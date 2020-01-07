// @flow strict

import {useCallback, useEffect, useMemo} from 'react';
import {useDispatch} from "react-redux";

import useDrag from '../hook/useDrag';

type MouseFunc = (e: SyntheticMouseEvent<>) => void;
type PositionStyle = $ReadOnly<{|
  left: number,
  top: number,
|}>;
type DragReturn = $ReadOnly<{|
  dragging: boolean,
  positionStyle: ?PositionStyle,
  selectItemFor: (id: string) => MouseFunc,
|}>;

const COPY_HEIGHT = 20;

const useWorkspace = (): DragReturn => {
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
  return {dragging, positionStyle, selectItemFor};
}

export default useWorkspace;
