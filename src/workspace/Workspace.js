// @flow strict

import React from 'react';
import Element from './Element.js';

type Item = $ReadOnly<{|
  type: string,
|}>;

type Props = $ReadOnly<{|
  items: Array<Item>,
|}>;

function Workspace({items}: Props): React.Element<'div'> {
  const itemElements = items.map((item: Item): React.Element<typeof Element> => <Element />);
  return (
    <div style={styles.root}>
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
    gridRowGap: 12,
    gridTemplateColumns: '1fr',
    gridTemplateRows: 'repeat(auto-fill, 40px)',
    height: '100%',
    overflowY: 'auto',
    padding: 20,
    width: '100%',
  },
};

export default Workspace;
