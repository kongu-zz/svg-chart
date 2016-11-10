import * as React from "react";
import { Chart } from "../chartModel";
import { GraphInterfaces } from "./Interfaces";
import { GraphBody, makeDataPoints } from "./GraphBody";
import moment from "moment";
moment.locale("ru");

const ReactTooltip = require("react-tooltip");

export class Graph extends React.Component<GraphInterfaces.IGraphProps, {}> {

    private makeXAxis = () => {
        let months: JSX.Element[] = [];
        let first = this.props.data[0].timeStamp;
        let last = this.props.data[this.props.data.length - 1].timeStamp;
        let currentDate = first;
        let numberOfMonths = 0;
        while (currentDate < last) {
            numberOfMonths++;
            currentDate = moment(currentDate).add(1, "months").toDate();

        }
        let monthInterval = this.props.width / numberOfMonths;

        let currentX = monthInterval;
        currentDate = first;
        while (currentDate < last) {

            months.push(
                <text textAnchor="middle" stroke="none" fill="#99a0a9" x={currentX} y={this.props.height + 20}>
                    {moment(currentDate).format("MMMM")}
                </text>
            );
            currentDate = moment(currentDate).add(1, "months").toDate();
            currentX += monthInterval;
        }
        return months;
    };

    private makeYAxis = () => {
        let lines: JSX.Element[] = [];
        let step = this.props.settings.yStep;
        let virtualHeight = this.props.height / 3;
        for (let i = 0; i < virtualHeight / step + 1; i++) {
            let lineHeight = this.props.height + this.props.settings.xAxisWidth - (i * step * 3);
            lines.push(<line
                x1={this.props.settings.yAxisWidth}
                y1={lineHeight}
                x2={this.props.width + this.props.settings.yAxisWidth}
                y2={lineHeight}
                stroke="#ebedef" strokeWidth={2} />);
            let xAxisNumber = i * step - step;
            if (xAxisNumber < 0) {
                continue;
            }
            lines.push(
                <text textAnchor="middle" stroke="none" fill="#99a0a9" x="20" y={lineHeight}>{xAxisNumber}</text>
            );
        }
        return lines;
    };

    public render(): JSX.Element {
        return (
            <div>
                <svg width={this.props.width + this.props.settings.yAxisWidth} height={this.props.height + this.props.settings.xAxisWidth}>
                    <rect x={0} y={0}
                        width={this.props.width + this.props.settings.yAxisWidth}
                        height={this.props.height + this.props.settings.xAxisWidth}
                        fill={this.props.settings.bgColor} stroke={this.props.settings.bgColor} />

                    {this.makeYAxis()}
                    {this.makeXAxis()}
                    <GraphBody {...this.props} />
                    {makeDataPoints(this.props)}
                </svg>
                <ReactTooltip type="light" border={true} />
            </div>
        );
    }
}