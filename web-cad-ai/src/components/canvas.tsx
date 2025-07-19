// src/components/Canvas.tsx
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'; // 경로 수정 확인

function Canvas() {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null); // scene 참조 추가
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null); // camera 참조 추가

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // 씬, 카메라, 렌더러 초기화
    const scene = new THREE.Scene();
    sceneRef.current = scene; // scene 참조 저장
    scene.background = new THREE.Color(0xeeeeee); // 밝은 회색 배경으로 변경

    // OrthographicCamera 설정 (2D 도면에 적합)
    const aspect = currentMount.clientWidth / currentMount.clientHeight;
    const frustumSize = 20; // 뷰포트의 '높이' (이 값에 따라 보이는 범위가 달라짐)
    const camera = new THREE.OrthographicCamera(
      -frustumSize * aspect / 2,
      frustumSize * aspect / 2,
      frustumSize / 2,
      -frustumSize / 2,
      1,
      1000
    );
    camera.position.set(0, 0, 10); // 2D 평면을 바라보도록 Z축에 위치
    camera.lookAt(0, 0, 0); // 원점을 바라보게 설정
    cameraRef.current = camera; // camera 참조 저장

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    currentMount.appendChild(renderer.domElement);

    // 조명 (2D에서는 큰 의미 없지만, 3D 전환 고려하여 유지)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(1, 1, 1).normalize();
    scene.add(directionalLight);

    // 그리드 헬퍼 추가 (2D 평면에 맞춤)
    const gridHelper = new THREE.GridHelper(frustumSize, frustumSize, 0x888888, 0xbbbbbb);
    gridHelper.rotation.x = Math.PI / 2; // XZ 평면에서 XY 평면으로 회전
    scene.add(gridHelper);

    // OrbitControls 설정 (2D 뷰에서도 이동/확대/축소에 사용)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = true; // 2D 이동에 유용
    controls.enableRotate = false; // 2D 뷰에서는 회전 비활성화 (선택 사항)
    controls.mouseButtons = { // 2D 이동에 적합한 마우스 버튼 설정 (가운데/오른쪽 버튼으로 패닝)
        LEFT: THREE.MOUSE.PAN,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.ROTATE // 또는 THREE.MOUSE.PAN으로 변경하여 회전 대신 패닝
    };


    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      const newAspect = currentMount.clientWidth / currentMount.clientHeight;
      camera.left = -frustumSize * newAspect / 2;
      camera.right = frustumSize * newAspect / 2;
      camera.top = frustumSize / 2;
      camera.bottom = -frustumSize / 2;
      camera.updateProjectionMatrix();
      renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // 클린업 함수
    return () => {
      window.removeEventListener('resize', handleResize);
      if (currentMount && renderer.domElement) {
         currentMount.removeChild(renderer.domElement);
      }
      // scene, camera, renderer, controls, gridHelper 등 dispose (필요시)
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

export default Canvas;
