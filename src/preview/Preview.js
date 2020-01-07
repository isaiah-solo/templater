// @flow strict

import type {Element} from 'react';

import type {Item, State} from '../reducer/workspaceItemReducer';

import React, {useMemo} from 'react';

import {useSelector} from "react-redux";

export const PADDING = 20;

type Props = $ReadOnly<{||}>;

function Preview(_: Props): Element<'div'> {
  const items = useSelector((state?: State): Array<Item> => {
    return state !== undefined ? state.items : [];
  });
  const itemElements = useMemo(
    (): Array<Element<'div'>> => {
      return items.map((
        {text}: Item,
        index: number,
      ): Element<'div'> => {
        return (
          <div key={index}>
            {text}
          </div>
        );
      })
    },
    [items],
  );
  return (
    <div style={styles.root}>
      {itemElements}
    </div>
  );
}

const styles = {
  root: {
    backgroundColor: 'white',
    boxShadow: 'rgba(0, 0, 0, 0.05) 0 2px 16px -2px',
    boxSizing: 'border-box',
    height: '100%',
    padding: PADDING,
    width: '100%',
    wordBreak: 'break-all',
  },
};

export default Preview;
