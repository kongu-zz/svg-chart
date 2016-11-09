import * as React from "react";
import { connect } from "react-redux";
import { IDispatcher } from "../../Common/reduxHelper";
import { Chart } from "../chartModel";
import { ChartActions } from "../chartActions";
//import { SearchDomain } from "../searchDomainActions";
//import { SearchDomainResults } from "./SearchDomainResults";
import { IInjectedProps } from "react-router";
import { action } from "../../Common/actionFactory";
import { deserialize } from "json-typescript-mapper";
import { ChartContainer } from "./ChartContainer";

interface IProps extends IInjectedProps, IDispatcher {
}

@connect()
export default class ChartRoute extends React.Component<IProps, {}> {

    constructor(props: IProps) {
        super(props);
    }

    public componentDidMount(): void {
        this.dispatchSearch(this.props);
    }

    public componentWillReceiveProps(nextProps: IProps, nextContext: any): void {
        this.dispatchSearch(nextProps);
    }

    private dispatchSearch(target: IProps) {
        target.dispatch(ChartActions.fetchChartData());

        // let lastViewQueryModel = deserialize(Search.LastViewQueryModel, target.location.query);
        // target.dispatch(LastViewActions.validateDateAndUpdate(lastViewQueryModel));

        // let query = target.location.query as Search.DomainSearchQuery;
        // target.dispatch(SearchDomain.search(query));
    }

    public render(): JSX.Element {
        return <ChartContainer/>
    }
}