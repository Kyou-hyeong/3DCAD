// import React, { useEffect, useRef } from 'react';
import Canvas from './components/canvaus';
import Toolbar from './components/toolbar';
function App() {
  return (
    <div
      style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}
    >
      <Toolbar />
      <Canvas />
    </div>
  );
}

export default App;