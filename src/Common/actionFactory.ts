import { Action } from "redux";

export interface ActionPayload<T> extends Action {
    pl: T;
}

export function action<T>(type: string, pl: T = null): ActionPayload<T> {
    return { type, pl };
}

export function GetPl<T>(a: Action): T {
    return (a as ActionPayload<T>).pl;
}