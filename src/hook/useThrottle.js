// @flow strict

import useToggle from './useToggle';

type ThrottleFunc = () => void;
type ThrottledFunc = (func: any, limit: number) => ThrottleFunc;

const useThrottle = (): ThrottledFunc => {
  const {
    isToggled: inThrottle,
    toggleFalse: unthrottle,
    toggleTrue: throttle,
  } = useToggle(false);
  return (func: any, limit: number): ThrottleFunc => {
    return function(): void {
      if (inThrottle) {
        return;
      }
      func.apply(this, arguments);
      throttle();
      setTimeout(unthrottle, limit);
    };
  };
}

export default useThrottle;
