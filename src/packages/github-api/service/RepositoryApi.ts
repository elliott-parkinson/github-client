import axios from "axios"

import { IBasicGithubSearchResponse } from "../models/repository/IBasicGithubSearchResponse";
import { IBasicGithubRepositorySearchItem } from "../models/repository/IBasicGithubRepositorySearchItem";

export class RepositoryApi {
	private Url: string;

	constructor(url: string) {
		this.Url = url;
	}

	public async SearchRepositories(term: string): Promise<IBasicGithubSearchResponse> {
		try {
			const response = await axios.get(
				this.Url + '/search/repositories?'
				+ "q="+encodeURIComponent(term)
			);

			return {
				success: true,
				total: response.data.total_count,
				items: response.data.items
			} as IBasicGithubSearchResponse;
		}
		catch (exception) {
			return {
				success: false,
				total: 0,
				items: []
			} as IBasicGithubSearchResponse;
		}
	}

	public async GetReadme(repo: IBasicGithubRepositorySearchItem): Promise<string> {
		let readmeUrl: string = this.Url + '/repos/' + repo.owner.login +'/' + repo.name +'/readme'
		console.log(readmeUrl);
		try {
			const response = await axios.get(
				readmeUrl
			);

			return atob(response.data.content);
		}
		catch (exception) {
			return "";
		}
	}
}