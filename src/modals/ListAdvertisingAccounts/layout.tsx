import React from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';

import { Loader } from '#ui-kit';
import { H2, H4, H5 } from '#ui-kit/Text';

import { ListExtender, ModalWrapper } from '#components';

import { STRINGS } from '#localization';

import { useColors } from '#styles/theme/ColorsContext';

import { ViewProps } from '.';

const Layout: React.FC<ViewProps> = props => {
  const colors = useColors();
  const t = STRINGS.MODAL_LIST_ADVERTISING_ACCOUNTS;
  return (
    <ModalWrapper
      contentContainerStyle={styles.container}
      visible={props.modal.visible}
      setVisible={props.modal.setVisible}
    >
      <H2 style={styles.padded}>{t.title}</H2>

      <FlatList
        data={props.accounts}
        ItemSeparatorComponent={() => (
          <View
            style={[styles.divider, { borderColor: colors.grayscale.__55 }]}
          />
        )}
        ListEmptyComponent={
          props.isLoading ? <Loader fullscreen={true} /> : null
        }
        ListFooterComponent={<ListExtender />}
        ListHeaderComponent={<ListExtender />}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.accountContainer}
            onPress={() => {
              props.modal.close();

              props.route.params?.onSelect && props.route.params.onSelect(item);
            }}
          >
            <H4 weight="700">{item.service}</H4>
            <View style={styles.accountDescription}>
              <H4 textAlign="right">{item.account_name}</H4>
              {item.description && (
                <H5
                  color={colors.grayscale.__1}
                  textAlign="right"
                >
                  {item.description?.replaceAll('<br />', '\n')}
                </H5>
              )}
            </View>
          </TouchableOpacity>
        )}
      />
    </ModalWrapper>
  );
};

const styles = StyleSheet.create({
  padded: {
    paddingHorizontal: 16,
  },
  container: {
    paddingHorizontal: 0,
  },
  divider: {
    width: '100%',
    borderTopWidth: 1,
  },
  accountContainer: {
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  accountDescription: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default Layout;
