// @flow strict

import type {Item, State} from './workspaceItemReducer';
import {useCallback} from 'react';
import {useDispatch, useSelector} from "react-redux";

type AddItemFunc = () => void;

type AddItemCurryFunc = $ReadOnly<{|
  atIndex: (index: number) => AddItemFunc,
  toBeginning: () => AddItemFunc,
  toEnd: () => AddItemFunc,
|}>;

function useWorkplaceItems() {
  const dispatch = useDispatch();
  const items = useSelector((state: State): Array<Item> => (
    state !== undefined ? state.items : []
  ));
  const addItem = useCallback(
    (item: Item): AddItemCurryFunc => ({
      atIndex: (index: number): AddItemFunc => (
        (): void => {
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
  return {addItem, items};
}

export default useWorkplaceItems;
