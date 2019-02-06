import * as React from "react";
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';

import { TextField } from 'office-ui-fabric-react/lib/TextField';

import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { IconButton } from 'office-ui-fabric-react/lib/Button';

export interface ISearchPageProps {
	onSearch: ( value: any) => Promise<void>;
	searchResults: any[];
}


@observer
export class SearchPage extends React.Component<any, any> {
	public props: ISearchPageProps;

	constructor(props: ISearchPageProps) {
		super(props);
	}

	render() {
		return <div>
			<SearchBox
				placeholder="Search"
				onSearch={this.props.onSearch}
				underlined={true}
      		/>

			{this.props.searchResults.map( result =>
				<div key={result.id} className="github-repository-search-item">
					<CommandBar
						items={[
							{
								key: 'repo',
								name: result.full_name,
								iconProps: {
									iconName: 'Website'
								},
								onClick: () => window.location.href=result.html_url
							}
						]}
						farItems={[
							{
								key: 'view',
								name: 'View',
								iconProps: {
									iconName: 'RedEye'
								},
								onClick: () => console.log('View')
							  }
						]}
						ariaLabel={'Use left and right arrow keys to navigate between commands'}
					/>
					<div className="github-repository-search-item-content">
						<Label>{result.description}</Label>
						<Label><Icon iconName="FavoriteStarFill" />&nbsp; {result.stargazers_count}</Label>
					</div>
				</div>
			 )}
		</div>;
	}
}