import React from 'react';
import { View, StyleSheet } from 'react-native';

import { StackNavigationProp } from '@react-navigation/stack';

import { Button } from '#ui-kit';
import { H2 } from '#ui-kit/Text';

import { ModalWrapper } from '#components';

import { AppParamList } from '#navigation/types';

import { STRINGS } from '#localization';

import { modalSafeZone } from '#styles';

import { ViewProps } from '.';

const Layout: React.FC<ViewProps> = props => {
  const t = STRINGS.UTILS_MODAL_ACTIONS;
  return (
    <ModalWrapper
      visible={props.modal.visible}
      setVisible={props.modal.setVisible}
    >
      <H2>{t.title}</H2>

      {!!props.buttons.length &&
        props.buttons.map((el, index) => (
          <View
            key={index}
            style={styles.buttonContainer}
          >
            <Button
              {...el}
              onPress={() => {
                el.onPress &&
                  el.onPress(
                    props.navigation as unknown as StackNavigationProp<AppParamList>,
                    props.modal,
                  );
              }}
            />
          </View>
        ))}

      <View style={modalSafeZone.style} />
    </ModalWrapper>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: 12,
  },
});

export default Layout;
