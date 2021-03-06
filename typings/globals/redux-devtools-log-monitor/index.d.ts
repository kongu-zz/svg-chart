// Generated by typings
// Source: https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/2867a19221cd5e2449135aeed9f13f760b65f458/redux-devtools-log-monitor/redux-devtools-log-monitor.d.ts
declare module "redux-devtools-log-monitor" {
  import * as React from 'react'
  import {ColorScheme} from 'base16'

  interface ILogMonitorProps {
    /**
     * Either a string referring to one of the themes provided by
     * redux-devtools-themes or a custom object of the same format.
     *
     * @see https://github.com/gaearon/redux-devtools-themes
     */
    theme?: string | ColorScheme

    /**
     * A function that selects the slice of the state for DevTools to show.
     *
     * @example state => state.thePart.iCare.about.
     * @default state => state.
     */
    select?: (state: any) => any

    /**
     * When true, records the current scroll top every second so it
     * can be restored on refresh. This only has effect when used together
     * with persistState() enhancer from Redux DevTools.
     *
     * @default true
     */
    preserveScrollTop?: boolean

    /**
     * When true, displays the action object expanded rather than collapsed.
     *
     * @default true
     */
    expandActionRoot?: boolean

    /**
     * When true, displays the state object expanded rather than collapsed.
     *
     * @default true
     */
     expandStateRoot?: boolean
  }

  export default class LogMonitor extends React.Component<ILogMonitorProps, any> {}
}
