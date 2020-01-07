// @flow strict

import type {Element} from 'react';
import React from 'react';

export type MouseFunc = (e: SyntheticMouseEvent<>) => void;

type Props = $ReadOnly<{|
  height: number,
  id: string,
  index: number,
  onMouseUp?: MouseFunc,
|}>;

function PlaceholderItem({
  height,
  onMouseUp,
}: Props): Element<'div'> {
  return (
    <div onMouseUp={onMouseUp}
      style={{
        ...styles.root,
        height,
      }} />
  );
}

const styles = {
  root: {
    alignItems: 'center',
    backgroundColor: '#202020',
    boxSizing: 'border-box',
    color: 'white',
    display: 'flex',
    paddingLeft: 20,
    width: '100%',
  },
};

export default PlaceholderItem;
