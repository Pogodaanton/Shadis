import {ReactNode} from 'react';

export enum Theme {
  dark = "#333333",
  light = "#FFFFFF",
}

export enum ThemeName {
  dark = "dark",
  light = "light",
}

interface ContextData {
  theme: ThemeName,
  toggleTheme: Function
}

export interface props { children: ReactNode; }
export interface state { contextData: ContextData, designSystem: Object }