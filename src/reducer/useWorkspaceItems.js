// @flow strict

import type {Item, State} from './workspaceItemReducer';
import type {ElementRef} from 'react';
import {useCallback, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";

type AddItemFunc = () => void;

type AddItemCurryFunc = $ReadOnly<{|
  atIndex: (index: number) => AddItemFunc,
  toBeginning: () => AddItemFunc,
  toEnd: () => AddItemFunc,
|}>;

export const GAP = 12;
export const ITEM_HEIGHT = 40;
export const PADDING = 20;

function useWorkplaceItems(ref: ElementRef<any>) {
  const current = ref.current;
  const dispatch = useDispatch();
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
    const placeholderItem = {type: 'placeholder'};
    let items = [...initItems];
    if (mouseY == null) {
      // nothing different happens
    } else if (mouseY > itemsHeight) {
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
  const addItem = useCallback(
    (item: Item): AddItemCurryFunc => ({
      atIndex: (index: number): AddItemFunc => (
        (): void => {
          console.log('test');
          dispatch({
            index,
            item,
            type: 'add',
          });
        }
      ),
      toBeginning: (): AddItemFunc => (
        (): void => {
          dispatch({
            item,
            type: 'add_to_beginning',
          });
        }
      ),
      toEnd: (): AddItemFunc => (
        (): void => {
          dispatch({
            item,
            type: 'add_to_end',
          });
        }
      ),
    }),
    [dispatch],
  );
  return {addItem, hover, hoverOut, items};
}

export default useWorkplaceItems;
