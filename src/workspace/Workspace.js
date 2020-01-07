// @flow strict

import type {Element} from 'react';
import type {MouseFunc} from '../workplace_item/TextItem.js';
import type {Item, ItemType} from '../reducer/workspaceItemReducer';
import React, {useCallback, useMemo, useRef} from 'react';
import {useDispatch} from "react-redux";
import PlaceholderItem from '../workplace_item/PlaceholderItem.js';
import TextItem from '../workplace_item/TextItem.js';
import useWorkspaceItems, {GAP, ITEM_HEIGHT, PADDING} from '../reducer/useWorkspaceItems';

type ItemElementType = typeof PlaceholderItem
  | typeof TextItem;

const ITEM_MAP: {[ItemType]: ItemElementType} = {
  placeholder: PlaceholderItem,
  text: TextItem,
};

function Workspace(): Element<'div'> {
  const dispatch = useDispatch();
  const workspaceRef = useRef(null);
  const {
    hover,
    hoverOut,
    items,
  } = useWorkspaceItems(workspaceRef);
  const dropItemAt = useCallback(
    (index: number): MouseFunc => {
      return (_: SyntheticMouseEvent<>): void => {
        dispatch({
          index,
          type: 'end_drag',
        });
      };
    },
    [dispatch],
  );
  const itemElements = useMemo(
    (): Array<Element<ItemElementType>> => {
      return items.map((
        {id, text, type}: Item,
        index: number,
      ): Element<ItemElementType> => {
        const Item = ITEM_MAP[type];
        return (
          <Item height={ITEM_HEIGHT}
            id={id}
            index={index}
            key={index}
            onMouseUp={dropItemAt(index)} />
        );
      })
    },
    [dropItemAt, items],
  );
  return (
    <div onMouseLeave={hoverOut}
      onMouseMove={hover}
      onMouseUp={hoverOut}
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
