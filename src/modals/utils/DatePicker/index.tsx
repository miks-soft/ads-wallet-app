import React from 'react';

import { ModalsRoutes, ModalsScreenProps } from '#navigation/Modals/types';

import Layout from './layout';

type NavigationProps = ModalsScreenProps<ModalsRoutes.DatePicker>;

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
