// import "react-hot-loader/patch";
import * as React from "react";
import * as ReactDom from "react-dom";
import Root from "./Root";
// const { AppContainer } = require("react-hot-loader");

export default class ApplicationDev {

    public run(): void {

        console.log("run");
        ReactDom.render(
            <Root/>,
            document.getElementById("app"), () => { }
        );
    }
}