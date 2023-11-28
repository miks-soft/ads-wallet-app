import React, { useState } from 'react';

import { useSelector } from '#hooks/redux';

import { CompositeScreenProps } from '@react-navigation/native';

import {
  DrawerScreenProps,
  DrawerRoutes,
  MainRoutes,
  MainScreenProps,
} from '#navigation/Main/types';
import { AppRoutes, AppScreenProps } from '#navigation/types';

import { useGetStatsBetweenDatesQuery } from '#api/controllers/BusinessAccounts';

import DateFormatter from '#services/formatters/Date';

import { DTOStats } from '#generated/types';

import Layout from './layout';
import { GroupChartDisplayOptions } from './types';

type NavigationProps = CompositeScreenProps<
  MainScreenProps<MainRoutes.Statistics>,
  CompositeScreenProps<
    AppScreenProps<AppRoutes>,
    DrawerScreenProps<DrawerRoutes>
  >
>;
const Container: React.FC<NavigationProps> = props => {
  const currentBusinessAccountId = useSelector(
    store => store.app.currentBusinessAccountId,
  );

  const [filterStartDate, setFilterStartDate] = useState<Date | undefined>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  );

  const [filterEndDate, setFilterEndDate] = useState<Date | undefined>(
    new Date(),
  );

  const [tab, setTabs] = useState(GroupChartDisplayOptions.Day);

  const statsQuery = useGetStatsBetweenDatesQuery(
    {
      params: {
        date_from: filterStartDate
          ? DateFormatter.trimDate(filterStartDate)
          : '',
        date_to: filterEndDate ? DateFormatter.trimDate(filterEndDate) : '',
      },
      path: {
        business_account: currentBusinessAccountId,
      },
    },
    {
      skip: !currentBusinessAccountId,
    },
  );

  return (
    <Layout
      /**
       *Options
       */
      filterEndDate={filterEndDate}
      filterStartDate={filterStartDate}
      isLoading={statsQuery.isFetching}
      stats={statsQuery.data}
      tab={tab}
      /**
       *Methods
       */
      onRefresh={statsQuery.refetch}
      setFilterEndDate={setFilterEndDate}
      setFilterStartDate={setFilterStartDate}
      setTab={setTabs}
      {...props}
    />
  );
};

type PassingStates = {
  tab: GroupChartDisplayOptions;
  filterStartDate?: Date;
  filterEndDate?: Date;
};

type PassingProps = {
  stats?: DTOStats;
  isLoading: boolean;

  onRefresh: () => void;
};

export type ViewProps = NavigationProps &
  PassingStates &
  getSetStateProps<PassingStates> &
  PassingProps;

export default Container;
