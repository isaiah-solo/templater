// @flow strict

import type {Element} from 'react';

import React, {useMemo} from 'react';

import useToolbarItem from './useToolbarItem';

const COPY_HEIGHT = 20;

function HeaderItem(): Element<typeof React.Fragment> {
  const {
    dragging,
    positionStyle,
    select,
  } = useToolbarItem({
    id: 'hover',
    text: '',
    type: 'header',
  });
  const hoveringItem = useMemo(
    (): Element<'div'> => (
      <div style={{
        ...styles.root,
        ...styles.copy,
        ...positionStyle,
      }} />
    ),
    [positionStyle],
  );
  return (
    <>
      {dragging && hoveringItem}
      <div onMouseDown={select} style={styles.root}>
        Header
      </div>
    </>
  );
}

const styles = {
  root: {
    alignItems: 'center',
    backgroundColor: '#0cbfe9',
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

export default HeaderItem;
