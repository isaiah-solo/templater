// @flow strict

import type {Element} from 'react';
import React from 'react';

type Props = $ReadOnly<{||}>;

function Preview(_: Props): Element<'div'> {
  return (
    <div style={styles.root} />
  );
}

const styles = {
  root: {
    backgroundColor: 'white',
    boxShadow: 'rgba(0, 0, 0, 0.05) 0 2px 16px -2px',
    height: '100%',
    width: '100%',
  },
};

export default Preview;
