import { NavigationAttemptHandler } from "@allpro/react-router-pause";

export interface NavigationHandler {
  id: string;
  handler: NavigationAttemptHandler;
}

/**
 * Subscribe and unsubscribe from listening to route changes.
 */
export interface RouteInterceptor {
  /**
   * Subscribes a listener to route changes and returns a function
   * that can be used as a return value in a `useEffect` hook.
   */
  addNavigationHandler: (handler: NavigationHandler["handler"]) => () => void;
  /**
   * Unsubscribes a listener from route changes
   */
  removeNavigationHandler: (handler: NavigationHandler["handler"]) => void;
}
