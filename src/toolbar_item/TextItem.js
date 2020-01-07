// @flow strict

import type {Element} from 'react';

import React, {useCallback, useMemo} from 'react';

import useToolbarItem from './useToolbarItem';
import useToggle from '../hook/useToggle';

const COPY_HEIGHT = 20;

function TextItem(): Element<typeof React.Fragment> {
  const {
    dragging,
    mouseX,
    mouseY,
    select,
  } = useToolbarItem({
    id: 'hover',
    text: '',
    type: 'text',
  });
  const hoveringItem = useMemo(
    (): Element<'div'> => (
      <div style={{
        ...styles.root,
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
  return (
    <>
      {dragging && hoveringItem}
      <div onMouseDown={select} style={styles.root}>
        Text
      </div>
    </>
  );
}

const styles = {
  root: {
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

export default TextItem;
