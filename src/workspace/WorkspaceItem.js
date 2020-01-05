// @flow strict

import type {ItemType} from '../reducer/workspaceItemReducer';
import type {Element} from 'react';
import React from 'react';

const BACKGROUND_COLOR_MAP = {
  new_item: '#ee0060',
  placeholder: '#202020',
  text: '#ee0060',
};

type Props = $ReadOnly<{|
  height: number,
  onClick: () => void,
  type: ItemType,
|}>;

function WorkspaceItem({
  height,
  onClick,
  type,
}: Props): Element<'div'> {
  const backgroundColor = BACKGROUND_COLOR_MAP[type];
  return (
    <div onClick={onClick}
      style={{
        ...styles.root,
        backgroundColor,
        height,
      }} />
  );
}

const styles = {
  root: {
    boxSizing: 'border-box',
    width: '100%',
  },
};

export default WorkspaceItem;
