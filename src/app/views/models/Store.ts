import { observable, action } from 'mobx';
import { observer } from 'mobx-react';

import { IContainer } from "../../Container";


export class GithubRepositorySearchAppStore {
    @observable public Container: IContainer;

    @observable RepositorySearchResults: any[] = [];
    @observable SelectedRepository: string;

    @action
    public async SearchRepositories(term: string) {
        let repositories = await this.Container.GithubApi.Repository.SearchRepositories(term);

        return repositories;
    }
    
    @action
    public SetSelectedRepository(id: string) {
        this.SelectedRepository = id;
    }
}
