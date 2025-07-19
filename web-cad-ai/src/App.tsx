import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

function App() {
  const mountRef = useRef<HTMLDivElement>(null); // useRef에 HTMLDivElement 타입을 명시

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return; // currentMount가 null일 경우를 대비

    // --- Three.js 씬 설정 ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xcccccc);

    const camera = new THREE.PerspectiveCamera(
      75,
      currentMount.clientWidth / currentMount.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    currentMount.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1).normalize();
    scene.add(directionalLight);

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0x0077ff });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;

    const animate = () => {
      requestAnimationFrame(animate);
      // cube.rotation.x += 0.005;
      // cube.rotation.y += 0.005;
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // --- 클린업 함수 ---
    return () => {
      window.removeEventListener('resize', handleResize);
      if (currentMount && renderer.domElement) { // 렌더러 엘리먼트가 존재할 때만 제거
         currentMount.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      controls.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}
    >
      {/* Three.js 캔버스가 이 div 안에 렌더링됩니다. */}
    </div>
  );
}

export default App;