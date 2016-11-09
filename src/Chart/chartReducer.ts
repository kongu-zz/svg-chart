import { Action } from "redux";
import { Chart } from "./chartModel";
import { ChartActions } from "./chartActions";
import { GetPl } from "../Common/actionFactory";
import { FetchState } from "../Common/fetchState";

export function chartReducer(
    state: Chart.ChartModel = { FetchState: FetchState.InProgress, Data: [] },
    action: Action): Chart.ChartModel {

    let newState = Object.assign({}, state);

    switch (action.type) {
        case ChartActions.REQUEST_START:
            newState.FetchState = FetchState.InProgress;
            break;
        case ChartActions.RECEIVED_DATA:
            newState.FetchState = FetchState.Finished;
            newState.Data = GetPl<Chart.Point[]>(action);

            break;
        case ChartActions.FAILED_GET_DATA:
            newState.FetchState = FetchState.Error;
            break;
        default:
            return state;
    }
    return newState;
}