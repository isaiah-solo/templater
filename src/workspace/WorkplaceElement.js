// @flow strict

import type {Element} from 'react';
import React from 'react';

function WorkplaceElement(): Element<'div'> {
  return (
    <div style={styles.root} />
  );
}

const styles = {
  root: {
    backgroundColor: '#ee0060',
    boxSizing: 'border-box',
    height: 40,
    width: '100%',
  },
};

export default WorkplaceElement;
