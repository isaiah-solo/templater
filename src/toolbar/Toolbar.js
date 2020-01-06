// @flow strict

import type {State} from '../reducer/workspaceItemReducer';
import type {Element} from 'react';
import React, {useCallback, useEffect, useMemo} from 'react';
import {useDispatch, useSelector} from "react-redux";
import useDrag from '../hook/useDrag';

const COPY_HEIGHT = 20;

function Toolbar(): Element<'div'> {
  const dispatch = useDispatch();
  const draggingNewItem = useSelector((state?: State): boolean => {
    return state !== undefined
      ? state.draggingNewItem
      : false;
  });
  const {
    mouseX,
    mouseY,
    select,
  } = useDrag();
  const hoverItem = useMemo(
    (): Element<'div'> => (
      <div style={{
        ...styles.item,
        ...styles.itemCopy,
        left: mouseX,
        top: mouseY != null ? mouseY - COPY_HEIGHT - 10 : null,
      }} />
    ),
    [mouseX, mouseY],
  );
  const dropItem = useCallback(
    (e: SyntheticMouseEvent<>): void => {
      dispatch({
        type: 'stop_drag',
      });
      window.removeEventListener('mouseup', dropItem, true);
    },
    [dispatch],
  );
  const selectItem = useCallback(
    (e: SyntheticMouseEvent<>): void => {
      select(e);
      dispatch({
        hoveredItem: {type: 'text'},
        type: 'start_drag',
      });
    },
    [dispatch, select],
  );
  useEffect(
    (): void => {
      if (draggingNewItem) {
        window.addEventListener('mouseup', dropItem, true);
      }
    },
    [draggingNewItem, dropItem],
  );
  return (
    <div style={styles.root}>
      {draggingNewItem && hoverItem}
      <div onMouseDown={selectItem} style={styles.item}>
        Text
      </div>
    </div>
  );
}

const styles = {
  root: {
    boxSizing: 'border-box',
    display: 'grid',
    gridAutoFlow: 'row',
    gridRowGap: 12,
    gridTemplateColumns: '1fr',
    gridTemplateRows: 'repeat(auto-fill, 200px)',
    height: '100%',
    width: 200,
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
  itemCopy: {
    borderRadius: 12,
    boxShadow: '#2a2a2a 0 2px 16px -2px',
    height: COPY_HEIGHT,
    position: 'fixed',
    width: 50,
  },
};

export default Toolbar;
