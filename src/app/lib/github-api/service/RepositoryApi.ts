import axios from "axios"


export interface IBasicGithubRepositorySearchItem {
	id: number;
	name: string;
	full_name: string;
	description: string;
	default_branch: string;
	private: boolean;
	archived: boolean;

	language: string;
	languages_url: string;

	homepage: string;
	clone_url: string;
	fork: boolean;
	forks: number;

	has_issues: boolean;
	open_issues: number;
	issues_url: string;

	html_url: string;
	url: string;

	owner: any;
	readme: string;
}

export interface IBasicGithubSearchResponse {
	items: IBasicGithubRepositorySearchItem[];
	total: number;
	success: boolean;
}

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