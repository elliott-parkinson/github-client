import * as React from "react";
import ReactMarkdown from "react-markdown";
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';

import { initializeIcons } from '@uifabric/icons';
initializeIcons();

import { Label } from 'office-ui-fabric-react/lib/Label';
import { Modal } from 'office-ui-fabric-react/lib/Modal';
import { SearchPage } from "./templates/SearchPage";

import { Container } from "../Container";
import { GithubRepositorySearchAppStore } from "./models";
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { ActionButton } from 'office-ui-fabric-react/lib/Button';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';

import { GitHubRepositoryCounts } from "./components/GitHubRepositoryCounts";

// This odd line fixes a linting issue with typescript and ReactMarkdown. It's ugly, but it works.
let MarkDownRender: React.Component = ReactMarkdown;

@observer
export class View extends React.Component<any, any> {
	@observable HasSearched: boolean = false;
	@observable Searching: boolean = false;
	@observable ShowDetails: boolean = false;
	private store: GithubRepositorySearchAppStore = new GithubRepositorySearchAppStore();

	constructor(props: any) {
		super(props);
		this.store.Container = Container;
	}

	@action
	public async GetRepositories(term: string): Promise<any> {
		this.HasSearched = true;
		this.Searching = true;
		let repositories = await this.store.SearchRepositories(term);
		this.store.RepositorySearchResults = repositories.items;

		this.Searching = false;
	}

	@action
	public async SetSelectedRepository(item: any): Promise<any> {
		this.store.SetSelectedRepository(item);
		item.readme = await this.store.GetReadme(item);
	}

	render() {
		return <div>
			<div className="topBar">
				<Label>Github Repository Search</Label>
			</div>
			<div className="app">
				<SearchPage
					onSearch={value => this.GetRepositories(value)}
					onView={item => { this.SetSelectedRepository(item); this.ShowDetails = true; }}
					searchResults={this.store.RepositorySearchResults}
					searching={this.Searching}>
				</SearchPage>

				<Modal
					titleAriaId="titleId"
					subtitleAriaId="subtitleId"
					isOpen={this.ShowDetails}
					onDismiss={ i => this.ShowDetails = false}
					isBlocking={false}
					scrollableContentClassName={"test"}
				>
					<div className="ms-modal-header">
						<Label>{this.store.SelectedRepository.full_name}</Label>
						<ActionButton
							iconProps={{ iconName: 'ChromeClose' }}
							allowDisabledFocus={true}
							onClick={() => this.ShowDetails = false}
						>
						</ActionButton>
					</div>
					<div className="ms-modal-body">
						<div className="ms-modal-inner-body">
							<div style={{textAlign: "center", marginLeft: "auto", marginRight: "auto"}}>
								<GitHubRepositoryCounts repository={this.store.SelectedRepository} />
							</div>
							
							{ this.store.LoadingReadme ? 
								<MessageBar><Icon iconName="ProgressRingDots" /> &nbsp; Loading readme...</MessageBar> : 
								this.store.SelectedRepository.readme !== "" ? 
									<MarkDownRender source={this.store.SelectedRepository.readme} escapeHtml={false} /> :
									<MessageBar messageBarType={MessageBarType.error} isMultiline={false} dismissButtonAriaLabel="Close">
										Error loading readme file.
									</MessageBar>
							}
						</div>
					</div>
				</Modal>
			</div>
		</div>;
	}
}