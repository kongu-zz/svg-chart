import * as React from "react";
import { Chart } from "../chartModel";

export interface IProps {
    data: Chart.Point[];
    width: number;
    height: number;

}

interface GrapthPoint {
    x: number;
    y: number;
}

export const XAxis = (props: { x1: number; y1: number; x2: number; y2: number }) => {

    return (
        <line {...props} stroke="green" strokeWidth={2} />
    );
};

export const Body = (props: { data: Chart.Point[]; width: number; height: number; }) => {
    let first = props.data[0].timeStamp.getTime();
    let last = props.data[props.data.length - 1].timeStamp.getTime();
    let diff = last - first;
    let k = props.width / diff;

    let xPrev = 0;
    let timePrev = first;
    let graphData = props.data.map<GrapthPoint>((item, index): GrapthPoint => {
        let x: number;
        if (index === 0) {
            x = 0;
        } else {
            let qq = item.timeStamp.getTime() - timePrev;
            x = xPrev + (qq / diff * props.width);
        }
        xPrev = x;
        timePrev = item.timeStamp.getTime();

        console.log(`${item.timeStamp} - ${x}`);
        return { y: item.value, x: x };
    });

    let x = 0;
    let y = props.height - 100;
    let d = [`M ${x} ${y}`];

    let collector = graphData.map((chunk): any => {
      let xNext = x + chunk.x;
      let yNext = y - chunk.y;
      return `L ${xNext} ${yNext}`;
    });

    let path = d.concat(collector).join(' ');

    return (
        <path d={path}
        stroke="orange"
        strokeWidth={1}
        fill="none"
      />
    );
};

export class Graph extends React.Component<IProps, {}> {

    public render(): JSX.Element {
        return <svg width={this.props.width} height={this.props.height} fill="grey">
            <XAxis x1={0} y1={0} x2={0} y2={this.props.height} />
            <XAxis x1={0} y1={this.props.height} x2={this.props.width} y2={this.props.height} />
            <Body width={this.props.width} height={this.props.height} data={this.props.data} />
        </svg>;
    }
}