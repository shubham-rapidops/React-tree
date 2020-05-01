import React from 'react';
import "@elastic/eui/dist/eui_theme_light.css";

import './App.css';
import Customers from'./component/Customers'
import TreeView from './component/Tree'

function App() {
  return (
    <div className="App">
     <Customers />
     {/* <TreeView /> */}

    </div>
  );
}

export default App;
  