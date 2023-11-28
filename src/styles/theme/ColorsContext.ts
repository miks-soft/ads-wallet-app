import React, { useContext } from 'react';

import { defaultColors } from './index';

export const ColorsContext = React.createContext(defaultColors);

export const useColors = () => {
  const colors = useContext(ColorsContext);

  return colors;
};
