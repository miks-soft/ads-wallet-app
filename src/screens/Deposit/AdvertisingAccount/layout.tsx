/* eslint-disable max-lines */
import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';

import { useSelector } from '#hooks/redux';

import FastImage from 'react-native-fast-image';

import { Button, Checkbox, FieldError, Header, TextInput } from '#ui-kit';
import SelectableCard from '#ui-kit/SelectableCard';
import Text, { H3, H4, H5 } from '#ui-kit/Text';

import { ListExtender } from '#components';
import AvoidKeyboard from '#components/utils/AvoidKeyboard';
import KeyboardAwareFlatList from '#components/utils/KeyboardAwareFlatList';

import { ModalsRoutes } from '#navigation/Modals/types';
import { AppRoutes } from '#navigation/types';

import { STRINGS } from '#localization';

import NumberFormatter from '#services/formatters/Number';

import { APP_CURRENCY_MAP } from '#config';
import {
  CurrencyMap,
  MapImplementedAdvertisingServicesLogo,
} from '#config/enums';

import { SAFE_ZONE_BOTTOM, shadow } from '#styles';
import { Colors } from '#styles/theme';
import { useColors } from '#styles/theme/ColorsContext';

import { DTOAdvertAccountCampaign } from '#generated/types';

import { ViewProps } from '.';
import DepositAdvertisingAccountCampaign from './components/DepositAdvertisingAccountCampaign';
import {
  DepositAdvertisingAccountSources,
  UIAdvertisingCampaignDeposit,
} from './types';

const Layout: React.FC<ViewProps> = props => {
  const colors = useColors();
  const styles = getStyles(colors);
  const t = STRINGS.SCREEN_DEPOSIT_ADVERTISING_ACCOUNT;
  const region = useSelector(store => store.app.region);

  const setCampaignAmount = (index = 1, item: UIAdvertisingCampaignDeposit) =>
    props.setCampaignAmounts!(old => {
      const newOld = [...old!];

      newOld[index] = item;

      return newOld;
    });

  const renderCampaign = ({
    item,
    index,
  }: {
    item: DTOAdvertAccountCampaign;
    index: number;
  }) => {
    const campaignAmountIndex = props.campaignAmounts?.findIndex(
      el => el.campaign_id === item.id,
    );

    const campaignAmount = props.campaignAmounts?.[campaignAmountIndex!];

    return (
      <View
        style={[
          styles.campaignWrapper,
          index === props.campaigns?.length! - 1
            ? styles.lastCampaignWrapper
            : {},
        ]}
      >
        <DepositAdvertisingAccountCampaign
          amount={campaignAmount?.amount}
          error={campaignAmount?.error}
          item={item}
          selected={
            props.isAllCampaignsForceSelected || campaignAmount?.selected
          }
          onChangeAmount={amount =>
            setCampaignAmount(index, {
              campaign_id: item.id,
              ...campaignAmount,
              amount,
              selected: true,
            })
          }
          onSelect={old =>
            setCampaignAmount(index, {
              campaign_id: item.id,
              amount: '5000',
              ...campaignAmount,
              selected: !old,
            })
          }
        />
        {index !== props.campaigns?.length! - 1 ? (
          <View style={styles.divider} />
        ) : null}
      </View>
    );
  };

  return (
    <>
      <Header
        hideRightIcon={true}
        paddingHorizontal={16}
        title={t.title}
        titleSize={16}
        onPressLeft={props.navigation.goBack}
      />
      <KeyboardAwareFlatList
        data={props.campaigns}
        ListFooterComponent={
          <View style={styles.summary}>
            <ListExtender />
            <View style={styles.summaryLine}>
              <H4 color={colors.grayscale.__1}>{t.summaryTitle}</H4>
              <Text weight="700">
                {NumberFormatter.format(props.calculations.finalAmount)}{' '}
                {CurrencyMap[APP_CURRENCY_MAP[region]]}
              </Text>
            </View>

            {!!props.calculations.withNds && (
              <View style={styles.summaryLine}>
                <H4 color={colors.grayscale.__1}>{t.VAT}</H4>
                <Text weight="700">
                  {NumberFormatter.format(props.calculations.totalNds)}{' '}
                  {CurrencyMap[APP_CURRENCY_MAP[region]]}
                </Text>
              </View>
            )}

            {!!props.calculations.withCommision && (
              <View style={styles.summaryLine}>
                <H4 color={colors.grayscale.__1}>{t.commision}</H4>
                <Text weight="700">
                  {props.calculations.currentCommission} %
                </Text>
              </View>
            )}

            <View style={styles.divider} />

            <View style={styles.summaryLine}>
              <H4 color={colors.grayscale.__1}>{t.totalSum}</H4>
              <Text weight="700">
                {NumberFormatter.format(props.calculations.totalSum)}{' '}
                {CurrencyMap[APP_CURRENCY_MAP[region]]}
              </Text>
            </View>

            <ListExtender />
          </View>
        }
        ListHeaderComponent={
          <>
            <ListExtender />
            <H3 style={styles.title}>{t.depositFrom}</H3>

            <SelectableCard
              containerStyle={styles.card}
              isActive={
                props.selectedPaymentSource ===
                DepositAdvertisingAccountSources.WALLET
              }
              isSubtitleFirst={true}
              subtitle={t.value}
              title={`${NumberFormatter.format(
                props.currentBusinessAccount?.balance! || '0',
              )}  ${CurrencyMap[APP_CURRENCY_MAP[region]]}`}
              onPress={() =>
                props.setSelectedPaymentSource(
                  DepositAdvertisingAccountSources.WALLET,
                )
              }
            />

            <SelectableCard
              containerStyle={styles.card}
              isActive={
                props.selectedPaymentSource ===
                DepositAdvertisingAccountSources.CASHBACK
              }
              isSubtitleFirst={true}
              subtitle={t.cashbackValue}
              title={`${NumberFormatter.format(
                props.currentBusinessAccount?.cashback_balance! || '0',
              )} ${CurrencyMap[APP_CURRENCY_MAP[region]]}`}
              onPress={() =>
                props.setSelectedPaymentSource(
                  DepositAdvertisingAccountSources.CASHBACK,
                )
              }
            />

            <H3 style={styles.title}>{t.depositTo}</H3>

            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate(AppRoutes.Modals, {
                  screen: ModalsRoutes.ListAdvertisingAccounts,
                  params: {
                    onSelect: props.setSelectedAccount,
                  },
                });
              }}
            >
              <TextInput
                blurOnSubmit={true}
                containerStyle={styles.input}
                IconRight={
                  props.selectedAccount?.service && (
                    <View>
                      <FastImage
                        source={
                          MapImplementedAdvertisingServicesLogo[
                            props.selectedAccount?.service
                          ]
                        }
                        style={styles.logo}
                      />
                    </View>
                  )
                }
                label={
                  props.selectedAccount?.account_name || t.accountInputLabel
                }
                pointerEvents="none"
                value={
                  props.selectedAccount?.description?.replaceAll(
                    '<br />',
                    '\n',
                  ) || ''
                }
              />
            </TouchableOpacity>

            <TextInput
              blurOnSubmit={true}
              containerStyle={styles.input}
              IconRight={<H3>{CurrencyMap[APP_CURRENCY_MAP[region]]}</H3>}
              label={t.depositInputLabel}
              outlineType={props.errorAmount ? 'error' : undefined}
              value={props.amount}
              onChange={props.setAmount}
            />

            <FieldError style={styles.error}>{props.errorAmount}</FieldError>

            {!!props.campaigns?.length && (
              <H4 style={styles.title}>{t.depositSubAccountsTitle}</H4>
            )}

            {!!props.campaigns?.length && <ListExtender />}

            {!!props.campaigns?.length && (
              <TouchableOpacity
                style={styles.checkAllContainer}
                onPress={() =>
                  props.setIsAllCampaignsForceSelected(old => !old)
                }
              >
                <Checkbox
                  containerStyle={styles.checkbox}
                  value={props.isAllCampaignsForceSelected}
                />
                <Text>{t.selectAll}</Text>
              </TouchableOpacity>
            )}
          </>
        }
        numColumns={1}
        renderItem={renderCampaign}
        style={styles.container}
      />

      <AvoidKeyboard
        offset={20}
        style={[styles.footer, shadow.style]}
      >
        <View style={styles.footerRow}>
          <H4 color={colors.grayscale.__1}>{t.footer.totalSum}</H4>
          <Text weight="700">
            {props.ratesInfo?.shouldExchangeCurrency
              ? `${NumberFormatter.formatFloat(
                  props.calculations.totalSum *
                    (props.ratesInfo.exchangeRate?.value || 1),
                )} ${
                  CurrencyMap[props.ratesInfo.exchangeRate?.to as CurrencyMap]
                }`
              : `${NumberFormatter.format(props.calculations.totalSum)}`}{' '}
            {CurrencyMap[APP_CURRENCY_MAP[region]]}
          </Text>

          {props.ratesInfo?.shouldExchangeCurrency && (
            <H5
              color={colors.grayscale.__1}
              textAlign="left"
            >
              1{' '}
              {
                CurrencyMap[
                  props.ratesInfo.shownExchangeRate?.from as CurrencyMap
                ]
              }{' '}
              ={' '}
              {NumberFormatter.formatFloat(
                props.ratesInfo.shownExchangeRate?.value || '0',
              )}{' '}
              {
                CurrencyMap[
                  props.ratesInfo.shownExchangeRate?.to as CurrencyMap
                ]
              }
            </H5>
          )}
        </View>
        <View style={styles.footerRow}>
          <Button
            disabled={!props.selectedAccount || !props.calculations.totalSum}
            fullwidth={true}
            isLoading={props.isSubmitting}
            onPress={props.onSubmit}
          >
            {t.footer.actionButton}
          </Button>
        </View>
      </AvoidKeyboard>
    </>
  );
};

