import * as React from "react";
import { Chart } from "../chartModel";
import { GraphInterfaces } from "./Interfaces";
import moment from "moment";
moment.locale("ru");

const converToGraphData = (props: GraphInterfaces.IGraphProps): GraphInterfaces.IGraphPoint[] => {
    if (props.data.length === 0) {
        return [];
    }
    let first = props.data[0].timeStamp.getTime();
    let last = props.data[props.data.length - 1].timeStamp.getTime();
    let diff = last - first;

    let xPrev = props.settings.yAxisWidth;
    let timePrev = first;
    let graphData = props.data.map<GraphInterfaces.IGraphPoint>((item, index): GraphInterfaces.IGraphPoint => {
        let x: number;
        if (index === 0) {
            x = 0 + props.settings.yAxisWidth;
        } else {
            let pointsTimeDiff = item.timeStamp.getTime() - timePrev;
            x = Math.round(xPrev + (pointsTimeDiff / diff * (props.width - props.settings.yAxisWidth)));
        }
        xPrev = x;
        timePrev = item.timeStamp.getTime();

        // console.log(`${item.timeStamp} - ${x}`);
        return { y: item.value, x: x, original: item };
    });
    return graphData;
};

const makeBodyPath = (graphData: GraphInterfaces.IGraphPoint[], height: number, settings: GraphInterfaces.IGraphSettings) => {
    let x = settings.yAxisWidth;
    let y = height;
    // let d: string[] = [];//[`M ${x} ${y}`];

    let collector = graphData.map((chunk, index): any => {
        let xNext = x + chunk.x;
        let yNext = y - chunk.y * settings.yScale;
        if (index === 0) {
            return `M ${xNext} ${yNext}`;
        }
        return `L ${xNext} ${yNext}`;
    });

    return collector.join(" ");
};

export const GraphBody = (props: GraphInterfaces.IGraphProps) => {
    return (
        <path d={makeBodyPath(converToGraphData(props), props.height, props.settings)}
            stroke={props.settings.strokeColor}
            strokeWidth={2}
            fill="none"
            />
    );
};

export const makeDataPoints = (props: GraphInterfaces.IGraphProps) => {
    let graphData = converToGraphData(props);

    let x = props.settings.yAxisWidth;
    let y = props.height;

    let points: JSX.Element[] = [];
    graphData.map((chunk, index): any => {
        let xNext = x + chunk.x;
        let yNext = y - chunk.y * props.settings.yScale;
        points.push(
            <circle
                cx={xNext} cy={yNext} r={5}
                data-tip={`${moment(chunk.original.timeStamp).format("DD MMMM YYYY")}<br/> $ ${chunk.original.value}`}
                data-html={true}
                fill={props.settings.strokeColor} stroke={props.settings.bgColor} strokeWidth={2}
                key={index} />
        );
    });
    return points;
};