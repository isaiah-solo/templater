// @flow strict

import type {Item, State} from '../reducer/workspaceItemReducer';

import {useCallback, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";

import useDrag from '../hook/useDrag';

type DragReturn = $ReadOnly<{|
  dragging: boolean,
  mouseX: ?number,
  mouseY: ?number,
  selectItem: (e: SyntheticMouseEvent<>) => void,
|}>;

const useToolbarItem = (item: Item, dropCallback: any): DragReturn => {
  const dispatch = useDispatch();
  const dragging = useSelector((state?: State): boolean => {
    return state !== undefined
      ? state.draggingNewItem
      : false;
  });
  const {
    mouseX,
    mouseY,
    select,
  } = useDrag();
  const dropItem = useCallback(
    (e: SyntheticMouseEvent<>): void => {
      dispatch({
        type: 'stop_drag',
      });
      dropCallback();
      window.removeEventListener('mouseup', dropItem, true);
    },
    [dispatch, dropCallback],
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
      if (!dragging) {
        return;
      }
      window.addEventListener('mouseup', dropItem, true);
    },
    [dragging, dropItem],
  );
  return {dragging, mouseX, mouseY, selectItem};
}

export default useToolbarItem;
