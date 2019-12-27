// @flow strict

import React, { useCallback, useReducer } from 'react';
import Preview from './preview/Preview';
import Toolbar from './toolbar/Toolbar';
import Workspace from './workspace/Workspace';

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
    <div style={styles.root}>
      <Toolbar />
      <Workspace items={items} />
      <Preview />
    </div>
  );
}

const styles = {
  root: {
    backgroundColor: '#202020',
    boxSizing: 'border-box',
    display: 'grid',
    gridAutoFlow: 'column',
    gridGap: 20,
    gridTemplateColumns: 'auto 1fr 1fr',
    height: '100vh',
    padding: 20,
    width: '100vw',
  },
};

export default App;
