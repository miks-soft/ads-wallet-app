import React from 'react';
import { FlatList, StyleSheet, View, TouchableOpacity } from 'react-native';

import { Button, Icon } from '#ui-kit';
import { H2 } from '#ui-kit/Text';

import { ListExtender, ModalWrapper } from '#components';

import { STRINGS } from '#localization';

import { modalSafeZone } from '#styles';
import { useColors } from '#styles/theme/ColorsContext';

import { ViewProps } from '.';

const Layout: React.FC<ViewProps> = props => {
  const colors = useColors();

  const renderItemWrapper = ({
    item,
    index,
  }: {
    item: unknown;
    index: number;
  }) => (
    <TouchableOpacity
      key={props.route.params.keyExtractor(item, index)}
      style={[
        styles.itemContainer,
        {
          backgroundColor: props.route.params.checkedExtractor(
            item,
            props.selectedItem,
            index,
          )
            ? colors.grayscale.__6
            : colors.white,
        },
        props.route.params.itemContainerStyle,
      ]}
      onPress={() =>
        props.route.params.isMultiple
          ? props.selectMultiple(item, index)
          : props.setSelectedItem(item)
      }
    >
      {props.route.params.renderItem(item, index)}

      {props.route.params?.withCheckMark && (
        <View style={styles.icon}>
          <Icon
            color={
              props.route.params.checkedExtractor(
                item,
                props.selectedItem,
                index,
              )
                ? colors.primary.normal
                : colors.white
            }
            name="check"
            size={24}
          />
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <ModalWrapper
      contentContainerStyle={styles.modalContent}
      visible={props.modal.visible}
      setVisible={props.modal.setVisible}
    >
      <H2 style={styles.header}>{props.route.params?.title}</H2>

      <FlatList
        data={props.route.params.data}
        ListFooterComponent={<ListExtender />}
        ListHeaderComponent={<ListExtender />}
        renderItem={renderItemWrapper}
      />
      <View style={[styles.footer, modalSafeZone.style]}>
        <Button
          disabled={!props.selectedItem}
          onPress={() => {
            props.modal.close();

            props.route.params.onSelectionEnd(props.selectedItem);
          }}
        >
          {STRINGS.UTILS_MODAL_RADIO.select}
        </Button>
      </View>
    </ModalWrapper>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
  },
  footer: {
    paddingHorizontal: 16,
  },
  modalContent: {
    paddingHorizontal: 0,
  },
  itemContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  icon: {
    flexShrink: 0,
  },
});

export default Layout;
