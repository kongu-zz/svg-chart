import { Chart } from "../chartModel";

export namespace GraphInterfaces {
    export interface IGraphProps {
        data: Chart.Point[];
        width: number;
        height: number;
        settings: IGraphSettings;
    }

    export interface IGraphPoint {
        x: number;
        y: number;
        original: Chart.Point;
    }

    export interface IGraphSettings {
        xAxisWidth: number;
        yAxisWidth: number;
        yScale: number;
        yStep: number;
        bgColor: string;
        strokeColor: string;
    }
}