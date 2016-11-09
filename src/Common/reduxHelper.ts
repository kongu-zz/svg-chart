import { Action } from "redux";

export interface IDispatcher {
    dispatch?<A extends Action>(action: A): A;
}

export interface IDispatchFunc {
    <A extends Action>(action: A): A;
}

export interface IErrorCarrier {
    error: any;
}