import { useState } from 'react';

import { animateLayout } from '#utils';

const useField = <T>(param: T): [T, SetState<T>, string, SetState<string>] => {
  const [value, setValue] = useState(param);
  const [error, setError] = useState('');

  const _setValue = (_value: SetStateArg<T>) => {
    setValue(_value);
    error !== '' && animateLayout();

    setError('');
  };

  return [value, _setValue, error, setError];
};

export default useField;
