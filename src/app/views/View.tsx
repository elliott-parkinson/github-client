import * as React from "react";
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';

import { initializeIcons } from '@uifabric/icons';
initializeIcons();

import { Label } from 'office-ui-fabric-react/lib/Label';
import { SearchPage } from "./templates/SearchPage";

import { Container, IContainer } from "../Container";
import { GithubRepositorySearchAppStore } from "./models";

@observer
export class View extends React.Component<any, any> {
	@observable HasSearched: boolean = false;
	@observable Searching: boolean = false;
	private store: GithubRepositorySearchAppStore = new GithubRepositorySearchAppStore();

	constructor(props: any) {
		super(props);
		this.store.Container = Container;
	}

	@action
	public async GetRepositories(term: string): Promise<any> {
		this.HasSearched = true;
		let repositories = await this.store.SearchRepositories(term);
		this.store.RepositorySearchResults = repositories.items;

		console.log(repositories.items[0]);
	}

	render() {
		return <div>
			<div className="topBar">
				<Label>Github Repository Search</Label>
			</div>
			<div className="app">
			<SearchPage
				onSearch={value => this.GetRepositories(value)}
				searchResults={this.store.RepositorySearchResults}>
				searching={this.Searching}
			</SearchPage>
			</div>
		</div>;
	}
}