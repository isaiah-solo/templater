// @flow strict

import type {Element} from 'react';

import React from 'react';

import TextItem from '../toolbar_item/TextItem';

function Toolbar(): Element<'div'> {
  return (
    <div style={styles.root}>
      <TextItem />
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
};

export default Toolbar;
