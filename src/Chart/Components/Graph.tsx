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

const converToGraphData = (data: Chart.Point[], width: number, height: number, settings: GraphSettings): GrapthPoint[] => {
    let first = data[0].timeStamp.getTime();
    let last = data[data.length - 1].timeStamp.getTime();
    let diff = last - first;

    let xPrev = settings.yAxisWidth;
    let timePrev = first;
    let graphData = data.map<GrapthPoint>((item, index): GrapthPoint => {
        let x: number;
        if (index === 0) {
            x = 0 + settings.yAxisWidth;
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

const makeBodyPath = (graphData: GrapthPoint[], height: number, settings: GraphSettings) => {
    let x = settings.yAxisWidth;
    let y = height;
    let d = [`M ${x} ${y}`];

    let collector = graphData.map((chunk): any => {
        let xNext = x + chunk.x;
        let yNext = y - chunk.y * settings.yScale;
        return `L ${xNext} ${yNext}`;
    });

    return d.concat(collector).join(" ");
};

const Body = (props: { data: Chart.Point[]; width: number; height: number; settings: GraphSettings}) => {

    return (
        <path d={makeBodyPath(converToGraphData(props.data, props.width, props.height, props.settings), props.height, props.settings)}
            stroke="#74a3c7"
            strokeWidth={2}
            fill="none"
            />
    );
};

const makeDataPoints = (data: Chart.Point[], width: number, height: number, settings: GraphSettings) => {
    let graphData = converToGraphData(data, width, height, settings);

    let x = settings.yAxisWidth;
    let y = height;

    let points: JSX.Element[] = [];
    graphData.map((chunk): any => {
        let xNext = x + chunk.x;
        let yNext = y - chunk.y * settings.yScale;
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

const makeYAxis = (width: number, height: number, settings: GraphSettings) => {
    let lines: JSX.Element[] = [];
    let step = settings.yStep;
    let virtualHeight = height / 3;
    for (let i = 0; i < virtualHeight / step + 1; i++) {
        let lineHeight = height + settings.xAxisWidth - (i * step * 3);
        lines.push(<line
            x1={settings.yAxisWidth}
            y1={lineHeight}
            x2={width + settings.yAxisWidth}
            y2={lineHeight}
            stroke="#ebedef" strokeWidth={2} />);
        let xAxisNumber = i * step - step;
        if (xAxisNumber < 0) {
            continue;
        }
        lines.push(
            <text textAnchor="middle" stroke="#99a0a9" fill="#99a0a9" x="20" y={lineHeight}>{xAxisNumber}</text>
        );
    }
    return lines;
};

const makeXAxis = (width: number, height: number, data: Chart.Point[], settings: GraphSettings) => {
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
        let lines = makeYAxis(this.props.width, this.props.height, this.props.settings);

        let months = makeXAxis(this.props.width, this.props.height, this.props.data, this.props.settings);

        return (
            <div>
                <svg width={this.props.width + this.props.settings.yAxisWidth} height={this.props.height + this.props.settings.xAxisWidth} fill="#ff00ff">
                    <rect x={this.props.settings.yAxisWidth} y={0} width={this.props.width} height={this.props.height} fill="#f6f7f8" stroke="#f6f7f8" />
                    <rect x={0} y={0} width={this.props.settings.yAxisWidth} height={this.props.height} fill="#f6f7f8" stroke="#f6f7f8" />
                    <rect x={0} y={this.props.height} width={this.props.width + this.props.settings.yAxisWidth} height={this.props.settings.xAxisWidth} fill="#f6f7f8" stroke="#f6f7f8" />

                    {lines}
                    {months}
                    <Body width={this.props.width - this.props.settings.yAxisWidth} height={this.props.height} data={this.props.data} settings={this.props.settings}/>
                    {makeDataPoints(this.props.data, this.props.width - this.props.settings.yAxisWidth, this.props.height, this.props.settings)}
                </svg>
                <ReactTooltip type="light" border={true} />
            </div>
        );
    }
}