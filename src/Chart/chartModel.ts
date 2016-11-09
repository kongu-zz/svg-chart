import { FetchState } from "../Common/fetchState";

export namespace Chart {

    export class ChartModel {
        FetchState: FetchState;
        Data: Point[] = [];
    }

    export class Point {
        timeStamp: string;
        value: number;
    }
}