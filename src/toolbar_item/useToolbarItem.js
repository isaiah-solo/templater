// @flow strict

import type {Item} from '../reducer/workspaceItemReducer';

import {useCallback, useEffect, useMemo} from 'react';
import {useDispatch} from "react-redux";

import useDrag from '../hook/useDrag';

type PositionStyle = $ReadOnly<{|
  left: number,
  top: number,
|}>;
type DragReturn = $ReadOnly<{|
  dragging: boolean,
  positionStyle: ?PositionStyle,
  select: (e: SyntheticMouseEvent<>) => void,
|}>;

const COPY_HEIGHT = 20;

const useToolbarItem = (item: Item): DragReturn => {
  const dispatch = useDispatch();
  const {
    dragging,
    mouseX,
    mouseY,
    select,
  } = useDrag();
  const dropItem = useCallback(
    (e: SyntheticMouseEvent<>): void => {
      dispatch({
        type: 'stop_drag',
      });
      window.removeEventListener('mouseup', dropItem, true);
    },
    [dispatch],
  );
  const selectItem = useCallback(
    (e: SyntheticMouseEvent<>): void => {
      select(e);
      dispatch({
        hoveredItem: item,
        type: 'start_drag',
      });
    },
    [dispatch, item, select],
  );
  const positionStyle = useMemo(
    (): ?PositionStyle => {
      return mouseX != null && mouseY != null
        ? ({
          left: mouseX,
          top: mouseY - COPY_HEIGHT - 10,
        }) : null;
    },
    [mouseX, mouseY],
  );
  useEffect(
    (): void => {
      if (!dragging) {
        return;
      }
      window.addEventListener('mouseup', dropItem, true);
    },
    [dragging, dropItem],
  );
  return {dragging, positionStyle, select: selectItem};
}

export default useToolbarItem;
