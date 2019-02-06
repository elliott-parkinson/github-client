import { IBasicGithubRepositorySearchItem } from "./IBasicGithubRepositorySearchItem";

export interface IBasicGithubSearchResponse {
	items: IBasicGithubRepositorySearchItem[];
	total: number;
	success: boolean;
}