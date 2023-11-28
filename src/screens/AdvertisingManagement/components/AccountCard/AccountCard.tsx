import React, { useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';

import { NavigationProp, useNavigation } from '@react-navigation/native';

import { Text, Icon, Button } from '#ui-kit';
import { H4 } from '#ui-kit/Text';

import { DepositRoutes } from '#navigation/Deposit/types';
import { AppParamList, AppRoutes } from '#navigation/types';

import { ENUMS, STRINGS } from '#localization';

import { useCheckAccountMutation } from '#api/controllers/AdvertServices';

import NumberFormatter from '#services/formatters/Number';
import ToastService from '#services/ToastService';

import {
  MapAdvertisingAccountStatusesColor,
  AdvertisingAccountStatuses,
  ImplementedAdvertisingServices,
  CurrencyMap,
} from '#config/enums';

import { shadow, hitSlop } from '#styles';
import { useColors } from '#styles/theme/ColorsContext';

import { DTOAdvertAccount } from '#generated/types';

const AccountCard: React.FC<{
  containerStyle?: StyleProp<ViewStyle>;
  account: DTOAdvertAccount;
  onPressActions?: () => void;
  withActions?: boolean;
}> = ({ containerStyle, account, withActions, onPressActions }) => {
  const colors = useColors();
  const navigation = useNavigation<NavigationProp<AppParamList>>();
  const t = STRINGS.COMPONENT_ADVERTISING_ACCOUNT;

  const [checkAccount, checkAccountMeta] = useCheckAccountMutation({});

  useEffect(() => {
    if (checkAccountMeta.data?.error) {
      ToastService.error(checkAccountMeta.data?.error);
    }
  }, [checkAccountMeta.data]);

  return (
    <View
      style={[
        styles.wrapper,
        { backgroundColor: colors.white },
        shadow.style,
        containerStyle,
      ]}
    >
      {withActions && (
        <TouchableOpacity
          hitSlop={hitSlop}
          style={styles.actions}
          onPress={onPressActions}
        >
          <Icon name="more-vert" />
        </TouchableOpacity>
      )}
      <View style={styles.row}>
        <View style={styles.column}>
          <H4>{t.name}</H4>
          <H4
            selectable={true}
            weight="500"
          >
            {account?.service === ImplementedAdvertisingServices.VK
              ? account!.account_name.split('/')[3]
              : account?.account_name}
          </H4>
        </View>

        <View style={styles.column}>
          <H4>{t.status}</H4>
          <H4 color={MapAdvertisingAccountStatusesColor[account?.status!]}>
            {ENUMS.AdvertisingAccountStatuses[account?.status!]}
          </H4>
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.column}>
          <H4>{t.balance} </H4>
          <Text weight="500">
            {NumberFormatter.formatByCurrency(
              account?.balance,
              account.service_currency,
            )}{' '}
            {CurrencyMap[account.service_currency]}
          </Text>
        </View>

        <View style={styles.column}>
          <H4>{t.spent} </H4>
          <Text weight="500">
            {NumberFormatter.formatByCurrency(
              account?.spent,
              account.service_currency,
            )}{' '}
            {CurrencyMap[account.service_currency]}
          </Text>
        </View>
      </View>

      {account?.description && (
        <>
          <H4>{t.description} </H4>
          <H4 selectable={true}>
            {account?.description?.replaceAll('<br />', '\n')}
          </H4>
        </>
      )}

      {!!account?.campaings && (
        <TouchableOpacity
          style={styles.campaignsLink}
          onPress={() => {
            navigation.navigate(AppRoutes.AdvertisingAccountCampaigns, {
              advertisingAccountId: account.id,
              accountName: account.account_name,
              service: account.service,
            });
          }}
        >
          <Text color={colors.primary.normal}>
            {t.showCampaigns} {account?.campaings}
          </Text>
        </TouchableOpacity>
      )}

      {account?.status !== AdvertisingAccountStatuses.DELETED &&
        account?.status !== AdvertisingAccountStatuses.CREATED &&
        (account?.status === AdvertisingAccountStatuses.DECLINED ||
        account?.status === AdvertisingAccountStatuses.PENDING ? (
          <Button
            isLoading={checkAccountMeta.isLoading}
            size="small"
            style={styles.deposit}
            type="secondary"
            onPress={() =>
              checkAccount({
                data: {
                  service: account.service,
                  business_account_id: account.business_account_id,
                  account_id: account.id,
                },
              })
            }
          >
            {t.actionCheck}
          </Button>
        ) : (
          <Button
            size="small"
            style={styles.deposit}
            onPress={() => {
              navigation.navigate(AppRoutes.StackDeposit, {
                screen: DepositRoutes.AdvertisingAccount,
                params: {
                  defaultAccount: account!,
                },
              });
            }}
          >
            {t.actionDeposit}
          </Button>
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    padding: 16,
    borderRadius: 8,
  },
  campaignsLink: {
    marginTop: 8,
  },
  deposit: {
    marginTop: 12,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  column: {
    width: '50%',
  },
  actions: {
    position: 'absolute',
    zIndex: 3,
    top: 16,
    right: 8,
  },
});

export default React.memo(AccountCard);
