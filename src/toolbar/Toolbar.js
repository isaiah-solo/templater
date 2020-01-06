// @flow strict

import type {Element} from 'react';
import React, {useMemo} from 'react';
import useDrag from '../hook/useDrag';

const COPY_HEIGHT = 20;

function Toolbar(): Element<'div'> {
  const {
    isSelected,
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
  return (
    <div style={styles.root}>
      {isSelected && hoverItem}
      <div onMouseDown={select} style={styles.item}>
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
