// @flow strict

import type {Element} from 'react';
import React, {useMemo} from 'react';
import useDrag from '../hook/useDrag';

function Toolbar(): Element<'div'> {
  const {
    isSelected,
    select,
    selectedX,
    selectedY,
  } = useDrag();
  const hoverItem = useMemo(
    (): Element<'div'> => (
      <div style={{
        ...styles.item,
        ...styles.itemCopy,
        left: selectedX,
        top: selectedY,
      }}>
        Text
      </div>
    ),
    [selectedX, selectedY],
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
    height: 200,
    justifyContent: 'center',
    textAlign: 'center',
    userSelect: 'none',
    width: 200,
  },
  itemCopy: {
    backgroundColor: 'blue',
    position: 'fixed',
  },
};

export default Toolbar;
