import { RepositoryApi } from "./service/RepositoryApi";

export class GithubApi {
	private Url: string;
	public Repository: RepositoryApi;

	constructor(url: string) {
		this.Url = url;
		this.Repository = new RepositoryApi(url);
	}
}