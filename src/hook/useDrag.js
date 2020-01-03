// @flow strict

import { useCallback, useEffect, useState } from 'react';

function useDrag() {
  const [selected, setSelected] = useState<boolean>(false);
  const [selectedX, setSelectedX] = useState<?number>(null);
  const [selectedY, setSelectedY] = useState<?number>(null);
  const [offsetX, setOffsetX] = useState<?number>(null);
  const [offsetY, setOffsetY] = useState<?number>(null);
  const dragItem = useCallback(
    (e: SyntheticMouseEvent<>): void => {
      const selectedX = e.clientX - (offsetX != null ? offsetX : 0);
      const selectedY = e.clientY - (offsetY != null ? offsetY : 0);
      setSelectedX(selectedX);
      setSelectedY(selectedY);
    },
    [offsetX, offsetY, setSelectedX, setSelectedY],
  );
  const dropItem = useCallback(
    (e: SyntheticMouseEvent<>): void => {
      setOffsetX(null);
      setOffsetY(null);
      setSelected(false);
      setSelectedX(null);
      setSelectedY(null);
    },
    [setOffsetX, setOffsetY, setSelected, setSelectedX, setSelectedY],
  );
  const select = useCallback(
    (e: SyntheticMouseEvent<>): void => {
      const offsetX = e.nativeEvent.offsetX;
      const offsetY = e.nativeEvent.offsetY;
      setOffsetX(offsetX);
      setOffsetY(offsetY);
      setSelected(true);
      setSelectedX(e.clientX - offsetX);
      setSelectedY(e.clientY - offsetY);
    },
    [setOffsetX, setOffsetY, setSelected, setSelectedX, setSelectedY],
  );
  useEffect(
    (): void => {
      if (selected) {
        window.addEventListener('mouseup', dropItem);
        window.addEventListener('mousemove', dragItem);
      } else {
        window.removeEventListener('mouseup', dropItem);
        window.removeEventListener('mousemove', dragItem);
      }
    },
    [dragItem, dropItem, selected],
  );
  return {select, selected, selectedX, selectedY};
}

export default useDrag;
