// @flow strict

import type {Element} from 'react';

import type {Item, State} from '../reducer/workspaceItemReducer';

import React, {useCallback} from 'react';
import {FaGripVertical, FaTimes} from 'react-icons/fa';
import {useDispatch, useSelector} from "react-redux";

import useToggle from '../hook/useToggle';

type Props = $ReadOnly<{|
  grip?: (e: SyntheticMouseEvent<>) => void,
  height: number,
  id: string,
  onMouseUp?: (e: SyntheticMouseEvent<>) => void,
|}>;

function TextItem({
  grip,
  height,
  id,
  onMouseUp,
}: Props): Element<'div'> {
  const dispatch = useDispatch();
  const text = useSelector((state?: State): string => {
    const item = state !== undefined
      ? state.items.find((item: Item): boolean => {
          return item.id === id;
        }) ?? null
      : null;
    let currentText = item != null
      ? item.text ?? ''
      : '';
    currentText = currentText.length > 0
      ? currentText
      : 'Click to add text...';
    return currentText.length > 50
      ? currentText.slice(0, 50) + '...'
      : currentText;
  });
  const {
    isToggled: inEditMode,
    toggleFalse: disableEditMode,
    toggleTrue: enableEditMode,
  } = useToggle(false);
  const {
    isToggled: showingDelete,
    toggleFalse: hideDelete,
    toggleTrue: showDelete,
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
  const deleteItem = useCallback(
    (e: SyntheticMouseEvent<>): void => {
      dispatch({
        id,
        type: 'delete_item',
      });
    },
    [dispatch, id],
  );
  const enteredOrEscaped = useCallback(
    ({key}: SyntheticKeyboardEvent<>): void => {
      if (key !== 'Enter' && key !== 'Escape') {
        return;
      }
      disableEditMode();
    },
    [disableEditMode],
  );
  return (
    <div onBlur={disableEditMode}
      onClick={enableEditMode}
      onMouseEnter={showDelete}
      onMouseLeave={hideDelete}
      onMouseUp={onMouseUp}
      style={{
        ...styles.root,
        height,
      }}>
      <div style={styles.leftItems}>
        <FaGripVertical onMouseDown={grip}
          style={styles.gripIcon} />
        {inEditMode ? (
          <input autoFocus
            onBlur={disableEditMode}
            onChange={changeText}
            onKeyDown={enteredOrEscaped}
            style={styles.input}
            type="text"
            value={text} />
        ) : (
          <span style={styles.text}>
            {text}
          </span>
        )}
      </div>
      {(showingDelete || inEditMode) && (
        <div onClick={deleteItem}
          style={styles.deleteIcon}>
          <FaTimes />
        </div>
      )}
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
    justifyContent: 'space-between',
    padding: '0 10px',
    width: '100%',
  },
  deleteIcon: {
    boxSizing: 'border-box',
    cursor: 'pointer',
    height: 16,
    width: 16,
  },
  gripIcon: {
    cursor: 'pointer',
    marginRight: 10,
  },
  leftItems: {
    alignItems: 'center',
    boxSizing: 'border-box',
    display: 'flex',
    flexGrow: 1,
  },
  input: {
    backgroundColor: '#ee0060',
    borderWidth: 0,
    boxSizing: 'border-box',
    color: 'white',
    flexGrow: 1,
    fontSize: 16,
    outlineWidth: 0,
    padding: 0,
    textDecoration: 'underline',
    width: '100%',
  },
  text: {
    boxSizing: 'border-box',
    userSelect: 'none',
  },
};

export default TextItem;
