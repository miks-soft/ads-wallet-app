import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

import { Button, FieldError, Icon, Loader, TextInput } from '#ui-kit';
import Text, { H2 } from '#ui-kit/Text';

import { Attachment, ModalWrapper } from '#components';

import { ModalsRoutes } from '#navigation/Modals/types';

import { STRINGS } from '#localization';

import { useColors } from '#styles/theme/ColorsContext';

import { DTOHelpdeskTheme } from '#generated/types';

import { ViewProps } from '.';

const Layout: React.FC<ViewProps> = props => {
  const colors = useColors();
  const t = STRINGS.MODAL_CREATE_HELPDESK_REQUEST;
  return (
    <ModalWrapper
      visible={props.modal.visible}
      setVisible={props.modal.setVisible}
    >
      <ScrollView keyboardShouldPersistTaps="handled">
        <H2>{t.title}</H2>

        <TouchableOpacity
          disabled={!props.themes?.length}
          onPress={() => {
            props.navigation.navigate(ModalsRoutes.RadioSelect, {
              data: props.themes!,
              keyExtractor: item => item.id,
              checkedExtractor: (item, currentItem) =>
                item?.id === currentItem?.id,
              renderItem: (item: DTOHelpdeskTheme) => (
                <Text style={styles.selectItem}>{item.name}</Text>
              ),
              onSelectionEnd: item => {
                props.setTheme && props.setTheme(item);
              },
              title: t.selectThemeModal.title,
              defaultValue: props.theme,
            });

            props.modal.closeWithoutGoBack();
          }}
        >
          <TextInput
            containerStyle={styles.inputContainer}
            IconRight={
              props.themesLoading ? (
                <Loader />
              ) : props.theme?.id ? (
                <TouchableOpacity onPress={() => props.setTheme(undefined)}>
                  <Icon name="close" />
                </TouchableOpacity>
              ) : (
                <Icon
                  color={colors.grayscale.__2}
                  name="chevron-bottom"
                />
              )
            }
            label={t.themeInputLabel}
            pointerEvents="none"
            value={props.theme?.name}
            onSubmitEditing={() => props.refName.current?.focus()}
          />
        </TouchableOpacity>

        <TextInput
          containerStyle={styles.inputContainer}
          inputRef={props.refName}
          label={t.nameInputLabel}
          value={props.name}
          onChange={props.setName}
          onSubmitEditing={() => props.refText.current?.focus()}
        />

        <FieldError style={styles.error}>{props.errorName}</FieldError>

        <TextInput
          containerStyle={styles.inputContainer}
          inputRef={props.refText}
          label={t.textInputLabel}
          multiline={true}
          value={props.text}
          onChange={props.setText}
          onSubmitEditing={props.onAdd}
        />

        <FieldError style={styles.error}>{props.errorName}</FieldError>

        <ScrollView
          horizontal={true}
          style={styles.attachments}
        >
          {!!props.attachments.length &&
            props.attachments.map((el, index) => (
              <Attachment
                key={index + `${el.uri}`}
                name={el.name}
                type={el.type}
                onDelete={() =>
                  props.setAttachments(old =>
                    old.filter((item, idx) => index !== idx),
                  )
                }
              />
            ))}
        </ScrollView>

        <Button
          disabled={!(props.text.length && props.name.length && props.theme)}
          isLoading={props.isLoading}
          style={styles.sendButton}
          onPress={props.onAdd}
        >
          {t.actionAdd}
        </Button>

        <Button
          style={styles.button}
          type="secondary"
          onPress={props.onAttach}
        >
          {t.actionAttachFiles}
        </Button>
      </ScrollView>
    </ModalWrapper>
  );
};

const styles = StyleSheet.create({
  error: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  sendButton: {
    marginTop: 12,
  },
  button: {
    marginTop: 12,
    marginBottom: 8,
  },
  attachments: {
    width: '100%',
    paddingHorizontal: 4,
  },
  inputContainer: {
    marginTop: 12,
  },
  selectItem: {
    flex: 1,
    flexWrap: 'wrap',
    paddingVertical: 16,
  },
});

export default Layout;
