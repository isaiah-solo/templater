// @flow strict

import {useCallback, useEffect, useState} from 'react';
import useThrottle from './useThrottle';

type DragReturn = $ReadOnly<{|
  select: (e: SyntheticMouseEvent<>) => void,
  selected: boolean,
  selectedX: ?number,
  selectedY: ?number,
|}>;

const useDrag = (): DragReturn => {
  const [selected, setSelected] = useState<boolean>(false);
  const [selectedX, setSelectedX] = useState<?number>(null);
  const [selectedY, setSelectedY] = useState<?number>(null);
  const [offsetX, setOffsetX] = useState<?number>(null);
  const [offsetY, setOffsetY] = useState<?number>(null);
  const throttle = useThrottle();
  const dragItem = useCallback(
    throttle((e: SyntheticMouseEvent<>): void => {
      if (!selected || offsetX == null || offsetY == null) {
        return;
      }
      setSelectedX(e.clientX - offsetX);
      setSelectedY(e.clientY - offsetY);
    }, 100),
    [offsetX, offsetY, selected, selectedX, selectedY, setSelectedX, setSelectedY]
  );
  const dropItem = useCallback(
    (_: SyntheticMouseEvent<>): void => {
      setOffsetX(null);
      setOffsetY(null);
      setSelected(false);
      setSelectedX(null);
      setSelectedY(null);
      window.removeEventListener('mousemove', dragItem, true);
      window.removeEventListener('mouseup', dropItem, true);
    },
    [dragItem, setOffsetX, setOffsetY, setSelected, setSelectedX, setSelectedY],
  );
  const select = useCallback(
    (e: SyntheticMouseEvent<>): void => {
      const target: HTMLDivElement = (e.target: any);
      const newOffsetX = e.clientX - target.offsetTop;
      const newOffsetY = e.clientY - target.offsetLeft;
      setOffsetX(newOffsetX);
      setOffsetY(newOffsetY);
      setSelected(true);
      setSelectedX(e.clientX - newOffsetX);
      setSelectedY(e.clientY - newOffsetY);
    },
    [setOffsetX, setOffsetY, setSelected, setSelectedX, setSelectedY],
  );
  useEffect(
    (): void => {
      if (selected) {
        window.addEventListener('mouseup', dropItem, true);
        window.addEventListener('mousemove', dragItem, true);
      }
    },
    [dragItem, dropItem, selected],
  );
  return {select, selected, selectedX, selectedY};
}

export default useDrag;
