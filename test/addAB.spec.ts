/// <reference path="../typings/index.d.ts" />
import * as React from "react";
import * as Sinon from "sinon";

import * as Chai from "chai";
const expect = Chai.expect;
const use = Chai.use;
import chaiDateTime from "chai-datetime";
Chai.use(chaiDateTime);

import { ChartActions } from "../src/Chart/chartActions";

describe("simple test", () => {

    it("should be sum", () => {

        let a = 2;
        let b = 3;
        expect(ChartActions.addAB(a, b)).to.be.equal(5);
    });

    it("should not be sum", () => {

        let a = 2;
        let b = 3;
        expect(ChartActions.addAB(a, b)).not.to.be.equal(6);
    });

    it("should not be sort", () => {
        let testArray = [
            {
                "timeStamp": new Date("2017-12-11T18:04:30.32"),
                "value": 0
            },
            {
                "timeStamp": new Date("2015-12-11T18:04:30.32"),
                "value": 0
            },
            {
                "timeStamp": new Date("2018-12-11T18:04:30.32"),
                "value": 0
            },
            {
                "timeStamp": new Date("2015-11-22T18:04:59.79"),
                "value": 10
            }
        ];

        let expectedArray = [
            {
                "timeStamp": new Date("2015-11-22T18:04:59.79"),
                "value": 10
            },
            {
                "timeStamp": new Date("2015-12-11T18:04:30.32"),
                "value": 0
            },
            {
                "timeStamp": new Date("2017-12-11T18:04:30.32"),
                "value": 0
            },
            {
                "timeStamp": new Date("2018-12-11T18:04:30.32"),
                "value": 0
            }
        ];

        expect(ChartActions.sortChartPointsByTime(testArray)).to.deep.equal(expectedArray);
    });

    it("should not be sort 2", () => {

        let testArray = ["10", "9", "1", "2"];
        let expectedArray = ["1", "10", "2", "9"];

        expect(testArray.sort()).to.deep.equal(expectedArray);
    });

    it("should not be sort 3", () => {

        let testArray = [10, 9, 1, 2];
        let expectedArray = [1, 2, 9, 10];

        expect(testArray.sort(function (a, b) {
            if (a > b) {
                return 1;
            }
            if (a < b) {
                return -1;
            }
            return 0;
        })).to.deep.equal(expectedArray);
    });

    it("test neqw", () => {

        let test: any = null;
        let expected = 0;

        expect(test).eq(expected)
    })
});