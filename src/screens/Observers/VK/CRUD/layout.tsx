import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';

import { Button, Header, Icon, TextInput } from '#ui-kit';
import Text, { H2, H3 } from '#ui-kit/Text';

import { ModalsRoutes } from '#navigation/Modals/types';
import { AppRoutes } from '#navigation/types';

import { STRINGS } from '#localization';

import { SAFE_ZONE_BOTTOM } from '#styles';
import { useColors } from '#styles/theme/ColorsContext';

import { DTOObserverClient } from '#generated/types';

import { ViewProps } from '.';
import ObserversClient from '../../components/ObserversClient';

const Layout: React.FC<ViewProps> = props => {
  const colors = useColors();
  const isEdit = !!props.observer;
  const t = STRINGS.SCREEN_OBSERVERS_VK_CRUD;

  return (
    <View style={styles.container}>
      <Header
        hideRightIcon={true}
        rightIconName="plus"
        subtitle="vk.com"
        title={isEdit ? t.headerTitleEdit : t.headerTitle}
        onPressLeft={props.navigation.goBack}
      />
      <ScrollView contentContainerStyle={styles.scroll}>
        <H2 style={styles.title}>{t.accountInputTitle}</H2>
        <TouchableOpacity
          disabled={!isEdit}
          onPress={() =>
            Linking.openURL(`https://vk.com/id${props.observer?.user_id}`)
          }
        >
          <TextInput
            disabled={isEdit}
            IconRight={
              props.observer ? (
                <TouchableOpacity
                  onPress={() =>
                    props.navigation.navigate(AppRoutes.Modals, {
                      screen: ModalsRoutes.Dialog,
                      params: {
                        title: t.deleteAccountDialog.title,
                        text: t.deleteAccountDialog.text,
                        confirmButtonProps: {
                          children: t.deleteAccountDialog.confirmButton,
                          onPress: (navigation, modal) => {
                            modal.close();
                            props.onDelete();
                          },
                        },
                        declineButtonProps: {
                          children: t.deleteAccountDialog.declineButton,
                          onPress: (navigation, modal) => modal.close(),
                        },
                      },
                    })
                  }
                >
                  <Icon
                    color={colors.error.classic}
                    name="trash"
                  />
                </TouchableOpacity>
              ) : undefined
            }
            label={
              isEdit
                ? `https://vk.com/id${props.observer?.user_id}`
                : t.accountInputLabel
            }
            pointerEvents={isEdit ? 'none' : undefined}
            value={props.accountLink}
            onChange={props.setAccountLink}
          />
        </TouchableOpacity>

        <H2 style={styles.title}>{t.addAccountsTitle}</H2>
        <Button
          isLoading={props.accountsLoading}
          size="small"
          type="secondary"
          onPress={() =>
            props.navigation.navigate(AppRoutes.Modals, {
              screen: ModalsRoutes.Select,
              params: {
                data: props.observerClients!,
                keyExtractor: item => item.id,
                checkedExtractor: (item, currentItem: DTOObserverClient[]) =>
                  currentItem?.some(el => el.account_id === item.account_id),
                renderItem: (item: DTOObserverClient) => (
                  <View style={styles.modalClient}>
                    <H3 style={[styles.modalClientTitle, styles.wrapFix]}>
                      {item!.account_name.split('/')[3]}
                    </H3>
                    <Text style={styles.wrapFix}>{item.name}</Text>
                  </View>
                ),
                isMultiple: true,
                onSelectionEnd: items =>
                  props.setSelectedObserverClients(items),
                title: t.selectAccountsModal.title,
                defaultValue: props.selectedObserverClients,
                withCheckMark: true,
              },
            })
          }
        >
          {t.addAccountButton}
        </Button>
        {props.selectedObserverClients?.map(el => (
          <ObserversClient
            key={el.id}
            item={el}
            onDelete={() =>
              props.setSelectedObserverClients(old =>
                old?.filter(item => item.id !== el.id),
              )
            }
          />
        ))}
      </ScrollView>
      <View style={styles.footer}>
        <Button
          disabled={
            !(props.selectedObserverClients?.length && props.accountLink)
          }
          isLoading={props.isSubmitting}
          onPress={isEdit ? props.onEdit : props.onCreate}
        >
          {isEdit ? t.actionButtonEdit : t.actionButton}
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  footer: {
    paddingBottom: SAFE_ZONE_BOTTOM,
    paddingHorizontal: 16,
  },
  title: {
    marginTop: 8,
  },
  wrapFix: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 16,
    gap: 12,
  },
  modalClient: {
    flex: 1,
    marginBottom: 8,
  },
  modalClientTitle: {
    marginBottom: 2,
  },
});

export default Layout;
