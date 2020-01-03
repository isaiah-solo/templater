// @flow strict

import type {Element} from 'react';
import type {Item} from '../reducer/workspaceItemReducer';
import React, {useMemo} from 'react';
import WorkplaceElement from './WorkplaceElement.js';
import useWorkspaceItems from '../reducer/useWorkspaceItems';

function Workspace(): Element<'div'> {
  const {addItem, items} = useWorkspaceItems();
  const itemElements = useMemo(
    (): Array<Element<typeof WorkplaceElement>> => (
      items.map((item: Item, index: number): Element<typeof WorkplaceElement> => (
        <WorkplaceElement key={index} />
      ))
    ),
    [items],
  );
  return (
    <div onClick={addItem({type: 'text'}).toEnd()} style={styles.root}>
      {itemElements}
    </div>
  );
}

const styles = {
  root: {
    backgroundColor: '#2c2c2c',
    boxShadow: 'rgba(0, 0, 0, 0.05) 0 2px 16px -2px',
    boxSizing: 'border-box',
    display: 'grid',
    gridAutoFlow: 'row',
    gridRowGap: 12,
    gridTemplateColumns: '1fr',
    gridTemplateRows: 'repeat(auto-fill, 40px)',
    height: '100%',
    overflowY: 'auto',
    padding: 20,
    width: '100%',
  },
};

export default Workspace;
