import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import { StackNavigationProp } from '@react-navigation/stack';

import { Button } from '#ui-kit';
import { H2 } from '#ui-kit/Text';

import { ListExtender, ModalWrapper } from '#components';

import { AppParamList } from '#navigation/types';

import { modalSafeZone } from '#styles';

import { ViewProps } from '.';

const Layout: React.FC<ViewProps> = props => {
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
        renderItem={({ item, index }) =>
          props.route.params.renderItem(item, index)
        }
      />
      <View style={[styles.footer, modalSafeZone.style]}>
        <Button
          {...props.route.params.buttonProps}
          onPress={() => {
            props.route.params.buttonProps.onPress &&
              props.route.params.buttonProps.onPress(
                props.navigation as unknown as StackNavigationProp<AppParamList>,
                props.modal,
              );
          }}
        />
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
});

export default Layout;
