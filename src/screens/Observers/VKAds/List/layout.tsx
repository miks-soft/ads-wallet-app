import React from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';

import { Header, NoDataError } from '#ui-kit';

import { ListExtender } from '#components';

import { ObserversRoutes } from '#navigation/Observers/types';

import { STRINGS } from '#localization';

import { SAFE_ZONE_BOTTOM } from '#styles';
import { Colors } from '#styles/theme';
import { useColors } from '#styles/theme/ColorsContext';

import { ViewProps } from '.';
import Observer from './components/Observer';

const Layout: React.FC<ViewProps> = props => {
  const colors = useColors();
  const styles = getStyles(colors);
  const t = STRINGS.SCREEN_OBSERVERS_LIST_VK_ADS;

  return (
    <View style={styles.container}>
      <Header
        rightIconName="plus"
        subtitle={t.subtitle}
        title={t.headerTitle}
        onPressLeft={props.navigation.goBack}
        onPressRight={() =>
          props.navigation.navigate(ObserversRoutes.VK_ADS_CRUD, {})
        }
      />
      <FlatList
        contentContainerStyle={styles.listContainer}
        data={props.observers}
        ListEmptyComponent={
          !props.isRefreshing ? (
            <NoDataError
              subtitle={t.noAccountsErrorSubtitle}
              title={t.noAccountsErrorTitle}
              onPress={() =>
                props.navigation.navigate(ObserversRoutes.VK_ADS_CRUD, {})
              }
            />
          ) : undefined
        }
        ListFooterComponent={<ListExtender height={SAFE_ZONE_BOTTOM} />}
        ListHeaderComponent={<ListExtender />}
        refreshControl={
          <RefreshControl
            refreshing={props.isRefreshing}
            onRefresh={props.onRefresh}
          />
        }
        renderItem={({ item }) => (
          <Observer
            item={item}
            onEdit={() =>
              props.navigation.navigate(ObserversRoutes.VK_ADS_CRUD, {
                observer: item,
              })
            }
          />
        )}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const getStyles = (colors: Colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.grayscale.__7,
    },
    listContainer: {
      paddingHorizontal: 16,
      gap: 12,
    },
  });

export default Layout;
