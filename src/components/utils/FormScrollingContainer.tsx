import React from 'react';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { IS_IOS } from '#styles';

const FormScrollingContainer: React.FC<
  Partial<KeyboardAwareScrollView['props']>
> = ({
  children,
  enableOnAndroid = true,
  extraHeight = 200,
  extraScrollHeight = 120,
  keyboardShouldPersistTaps = 'handled',
  showsVerticalScrollIndicator = false,
  ...props
}) => {
  return (
    <KeyboardAwareScrollView
      {...props}
      enableOnAndroid={enableOnAndroid}
      extraHeight={IS_IOS ? 0 : extraHeight}
      extraScrollHeight={extraScrollHeight}
      keyboardShouldPersistTaps={keyboardShouldPersistTaps}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
    >
      {children}
    </KeyboardAwareScrollView>
  );
};

export default FormScrollingContainer;
