import React from 'react';
import { StyleSheet } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { shadow } from '#styles';
import { useColors } from '#styles/theme/ColorsContext';

import BottomTab, { Tab } from './BottomTab';

export interface IBottomBar {
  focusIndex: number;
  tabs: Tab[];
}

const BottomBar: React.FC<Partial<IBottomBar>> = ({
  focusIndex = 0,
  tabs = [],
}) => {
  const colors = useColors();
  return (
    <SafeAreaView
      edges={['bottom']}
      style={[
        styles.container,
        { backgroundColor: colors.white },
        shadow.style,
      ]}
    >
      {tabs.map((tab, index) => (
        <BottomTab
          key={tab.iconName}
          isFocus={focusIndex === index}
          {...tab}
        />
      ))}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 8,
  },
});

export default BottomBar;
