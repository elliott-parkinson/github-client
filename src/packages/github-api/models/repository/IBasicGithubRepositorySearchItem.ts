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