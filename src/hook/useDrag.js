// @flow strict

import {useCallback, useEffect, useState} from 'react';

import useThrottle from './useThrottle';
import useToggle from './useToggle';

type DragReturn = $ReadOnly<{|
  dragging: boolean,
  mouseX: ?number,
  mouseY: ?number,
  select: (e: SyntheticMouseEvent<>) => void,
|}>;

const useDrag = (): DragReturn => {
  const {
    isToggled: dragging,
    toggleFalse: endDrag,
    toggleTrue: startDrag,
  } = useToggle(false);
  const [mouseX, setMouseX] = useState<?number>(null);
  const [mouseY, setMouseY] = useState<?number>(null);
  const throttle = useThrottle();
  const dragItem = useCallback(
    throttle(
      ({clientX, clientY}: SyntheticMouseEvent<>): void => {
        if (!dragging) {
          return;
        }
        setMouseX(clientX);
        setMouseY(clientY);
      },
      100,
    ),
    [
      dragging,
      setMouseX,
      setMouseY,
    ],
  );
  const dropItem = useCallback(
    (_: SyntheticMouseEvent<>): void => {
      endDrag();
      setMouseX(null);
      setMouseY(null);
      window.removeEventListener('mousemove', dragItem, true);
      window.removeEventListener('mouseup', dropItem, true);
    },
    [
      dragItem,
      endDrag,
      setMouseX,
      setMouseY,
    ],
  );
  const select = useCallback(
    ({clientX, clientY}: SyntheticMouseEvent<>): void => {
      setMouseX(clientX);
      setMouseY(clientY);
      startDrag();
    },
    [
      setMouseX,
      setMouseY,
      startDrag,
    ],
  );
  useEffect(
    (): void => {
      if (dragging) {
        window.addEventListener('mouseup', dropItem, true);
        window.addEventListener('mousemove', dragItem, true);
      }
    },
    [dragItem, dropItem, dragging],
  );
  return {dragging, mouseX, mouseY, select};
}

export default useDrag;
