import React, { useMemo } from 'react';

import { DeepPartial } from '@reduxjs/toolkit';

import _ from 'lodash';

import {
  AppComponentsColors,
  Colors,
  defaultColors,
  getAppComponentColors,
} from '.';
import { ColorsContext } from './ColorsContext';
import { ComponentColorsContext } from './ComponentsColorContext';

const ThemeProvider: React.FC<{
  colors: Colors;
  children: React.ReactNode;
  overrideComponentColors?: DeepPartial<AppComponentsColors>;
}> = ({ children, colors = defaultColors, overrideComponentColors }) => {
  const componentColors = useMemo(
    () => _.merge(getAppComponentColors(colors), overrideComponentColors),
    [colors, overrideComponentColors],
  );

  return (
    <ColorsContext.Provider value={colors}>
      <ComponentColorsContext.Provider value={componentColors}>
        {children}
      </ComponentColorsContext.Provider>
    </ColorsContext.Provider>
  );
};

export default ThemeProvider;
