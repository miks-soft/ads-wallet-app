import React from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';

import { Button, Loader, NoDataError } from '#ui-kit';
import { H2 } from '#ui-kit/Text';

import { ListExtender, ModalWrapper } from '#components';

import { BusinessAccountRoutes } from '#navigation/BusinessAccount/types';
import { AppRoutes } from '#navigation/types';

import { STRINGS } from '#localization';

import { modalSafeZone } from '#styles';

import { ViewProps } from '.';
import BusinessAccount from './components/BusinessAccount';

const Layout: React.FC<ViewProps> = props => {
  const t = STRINGS.MODAL_LIST_BUSINESS_ACCOUNTS;
  return (
    <ModalWrapper
      visible={props.modal.visible}
      setVisible={props.modal.setVisible}
    >
      <H2>{t.title}</H2>

      <FlatList
        contentContainerStyle={styles.listContainer}
        data={props.businessAccounts}
        initialNumToRender={15}
        ListEmptyComponent={
          props.isLoading ? (
            <Loader fullscreen={true} />
          ) : (
            <NoDataError
              subtitle={t.noAccountsErrorSubtitle}
              title={t.noAccountsErrorTitle}
            />
          )
        }
        ListFooterComponent={
          <View style={styles.loaderContainer}>
            {props.isLoading && !props.isRefreshing && <Loader />}
          </View>
        }
        ListHeaderComponent={
          <>
            <ListExtender />
            <Button
              size="small"
              style={styles.addButton}
              type="secondary"
              onPress={() => {
                props.navigation.replace(AppRoutes.StackBusinessAccount, {
                  screen: BusinessAccountRoutes.CU,
                  params: {},
                });
              }}
            >
              {t.createNewAccount}
            </Button>
          </>
        }
        refreshControl={
          <RefreshControl
            refreshing={props.isRefreshing}
            onRefresh={props.onRefresh}
          />
        }
        renderItem={({ item }) => (
          <BusinessAccount
            isActive={item.id === props.selectedAccount?.id}
            item={item}
            onPress={() => props.setSelectedAccount(item)}
            onPressShow={() => {
              props.navigation.replace(AppRoutes.StackBusinessAccount, {
                screen: BusinessAccountRoutes.R,
                params: {
                  accountId: item.id!,
                },
              });
            }}
          />
        )}
        scrollEventThrottle={16}
        onScroll={props.onScroll}
      />
      <Button
        disabled={!props.selectedAccount?.id}
        style={modalSafeZone.style}
        onPress={props.onChangeAccount}
      >
        {t.action}
      </Button>
    </ModalWrapper>
  );
};

const styles = StyleSheet.create({
  addButton: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 4,
  },
  listContainer: {
    gap: 12,
  },
  loaderContainer: {
    minHeight: 28,
    paddingVertical: 12,
  },
});

export default Layout;
