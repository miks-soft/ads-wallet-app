import React, { useState } from 'react';

import { CompositeScreenProps } from '@react-navigation/native';

import {
  BusinessAccountRoutes,
  BusinessAccountScreenProps,
} from '#navigation/BusinessAccount/types';
import { AppRoutes, AppScreenProps } from '#navigation/types';

import { animateDecorator } from '#utils';

import Layout from './layout';

type NavigationProps = CompositeScreenProps<
  BusinessAccountScreenProps<BusinessAccountRoutes.CU>,
  AppScreenProps<AppRoutes>
>;

const Container: React.FC<NavigationProps> = props => {
  const { isEdit, businessAccount } = props.route.params;

  const [tab, setTab] = useState(
    isEdit ? (businessAccount?.is_legal ? 1 : 0) : 0,
  );

  return (
    <Layout
      /**
       *Options
       */
      tab={tab}
      /**
       *Methods
       */
      setTab={animateDecorator(setTab)}
      {...props}
    />
  );
};

type PassingStates = {
  tab: number;
};

type PassingProps = {};

export type ViewProps = NavigationProps &
  PassingStates &
  getSetStateProps<PassingStates> &
  PassingProps;

export default Container;
