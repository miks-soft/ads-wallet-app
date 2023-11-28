import React from 'react';
import { Provider } from 'react-redux';

import { KeyboardProvider } from 'react-native-keyboard-controller';
import { enableFreeze } from 'react-native-screens';

import { PersistGate } from 'redux-persist/integration/react';

import OTPTimerProvider from '#components/providers/OTPTimerProvider';

import { persistor, store } from '#store';

import AppMiddleware from './AppMiddleware';

enableFreeze(true);

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate
        loading={null}
        persistor={persistor}
      >
        <KeyboardProvider>
          <OTPTimerProvider>
            <AppMiddleware />
          </OTPTimerProvider>
        </KeyboardProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
