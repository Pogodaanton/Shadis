import React, { ReactNode, Component } from 'react';
import { DesignSystemProvider } from '@microsoft/fast-jss-manager-react';
import { StandardLuminance } from "@microsoft/fast-components-styles-msft";
import { ThemeName, Theme, props, state } from './DesignSystem.props';

export const PogodaDesignToolkit = React.createContext({});

const colorSchemes: { [key: string]: string } = {
  'DARK': '(prefers-color-scheme: dark)',
  'LIGHT': '(prefers-color-scheme: light)'
}

class PogodaDesignToolkitProvider extends Component<props, state> {
  private handleUpdateTheme = (customThemeName?: ThemeName): void => {
    const isLightMode: boolean = typeof customThemeName === "string" ? customThemeName === ThemeName.dark : this.state.contextData.theme === ThemeName.light;
    const updatedThemeColor: string = isLightMode ? Theme.dark : Theme.light;
    const updatedLuminance: number = isLightMode
        ? StandardLuminance.DarkMode
        : StandardLuminance.LightMode;
    console.log(isLightMode)

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


  constructor (props: props, state: state) {
    super(props, state)
    if (!window.matchMedia) {
      return
    }

    const listener = (e: MediaQueryListEvent | MediaQueryList): any => {
      if (!e || !e.matches) {
        return
      }
      const schemeNames = Object.keys(colorSchemes)
      for (let i = 0; i < schemeNames.length; i++) {
        const schemeName = schemeNames[i]
        if (e.media === colorSchemes[schemeName]) {
          this.handleUpdateTheme(schemeName === 'DARK' ? ThemeName.dark : ThemeName.light)
          break
        }
      }
    }

    // Add listener for all themes
    let activeMatches: Array<MediaQueryList> = []
    Object.keys(colorSchemes).forEach(schemeName => {
      const mq = window.matchMedia(colorSchemes[schemeName])
      mq.addListener(listener)
      activeMatches.push(mq)
      listener(mq)
    })

    // Remove listeners, no memory leaks
    activeMatches.forEach(mq => mq.removeListener(listener))
    activeMatches = []
  }

  public state = {
    contextData: {
      theme: ThemeName.light,
      toggleTheme: this.handleUpdateTheme
    },
    designSystem: {
      baseLayerLuminance: StandardLuminance.LightMode,
      backgroundColor: Theme.light
    }
  }

  public render = (): ReactNode => (
    <PogodaDesignToolkit.Provider value={this.state.contextData}>
      <DesignSystemProvider designSystem={this.state.designSystem}>
        {this.props.children}
      </DesignSystemProvider>
    </PogodaDesignToolkit.Provider>
  )
}

export default PogodaDesignToolkitProvider;
