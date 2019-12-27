// @flow strict

import React from 'react';

type Props = $ReadOnly<{||}>;

function Element(_: Props): React.Element<'div'> {
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

export default Element;
