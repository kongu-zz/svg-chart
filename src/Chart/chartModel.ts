import { FetchState } from "../Common/fetchState";

export namespace Chart {

    export class ChartModel {
        FetchState: FetchState;
        Data: Point[] = [];
    }

    export class BackendPoint {
        timeStamp: string;
        value: number;
    }

    export class Point {
        timeStamp: Date;
        value: number;
    }

}