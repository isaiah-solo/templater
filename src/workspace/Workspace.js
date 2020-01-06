// @flow strict

import type {Element} from 'react';
import type {MouseFunc} from './WorkspaceItem';
import type {Item} from '../reducer/workspaceItemReducer';
import React, {useCallback, useMemo, useRef} from 'react';
import {useDispatch} from "react-redux";
import WorkspaceItem from './WorkspaceItem.js';
import useWorkspaceItems, {GAP, ITEM_HEIGHT, PADDING} from '../reducer/useWorkspaceItems';

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
        console.log('test');
        dispatch({
          index,
          type: 'end_drag',
        });
      };
    },
    [dispatch],
  );
  const itemElements = useMemo(
    (): Array<Element<typeof WorkspaceItem>> => {
      return items.map((
        {type}: Item,
        index: number,
      ): Element<typeof WorkspaceItem> => (
        <WorkspaceItem height={ITEM_HEIGHT}
          key={index}
          onMouseUp={dropItemAt(index)}
          type={type} />
      ))
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
