// @flow strict

import type {ElementRef} from 'react';

import type {Item, State} from './workspaceItemReducer';

import {useCallback, useState} from 'react';
import {useSelector} from "react-redux";

export const GAP = 12;
export const ITEM_HEIGHT = 40;
export const PADDING = 20;

type ItemsReturn = $ReadOnly<{|
  hover: (e: SyntheticMouseEvent<>) => void,
  hoverOut: (e: SyntheticMouseEvent<>) => void,
  items: Array<Item>,
|}>;

function useWorkplaceItems(ref: ElementRef<any>): ItemsReturn {
  const current = ref.current;
  const [mouseY, setMouseY] = useState<?number>(null);
  const draggingNewItem = useSelector((state?: State): boolean => {
    return state !== undefined
      ? state.draggingNewItem
      : false;
  });
  const items = useSelector((state?: State): Array<Item> => {
    const initItems = state !== undefined ? state.items : [];
    const itemElementsHeight = ITEM_HEIGHT * initItems.length;
    const itemGapsHeight = GAP * (initItems.length - 1);
    const itemsHeight = itemElementsHeight + itemGapsHeight + PADDING;
    const placeholderItem = {id: 'placeholder', type: 'placeholder'};
    let items = [...initItems];
    if (mouseY == null) {
      return items;
    }
    if (mouseY > itemsHeight) {
      items = [...items, placeholderItem];
    } else {
      const heightNoPadding = mouseY - PADDING - ITEM_HEIGHT;
      const placeholderIndex = Math.ceil(
        heightNoPadding > 0 ? heightNoPadding / (GAP + ITEM_HEIGHT) : 0
      );
      const beginningItems = items.slice(0, placeholderIndex);
      const endingItems = items.slice(
        placeholderIndex,
        items.length,
      );
      items = [
        ...beginningItems,
        placeholderItem,
        ...endingItems,
      ];
    }
    return items;
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
  return {hover, hoverOut, items};
}

export default useWorkplaceItems;
