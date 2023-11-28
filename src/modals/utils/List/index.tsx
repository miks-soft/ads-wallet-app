import React from 'react';

import { CompositeScreenProps } from '@react-navigation/native';

import { ModalsRoutes, ModalsScreenProps } from '#navigation/Modals/types';
import { AppRoutes, AppScreenProps } from '#navigation/types';

import useModal, { ModalController } from '#hooks/useModal';

import Layout from './layout';

type NavigationProps = CompositeScreenProps<
  ModalsScreenProps<ModalsRoutes.List>,
  AppScreenProps<AppRoutes>
>;

const Container: React.FC<NavigationProps> = props => {
  const modal = useModal(true);

  return (
    <Layout
      /**
       *Options
       */
      modal={modal}
      /**
       *Methods
       */

      {...props}
    />
  );
};

type PassingStates = {};

type PassingProps = {
  modal: ModalController;
};

export type ViewProps = NavigationProps &
  PassingStates &
  getSetStateProps<PassingStates> &
  PassingProps;

export default Container;
