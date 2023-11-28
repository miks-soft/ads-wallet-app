import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { Button, FieldError, TextInput } from '#ui-kit';
import { H2, H4 } from '#ui-kit/Text';

import { ModalWrapper } from '#components';

import { AppRoutes } from '#navigation/types';

import { STRINGS } from '#localization';

import { useColors } from '#styles/theme/ColorsContext';

import { ViewProps } from '.';

const Layout: React.FC<ViewProps> = props => {
  const t = STRINGS.MODAL_CREATE_MY_TARGET_ACCOUNT;
  const colors = useColors();
  return (
    <ModalWrapper
      visible={props.modal.visible}
      setVisible={props.modal.setVisible}
    >
      <H2>{t.title}</H2>

      <TextInput
        containerStyle={styles.inputContainer}
        label={t.emailLabel}
        value={props.email}
        onChange={props.setEmail}
        onSubmitEditing={() => props.refName.current?.focus()}
      />

      <FieldError style={styles.error}>{props.errorEmail}</FieldError>

      <TextInput
        containerStyle={styles.inputContainer}
        inputRef={props.refName}
        label={t.clientNameLabel}
        value={props.name}
        onChange={props.setName}
        onSubmitEditing={props.onAdd}
      />

      <FieldError style={styles.error}>{props.errorName}</FieldError>

      <Button
        isLoading={props.isLoading}
        style={styles.button}
        onPress={props.onAdd}
      >
        {t.actionButton}
      </Button>

      <TouchableOpacity
        style={styles.link}
        onPress={() => {
          props.modal.closeWithoutGoBack();
          props.navigation.navigate(AppRoutes.AddMyTargetAccountGuide);
        }}
      >
        <H4
          color={colors.primary.normal}
          textAlign="center"
        >
          {t.toGuideScreenLink}
        </H4>
      </TouchableOpacity>
    </ModalWrapper>
  );
};

const styles = StyleSheet.create({
  error: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  link: {
    marginBottom: 8,
  },
  button: {
    marginTop: 12,
    marginBottom: 8,
  },
  inputContainer: {
    marginTop: 12,
  },
});

export default Layout;
