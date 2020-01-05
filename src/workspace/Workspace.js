// @flow strict

import type {Element} from 'react';
import type {Item} from '../reducer/workspaceItemReducer';
import React, {useCallback, useMemo, useRef, useState} from 'react';
import WorkspaceItem from './WorkspaceItem.js';
import useWorkspaceItems from '../reducer/useWorkspaceItems';

const GAP = 12;
const ITEM_HEIGHT = 40;
const PADDING = 20;

function Workspace(): Element<'div'> {
  const workspaceRef = useRef(null);
  const workspace = workspaceRef.current;
  const [pointerY, setPointerY] = useState<?number>(null);
  const {addItem, items} = useWorkspaceItems();
  const itemElements = useMemo(
    (): Array<Element<typeof WorkspaceItem>> => {
      const itemElementsHeight = ITEM_HEIGHT * items.length;
      const itemGapsHeight = GAP * (items.length - 1);
      const currentItemsHeight = itemElementsHeight + itemGapsHeight + PADDING;
      const placeholderItem = {type: 'placeholder'};
      let currentItems = [...items];
      if (pointerY == null) {
        // nothing different happens
      } else if (pointerY > currentItemsHeight) {
        currentItems = [...currentItems, placeholderItem];
      } else {
        const heightNoPadding = pointerY - PADDING - ITEM_HEIGHT;
        const placeholderIndex = Math.ceil(
          heightNoPadding > 0 ? heightNoPadding / (GAP + ITEM_HEIGHT) : 0
        );
        const beginningItems = currentItems.slice(0, placeholderIndex);
        const endingItems = currentItems.slice(
          placeholderIndex,
          currentItems.length,
        );
        currentItems = [
          ...beginningItems,
          placeholderItem,
          ...endingItems,
        ];
      }
      return currentItems.map((
        {type}: Item,
        index: number,
      ): Element<typeof WorkspaceItem> => (
        <WorkspaceItem height={ITEM_HEIGHT}
          onClick={addItem({type: 'text'}).atIndex(index)}
          key={index}
          type={type} />
      ))
    },
    [addItem, items, pointerY],
  );
  const hover = useCallback(
    (e: SyntheticMouseEvent<>): void => {
      if (workspace == null) {
        return;
      }
      setPointerY(e.pageY - workspace.offsetTop);
    },
    [setPointerY, workspace],
  );
  const hoverOut = useCallback(
    (_: SyntheticMouseEvent<>): void => {
      setPointerY(null);
    },
    [setPointerY],
  );
  return (
    <div onMouseMove={hover}
      onMouseLeave={hoverOut}
      ref={workspaceRef}
      style={styles.root}>
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
    gridRowGap: GAP,
    gridTemplateColumns: '1fr',
    gridTemplateRows: 'repeat(auto-fill, 40px)',
    height: '100%',
    overflowY: 'auto',
    padding: PADDING,
    width: '100%',
  },
};

export default Workspace;
