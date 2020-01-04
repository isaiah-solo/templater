// @flow strict

import {useState} from 'react';

type ThrottleFunc = () => void;
type ThrottledFunc = (func: any, limit: number) => ThrottleFunc;

const useThrottle = (): ThrottledFunc => {
  const [inThrottle, setInThrottle] = useState(false);
  return (func: any, limit: number): ThrottleFunc => {
    return function(): void {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        setInThrottle(true);
        setTimeout((): void => {
          setInThrottle(false);
        }, limit);
      }
    };
  }
}

export default useThrottle;
