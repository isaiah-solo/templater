// @flow strict

import type {ItemType} from '../reducer/workspaceItemReducer';
import type {Element} from 'react';
import React from 'react';

const BACKGROUND_COLOR_MAP = {
  new_item: '#ee0060',
  placeholder: '#202020',
  text: '#ee0060',
};

export type MouseFunc = (e: SyntheticMouseEvent<>) => void;

type Props = $ReadOnly<{|
  height: number,
  onMouseUp: MouseFunc,
  type: ItemType,
|}>;

function WorkspaceItem({
  height,
  onMouseUp,
  type,
}: Props): Element<'div'> {
  const backgroundColor = BACKGROUND_COLOR_MAP[type];
  return (
    <div onMouseUp={onMouseUp}
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
