// @flow strict

import React from 'react';
import './Toolbar.css';

type Props = $ReadOnly<{||}>;

function Toolbar(_: Props): React.Element<'div'> {
  return (
    <div className="Toolbar-root">
      <div className="Toolbar-item">
        <div className="Toolbar-itemText">Text</div>
      </div>
    </div>
  );
}

export default Toolbar;
