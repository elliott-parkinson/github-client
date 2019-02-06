import { GithubApi } from "../packages/github-api";

export interface IContainer {
	GithubApi: GithubApi;
	// Store: GithubRepositorySearchAppStore;
}

export const Container: IContainer = {
	GithubApi: new GithubApi("https://api.github.com")
}
