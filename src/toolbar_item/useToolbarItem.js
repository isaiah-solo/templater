// @flow strict

import type {Item, State} from '../reducer/workspaceItemReducer';

import {useCallback, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";

import useDrag from '../hook/useDrag';
import useToggle from '../hook/useToggle';

type DragReturn = $ReadOnly<{|
  dragging: boolean,
  mouseX: ?number,
  mouseY: ?number,
  select: (e: SyntheticMouseEvent<>) => void,
|}>;

const useToolbarItem = (item: Item): DragReturn => {
  const dispatch = useDispatch();
  const draggingGlobal = useSelector((state?: State): boolean => {
    return state !== undefined
      ? state.draggingNewItem
      : false;
  });
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
  useEffect(
    (): void => {
      if (!draggingGlobal) {
        return;
      }
      window.addEventListener('mouseup', dropItem, true);
    },
    [draggingGlobal, dropItem],
  );
  return {dragging, mouseX, mouseY, select: selectItem};
}

export default useToolbarItem;
