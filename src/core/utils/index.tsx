import { Alert, LayoutAnimation } from 'react-native';

import { STRINGS } from '#localization';

import Vibration from './vibrations';

export const showUnexpectedError = (error: any) => {
  Alert.alert(STRINGS.OTHER.UnexpectedNetworkError, JSON.stringify(error));
};

export const animateLayout = (onAnimationEnd = () => {}) => {
  LayoutAnimation.configureNext(
    {
      duration: 250,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      delete: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      update: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
    },
    () => {
      onAnimationEnd();
    },
  );
};

export const animateDecorator = <T extends (...args: any) => any>(cb: T) => {
  return (...params: Parameters<T>) => {
    animateLayout();
    //@ts-expect-error
    cb(...params);
  };
};

export const isHaveErrors = (booleanValidationResults: boolean[]) => {
  const haveErrors = booleanValidationResults.some(el => el);

  if (haveErrors) {
    Vibration.impactMedium();
  }

  return haveErrors;
};

export const delay = (time = 100) => {
  const _delay = new Promise(resolve => {
    setTimeout(() => {
      resolve('');
    }, time);
  });

  return _delay;
};
