// @flow strict

import type {Element} from 'react';
import type {Item, ItemType} from '../reducer/workspaceItemReducer';

import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {useDispatch} from "react-redux";

import PlaceholderItem from '../workspace_item/PlaceholderItem.js';
import TextItem from '../workspace_item/TextItem.js';
import useWorkspaceItems, {GAP, ITEM_HEIGHT, PADDING} from '../reducer/useWorkspaceItems';
import useWorkspaceItem from '../workspace_item/useWorkspaceItem';
import useToggle from '../hook/useToggle';

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
    isToggled: draggingFromHere,
    toggleFalse: dropFromHere,
    toggleTrue: dragFromHere,
  } = useToggle(false);
  const {
    dragging,
    mouseX,
    mouseY,
    selectItemFor,
  } = useWorkspaceItem();
  const {
    hover,
    hoverOut,
    items,
  } = useWorkspaceItems(workspaceRef);
  const dropItemFromHere = useCallback(
    (): void => {
      dropFromHere();
      window.removeEventListener('mouseup', dropItemFromHere, true);
    },
    [dropFromHere],
  );
  const dropItemAt = useCallback(
    (index: number): MouseFunc => {
      return (_: SyntheticMouseEvent<>): void => {
        dropFromHere();
        dispatch({
          index,
          type: 'end_drag',
        });
      };
    },
    [dispatch, dropFromHere],
  );
  const gripItemFor = useCallback(
    (id: string): MouseFunc => {
      return (e: SyntheticMouseEvent<>): void => {
        dragFromHere();
        selectItemFor(id)(e);
      };
    },
    [dragFromHere, selectItemFor],
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
                ? gripItemFor(id)
                : undefined
            }
            height={ITEM_HEIGHT}
            id={id}
            key={index}
            onMouseUp={
              type === 'placeholder'
                ? dropItemAt(index)
                : undefined
            } />
        );
      })
    },
    [dropItemAt, gripItemFor, items],
  );
  const hoveringItem = useMemo(
    (): Element<'div'> => (
      <div style={{
        ...styles.item,
        ...styles.copy,
        left: mouseX,
        top: (
          mouseY != null
            ? mouseY - COPY_HEIGHT - 10
            : null
        ),
      }} />
    ),
    [mouseX, mouseY],
  );
  useEffect(
    (): void => {
      if (!draggingFromHere) {
        return;
      }
      window.addEventListener('mouseup', dropItemFromHere, true);
    },
    [draggingFromHere, dropItemFromHere],
  );
  return (
    <>
      {draggingFromHere && dragging && hoveringItem}
      <div onMouseLeave={hoverOut}
        onMouseMove={hover}
        onMouseUp={hoverOut}
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
