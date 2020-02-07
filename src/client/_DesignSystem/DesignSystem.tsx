import React, { ReactNode, Component } from 'react';
import { DesignSystemProvider } from '@microsoft/fast-jss-manager-react';
import { StandardLuminance, ThemeName, Theme, props, state } from './DesignSystem.props';

export const PogodaDesignToolkit = React.createContext({});

const colorSchemes: { [key: string]: string } = {
  'dark': '(prefers-color-scheme: dark)',
  'light': '(prefers-color-scheme: light)'
}

class PogodaDesignToolkitProvider extends Component<props, state> {
  // Dark / Light mode listeners
  private activeMatches: Array<MediaQueryList> = [];

  /**
   * Toggles between dark / light mode.
   * If a `ThemeName` is given, it will update to that specific one.
   *
   * @see https://git.io/JvkF1
   * @memberof PogodaDesignToolkitProvider
   */
  handleUpdateTheme = (customThemeName?: ThemeName): void => {
    // If ThemeName is given, we don't want to change theme to it's opposite.
    // To avoid further complications in the code, we just pretend light mode were on if the opposite is the case
    const isLightMode: boolean = typeof customThemeName === "string"
      ? customThemeName === ThemeName.dark
      : this.state.contextData.theme === ThemeName.light;

    const updatedThemeColor: string = isLightMode ? Theme.dark : Theme.light;
    const updatedLuminance: number = isLightMode
        ? StandardLuminance.DarkMode
        : StandardLuminance.LightMode;

    this.setState({
        contextData: {
          ...this.state.contextData,
          theme: isLightMode ? ThemeName.dark : ThemeName.light
        },
        designSystem: {
          ...this.state.designSystem,
          baseLayerLuminance: updatedLuminance,
          backgroundColor: updatedThemeColor,
        },
    });
  };

  /**
   * Changes to dark / light mode according to system defaults
   * @private
   * @see https://git.io/JvkF6
   * @event MediaQueryList
   * @memberof PogodaDesignToolkitProvider
   */
  private matchMediaListener = (e: MediaQueryListEvent | MediaQueryList): any => {
    if (!e || !e.matches) {
      return
    }
    const schemeNames = Object.keys(colorSchemes)
    for (let i = 0; i < schemeNames.length; i++) {
      const schemeName = schemeNames[i]
      if (e.media === colorSchemes[schemeName]) {
        this.handleUpdateTheme(schemeName === 'dark' ? ThemeName.dark : ThemeName.light)
        break
      }
    }
  }

  // Add OS theme listener
  componentDidMount = () => {
    if (!window.matchMedia) return
    Object.keys(colorSchemes).forEach(schemeName => {
      const mq = window.matchMedia(colorSchemes[schemeName])
      mq.addListener(this.matchMediaListener)
      this.activeMatches.push(mq)
      this.matchMediaListener(mq)
    })
  }

  // Remove theme listeners, no memory leaks
  componentWillUnmount = () => {
    if (!window.matchMedia) return
    this.activeMatches.forEach(mq => mq.removeListener(this.matchMediaListener))
    this.activeMatches = []
  }

  state = {
    contextData: {
      theme: ThemeName.light,
      toggleTheme: this.handleUpdateTheme
    },
    designSystem: {
      baseLayerLuminance: StandardLuminance.LightMode,
      backgroundColor: Theme.light
    }
  }

  render = (): ReactNode => (
    <PogodaDesignToolkit.Provider value={this.state.contextData}>
      <DesignSystemProvider designSystem={this.state.designSystem}>
        {this.props.children}
      </DesignSystemProvider>
    </PogodaDesignToolkit.Provider>
  )
}

export default PogodaDesignToolkitProvider;