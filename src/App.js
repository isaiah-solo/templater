// @flow strict

import type {Element} from 'react';
import React from 'react';
import {Provider} from 'react-redux';
import Preview from './preview/Preview';
import Toolbar from './toolbar/Toolbar';
import Workspace from './workspace/Workspace';
import workspaceStore from './reducer/workspaceStore';

function App(): Element<typeof Provider> {
  return (
    <Provider store={workspaceStore}>
      <div style={styles.root}>
        <Toolbar />
        <Workspace />
        <Preview />
      </div>
    </Provider>
  );
}

const styles = {
  root: {
    backgroundColor: '#202020',
    boxSizing: 'border-box',
    display: 'grid',
    gridAutoFlow: 'column',
    gridGap: 20,
    gridTemplateColumns: 'auto 1fr 1fr',
    height: '100vh',
    padding: 20,
    width: '100vw',
  },
};

export default App;
