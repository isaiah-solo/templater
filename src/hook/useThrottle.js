// @flow strict

import useToggle from './useToggle';

type ThrottleFunc = () => void;
type ThrottledFunc = (func: any, limit: number) => ThrottleFunc;

const useThrottle = (): ThrottledFunc => {
  const {
    isToggled: inThrottle,
    toggleFalse: throttle,
    toggleTrue: unthrottle
  } = useToggle(false);
  return (func: any, limit: number): ThrottleFunc => {
    return function(): void {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        throttle();
        setTimeout(unthrottle, limit);
      }
    };
  };
}

export default useThrottle;
