import React, { useContext, useRef, createContext, useMemo } from "react";
import { uniqueId, findIndex } from "lodash-es";
import { NavigationHandler, RouteInterceptor } from "./RouteInterceptor.types";
import ReactRouterPause, { NavigationAttemptHandler } from "@allpro/react-router-pause";

/**
 * Listen to route changes and pause them if needed.
 */
const RouteInterceptorContext = createContext<RouteInterceptor>(null);

export const RouteInterceptionManager: React.ComponentType<{}> = ({ children }) => {
  const navigationHandlers = useRef<NavigationHandler[]>([]);

  /**
   * Subscribes a listener to route changes and returns a function
   * that can be used as a return value in a `useEffect` hook.
   */
  const addNavigationHandler = (handler: NavigationHandler["handler"]) => {
    const id = uniqueId("navHandler");
    navigationHandlers.current.push({ id, handler });
    return () => {
      const index = findIndex(navigationHandlers.current, { id });
      navigationHandlers.current.splice(index, 1);
      return;
    };
  };

  /**
   * Listen to changes in navigation and trigger every
   * function that is in `navigationHandlers`.
   */
  const onNavigationAttempt: NavigationAttemptHandler = (
    navigation,
    location,
    action
  ) => {
    if (navigationHandlers.current.length <= 0) return true;
    else
      return new Promise(resolveAttempt => {
        let shouldNavigate: Promise<boolean>[] = [];
        console.log(action);

        navigationHandlers.current.forEach(obj => {
          const res = obj.handler(navigation, location, action);
          if (typeof res === "boolean") {
            shouldNavigate.push(new Promise(resolve => resolve(!!res)));
          } else shouldNavigate.push(res);
        });

        Promise.all(shouldNavigate).then(bools => {
          resolveAttempt(!bools.includes(false));
        });
      });
  };

  /**
   * Make sure values don't re-render uselessly.
   */
  const contextItems = useMemo(
    () => ({
      addNavigationHandler,
    }),
    []
  );

  return (
    <RouteInterceptorContext.Provider value={contextItems}>
      <ReactRouterPause handler={onNavigationAttempt} />
      {children}
    </RouteInterceptorContext.Provider>
  );
};

export const useRouteInterception = () => {
  const ctx = useContext(RouteInterceptorContext);

  if (!ctx) {
    throw Error(
      "The `useRouteInterception` hook must be called from a descendent of the `RouteInterceptionManager`."
    );
  }

  return ctx;
};
