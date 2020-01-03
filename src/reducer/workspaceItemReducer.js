// @flow strict

export type ItemType = 'new_item' | 'placeholder' | 'text';

export type Item = $ReadOnly<{|
  type: ItemType,
|}>;

export type State = $ReadOnly<{|
  items: Array<Item>,
|}>;

type AddAction = $ReadOnly<{|
  index: number,
  item: Item,
  type: 'add',
|}>;

type AddToBeginningAction = $ReadOnly<{|
  item: Item,
  type: 'add_to_beginning',
|}>;

type AddToEndAction = $ReadOnly<{|
  item: Item,
  type: 'add_to_end',
|}>;

type DeleteAction = $ReadOnly<{|
  index: number,
  type: 'delete',
|}>;

type Action = AddAction
  | AddToBeginningAction
  | AddToEndAction
  | DeleteAction;

const workspaceItemReducer = (
  state: State = {items: []},
  action: Action,
): ?State => {
  const prevItems = [...state.items];
  switch (action.type) {
    case 'add': {
      const beginning = prevItems.slice(0, action.index);
      const end = prevItems.slice(action.index, prevItems.length);
      const items = [
        ...beginning,
        action.item,
        ...end,
      ];
      return {items};
    }
    case 'add_to_beginning': {
      const items = [
        action.item,
        ...prevItems,
      ];
      return {items};
    }
    case 'add_to_end': {
      const items = [
        ...prevItems,
        action.item,
      ];
      return {items};
    }
    case 'delete': {
      const beginning = prevItems.slice(0, action.index);
      const end = prevItems.slice(action.index + 1, prevItems.length);
      const items = [
        ...beginning,
        ...end,
      ];
      return {items};
    }
    default:
      break;
  }
}

export default workspaceItemReducer;
