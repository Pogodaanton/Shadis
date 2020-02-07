import {ReactNode} from 'react';

export enum Theme {
  dark = "#242424",
  light = "#ffffff",
}

export enum ThemeName {
  dark = "dark",
  light = "light",
}

/**
 * Values for light and dark mode for `baseLayerLuminance` in the design system.
 * @enum {number}
 */
export enum StandardLuminance {
  LightMode = 1,
  DarkMode = 0.14,
}

interface ContextData {
  theme: ThemeName,
  toggleTheme: Function
}

export interface props { children: ReactNode; }
export interface state { contextData: ContextData, designSystem: Object }