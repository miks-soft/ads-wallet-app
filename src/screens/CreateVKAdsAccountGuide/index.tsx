import React from 'react';

import { AppRoutes, AppScreenProps } from '#navigation/types';

import Layout from './layout';

type NavigationProps = AppScreenProps<AppRoutes.AddVKAdsAccountGuide>;

const Container: React.FC<NavigationProps> = props => {
  return (
    <Layout
      /**
       *Options
       */

      /**
       *Methods
       */
      {...props}
    />
  );
};

type PassingStates = {};

type PassingProps = {};

export type ViewProps = NavigationProps &
  PassingStates &
  getSetStateProps<PassingStates> &
  PassingProps;

export default Container;
