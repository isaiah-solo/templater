// @flow strict

import {useCallback, useEffect, useState} from 'react';

import useThrottle from './useThrottle';
import useToggle from './useToggle';

type DragReturn = $ReadOnly<{|
  isSelected: boolean,
  select: (e: SyntheticMouseEvent<>) => void,
  selectedX: ?number,
  selectedY: ?number,
|}>;

const useDrag = (): DragReturn => {
  const {
    isToggled: isSelected,
    toggleFalse: endDrag,
    toggleTrue: startDrag,
  } = useToggle(false);
  const [selectedX, setSelectedX] = useState<?number>(null);
  const [selectedY, setSelectedY] = useState<?number>(null);
  const [offsetX, setOffsetX] = useState<?number>(null);
  const [offsetY, setOffsetY] = useState<?number>(null);
  const throttle = useThrottle();
  const dragItem = useCallback(
    throttle(
      ({clientX, clientY}: SyntheticMouseEvent<>): void => {
        if (!isSelected || offsetX == null || offsetY == null) {
          return;
        }
        setSelectedX(clientX - offsetX);
        setSelectedY(clientY - offsetY);
      },
      100,
    ),
    [
      isSelected,
      offsetX,
      offsetY,
      selectedX,
      selectedY,
      setSelectedX,
      setSelectedY
    ],
  );
  const dropItem = useCallback(
    (_: SyntheticMouseEvent<>): void => {
      endDrag();
      setOffsetX(null);
      setOffsetY(null);
      setSelectedX(null);
      setSelectedY(null);
      window.removeEventListener('mousemove', dragItem, true);
      window.removeEventListener('mouseup', dropItem, true);
    },
    [
      dragItem,
      endDrag,
      setOffsetX,
      setOffsetY,
      setSelectedX,
      setSelectedY,
    ],
  );
  const select = useCallback(
    ({clientX, clientY, target}: SyntheticMouseEvent<>): void => {
      const {offsetLeft, offsetTop}: HTMLDivElement = (target: any);
      const newOffsetX = clientX - offsetLeft;
      const newOffsetY = clientY - offsetTop;
      setOffsetX(newOffsetX);
      setOffsetY(newOffsetY);
      setSelectedX(clientX - newOffsetX);
      setSelectedY(clientY - newOffsetY);
      startDrag();
    },
    [
      setOffsetX,
      setOffsetY,
      setSelectedX,
      setSelectedY,
      startDrag,
    ],
  );
  useEffect(
    (): void => {
      if (isSelected) {
        window.addEventListener('mouseup', dropItem, true);
        window.addEventListener('mousemove', dragItem, true);
      }
    },
    [dragItem, dropItem, isSelected],
  );
  return {isSelected, select, selectedX, selectedY};
}

export default useDrag;
