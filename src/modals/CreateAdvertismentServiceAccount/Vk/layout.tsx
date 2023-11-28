import React from 'react';
import { StyleSheet } from 'react-native';

import { Button, FieldError, TextInput } from '#ui-kit';
import { H2 } from '#ui-kit/Text';

import { ModalWrapper } from '#components';

import { STRINGS } from '#localization';

import { ViewProps } from '.';

const Layout: React.FC<ViewProps> = props => {
  const t = STRINGS.MODAL_CREATE_VK_ACCOUNT;
  return (
    <ModalWrapper
      visible={props.modal.visible}
      setVisible={props.modal.setVisible}
    >
      <H2>{t.title}</H2>

      <TextInput
        containerStyle={styles.inputContainer}
        label={t.linkLabel}
        value={props.link}
        onBlur={() => props.validateLink()}
        onChange={props.setLink}
        onSubmitEditing={() => props.refName.current?.focus()}
      />

      <FieldError style={styles.error}>{props.errorLink}</FieldError>

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
    </ModalWrapper>
  );
};

const styles = StyleSheet.create({
  error: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
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
