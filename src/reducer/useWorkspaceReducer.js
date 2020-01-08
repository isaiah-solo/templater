// @flow strict

import type {ElementRef} from 'react';

import type {Item, State} from './workspaceItemReducer';

import {useCallback, useState} from 'react';
import {useSelector} from "react-redux";

export const GAP = 12;
export const ITEM_HEIGHT = 40;
export const PADDING = 20;

type Items = $ReadOnly<{|
  items: Array<Item>,
  placeholderIndex: ?number,
|}>;
type ItemsReturn = $ReadOnly<{|
  ...Items,
  hover: (e: SyntheticMouseEvent<>) => void,
  hoverOut: (e: SyntheticMouseEvent<>) => void,
|}>;

function useWorkspaceReducer(ref: ElementRef<any>): ItemsReturn {
  const current = ref.current;
  const [mouseY, setMouseY] = useState<?number>(null);
  const draggingNewItem = useSelector((state?: State): boolean => {
    return state !== undefined
      ? state.draggingNewItem
      : false;
  });
  const {items, placeholderIndex} = useSelector((state?: State): Items => {
    const initItems = state !== undefined ? state.items : [];
    const placeholderItem = {id: 'placeholder', type: 'placeholder'};
    let items = [...initItems];
    if (mouseY == null) {
      return {
        items: [
          ...initItems
        ],
        placeholderIndex: null,
      };
    }
    const heightNoPadding = mouseY - PADDING - ITEM_HEIGHT;
    const placeholderIndex = Math.ceil(
      heightNoPadding > 0 ? heightNoPadding / (GAP + ITEM_HEIGHT) : 0
    );
    const beginningItems = items.slice(0, placeholderIndex);
    const endingItems = items.slice(
      placeholderIndex,
      items.length,
    );
    return {
      items: [
        ...beginningItems,
        placeholderItem,
        ...endingItems,
      ],
      placeholderIndex,
    };
  });
  const hover = useCallback(
    (e: SyntheticMouseEvent<>): void => {
      if (current == null || !draggingNewItem) {
        return;
      }
      setMouseY(e.pageY - current.offsetTop);
    },
    [current, draggingNewItem, setMouseY],
  );
  const hoverOut = useCallback(
    (_: SyntheticMouseEvent<>): void => {
      setMouseY(null);
    },
    [setMouseY],
  );
  return {hover, hoverOut, items, placeholderIndex};
}

export default useWorkspaceReducer;
