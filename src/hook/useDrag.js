// @flow strict

import {useCallback, useEffect, useState} from 'react';

const throttle = (func, limit) => {
  let inThrottle = false;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
}

function useDrag() {
  const [selected, setSelected] = useState<boolean>(false);
  const [selectedX, setSelectedX] = useState<?number>(null);
  const [selectedY, setSelectedY] = useState<?number>(null);
  const [offsetX, setOffsetX] = useState<?number>(null);
  const [offsetY, setOffsetY] = useState<?number>(null);
  const dragItem = useCallback(
    throttle((e: SyntheticMouseEvent<>): void => {
      if (!selected || offsetX == null || offsetY == null) {
        return;
      }
      const newSelectedX = e.clientX - offsetX;
      const newSelectedY = e.clientY - offsetY;
      if (newSelectedX === selectedX && newSelectedY === selectedY) {
        return;
      }
      setSelectedX(newSelectedX);
      setSelectedY(newSelectedY);
    }, 100),
    [selected, selectedX, selectedY, setSelectedX, setSelectedY, offsetX, offsetY]
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
