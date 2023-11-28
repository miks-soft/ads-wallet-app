import React from 'react';

import { isArray } from 'lodash';

import { useColors } from '#styles/theme/ColorsContext';

import Text, { IText } from './Text';

export interface IFieldError {
  children: string;
  shouldRender: boolean;
  style: IText['style'];
}

const FieldError: React.FC<Partial<IFieldError>> = ({
  children = '',
  shouldRender = children,
  style = {},
}) => {
  const colors = useColors();

  return shouldRender ? (
    <Text
      color={colors.error.classic}
      style={style}
    >
      {isArray(children) ? children.join('\n') : children}
    </Text>
  ) : null;
};

export default React.memo(FieldError);
