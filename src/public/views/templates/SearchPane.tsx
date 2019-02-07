import * as React from "react";
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';


import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';

import { GitHubRepositoryCounts } from "../components/GitHubRepositoryCounts";

export interface ISearchPaneProps {
	onSearch: ( value: any) => Promise<void>;
	onView: ( value: any) => void;
	searchResults: any[];
	searching: boolean;
}


@observer
export class SearchPane extends React.Component<any, any> {
	public props: ISearchPaneProps;

	constructor(props: ISearchPaneProps) {
		super(props);
	}

	render() {
		return <div className="github-search-area">
			<SearchBox
				placeholder="Search"
				onSearch={this.props.onSearch}
				underlined={true}
      		/>

			{ this.props.searching == false && this.props.searchResults.length ===0 ? <MessageBar messageBarType={MessageBarType.error} isMultiline={false} dismissButtonAriaLabel="Close">
				No search results to display.
			</MessageBar> : ''}

			{ this.props.searching ? <MessageBar><Icon iconName="ProgressRingDots" /> &nbsp; Loading...</MessageBar> : this.props.searchResults.map( result =>
				<div key={result.id} className="github-repository-search-item" onClick={item => this.props.onView(result)}>
					<CommandBar
						items={[
							{
								key: 'repo',
								name: result.full_name,
								iconProps: {
									iconName: 'Website'
								},
								disabled: true,
								onClick: () => window.location.href=result.html_url
							}
						]}
						ariaLabel={'Use left and right arrow keys to navigate between commands'}
					/>
					<div className="github-repository-search-item-content">
						<Label>{result.description}</Label>
						<br />
						<GitHubRepositoryCounts repository={result} />
					</div>
				</div>
			)}
		</div>;
	}
}