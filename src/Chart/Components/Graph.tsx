import * as React from "react";
import { Chart } from "../chartModel";
import moment from "moment";
moment.locale("ru");

const ReactTooltip = require("react-tooltip");

export interface IProps {
    data: Chart.Point[];
    width: number;
    height: number;
    settings: GraphSettings;
}

interface GrapthPoint {
    x: number;
    y: number;
    original: Chart.Point;
}

interface GraphSettings {
    xAxisWidth: number;
    yAxisWidth: number;
    yScale: number;
    yStep: number;
    bgColor: string;
    strokeColor: string;
}

const converToGraphData = (data: Chart.Point[], width: number, height: number): GrapthPoint[] => {
    let first = data[0].timeStamp.getTime();
    let last = data[data.length - 1].timeStamp.getTime();
    let diff = last - first;

    let xPrev = 40;
    let timePrev = first;
    let graphData = data.map<GrapthPoint>((item, index): GrapthPoint => {
        let x: number;
        if (index === 0) {
            x = 0 + 40;
        } else {
            let pointsTimeDiff = item.timeStamp.getTime() - timePrev;
            x = Math.round(xPrev + (pointsTimeDiff / diff * width));
        }
        xPrev = x;
        timePrev = item.timeStamp.getTime();

        console.log(`${item.timeStamp} - ${x}`);
        return { y: item.value, x: x, original: item };
    });
    return graphData;
};

const makeBodyPath = (graphData: GrapthPoint[], height: number) => {
    let x = 40;
    let y = height; // - 100;
    let d = [`M ${x} ${y}`];

    let collector = graphData.map((chunk): any => {
        let xNext = x + chunk.x;
        let yNext = y - chunk.y * 3;
        return `L ${xNext} ${yNext}`;
    });

    return d.concat(collector).join(" ");
};

const Body = (props: { data: Chart.Point[]; width: number; height: number; }) => {

    return (
        <path d={makeBodyPath(converToGraphData(props.data, props.width, props.height), props.height)}
            stroke="#74a3c7"
            strokeWidth={2}
            fill="none"
            />
    );
};

const makeDataPoints = (data: Chart.Point[], width: number, height: number) => {
    let graphData = converToGraphData(data, width, height);

    let x = 40;
    let y = height;

    let points: JSX.Element[] = [];
    graphData.map((chunk): any => {
        let xNext = x + chunk.x;
        let yNext = y - chunk.y * 3;
        points.push(
            <circle
                cx={xNext} cy={yNext} r={5}
                data-tip={`${moment(chunk.original.timeStamp).format("DD MMMM YYYY")}<br/> $ ${chunk.original.value}`}
                data-html={true}
                fill="#74a3c7" stroke="#f6f7f8" strokeWidth={2} />
        );
    });
    return points;
};

const makeYAxis = (width: number, height: number) => {
    let lines: JSX.Element[] = [];
    let step = 20;
    let virtualHeight = height / 3;
    for (let i = 0; i < virtualHeight / step + 1; i++) {
        let lineHeight = height + 60 - (i * 20 * 3);
        lines.push(<line
            x1={40}
            y1={lineHeight}
            x2={width + 40}
            y2={lineHeight}
            stroke="#ebedef" strokeWidth={2} />);
        let xAxisNumber = i * 20 - 20;
        if (xAxisNumber < 0) {
            continue;
        }
        lines.push(
            <text textAnchor="middle" stroke="#99a0a9" fill="#99a0a9" x="20" y={lineHeight}>{xAxisNumber}</text>
        );
    }
    return lines;
};

const makeXAxis = (width: number, height: number, data: Chart.Point[]) => {
    let months: JSX.Element[] = [];
    let first = data[0].timeStamp;
    let last = data[data.length - 1].timeStamp;
    let currentDate = first;
    let numberOfMonths = 0;
    while (currentDate < last) {
        numberOfMonths++;
        currentDate = moment(currentDate).add(1, "months").toDate();

    }
    let monthInterval = width / numberOfMonths;

    let currentX = monthInterval;
    currentDate = first;
    while (currentDate < last) {

        months.push(
            <text textAnchor="middle" stroke="#99a0a9" fill="#99a0a9" x={currentX} y={height + 20}>
                {moment(currentDate).format("MMMM")}
            </text>
        );
        currentDate = moment(currentDate).add(1, "months").toDate();
        currentX += monthInterval;
    }
    return months;
};

export class Graph extends React.Component<IProps, {}> {

    public render(): JSX.Element {
        let lines = makeYAxis(this.props.width, this.props.height);

        let months = makeXAxis(this.props.width, this.props.height, this.props.data);

        return (
            <div>
                <svg width={this.props.width + 40} height={this.props.height + 60} fill="#ff00ff">
                    <rect x={40} y={0} width={this.props.width} height={this.props.height} fill="#f6f7f8" stroke="#f6f7f8" />
                    <rect x={0} y={0} width={40} height={this.props.height} fill="#f6f7f8" stroke="#f6f7f8" />
                    <rect x={0} y={this.props.height} width={this.props.width + 40} height={60} fill="#f6f7f8" stroke="#f6f7f8" />

                    {lines}
                    {months}
                    <Body width={this.props.width - 40} height={this.props.height} data={this.props.data} />
                    {makeDataPoints(this.props.data, this.props.width - 40, this.props.height)}
                </svg>
                <ReactTooltip type="light" border={true} />
            </div>
        );
    }
}