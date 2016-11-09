import * as React from "react";
import { connect } from "react-redux";
import { FetchState } from "../../Common/fetchState";
import { Chart } from "../chartModel";
import { Model } from "../../Model/modelRoot";

import { IDispatcher } from "../../Common/reduxHelper";
import { action } from "../../Common/actionFactory";
import { ChartActions } from "../chartActions";
import { Graph } from "./Graph";


interface IProps extends IDispatcher {
    model?: Chart.ChartModel;
}

interface IState {
}

@connect((state: Model.Root): IProps => { return { model: state.chart }; })
export class ChartContainer extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);

    }

    public render(): JSX.Element {
        if (!this.props.model) {
            return null;
        }

        switch (this.props.model.FetchState) {
            case FetchState.InProgress:
                return <span>Loading data...</span>;
            case FetchState.Finished:
                return (
                    <Graph width={800} height={300} data={this.props.model.Data}/>
                );
            case FetchState.Error:
                return <span>Error fetching data</span>;
            default:
                return null;
        }
    }
}
