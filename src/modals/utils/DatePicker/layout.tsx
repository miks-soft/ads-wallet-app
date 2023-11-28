import React from 'react';

import { useSelector } from '#hooks/redux';

import DatePicker from 'react-native-date-picker';

import { STRINGS } from '#localization';

import { ViewProps } from '.';

const Layout: React.FC<ViewProps> = props => {
  const t = STRINGS.UTILS_MODAL_DATE_PICKER;
  const region = useSelector(store => store.app.region);
  return (
    <DatePicker
      cancelText={t.cancelText}
      confirmText={t.confirmText}
      locale={region === 'USA' ? 'en' : 'ru'}
      mode="date"
      title={t.title}
      {...props.route.params}
      modal
      open={true}
      onCancel={props.navigation.goBack}
      onConfirm={date => {
        props.route.params.onConfirm && props.route.params.onConfirm(date);
        props.navigation.goBack();
      }}
    />
  );
};

export default Layout;
