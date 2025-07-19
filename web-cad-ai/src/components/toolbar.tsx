import React, { useEffect, useRef } from 'react';

function Toolbar() {
  const toolbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentToolbar = toolbarRef.current;
    if (!currentToolbar) return;

    // Toolbar 초기화 로직 (예: 버튼 추가 등)
    currentToolbar.innerHTML = `
      <button id="addCube">Add Cube</button>
      <button id="removeCube">Remove Cube</button>
    `;

    const addCubeButton = currentToolbar.querySelector('#addCube');
    const removeCubeButton = currentToolbar.querySelector('#removeCube');

    addCubeButton?.addEventListener('click', () => {
      console.log('Add Cube clicked');
      // Add cube logic here
    });

    removeCubeButton?.addEventListener('click', () => {
      console.log('Remove Cube clicked');
      // Remove cube logic here
    });

    return () => {
      addCubeButton?.removeEventListener('click', () => {});
      removeCubeButton?.removeEventListener('click', () => {});
    };
  }, []);

  return <div ref={toolbarRef} className="toolbar"></div>;
}

export default Toolbar;
