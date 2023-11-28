import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

import { useSelector } from '#hooks/redux';

import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import { NavigationProp, useNavigation } from '@react-navigation/native';

import FastImage from 'react-native-fast-image';

import { Loader, Text, Icon } from '#ui-kit';
import { IconNames } from '#ui-kit/Icon';
import { H4 } from '#ui-kit/Text';

import { BusinessAccountRoutes } from '#navigation/BusinessAccount/types';
import { ModalsRoutes } from '#navigation/Modals/types';
import { ObserversRoutes } from '#navigation/Observers/types';
import { AppParamList, AppRoutes } from '#navigation/types';

import { STRINGS } from '#localization';

import { useLogoutMutation } from '#api/controllers/Auth';
import { useGetBusinessAccountQuery } from '#api/controllers/BusinessAccounts';
import useAvailableAdvertServices from '#api/hooks/useAvailableAdvertServices';

import Images from '#config/images';

import { SAFE_ZONE_BOTTOM } from '#styles';
import { Colors } from '#styles/theme';
import { useColors } from '#styles/theme/ColorsContext';

import BusinessAccountBalance from './components/Balance';

const Drawer: React.FC<Partial<DrawerContentComponentProps>> = props => {
  const navigation = useNavigation<NavigationProp<AppParamList>>();
  const currentBusinessAccountId = useSelector(
    store => store.app.currentBusinessAccountId,
  );
  const colors = useColors();
  const styles = getStyles(colors);
  const t = STRINGS.DRAWER;

  const { availableServices } = useAvailableAdvertServices(true);

  const { data: currentBusinessAccount } = useGetBusinessAccountQuery(
    {
      path: {
        business_account: currentBusinessAccountId,
      },
    },
    {
      skip: !currentBusinessAccountId,
    },
  );

  const [logout, logoutMeta] = useLogoutMutation();

  const renderLink = (text: text, icon: IconNames, onPress?: () => void) => (
    <TouchableOpacity
      style={styles.link}
      onPress={onPress}
    >
      <Icon
        color={colors.grayscale.__2}
        name={icon}
      />
      <Text style={styles.linkText}>{text}</Text>
    </TouchableOpacity>
  );

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.contentContainer}
      style={styles.container}
    >
      <TouchableOpacity
        style={styles.userInfo}
        onPress={() => {
          navigation.navigate(AppRoutes.StackBusinessAccount, {
            screen: BusinessAccountRoutes.R,
            params: {
              accountId: currentBusinessAccountId,
            },
          });
        }}
      >
        <FastImage
          source={Images.DefaultAvatar}
          style={styles.avatar}
          tintColor={colors.primary.normal}
        />
        <View style={styles.accountInfo}>
          {currentBusinessAccount ? (
            <>
              <Text
                lineHeight={18}
                weight="700"
              >
                {currentBusinessAccount.is_legal
                  ? currentBusinessAccount.legal_name
                  : `${currentBusinessAccount.first_name} ${currentBusinessAccount.last_name}`}
              </Text>
              <H4 style={styles.userName}>{currentBusinessAccount.email}</H4>
            </>
          ) : (
            <Loader fullscreen={true} />
          )}
        </View>
      </TouchableOpacity>

      <BusinessAccountBalance />
      <View style={[styles.separator, {}]} />

      {renderLink(t.businessAccountsLink, 'supervisor-account', () =>
        navigation.navigate(AppRoutes.Modals, {
          screen: ModalsRoutes.ListBusinessAccounts,
        }),
      )}
      <View style={styles.separator} />
      {availableServices?.length > 0 && (
        <>
          {renderLink(t.cashbackAndCommission, 'toll', () =>
            navigation.navigate(AppRoutes.CashbackAndCommission),
          )}
          <View style={styles.separator} />
        </>
      )}

      {renderLink(t.additionalAccountsVK, 'vk', () =>
        navigation.navigate(AppRoutes.StackObservers, {
          screen: ObserversRoutes.VK_LIST,
        }),
      )}
      {renderLink(t.additionalAccountsVKAds, 'vk', () =>
        navigation.navigate(AppRoutes.StackObservers, {
          screen: ObserversRoutes.VK_ADS_LIST,
        }),
      )}
      <View style={styles.footer}>
        {renderLink(t.editAccount, 'pencil', () => {
          navigation.navigate(AppRoutes.StackBusinessAccount, {
            screen: BusinessAccountRoutes.CU,
            params: {
              isEdit: true,
              businessAccount: currentBusinessAccount,
            },
          });
        })}
        <View style={styles.separator} />
        <TouchableOpacity
          style={styles.linkLast}
          onPress={() => {
            logout();
          }}
        >
          {logoutMeta.isLoading ? (
            <Loader />
          ) : (
            <Icon
              color={colors.primary.normal}
              name="exit"
            />
          )}
          <Text
            color={colors.primary.normal}
            style={styles.linkText}
            weight="700"
          >
            {t.logOut}
          </Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
};

const getStyles = (colors: Colors) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 24,
    },
    contentContainer: {
      flexGrow: 1,
    },
    avatar: {
      width: 40,
      aspectRatio: 1,
      marginRight: 12,
      borderRadius: 20,
    },
    accountInfo: {
      flex: 1,
    },
    userName: {
      marginTop: 2,
    },
    userInfo: {
      flexDirection: 'row',
      marginBottom: 20,
      paddingTop: 20,
    },
    separator: {
      borderBottomWidth: 1,
      borderBottomColor: colors.grayscale.__3,
    },
    link: {
      flexDirection: 'row',
      paddingVertical: 12,
    },
    linkLast: {
      flexDirection: 'row',
      paddingVertical: 16,
    },
    linkText: {
      marginLeft: 8,
    },
    footer: {
      marginTop: 'auto',
      paddingBottom: SAFE_ZONE_BOTTOM,
    },
  });

export default Drawer;