const getStyles = (colors: Colors) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 16,
    },
    title: {
      marginTop: 12,
      marginBottom: 8,
    },
    card: {
      marginTop: 8,
      marginBottom: 4,
    },
    input: {
      marginTop: 8,
      marginBottom: 4,
    },
    error: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
    },
    summary: {
      marginVertical: 0,
    },
    divider: {
      height: 1,
      width: '100%',
      marginVertical: 8,
      backgroundColor: colors.grayscale.__5,
    },
    campaignWrapper: {
      paddingHorizontal: 16,
      borderColor: colors.grayscale.__55,
      backgroundColor: colors.white,
      borderLeftWidth: 1,
      borderRightWidth: 1,
    },
    lastCampaignWrapper: {
      borderBottomWidth: 1,
      borderBottomLeftRadius: 8,
      borderBottomRightRadius: 8,
    },
    summaryLine: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    footer: {
      flexDirection: 'row',
      paddingTop: 16,
      paddingBottom: SAFE_ZONE_BOTTOM,
      paddingHorizontal: 16,
      backgroundColor: colors.white,
    },
    footerRow: {
      width: '50%',
      justifyContent: 'center',
    },
    checkAllContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 16,
      paddingHorizontal: 16,
      borderWidth: 1,
      borderColor: colors.grayscale.__55,
      backgroundColor: colors.white,
      borderBottomWidth: 1,
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
    },
    checkbox: {
      marginRight: 8,
    },
    logo: {
      width: 40,
      aspectRatio: 1,
    },
  });

export default Layout;
