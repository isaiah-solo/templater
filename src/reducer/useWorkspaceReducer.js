// @flow strict

import type {ElementRef} from 'react';

import type {Item, State} from './workspaceItemReducer';

import {useCallback, useEffect, useMemo, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";

import useDrag from '../hook/useDrag';

export const GAP = 12;
export const ITEM_HEIGHT = 40;
export const PADDING = 20;

type MouseFunc = (e: SyntheticMouseEvent<>) => void;
type PositionStyle = $ReadOnly<{|
  left: number,
  top: number,
|}>;
type ItemsReturn = $ReadOnly<{|
  dragging: boolean,
  hover: (e: SyntheticMouseEvent<>) => void,
  hoverOut: (e: SyntheticMouseEvent<>) => void,
  items: Array<Item>,
  placeholderIndex: ?number,
  positionStyle: ?PositionStyle,
  selectItemFor: (id: string) => MouseFunc,
|}>;

const COPY_HEIGHT = 20;

function useWorkspaceReducer(ref: ElementRef<any>): ItemsReturn {
  const dispatch = useDispatch();
  const current = ref.current;
  const [hoverY, setHoverY] = useState<?number>(null);
  const draggingNewItem = useSelector((state?: State): boolean => {
    return state?.draggingNewItem ?? false;
  });
  const {
    dragging,
    mouseX,
    mouseY,
    select,
  } = useDrag();
  const placeholderIndex = useMemo(
    (): ?number => {
      if (hoverY == null) {
        return null;
      }
      const heightNoPadding = hoverY - PADDING - ITEM_HEIGHT;
      return Math.ceil(
        heightNoPadding > 0
          ? heightNoPadding / (GAP + ITEM_HEIGHT)
          : 0
      );
    },
    [hoverY],
  );
  const items = useSelector((state?: State): Array<Item> => {
    const items = state?.items ?? [];
    if (placeholderIndex == null) {
      return [...items];
    }
    const placeholderItem = {id: 'placeholder', type: 'placeholder'};
    const beginningItems = items.slice(0, placeholderIndex);
    const endingItems = items.slice(
      placeholderIndex,
      items.length,
    );
    return [
      ...beginningItems,
      placeholderItem,
      ...endingItems,
    ];
  });
  const hover = useCallback(
    (e: SyntheticMouseEvent<>): void => {
      if (current == null || !draggingNewItem) {
        return;
      }
      setHoverY(e.pageY - current.offsetTop);
    },
    [current, draggingNewItem, setHoverY],
  );
  const hoverOut = useCallback(
    (_: SyntheticMouseEvent<>): void => {
      setHoverY(null);
    },
    [setHoverY],
  );
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
        setHoverY(e.pageY - current.offsetTop);
        dispatch({
          id,
          type: 'pick_up_item',
        });
      };
    },
    [current, dispatch, select, setHoverY],
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
  return {
    dragging,
    hover,
    hoverOut,
    items,
    placeholderIndex,
    positionStyle,
    selectItemFor,
  };
}

export default useWorkspaceReducer;
