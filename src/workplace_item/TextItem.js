// @flow strict

import type {Item, State} from '../reducer/workspaceItemReducer';
import type {Element} from 'react';

import React, {useCallback, useMemo} from 'react';
import {useDispatch, useSelector} from "react-redux";

import useToggle from '../hook/useToggle';

export type MouseFunc = (e: SyntheticMouseEvent<>) => void;

type Props = $ReadOnly<{|
  height: number,
  id: string,
  index: number,
  onMouseUp?: MouseFunc,
|}>;

function TextItem({
  height,
  id,
  onMouseUp,
}: Props): Element<'div'> {
  const dispatch = useDispatch();
  const findItem = useCallback(
    (item: Item): boolean => {
      return item.id === id;
    },
    [id],
  );
  const text = useSelector((state?: State): string => {
    const item = state !== undefined
      ? state.items.find(findItem) ?? null
      : null;
    return item != null
      ? item.text ?? ''
      : '';
  });
  const {
    isToggled: inEditMode,
    toggleFalse: disableEditMode,
    toggleTrue: enableEditMode,
  } = useToggle(false);
  const changeText = useCallback(
    (e: SyntheticInputEvent<>): void => {
      dispatch({
        id,
        text: e.target.value,
        type: 'update_item_text',
      });
    },
    [dispatch, id],
  );
  const onEnter = useCallback(
    (e: SyntheticKeyboardEvent<>): void => {
      if (e.key === 'Enter') {
        disableEditMode();
      }
    },
    [disableEditMode],
  );
  const displayText = useMemo(
    (): string => {
      return text.length > 0 ? text : 'Click to add text...';
    },
    [text],
  );
  return (
    <div onClick={enableEditMode}
      onBlur={disableEditMode}
      onMouseUp={onMouseUp}
      style={{
        ...styles.root,
        height,
      }}>
      {inEditMode
        ? <input autoFocus
            onBlur={disableEditMode}
            onChange={changeText}
            onKeyDown={onEnter}
            style={styles.input}
            type="text"
            value={text} />
        : displayText}
    </div>
  );
}

const styles = {
  root: {
    alignItems: 'center',
    backgroundColor: '#ee0060',
    boxSizing: 'border-box',
    color: 'white',
    display: 'flex',
    paddingLeft: 20,
    width: '100%',
  },
  input: {
    backgroundColor: '#ee0060',
    borderWidth: 0,
    color: 'white',
    fontSize: 16,
    outlineWidth: 0,
    padding: 0,
    textDecoration: 'underline',
  },
};

export default TextItem;
