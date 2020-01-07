// @flow strict

export type ItemType = 'placeholder'
  | 'text';

export type Item = $ReadOnly<{|
  id: string,
  text?: string,
  type: ItemType,
|}>;

export type State = $ReadOnly<{|
  currentID: number,
  draggingNewItem: boolean,
  hoveredItem: ?Item,
  items: Array<Item>,
|}>;

type DeleteItemAction = $ReadOnly<{|
  id: string,
  type: 'delete_item',
|}>;

type EndDragAction = $ReadOnly<{|
  index: number,
  type: 'end_drag',
|}>;

type PickUpItemAction = $ReadOnly<{|
  id: string,
  type: 'pick_up_item',
|}>;

type StartDragAction = $ReadOnly<{|
  hoveredItem: Item,
  type: 'start_drag',
|}>;

type StopDragAction = $ReadOnly<{|
  type: 'stop_drag',
|}>;

type UpdateItemTextAction = $ReadOnly<{|
  id: number,
  text: string,
  type: 'update_item_text',
|}>;

type Action = DeleteItemAction
  | EndDragAction
  | PickUpItemAction
  | StartDragAction
  | StopDragAction
  | UpdateItemTextAction;

const DEFAULT_STATE = {
  currentID: 0,
  draggingNewItem: false,
  hoveredItem: null,
  items: [],
};

const workspaceItemReducer = (
  state: State = DEFAULT_STATE,
  action: Action,
): ?State => {
  const prevItems = [...state.items];
  const findItemFor = (id: string): (Item => boolean) => {
    return (item: Item): boolean => {
      return item.id === id;
    }
  };
  switch (action.type) {
    case 'delete_item': {
      const id = action.id;
      const index = prevItems.findIndex(findItemFor(id));
      const beginning = prevItems.slice(0, index);
      const end = prevItems.slice(index + 1, prevItems.length);
      const items = [
        ...beginning,
        ...end,
      ];
      return {
        ...state,
        draggingNewItem: false,
        items,
      };
    }
    case 'end_drag': {
      const currentID = state.currentID;
      const index = action.index;
      const hoveredItem = state.hoveredItem != null
        ? {...state.hoveredItem, id: String(currentID)}
        : null;
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
      return {
        ...state,
        currentID: currentID + 1,
        draggingNewItem: false,
        hoveredItem: null,
        items
      };
    }
    case 'pick_up_item': {
      const id = action.id;
      const originalItem = prevItems.find(findItemFor(id));
      const index = prevItems.findIndex(findItemFor(id));
      const beginning = prevItems.slice(0, index);
      const end = prevItems.slice(index + 1, prevItems.length);
      const items = [
        ...beginning,
        ...end,
      ];
      return {
        ...state,
        draggingNewItem: true,
        hoveredItem: originalItem,
        items,
      };
    }
    case 'start_drag': {
      const hoveredItem = action.hoveredItem;
      return {...state, draggingNewItem: true, hoveredItem};
    }
    case 'stop_drag': {
      return {...state, draggingNewItem: false};
    }
    case 'update_item_text': {
      const id = action.id;
      const originalItem = prevItems.find(findItemFor(String(id)));
      const index = prevItems.findIndex(findItemFor(String(id)));
      const beginning = prevItems.slice(0, index);
      const end = prevItems.slice(index + 1, prevItems.length);
      const items = [
        ...beginning,
        {...originalItem, text: action.text},
        ...end,
      ];
      return {...state, items};
    }
    default:
      break;
  }
}

export default workspaceItemReducer;
