// Type definitions for react-router-pause
// Project: https://github.com/allpro/react-router-pause
// Definitions by: Anton D. <https://github.com/pogodaanton/>
// Typescript Version: 3.8

declare module "@allpro/react-router-pause" {
  import * as H from "history";

  export interface ReactRouterPauseNavigationAPI {
    /**
     * Is there currently a location cached that we can 'resume'?
     * @returns {boolean} A boolean value
     */
    isPaused: () => boolean;
    /**
     * Is there currently a location cached that we can 'resume'?
     * @returns {(Object|null)} Location object or null
     */
    pausedLocation: () => H.Location | null;
    /**
     * Resume previously cachedNavigation blocked by handler callback.
     */
    resume: () => void;
    /**
     * Clear cached navigation/location data so cannot be used
     */
    cancel: () => void;
    /**
     * Push function from the `history` object
     */
    push: (path: H.Path, state: H.LocationState) => void;
    /**
     * Replace function from the `history` object
     */
    replace: (path: H.Path, state: H.LocationState) => void;
  }

  /**
   * Listener for navigation attempts that will be called ***before*** a route-change.
   *
   * You must either call a `NavigationAPI` method or return one of the following responses:
   * - `true` or `undefined` - Allow navigation to continue.
   * - `false` - Cancel the navigation event, permanently.
   * - `null` - Pause navigation so can optionally be resumed later.
   * - `Promise` - Pause navigation until promise is settled, then:
   *  - If promise is *rejected*, cancel navigation
   *  - If promise resolves with a value of `false`, cancel navigation
   *  - If promise resolves with any other value, resume navigation
   *
   * @param {Object} navigation An API that provides control of the navigation.
   * @param {Object} location A React Router location object that describes the navigation event.
   * @param {string} action The event-action type: PUSH, REPLACE, or POP
   * @returns Optional if the handler calls a navigationAPI method before it returns
   */
  export type NavigationAttemptHandler = (
    /**
     * An API that provides control of the navigation.
     */
    navigation: ReactRouterPauseNavigationAPI,
    /**
     * A React Router location object that describes the navigation event.
     */
    location: H.Location,
    /**
     * The event-action type: `PUSH`, `REPLACE`, or `POP`
     */
    action: H.Action
  ) => boolean | undefined | null | Promise<boolean | undefined>;

  interface ReactRouterPauseProps {
    handler?: NavigationAttemptHandler;
    when?: boolean;
    config?: {
      allowBookmarks: boolean;
    };
  }

  declare class ReactRouterPause extends React.Component<ReactRouterPauseProps> {}

  export = ReactRouterPause;
}
