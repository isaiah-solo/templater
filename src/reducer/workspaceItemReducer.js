// @flow strict

export type ItemType = 'new_item' | 'placeholder' | 'text';

export type Item = $ReadOnly<{|
  type: ItemType,
|}>;

export type State = $ReadOnly<{|
  draggingNewItem: boolean,
  hoveredItem: ?Item,
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

type EndDragAction = $ReadOnly<{|
  index: number,
  type: 'end_drag',
|}>;

type StartDragAction = $ReadOnly<{|
  hoveredItem: Item,
  type: 'start_drag',
|}>;

type StopDragAction = $ReadOnly<{|
  type: 'stop_drag',
|}>;

type Action = AddAction
  | AddToBeginningAction
  | AddToEndAction
  | DeleteAction
  | EndDragAction
  | StartDragAction
  | StopDragAction;

const DEFAULT_STATE = {
  draggingNewItem: false,
  hoveredItem: null,
  items: [],
};

const workspaceItemReducer = (
  state: State = DEFAULT_STATE,
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
      return {...state, items};
    }
    case 'add_to_beginning': {
      const items = [
        action.item,
        ...prevItems,
      ];
      return {...state, items};
    }
    case 'add_to_end': {
      const items = [
        ...prevItems,
        action.item,
      ];
      return {...state, items};
    }
    case 'end_drag': {
      const hoveredItem = state.hoveredItem;
      const index = action.index;
      if (hoveredItem == null) {
        return {...state, draggingNewItem: false};
      }
      const beginning = prevItems.slice(0, index);
      const end = prevItems.slice(index, prevItems.length);
      const items = [
        ...beginning,
        hoveredItem,
        ...end,
      ];
      return {...state, draggingNewItem: false, hoveredItem: null, items};
    }
    case 'start_drag': {
      const hoveredItem = action.hoveredItem;
      return {...state, draggingNewItem: true, hoveredItem};
    }
    case 'stop_drag': {
      return {...state, draggingNewItem: false};
    }
    default:
      break;
  }
}

export default workspaceItemReducer;
