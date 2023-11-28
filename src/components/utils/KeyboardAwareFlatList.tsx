import React from 'react';

import { KeyboardAwareFlatList as _KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';

import { IS_IOS } from '#styles';

const KeyboardAwareFlatList: React.FC<_KeyboardAwareFlatList['props']> = ({
  children,
  enableOnAndroid = true,
  extraHeight = 200,
  extraScrollHeight = 120,
  keyboardShouldPersistTaps = 'handled',
  showsVerticalScrollIndicator = false,
  ...props
}) => {
  return (
    <_KeyboardAwareFlatList
      {...props}
      enableOnAndroid={enableOnAndroid}
      extraHeight={IS_IOS ? 0 : extraHeight}
      extraScrollHeight={extraScrollHeight}
      keyboardShouldPersistTaps={keyboardShouldPersistTaps}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
    >
      {children}
    </_KeyboardAwareFlatList>
  );
};

export default KeyboardAwareFlatList;
