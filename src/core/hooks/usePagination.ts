import { useEffect, useState } from 'react';

const usePagination = ({
  page = 0,
  setPage = () => {},
  queryPage = 0,
  lastPage = 1,
  query,
}: {
  page: number;
  setPage: SetState<number>;
  queryPage?: number;
  lastPage?: number;
  query: { isLoading: boolean; isFetching: boolean; refetch: () => void };
}) => {
  const [refreshing, setRefreshing] = useState(query.isLoading);
  const [loading, setLoading] = useState(query.isLoading || query.isFetching);

  const fetchMore = async () => {
    if ((lastPage && page >= lastPage) || loading) {
      return;
    }

    setPage(old => old + 1);
  };

  const refresh = async () => {
    page !== 1 ? setPage(1) : query.refetch();
  };

  useEffect(() => {
    setPage(queryPage || 1);
  }, [queryPage]);

  useEffect(() => {
    setRefreshing(query.isLoading);
  }, [query.isLoading]);

  useEffect(() => {
    setLoading(query.isFetching);
  }, [query.isFetching]);

  const resetPaginationDecorator = <T>(set: SetState<T>) => {
    return (value: SetStateArg<T>) => {
      //@ts-expect-error callbacks will fall, refactor if need
      set(old => {
        if (old !== value) {
          setPage(1);
        }
        return value;
      });
    };
  };

  return {
    refreshing,
    refresh,
    loading,
    fetchMore,
    resetDecorator: resetPaginationDecorator,
  };
};

export default usePagination;
