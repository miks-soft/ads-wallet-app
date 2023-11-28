import React, { useContext } from 'react';

import _ from 'lodash';

import { AppComponentsColors } from './index';

export const ComponentColorsContext = React.createContext<AppComponentsColors>(
  undefined as unknown as AppComponentsColors,
);
/*
// if init value set as getAppComponentsColor(defaultTheme)
// error with imports occurs and func becomes undefined
// resulting in TypeError runtime error
*/
export const useComponentsColors = <T extends keyof AppComponentsColors>(
  componentName?: T,
  overrideColors?: AppComponentsColors[T],
) => {
  const componentColors = useContext(ComponentColorsContext);

  return (
    componentName
      ? _.merge(componentColors![componentName], overrideColors)
      : componentColors
  ) as AppComponentsColors[T];
};
