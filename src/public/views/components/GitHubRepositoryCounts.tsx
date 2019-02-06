import * as React from "react";
import { observer } from 'mobx-react';

import { initializeIcons } from '@uifabric/icons';
initializeIcons();

import { Label } from 'office-ui-fabric-react/lib/Label';
import { Icon } from 'office-ui-fabric-react/lib/Icon';

@observer
export class GitHubRepositoryCounts extends React.Component<any, any> {
	public props: any;

	constructor(props: any) {
		super(props);
	}

	render() {
		return <Label>
			<Icon iconName="FavoriteStarFill" />&nbsp; {this.props.repository.stargazers_count}
			{ this.props.repository.forks > 0 ? (<span>&nbsp; | &nbsp; <Icon iconName="BranchFork2" />&nbsp; {this.props.repository.forks} </span>) : '' }
			{ this.props.repository.hasIssues ? (<span>&nbsp; | &nbsp; <Icon iconName="IssueTracking" />&nbsp; {this.props.repository.open_issues} </span>) : '' }
		</Label>;
	}
}