import React from 'react';
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native';

import { Button, Radio } from '#ui-kit';
import { H2 } from '#ui-kit/Text';

import { ListExtender, ModalWrapper } from '#components';

import { STRINGS } from '#localization';

import { modalSafeZone } from '#styles';

import { ViewProps } from '.';

const Layout: React.FC<ViewProps> = props => {
  const renderItemWrapper = ({
    item,
    index,
  }: {
    item: unknown;
    index: number;
  }) => (
    <TouchableOpacity
      key={props.route.params.keyExtractor(item, index)}
      style={[styles.itemContainer, props.route.params.itemContainerStyle]}
      onPress={() =>
        props.setSelectedItem(() =>
          props.route.params.checkedExtractor(item, props.selectedItem, index)
            ? undefined
            : item,
        )
      }
    >
      {props.route.params.renderItem(item, index)}

      <Radio
        value={props.route.params.checkedExtractor(
          item,
          props.selectedItem,
          index,
        )}
      />
    </TouchableOpacity>
  );

  return (
    <ModalWrapper
      visible={props.modal.visible}
      setVisible={props.modal.setVisible}
    >
      <H2>{props.route.params?.title}</H2>

      <FlatList
        data={props.route.params.data}
        initialNumToRender={20}
        ListFooterComponent={<ListExtender />}
        ListHeaderComponent={<ListExtender />}
        renderItem={renderItemWrapper}
      />
      <Button
        style={modalSafeZone.style}
        onPress={() => {
          props.modal.close();

          props.route.params.onSelectionEnd(props.selectedItem);
        }}
      >
        {STRINGS.UTILS_MODAL_RADIO.select}
      </Button>
    </ModalWrapper>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default Layout;
