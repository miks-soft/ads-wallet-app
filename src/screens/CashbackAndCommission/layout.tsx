import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';

import { useSelector } from '#hooks/redux';

import { Header, Loader } from '#ui-kit';

import { ListExtender } from '#components';

import { STRINGS } from '#localization';

import { SAFE_ZONE_BOTTOM } from '#styles';

import { ViewProps } from '.';
import CashbackInfoSection from './components/CashbackInfoSection';
import CommisionInfoSection from './components/CommisionInfoSection';
import ServiceShortcut from './components/ServiceShortcut';

const Layout: React.FC<ViewProps> = props => {
  const t = STRINGS.SCREEN_CASHBACK_AND_COMMISSION;
  const region = useSelector(store => store.app.region);

  if (props.isLoading) {
    return (
      <View style={styles.container}>
        <Header
          hideRightIcon={true}
          title={t.title}
          onPressLeft={props.navigation.goBack}
        />
        <Loader fullscreen={true} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        hideRightIcon={true}
        paddingHorizontal={16}
        title={t.title}
        onPressLeft={props.navigation.goBack}
      />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.services}>
          {!!props.availableServices.length &&
            props.availableServices.map(el => (
              <View
                key={el}
                style={styles.service}
              >
                <ServiceShortcut
                  isActive={props.selectedService === el}
                  service={el}
                  onPress={() => props.setSelectedService(el)}
                />
              </View>
            ))}
        </View>

        <View style={styles.main}>
          {region !== 'USA' &&
            !!props.businessAccount?.cashback_conditions?.advertising[
              props.selectedService
            ] && (
              <CashbackInfoSection
                amount="100.00"
                ranges={
                  props.businessAccount?.cashback_conditions?.advertising[
                    props.selectedService
                  ]
                }
                subtitle={t.cashbackAdvertisingSubtitle}
                title={t.cashbackAdvertisingTitle}
              />
            )}

          {region !== 'USA' &&
            !!props.businessAccount?.cashback_conditions?.deposit && (
              <CashbackInfoSection
                amount="100.00"
                ranges={props.businessAccount?.cashback_conditions?.deposit}
                subtitle={t.cashbackDepositSubtitle}
                title={t.cashbackDepositTitle}
              />
            )}

          {region !== 'USA' &&
            !!props.businessAccount?.cashback_conditions?.commission[
              props.selectedService
            ] && (
              <CashbackInfoSection
                amount="100.00"
                ranges={
                  props.businessAccount?.cashback_conditions?.commission[
                    props.selectedService
                  ]
                }
                subtitle={t.cashbackCommissionSubtitle}
                title={t.cashbackCommissionTitle}
              />
            )}

          {/*@ts-expect-error FIX DOCS */}
          {!!props.businessAccount?.commissions_conditions[
            props.selectedService
          ] && (
            <CommisionInfoSection
              amount="100"
              ranges={
                /*@ts-expect-error FIX DOCS */
                props.businessAccount?.commissions_conditions[
                  props.selectedService
                ]
              }
              title={t.commissionTitle}
            />
          )}
        </View>

        <ListExtender height={SAFE_ZONE_BOTTOM} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: 16,
  },
  services: {
    flexDirection: 'row',
    paddingTop: 12,
    gap: 8,
  },
  service: {
    flex: 1,
    maxWidth: '33%',
  },
  main: {
    marginTop: 12,
    gap: 16,
  },
});

export default Layout;
