// @flow strict

import React, { useCallback, useReducer } from 'react';
import Preview from './preview/Preview';
import Workspace from './workspace/Workspace';
import './App.css';

type Item = $ReadOnly<{|
  type: string,
|}>;

type ItemState = $ReadOnly<{|
  items: Array < Item >,
|}>;

type AddAction = $ReadOnly<{|
  index: number,
  item: Item,
  type: 'add',
|}>;

type DeleteAction = $ReadOnly<{|
  itemIndex: number,
  type: 'delete',
|}>;

type Action = AddAction | DeleteAction;

type Props = $ReadOnly<{||}>;

const reducer = (state: ItemState, action: Action) => {
  const prevItems = [...action.items];
  switch (action.type) {
    case 'add':
      return { items: [...(prevItems.splice(action.index, 0, [action.item]))] };
    case 'delete':
      return { items: [...(prevItems.splice(action.index, 1))] };
    default:
      throw new Error('invalid action');
  }
};

function App(_: Props): React.Element<'div'> {
  const [items, dispatch] = useReducer(reducer, [
    {type: 'test'},
    {type: 'test'},
  ]);
  const addItem = useCallback((item: Item, index: number): (() => void) => (
    (): void => {
      dispatch({index, item, type: 'add'});
    }
  ), []);
  const deleteItem = useCallback((index: number): (() => void) => (
    (): void => {
      dispatch({itemIndex: index, type: 'delete'});
    }
  ), []);
  return (
    <div className="App-root">
      <Workspace items={items} />
      <Preview />
    </div>
  );
}

export default App;
