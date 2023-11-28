import React, { useState } from 'react';

import { CompositeScreenProps } from '@react-navigation/native';

import { ModalsRoutes, ModalsScreenProps } from '#navigation/Modals/types';
import { AppRoutes, AppScreenProps } from '#navigation/types';

import useModal, { ModalController } from '#hooks/useModal';

import Layout from './layout';

type NavigationProps = CompositeScreenProps<
  ModalsScreenProps<ModalsRoutes.Select>,
  AppScreenProps<AppRoutes>
>;

const Container: React.FC<NavigationProps> = props => {
  const modal = useModal(true);

  const [selectedItem, setSelectedItem] = useState<any[]>(
    props.route.params?.defaultValue,
  );

  const selectMultiple = (item: any, index: number) => {
    const isItemAlreadySelected = props.route.params.checkedExtractor(
      item,
      selectedItem,
      index,
    );

    if (isItemAlreadySelected) {
      setSelectedItem(old => {
        //TODO refactor
        return old.filter(
          el => !props.route.params.checkedExtractor(el, [item], index),
        );
      });
    } else {
      setSelectedItem(old => [...(old || []), item]);
    }
  };

  return (
    <Layout
      /**
       *Options
       */
      modal={modal}
      selectedItem={selectedItem}
      /**
       *Methods
       */
      selectMultiple={selectMultiple}
      setSelectedItem={setSelectedItem}
      {...props}
    />
  );
};

type PassingStates = {
  selectedItem: any;
};

type PassingProps = {
  modal: ModalController;
  selectMultiple: (item: any, index: number) => void;
};

export type ViewProps = NavigationProps &
  PassingStates &
  getSetStateProps<PassingStates> &
  PassingProps;

export default Container;
