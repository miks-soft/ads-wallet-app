import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import Clipboard from '@react-native-clipboard/clipboard';

import { Icon, Loader, Text } from '#ui-kit';
import { H3 } from '#ui-kit/Text';

import { ListExtender } from '#components';

import ToastService from '#services/ToastService';

import {
  DocumentsDeliveryTypes,
  MapDocumentsDeliveryTypesText,
} from '#config/enums';

import { SAFE_ZONE_BOTTOM } from '#styles';
import { useColors } from '#styles/theme/ColorsContext';

import { ViewProps } from '.';

const Layout: React.FC<ViewProps> = props => {
  const colors = useColors();
  const renderCopyableLine = (title: string, text?: string) => {
    return (
      <TouchableOpacity
        disabled={!text}
        onPress={() => {
          Clipboard.setString(text!);
          ToastService.success(`Поле "${title}" скопировано в буффер обмена`);
        }}
      >
        <View style={styles.copyableTitleWrapper}>
          <Text color={colors.grayscale.__2}>{title}</Text>
          <Icon
            color={colors.grayscale.__2}
            name="copy"
            size={16}
            style={styles.copyIcon}
          />
        </View>
        <Text style={styles.description}>{text}</Text>
      </TouchableOpacity>
    );
  };

  const renderLine = (title: string, text?: string) => {
    return (
      <>
        <Text color={colors.grayscale.__2}>{title}</Text>
        <Text style={styles.description}>{text}</Text>
      </>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <H3 style={styles.title}>Учётные данные</H3>

      {renderCopyableLine('Эл. почта', props.userInfo?.email)}
      {renderCopyableLine('ADSWallet ID', props.businessAccount?.id)}

      <H3 style={styles.title}>Данные юрлица</H3>

      {renderCopyableLine('ИНН', props.businessAccount?.inn)}
      {renderCopyableLine('Название', props.businessAccount?.legal_name)}
      {renderCopyableLine('Юр. адрес', props.businessAccount?.legal_address)}
      {renderCopyableLine(
        'Почтовый адрес',
        props.businessAccount?.legal_receiving_physical_address,
      )}

      <H3 style={styles.title}>Контактное лицо</H3>

      {renderLine('Имя', props.businessAccount?.legal_contact_name)}
      {renderCopyableLine('Телефон', props.businessAccount?.phone)}
      {renderCopyableLine('E-mail', props.businessAccount?.email)}

      <H3 style={styles.title}>Банковские реквизиты</H3>

      {renderLine('Название', props.businessAccount?.bank_name)}
      {renderCopyableLine('БИК', props.businessAccount?.bic)}
      {renderCopyableLine('Расчетный счёт', props.businessAccount?.iban)}
      {renderCopyableLine(
        'Корреспондентский счёт',
        props.businessAccount?.swift_code,
      )}
      {renderCopyableLine('Адрес банка', props.businessAccount?.bank_address)}

      <H3 style={styles.title}>Закрывающие документы</H3>

      {renderLine(
        'Получать по',
        MapDocumentsDeliveryTypesText[
          props.businessAccount!
            .legal_receiving_docs_method as DocumentsDeliveryTypes
        ],
      )}

      <H3 style={styles.title}>Управление через API</H3>

      {renderCopyableLine(
        'Client ID',
        props.businessAccount?.oaut2_data?.cilent_id || '-',
      )}
      {renderCopyableLine(
        'Client Secret',
        props.businessAccount?.oaut2_data?.cilent_secret || '-',
      )}

      {props.isResetingSecret ? (
        <Loader />
      ) : (
        <TouchableOpacity onPress={props.onResetClientSecret}>
          <Text color={colors.primary.normal}>Сгенерировать новый ключ</Text>
        </TouchableOpacity>
      )}

      <ListExtender height={SAFE_ZONE_BOTTOM} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  copyableTitleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    marginTop: 12,
    marginBottom: 8,
  },
  copyIcon: {
    marginLeft: 4,
  },
  description: {
    marginBottom: 8,
  },
});

export default Layout;
