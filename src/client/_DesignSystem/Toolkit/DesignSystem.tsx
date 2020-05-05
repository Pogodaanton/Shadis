import React, { ReactNode, Component } from "react";
import { DesignSystemProvider } from "@microsoft/fast-jss-manager-react";
import {
  StandardLuminance,
  ThemeName,
  Theme,
  props,
  state,
  ContextData,
} from "./DesignSystem.props";
import { createColorPalette } from "@microsoft/fast-components-styles-msft";
import { parseColor } from "@microsoft/fast-colors";

export const DesignToolkit = React.createContext<ContextData>(null);

const colorSchemes: { [key: string]: string } = {
  dark: "(prefers-color-scheme: dark)",
  light: "(prefers-color-scheme: light)",
};

const accentBaseColor = "#ff6e01";
const accentColors = {
  accentBaseColor,
  accentPalette: createColorPalette(parseColor(accentBaseColor)),
};

/**
 * @see window.userData
 */
export const isLoggedIn =
  typeof window.userData !== "undefined" &&
  typeof window.userData.username !== "undefined";

class DesignToolkitProvider extends Component<props, state> {
  // Dark / Light mode listeners
  private activeMatches: Array<MediaQueryList> = [];

  /**
   * Toggles between dark / light mode.
   * If a `ThemeName` is given, it will update to that specific one.
   *
   * @see https://git.io/JvkF1
   * @memberof DesignToolkitProvider
   */
  handleUpdateTheme = (customThemeName?: ThemeName): void => {
    // If ThemeName is given, we don't want to change theme to it's opposite.
    // To avoid further complications in the code, we just pretend light mode were on if the opposite is the case
    const isLightMode: boolean =
      typeof customThemeName === "string"
        ? customThemeName === ThemeName.dark
        : this.state.contextData.theme === ThemeName.light;

    const updatedThemeColor: string = isLightMode ? Theme.dark : Theme.light;
    const updatedLuminance: number = isLightMode
      ? StandardLuminance.DarkMode
      : StandardLuminance.LightMode;

    this.setState({
      contextData: {
        ...this.state.contextData,
        theme: isLightMode ? ThemeName.dark : ThemeName.light,
      },
      designSystem: {
        ...this.state.designSystem,
        ...accentColors,
        baseLayerLuminance: updatedLuminance,
        backgroundColor: updatedThemeColor,
        cornerRadius: 5,
      },
    });
  };

  /**
   * Changes to dark / light mode according to system defaults
   * @private
   * @see https://git.io/JvkF6
   * @event MediaQueryList
   * @memberof DesignToolkitProvider
   */
  private matchMediaListener = (e: MediaQueryListEvent | MediaQueryList): any => {
    if (!e || !e.matches) {
      return;
    }
    const schemeNames = Object.keys(colorSchemes);
    for (let i = 0; i < schemeNames.length; i++) {
      const schemeName = schemeNames[i];
      if (e.media === colorSchemes[schemeName]) {
        this.handleUpdateTheme(schemeName === "dark" ? ThemeName.dark : ThemeName.light);
        break;
      }
    }
  };

  // Add OS theme listener
  componentDidMount = () => {
    if (!window.matchMedia) return;
    Object.keys(colorSchemes).forEach(schemeName => {
      const mq = window.matchMedia(colorSchemes[schemeName]);
      mq.addListener(this.matchMediaListener);
      this.activeMatches.push(mq);
      this.matchMediaListener(mq);
    });
  };

  // Remove theme listeners, no memory leaks
  componentWillUnmount = () => {
    if (!window.matchMedia) return;
    this.activeMatches.forEach(mq => mq.removeListener(this.matchMediaListener));
    this.activeMatches = [];
  };

  state = {
    contextData: {
      theme: ThemeName.light,
      toggleTheme: this.handleUpdateTheme,
    },
    designSystem: {
      baseLayerLuminance: StandardLuminance.LightMode,
      backgroundColor: Theme.light,
    },
  };

  render = (): ReactNode => (
    <DesignToolkit.Provider value={this.state.contextData}>
      <DesignSystemProvider designSystem={this.state.designSystem}>
        {this.props.children}
      </DesignSystemProvider>
    </DesignToolkit.Provider>
  );
}

export default DesignToolkitProvider;
