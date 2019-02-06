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
}

export interface IBasicGithubSearchResponse {
	items: IBasicGithubRepositorySearchItem[];
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
				items: response.data.items
			} as IBasicGithubSearchResponse;
		}
		catch (exception) {
			return {
				success: false,
				items: []
			} as IBasicGithubSearchResponse;
		}
	}
}