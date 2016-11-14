import * as React from "react";
import { Provider } from "react-redux";
import { Router, Route, IndexRoute, browserHistory } from "react-router";
import { createStore, combineReducers, applyMiddleware, compose } from "redux";
// import { syncHistoryWithStore, routerReducer, routerMiddleware } from "react-router-redux";
import thunkMiddleware from "redux-thunk";


import { chartReducer } from "./Chart/chartReducer";

import { Model } from "./Model/modelRoot";

import DevTools from "./DevTools";
import ChartRoute from "./Chart/Components/ChartRoute";

// import { IntlProvider } from "react-intl";
// const en = require("./Locale/en.json");

export interface IProps {
}

export default class Root extends React.Component<{}, {}> {


    public render(): JSX.Element {

        // const reduxRoutermiddleware = routerMiddleware(browserHistory);

        // !! GOTTA name reducer references according to model fields
        let reducers = combineReducers<Model.Root>(
            Object.assign(
                { chart: chartReducer })
        );

        let composeMiddleware: any;
        let devToolsExtensionMiddleware = (window as any).devToolsExtension && (window as any).devToolsExtension();
        // if (process.env.NODE_ENV === "production" || (process.env.NODE_ENV === "development" && !devToolsExtensionMiddleware)) {
        if (process.env.NODE_ENV === "production") {
            composeMiddleware = compose(
                applyMiddleware(thunkMiddleware as any)
            );
        } else if (process.env.NODE_ENV === "development" && devToolsExtensionMiddleware) {
            composeMiddleware = compose(
                applyMiddleware(thunkMiddleware as any),
                // DevTools.instrument(),
                devToolsExtensionMiddleware
            );
        } else {
            composeMiddleware = compose(
                applyMiddleware(thunkMiddleware as any),
                DevTools.instrument()
                // devToolsExtensionMiddleware
            );
        }

        let store = createStore(
            reducers,
            {},
            composeMiddleware
        );

        // const history = syncHistoryWithStore(browserHistory, store);
        return (
            <Provider store={store}>
                <div>
                    <ChartRoute />
                    <DevTools /> {/* вот зачем этот div - ctrl+h в браузерах отличных от хром*/}
                </div>
            </Provider>
        );
    }
}