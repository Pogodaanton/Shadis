import React, { useState, useRef, useEffect, useCallback } from "react";
import { TabBarProps, TabBarClassNameContract, TabItem } from "./TabBar.props";
import {
  DesignSystem,
  accentFillActive,
  neutralFillHover,
} from "@microsoft/fast-components-styles-msft";
import manageJss, { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import Tab from "../Tab/Tab";
import { TabsSlot, TabLocation } from "@microsoft/fast-components-react-base";
import {
  keyCodeArrowLeft,
  Orientation,
  keyCodeArrowRight,
  keyCodeArrowUp,
  keyCodeArrowDown,
  keyCodeHome,
  keyCodeEnd,
} from "@microsoft/fast-web-utilities";
import tabEventEmitter from "../TabEvents";
import { TabClassNameContract } from "../Tab/Tab.props";

const styles: ComponentStyles<TabBarClassNameContract, DesignSystem> = {
  tabBar: {
    display: "inline-flex",
    position: "relative",
    paddingBottom: "3px",
    "&:not(.focus-visible), & *": {
      outline: "none",
    },
  },
  tabBar_indicator: {
    background: accentFillActive,
    position: "absolute",
    bottom: "0",
    left: "0",
    width: "1px",
    height: "3px",
    transition: "all .2s",
    transformOrigin: "left",
  },
};

const tabStyles: ComponentStyles<TabClassNameContract, DesignSystem> = {
  tab_title: {},
  tab: {
    position: "relative",
    "&::after": {
      content: "''",
      position: "absolute",
      width: "100%",
      height: "3px",
      opacity: "0",
      background: neutralFillHover,
      bottom: "-3px",
      transition: "opacity .1s",
    },
    "&:hover::after": {
      opacity: "1",
    },
  },
};

/**
 * Custom tabbar which can be connected to a seperate tabpanel.
 * Some parts of the code were borrowed from FAST's <Tabs/>
 */
const TabBar: React.ComponentType<TabBarProps> = React.memo(
  ({ managedClasses, id, items, orientation = Orientation.horizontal, ...props }) => {
    /**
     * Id of the currently selected tab
     */
    const [activeId, setActiveId] = useState<string>(null);

    /**
     * Stylesheet for the active tab indicator
     */
    const [activeIndicatorStyles, setAactiveIndicatorStyles] = useState<
      React.CSSProperties
    >({});

    /**
     * Ref of the main tabbar
     */
    const tabBarRef = useRef<HTMLDivElement>();

    /**
     * Looks up whether the given tab is currently selected or not
     */
    const getActiveState = useCallback(
      (tabItem: TabItem, index: number): boolean => {
        if (activeId) return activeId === tabItem.id;
        return index === 0;
      },
      [activeId]
    );

    /**
     * Activates a tab and focuses on the new element
     */
    const activateTab = (location: TabLocation): void => {
      const count = items.length;
      const currentItemIndex: number = items.findIndex(getActiveState);
      let itemIndex: number;

      switch (location) {
        case TabLocation.first:
          itemIndex = 0;
          break;
        case TabLocation.last:
          itemIndex = count - 1;
          break;
        case TabLocation.previous:
          itemIndex = currentItemIndex > 0 ? currentItemIndex - 1 : count - 1;
          break;
        case TabLocation.next:
          itemIndex = currentItemIndex < count - 1 ? currentItemIndex + 1 : 0;
          break;
      }

      const nextActiveId = items[itemIndex].id;
      setActiveId(nextActiveId);
      (Array.from(tabBarRef.current.children)[itemIndex] as HTMLButtonElement).focus();
    };

    /**
     * Handles the click event of a tab element
     */
    const handleClick = (e: React.MouseEvent<HTMLDivElement>): void => {
      setActiveId(e.currentTarget.getAttribute("aria-controls"));
    };

    /**
     * Handles the keydown event on a tab element
     */
    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
      const keyCode: number = e.keyCode;

      if (orientation === Orientation.horizontal) {
        switch (keyCode) {
          case keyCodeArrowLeft:
            e.preventDefault();
            activateTab(TabLocation.previous);
            break;
          case keyCodeArrowRight:
            e.preventDefault();
            activateTab(TabLocation.next);
            break;
        }
      } else {
        switch (e.keyCode) {
          case keyCodeArrowUp:
            e.preventDefault();
            activateTab(TabLocation.previous);
            break;
          case keyCodeArrowDown:
            e.preventDefault();
            activateTab(TabLocation.next);
            break;
        }
      }

      switch (keyCode) {
        case keyCodeHome:
          activateTab(TabLocation.first);
          break;
        case keyCodeEnd:
          activateTab(TabLocation.last);
          break;
      }
    };

    /**
     * Emitting events on changes in the currently selected tab,
     * so that other components can react to the changes. (e.g.: TabPanel)
     */
    useEffect(() => {
      if (!activeId) return;
      const activeItem = items.find(getActiveState);
      tabEventEmitter.emit(`${id}-change`, activeItem);

      /**
       * Sends necessary tabbar data to new subscribers.
       */
      const subHandler = () => tabEventEmitter.emit(`${id}-subPub`, activeItem);
      tabEventEmitter.on(`${id}-sub`, subHandler);
      return () => {
        tabEventEmitter.off(`${id}-sub`, subHandler);
      };
    }, [activeId, getActiveState, id, items]);

    const renderTabs = (): JSX.Element[] => {
      if (items) {
        return items.map((tabItem: TabItem, index: number) => {
          const isActive = getActiveState(tabItem, index);
          return (
            <Tab
              slot={TabsSlot.tab}
              key={tabItem.id}
              aria-controls={tabItem.id}
              active={isActive}
              onClick={handleClick}
              onKeyDown={handleKeyDown}
              tabIndex={isActive ? 0 : -1}
              icon={tabItem.icon}
              jssStyleSheet={tabStyles}
            >
              {tabItem.title}
            </Tab>
          );
        });
      }

      return null;
    };

    useEffect(() => {
      if (tabBarRef.current && Array.isArray(items)) {
        const tabBar: HTMLDivElement = tabBarRef.current;
        const selectedTab: HTMLElement = tabBar.querySelector("[aria-selected='true']");

        // Default values
        let width: number = 0;
        let posX: number = 0;

        if (selectedTab !== null) {
          width = selectedTab.getBoundingClientRect().width;
          posX =
            (selectedTab.getBoundingClientRect().left -
              tabBar.getBoundingClientRect().left) /
            width;
        }

        setAactiveIndicatorStyles({
          transform: `scaleX(${width}) translateX(${posX}px)`,
        });
      }
    }, [items, activeId]);

    return (
      <div
        role="tablist"
        ref={tabBarRef}
        className={managedClasses.tabBar}
        aria-label={props.label}
        aria-orientation={orientation}
      >
        {renderTabs()}
        <div
          className={managedClasses.tabBar_indicator}
          tabIndex={-1}
          style={activeIndicatorStyles}
        />
      </div>
    );
  }
);

export default manageJss(styles)(TabBar);
