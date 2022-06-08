import React from 'react';
import { useRoutes } from 'react-router-dom'
import routers from './routers/router';
import './App.css';
function App() {
  const element = useRoutes(routers);
  return (
    <div className="App">
      {element}
    </div>
  );
}

export default App;
