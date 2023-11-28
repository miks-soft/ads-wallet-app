import React from 'react';

import { Header, Loader } from '#ui-kit';

import { BusinessAccountRoutes } from '#navigation/BusinessAccount/types';

import { ViewProps } from '.';
import ViewOrganization from './states/Organization';
import ViewPerson from './states/Person';

const Layout: React.FC<ViewProps> = props => {
  return (
    <>
      <Header
        hideRightIcon={props.isLoading}
        paddingHorizontal={16}
        rightIconName="pencil"
        title="Бизнес аккаунт"
        onPressLeft={props.navigation.goBack}
        onPressRight={() => {
          props.navigation.navigate(BusinessAccountRoutes.CU, {
            businessAccount: props.businessAccount,
            isEdit: true,
          });
        }}
      />
      {props.isLoading ? (
        <Loader fullscreen={true} />
      ) : props.businessAccount?.is_legal ? (
        <ViewOrganization
          businessAccount={props.businessAccount}
          navigation={props.navigation}
          route={props.route}
          userInfo={props.userInfo}
        />
      ) : (
        <ViewPerson
          businessAccount={props.businessAccount}
          navigation={props.navigation}
          route={props.route}
          userInfo={props.userInfo}
        />
      )}
    </>
  );
};

export default Layout;
