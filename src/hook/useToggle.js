// @flow strict

import {useCallback, useState} from 'react';

type ToggleReturn = $ReadOnly<{|
  isToggled: boolean,
  toggleFalse: () => void,
  toggleTrue: () => void,
|}>;

const useToggle = (initial: boolean): ToggleReturn => {
  const [isToggled, setIsToggled] = useState(initial);
  const toggleFalse = useCallback(
    (): void => {
      setIsToggled(false);
    },
    [],
  );
  const toggleTrue = useCallback(
    (): void => {
      setIsToggled(true);
    },
    [],
  );
  return {
    isToggled,
    toggleFalse,
    toggleTrue,
  };
}

export default useToggle;
