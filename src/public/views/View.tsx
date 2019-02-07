import * as React from "react";
import ReactMarkdown from "react-markdown";
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';

import { initializeIcons } from '@uifabric/icons';
initializeIcons();

import { Label } from 'office-ui-fabric-react/lib/Label';
import { Modal } from 'office-ui-fabric-react/lib/Modal';
import { SearchPane } from "./templates/SearchPane";

import { Container } from "../Container";
import { GithubRepositorySearchAppStore } from "./models";
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { PivotItem, PivotLinkSize, Pivot } from 'office-ui-fabric-react/lib/Pivot';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import { Breadcrumb, IBreadcrumbItem, IDividerAsProps } from 'office-ui-fabric-react/lib/Breadcrumb';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';

import { GitHubRepositoryCounts } from "./components/GitHubRepositoryCounts";

// This odd line fixes a linting issue with typescript and ReactMarkdown. It's ugly, but it works.
let MarkDownRender: React.Component = ReactMarkdown;


const SidePanel = props => <div className="side-panel">
	{ props.children }
</div>

const MainPane = props => <div className="main-pane">
	{ props.children }
</div>


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
				<Label>Github Repository Search &nbsp; <a href="https://github.com/elliott-parkinson/github-client" target="_blank"><small>View on Github</small> &nbsp; <svg height="22" class="octicon octicon-mark-github" viewBox="0 0 16 16" version="1.1" width="32" aria-hidden="true"><path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path></svg></a></Label>
			</div>
			<div className="app">
				<SidePanel>
					<SearchPane
						onSearch={value => this.GetRepositories(value)}
						onView={item => { this.SetSelectedRepository(item); this.ShowDetails = true; }}
						searchResults={this.store.RepositorySearchResults}
						searching={this.Searching}>
					</SearchPane>
				</SidePanel>

				<MainPane>
					{ this.store.SelectedRepository ? <div>
						<Breadcrumb
							items={[
								{ text: 'Repositories', key: 'Repositories', onClick: event => console.log(event) },
								{ text: this.store.SelectedRepository.owner.login, key: 'user', onClick: event => console.log(event) },
								{ text: this.store.SelectedRepository.name, key: 'repo', onClick: event => console.log(event), isCurrentItem: true }
							]}
						/>

						<Pivot linkSize={PivotLinkSize.large}>
							<PivotItem linkText="Code" itemIcon="Code">
								<div className="pad">
									<Label>{this.store.SelectedRepository.description}</Label>
								</div>
								<br />
								<div className="panel">
									<div className="panel-body">
										<div style={{textAlign: "center", marginLeft: "auto", marginRight: "auto"}}>
											<Icon iconName="FavoriteStarFill" />&nbsp; {this.store.SelectedRepository.stargazers_count} Stargazers
											{ this.store.SelectedRepository.watchers_count > 0 ? (<span>&nbsp; | &nbsp; <Icon iconName="View" />&nbsp; {this.store.SelectedRepository.watchers_count} Watchers</span>) : '' }
											{ this.store.SelectedRepository.forks > 0 ? (<span>&nbsp; | &nbsp; <Icon iconName="BranchFork2" />&nbsp; {this.store.SelectedRepository.forks} Forks</span>) : '' }
											{ this.store.SelectedRepository.hasIssues ? (<span>&nbsp; | &nbsp; <Icon iconName="IssueTracking" />&nbsp; {this.store.SelectedRepository.open_issues} Issues</span>) : '' }
										</div>
									</div>
								</div>
								<br />
								<CommandBar
									items={[
										{
											key: 'repo',
											name: "Branch: " + this.store.SelectedRepository.default_branch,
											iconProps: {
												iconName: 'BranchFork2'
											},
											disabled: true,
											onClick: () => console.log('This does nothing at all.')
										}
									]}
									/*farItems={[
										{
											key: 'repo',
											name: "Clone or download",
											iconProps: {
												iconName: 'Download'
											},
											onClick: () => console.log('hi')
										}
									]}*/
									ariaLabel={'Use left and right arrow keys to navigate between commands'}
								/>
								
								<div className="panel">
									<div className="panel-heading">
										<Icon iconName="ReadingMode" /> &nbsp; <Label>Readme</Label>
									</div>

									<div className="panel-body">
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
							</PivotItem>
							<PivotItem itemCount={this.store.SelectedRepository.open_issues} linkText="Issues"  itemIcon="IssueTracking">
								<MessageBar messageBarType={MessageBarType.error} isMultiline={false} dismissButtonAriaLabel="Close">
									This contains nothing at all.
								</MessageBar>
							</PivotItem>
						</Pivot>

						
					</div> : ''}
				</MainPane>
			</div>
		</div>;
	}
}