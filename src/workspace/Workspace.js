// @flow strict

import React from 'react';
import Element from './Element.js';
import './Workspace.css';

type Item = $ReadOnly<{|
  type: string,
|}>;

type Props = $ReadOnly<{|
  items: Array<Item>,
|}>;

function Workspace({items}: Props): React.Element<'div'> {
  const itemElements = items.map((item: Item): React.Element<typeof Element> => <Element />);
  return (
    <div className="Workspace-root">
      {itemElements}
    </div>
  );
}

export default Workspace;
