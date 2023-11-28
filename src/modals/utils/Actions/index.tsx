import React from 'react';

import { ModalsRoutes, ModalsScreenProps } from '#navigation/Modals/types';

import useModal, { ModalController } from '#hooks/useModal';

import Layout from './layout';
import { UIActionModalButton } from './types';

type NavigationProps = ModalsScreenProps<ModalsRoutes.Actions>;

const Container: React.FC<NavigationProps> = props => {
  const modal = useModal(true);

  return (
    <Layout
      /**
       *Options
       */
      buttons={props.route.params?.buttons}
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
  buttons: UIActionModalButton[];
  modal: ModalController;
};

export type ViewProps = NavigationProps &
  PassingStates &
  getSetStateProps<PassingStates> &
  PassingProps;

export default Container;
