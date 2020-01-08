// @flow strict

import type {Element} from 'react';
import type {Item, ItemType} from '../reducer/workspaceItemReducer';

import React, {useCallback, useMemo, useRef} from 'react';
import {useDispatch} from "react-redux";

import PlaceholderItem from '../workspace_item/PlaceholderItem.js';
import TextItem from '../workspace_item/TextItem.js';
import useWorkspaceReducer, {GAP, ITEM_HEIGHT, PADDING} from '../reducer/useWorkspaceReducer';

type ItemElementType = typeof PlaceholderItem
  | typeof TextItem;
type MouseFunc = (e: SyntheticMouseEvent<>) => void;

const COPY_HEIGHT = 20;
const ITEM_MAP: {[ItemType]: ItemElementType} = {
  placeholder: PlaceholderItem,
  text: TextItem,
};

function Workspace(): Element<typeof React.Fragment> {
  const dispatch = useDispatch();
  const workspaceRef = useRef(null);
  const {
    dragging,
    hover,
    hoverOut,
    items,
    placeholderIndex,
    positionStyle,
    selectItemFor,
  } = useWorkspaceReducer(workspaceRef);
  const dropItemAt = useCallback(
    (index: ?number): MouseFunc => {
      return (e: SyntheticMouseEvent<>): void => {
        if (index == null) {
          return;
        }
        hoverOut(e);
        dispatch({
          index,
          type: 'end_drag',
        });
      };
    },
    [dispatch, hoverOut],
  );
  const itemElements = useMemo(
    (): Array<Element<ItemElementType>> => {
      return items.map((
        {id, text, type}: Item,
        index: number,
      ): Element<ItemElementType> => {
        const Item = ITEM_MAP[type];
        return (
          <Item grip={
              type !== 'placeholder'
                ? selectItemFor(id)
                : undefined
            }
            height={ITEM_HEIGHT}
            id={id}
            key={index} />
        );
      })
    },
    [items, selectItemFor],
  );
  const hoveringItem = useMemo(
    (): Element<'div'> => {
      return (
        <div style={{
          ...styles.item,
          ...styles.copy,
          ...positionStyle,
        }} />
      );
    },
    [positionStyle],
  );
  return (
    <>
      {dragging && hoveringItem}
      <div onMouseLeave={hoverOut}
        onMouseMove={hover}
        onMouseUp={dropItemAt(placeholderIndex)}
        ref={workspaceRef}
        style={styles.root}>
        {itemElements}
      </div>
    </>
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
  item: {
    alignItems: 'center',
    backgroundColor: '#ee0060',
    boxSizing: 'border-box',
    color: 'white',
    display: 'flex',
    fontSize: 24,
    height: 50,
    justifyContent: 'center',
    textAlign: 'center',
    userSelect: 'none',
    width: 200,
  },
  copy: {
    borderRadius: 12,
    boxShadow: '#2a2a2a 0 2px 16px -2px',
    height: COPY_HEIGHT,
    position: 'fixed',
    width: 50,
  },
};

export default Workspace;
