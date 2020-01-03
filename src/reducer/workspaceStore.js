// @flow strict

import {createStore} from 'redux';
import workspaceItemReducer from './workspaceItemReducer';

const workspaceStore = createStore(workspaceItemReducer);

export default workspaceStore;
