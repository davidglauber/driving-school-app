declare module 'react-native-progress/Bar' {
    import { Component } from 'react';
    import { ViewStyle } from 'react-native';
  
    interface ProgressBarProps {
      progress?: number;
      indeterminate?: boolean;
      color?: string;
      unfilledColor?: string;
      borderColor?: string;
      borderWidth?: number;
      width?: number;
      height?: number;
      borderRadius?: number;
      animationType?: 'decay' | 'timing' | 'spring';
      style?: ViewStyle;
    }
  
    export default class ProgressBar extends Component<ProgressBarProps> {}
  }