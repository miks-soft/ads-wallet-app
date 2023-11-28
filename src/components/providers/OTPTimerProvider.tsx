import React, {
  ReactNode,
  RefObject,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

import BackgroundTimer from 'react-native-background-timer';

import moment from 'moment';

type TimerRef = {
  start: (duration?: number) => void;
  stop: () => void;
};

type TimerContext = {
  value: string;
  valueRaw: number;
  ref: RefObject<TimerRef>;
};

export const OTPTimer = React.createContext<TimerContext>(
  null as unknown as TimerContext,
);

const OTP_TIMER_DURATION = 6;

const OTPTimerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const ref = useRef<TimerRef>(null);
  const [timer, setTimer] = useState(0);

  const startTimer = (duration = OTP_TIMER_DURATION) => {
    BackgroundTimer.stopBackgroundTimer();

    setTimer(duration);

    setImmediate(() =>
      BackgroundTimer.runBackgroundTimer(() => {
        setTimer(old => old - 1);
      }, 1000),
    );
  };

  const stopTimer = () => {
    setTimer(0);
    BackgroundTimer.stopBackgroundTimer();
  };

  useImperativeHandle(ref, () => ({
    start: startTimer,
    stop: stopTimer,
  }));

  useEffect(() => {
    if (timer < 1) {
      stopTimer();
    }
  }, [timer]);

  return (
    <OTPTimer.Provider
      value={{
        valueRaw: timer,
        value: `${moment.utc(timer * 1000).format('mm:ss')}`,
        ref: ref,
      }}
    >
      {children}
    </OTPTimer.Provider>
  );
};

const useTimer = () => useContext(OTPTimer);

export { useTimer };
export default OTPTimerProvider;
