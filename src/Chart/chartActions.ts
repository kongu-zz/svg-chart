import { action } from "../Common/actionFactory";
import { fetchBackendAsync } from "../Common/fetchBackendAsync";
import { IDispatchFunc } from "../Common/reduxHelper";
import { Chart } from "./chartModel";

const config = require("config");

export namespace ChartActions {
    export const REQUEST_START = "ChartActions.REQUEST_START";
    export const RECEIVED_DATA = "ChartActions.RECEIVED_DATA";
    export const FAILED_GET_DATA = "ChartActions.FAILED_GET_DATA";

    export function fetchChartData(): any {
        return async (dispatch: IDispatchFunc) => {
            dispatch(action(ChartActions.REQUEST_START));

            let response = await fetchBackendAsync("GET", `${config.serverUrl}/api/chartsData`,
                {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                });

            if (!response.ok && response.status !== 404) {
                dispatch(action(ChartActions.FAILED_GET_DATA));
                return;
            }

            let result: Chart.Point[] = [];
            if (response.status === 404) {
                dispatch(action(RECEIVED_DATA, result));
            } else {

                let fetchedResult: Chart.BackendPoint[] = await response.json();
                result = fetchedResult.map<Chart.Point>((item): Chart.Point => {

                    let point = new Chart.Point();

                    point.timeStamp = new Date(item.timeStamp);
                    point.value = item.value;

                    return point;
                });

            }

            dispatch(action(RECEIVED_DATA, result));
        };
    }

}