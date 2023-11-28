import { StackNavigationProp } from '@react-navigation/stack';

import { IButton } from '#ui-kit/Button';

import { AppParamList } from '#navigation/types';

import { ModalController } from '#hooks/useModal';

export type UIActionModalButton = Partial<
  Omit<IButton, 'onPress'> & { bypassGoBackOnClose: boolean } & {
    onPress: (
      navigation: StackNavigationProp<AppParamList>,
      modal: ModalController,
    ) => void;
  }
>;
