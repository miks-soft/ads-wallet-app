import React from 'react';

import { Header } from '#ui-kit';

import { ViewProps } from '.';
import CreateOrganizationContainer from './states/Organization';
import CreatePersonContainer from './states/Person';

const Layout: React.FC<ViewProps> = props => {
  return (
    <>
      <Header
        hideRightIcon={true}
        paddingHorizontal={16}
        title={`Bussiness Account ${
          props.route.params.isEdit ? 'Editing' : 'Creation'
        }`}
        titleSize={props.route.params.isEdit ? 16 : 20}
        onPressLeft={props.navigation.goBack}
      />
      {props.tab === 0 && (
        <CreatePersonContainer
          navigation={props.navigation}
          route={props.route}
          tab={props.tab}
          setTab={props.setTab}
        />
      )}
      {props.tab === 1 && (
        <CreateOrganizationContainer
          navigation={props.navigation}
          route={props.route}
          tab={props.tab}
          setTab={props.setTab}
        />
      )}
    </>
  );
};

export default Layout;
