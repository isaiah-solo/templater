// @flow strict

import React from 'react';

type Props = $ReadOnly<{||}>;

function Toolbar(_: Props): React.Element<'div'> {
  return (
    <div style={styles.root}>
      <div style={styles.item}>
        <div style={styles.itemText}>Text</div>
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
    height: 200,
    justifyContent: 'center',
    textAlign: 'center',
    width: 200,
  },
  itemText: {
    fontSize: 24,
  },
};

export default Toolbar;
