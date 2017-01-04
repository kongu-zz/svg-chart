import { action } from "../Common/actionFactory";
import { fetchBackendAsync } from "../Common/fetchBackendAsync";
import { IDispatchFunc } from "../Common/reduxHelper";
import { Chart } from "./chartModel";

const config = require("config");

export namespace ChartActions {
    export const REQUEST_START = "ChartActions.REQUEST_START";
    export const RECEIVED_DATA = "ChartActions.RECEIVED_DATA";
    export const FAILED_GET_DATA = "ChartActions.FAILED_GET_DATA";

    export function mapChartPoints(fetchedResult: Chart.BackendPoint[]): Chart.Point[] {
        return fetchedResult.map<Chart.Point>((item): Chart.Point => {

            let point = new Chart.Point();

            point.timeStamp = new Date(item.timeStamp);
            point.value = item.value;

            return point;
        });
    }

    export function addAB(a: number, b: number): number {
        return a + b;
    }

    export function sortChartPointsByTime(points: Chart.Point[]): Chart.Point[] {
        return points.sort(function (a, b) {
            if (a.timeStamp > b.timeStamp) {
                return 1;
            }
            if (a.timeStamp < b.timeStamp) {
                return -1;
            }
            return 0;
        });
    }

    export function fetchChartData(): any {
        return async (dispatch: IDispatchFunc) => {
            dispatch(action(ChartActions.REQUEST_START));

            let response = await fetchBackendAsync("GET", `${config.serverUrl}/api/chartsData`, {
                "Accept": "application/json",
                "Content-Type": "application/json"
            });

            if (!response.ok && response.status !== 404) {
                dispatch(action(ChartActions.FAILED_GET_DATA));
                return;
            }

            if (response.status === 404) {
                dispatch(action(RECEIVED_DATA, []));
            } else {
                let fetchedResult = await response.json<Chart.BackendPoint[]>();
                let result = sortChartPointsByTime(mapChartPoints(fetchedResult));
                dispatch(action(RECEIVED_DATA, result));
            }
        };
    }

}