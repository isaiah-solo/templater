// @flow strict

import React from 'react';
import './Workspace.css';

type Props = $ReadOnly<{||}>;

function Element(_: Props): React.Element<'div'> {
  return (
    <div className="Workspace-element" />
  );
}

export default Element;
