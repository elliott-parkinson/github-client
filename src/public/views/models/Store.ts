import { observable, action } from 'mobx';
import { observer } from 'mobx-react';

import { IContainer } from "../../Container";
import { IBasicGithubRepositorySearchItem } from '../../../packages/github-api/models/repository/IBasicGithubRepositorySearchItem';
import { threadId } from 'worker_threads';


export class GithubRepositorySearchAppStore {
    @observable public Container: IContainer;

    @observable RepositorySearchResults: any[] = [];
    @observable SelectedRepository: IBasicGithubRepositorySearchItem | any = undefined;
    @observable LoadingReadme: boolean = false;

    @action
    public async SearchRepositories(term: string) {
        let repositories = await this.Container.GithubApi.Repository.SearchRepositories(term);
        return repositories;
    }
    
    @action
    public SetSelectedRepository(repo: IBasicGithubRepositorySearchItem) {
        this.SelectedRepository = repo;
    }

    @action
    public async GetReadme(repo: IBasicGithubRepositorySearchItem) {
        this.LoadingReadme = true;
        let readme = await this.Container.GithubApi.Repository.GetReadme(repo);
        this.LoadingReadme = false;


        return readme;
    }
}
