import AsyncStorage from '@react-native-async-storage/async-storage';
import { configureStore } from '@reduxjs/toolkit';

import createDebugger from 'redux-flipper';
import { createLogger } from 'redux-logger';
import { persistStore, persistReducer } from 'redux-persist';

import { Query } from '#api';

import reducers from './slices';

const persistConfig = {
  key: 'redux-persisted',
  storage: AsyncStorage,
};

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    })
      .concat(Query.middleware)
      .concat(
        createLogger({
          collapsed: true,
          predicate: () => process.env.NODE_ENV === 'development',
        }),
      )
      .concat(createDebugger()),
});

export const persistor = persistStore(store);

// uncomment to clear store

// persistor.purge();
// import * as Keychain from 'react-native-keychain';
// Keychain.resetGenericPassword();

// store.dispatch(Query.util.resetApiState());

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
