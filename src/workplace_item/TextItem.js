// @flow strict

import type {Element} from 'react';

import type {Item, State} from '../reducer/workspaceItemReducer';

import React, {useCallback, useMemo} from 'react';
import {FaGripVertical, FaTimes} from 'react-icons/fa';
import {useDispatch, useSelector} from "react-redux";

import useToggle from '../hook/useToggle';

export type MouseFunc = (e: SyntheticMouseEvent<>) => void;

type Props = $ReadOnly<{|
  grip?: MouseFunc,
  height: number,
  id: string,
  index: number,
  onMouseUp?: MouseFunc,
|}>;

function TextItem({
  grip,
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
  const enteredOrEscaped = useCallback(
    ({key}: SyntheticKeyboardEvent<>): void => {
      if (key !== 'Enter' && key !== 'Escape') {
        return;
      }
      disableEditMode();
    },
    [disableEditMode],
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
  const displayText = useMemo(
    (): string => {
      const currentText = text.length > 0 ? text : 'Click to add text...';
      return currentText.length > 50 ? currentText.slice(0, 50) + '...' : currentText;
    },
    [text],
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
          <span style={styles.displayText}>
            {displayText}
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
  displayText: {
    userSelect: 'none',
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
    color: 'white',
    flexGrow: 1,
    fontSize: 16,
    outlineWidth: 0,
    padding: 0,
    textDecoration: 'underline',
    width: '100%',
  },
};

export default TextItem;
