import { ReactNode } from "react";

export enum Theme {
  dark = "#242424",
  light = "#f7f7f7",
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
  LightMode = 0.97,
  DarkMode = 0.14,
}

export interface ContextData {
  theme: ThemeName;
  toggleTheme: () => void;
}

export interface props {
  children: ReactNode;
}

export interface state {
  contextData: ContextData;
  designSystem: Object;
}
