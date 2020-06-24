import React, { useState, useEffect, useCallback } from "react";
import { TabViewerProps, TabViewerClassNameContract, TabPanel } from "./TabViewer.props";
import { DesignSystem } from "@microsoft/fast-components-styles-msft";
import manageJss, { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import tabEventEmitter from "../TabEvents";
import { TabItem } from "../TabBar/TabBar.props";
import { classNames } from "@microsoft/fast-web-utilities";

const styles: ComponentStyles<TabViewerClassNameContract, DesignSystem> = {
  tabViewer: {},
  tabPanel: {
    display: "none",
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  tabPanel__visible: {
    display: "block",
  },
};

const TabViewer: React.ComponentType<TabViewerProps> = ({
  managedClasses,
  items,
  id,
  ...props
}) => {
  const [activeId, setActiveId] = useState<string>(null);

  /**
   * Looks up whether the given tab panel is currently visible or not
   */
  const getActiveState = useCallback(
    (tabItem: TabPanel, index: number): boolean => {
      if (activeId) return activeId === tabItem.id;
      return index === 0;
    },
    [activeId]
  );

  /**
   * Listening to change events from <TabBar/>
   */
  useEffect(() => {
    // We need to do this in order to cache the function
    const changeHandler = (id: TabItem["id"]): void => setActiveId(id);

    // Handle initial data
    tabEventEmitter.once(`${id}-subPub`, changeHandler);
    // Subscribe to change handler
    tabEventEmitter.on(`${id}-change`, changeHandler);
    // Tell tabbar to broadcast initial data
    tabEventEmitter.emit(`${id}-sub`);

    return () => {
      tabEventEmitter.off(`${id}-subPub`, changeHandler);
      tabEventEmitter.off(`${id}-change`, changeHandler);
    };
  }, [id]);

  useEffect(() => {
    if (!activeId) return;

    const func = items.find(getActiveState)["onLoad"];
    if (typeof func === "function") func();
  }, [activeId, getActiveState, items]);

  return (
    <div className={managedClasses.tabViewer}>
      {items.map((tabItem, i) => (
        <div
          key={tabItem.id}
          className={classNames(managedClasses.tabPanel, [
            managedClasses.tabPanel__visible,
            getActiveState(tabItem, i),
          ])}
        >
          {tabItem.children}
        </div>
      ))}
    </div>
  );
};

export default manageJss(styles)(TabViewer);
