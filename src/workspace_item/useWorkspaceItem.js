// @flow strict

import type {State} from '../reducer/workspaceItemReducer';

import {useCallback, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";

import useDrag from '../hook/useDrag';

type MouseFunc = (e: SyntheticMouseEvent<>) => void;
type DragReturn = $ReadOnly<{|
  dragging: boolean,
  mouseX: ?number,
  mouseY: ?number,
  selectItemFor: (id: string) => MouseFunc,
|}>;

const useWorkspaceItem = (): DragReturn => {
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
  const selectItemFor = useCallback(
    (id: string): MouseFunc => {
      return (e: SyntheticMouseEvent<>): void => {
        select(e);
        dispatch({
          id,
          type: 'pick_up_item',
        });
      };
    },
    [dispatch, select],
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
  return {dragging, mouseX, mouseY, selectItemFor};
}

export default useWorkspaceItem;
