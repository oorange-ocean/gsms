import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { LNGStation } from '../scenes/LNGStation';

const InspectionView: React.FC = () => {
  console.log('InspectionView 组件渲染');
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const stationRef = useRef<LNGStation | null>(null);

  useEffect(() => {
    console.log('useEffect 开始执行');
    console.log('containerRef 状态:', containerRef.current);

    if (!containerRef.current) {
      console.warn('容器元素未找到');
      return;
    }

    let isComponentMounted = true;
    
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      cameraRef.current.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };

    requestAnimationFrame(() => {
      if (!isComponentMounted || !containerRef.current) {
        console.warn('组件已卸载或容器不存在');
        return;
      }

      console.log('延迟初始化后的容器尺寸:', {
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight
      });

      try {
        // 再次检查容器是否存在
        if (!containerRef.current) {
          throw new Error('容器元素不存在');
        }

        const containerWidth = containerRef.current.clientWidth;
        const containerHeight = containerRef.current.clientHeight;

        if (containerWidth === 0 || containerHeight === 0) {
          throw new Error(`容器尺寸无效: ${containerWidth}x${containerHeight}`);
        }

        // 初始化场景
        console.log('初始化场景');
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf0f0f0);
        sceneRef.current = scene;

        // 初始化相机
        console.log('初始化相机');
        const camera = new THREE.PerspectiveCamera(
          75,
          containerWidth / containerHeight,
          0.1,
          1000
        );
        console.log('容器尺寸:', {
          width: containerWidth,
          height: containerHeight
        });
        camera.position.set(10, 10, 10);
        camera.lookAt(0, 0, 0);
        cameraRef.current = camera;

        // 初始化渲染器
        console.log('初始化渲染器');
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(containerWidth, containerHeight);
        renderer.shadowMap.enabled = true;
        containerRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // 添加轨道控制器
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controlsRef.current = controls;

        // 添加地面
        const groundGeometry = new THREE.PlaneGeometry(50, 50);
        const groundMaterial = new THREE.MeshStandardMaterial({ 
          color: 0x999999,
          roughness: 0.8 
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        scene.add(ground);

        // 添加环境光
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        // 添加平行光
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5);
        directionalLight.castShadow = true;
        scene.add(directionalLight);

        // 添加网格辅助线
        const gridHelper = new THREE.GridHelper(50, 50);
        scene.add(gridHelper);

        // 添加坐标轴辅助线
        const axesHelper = new THREE.AxesHelper(5);
        scene.add(axesHelper);

        // 初始化LNG站场景
        stationRef.current = new LNGStation(containerRef.current);

        // 动画循环
        const animate = () => {
          requestAnimationFrame(animate);
          if (controlsRef.current) {
            controlsRef.current.update();
          }
          if (rendererRef.current && sceneRef.current && cameraRef.current) {
            rendererRef.current.render(sceneRef.current, cameraRef.current);
          }
        };
        console.log('启动动画循环');
        animate();

        window.addEventListener('resize', handleResize);

      } catch (error) {
        console.error('3D场景初始化失败:', error);
      }
    });

    return () => {
      console.log('组件清理');
      isComponentMounted = false;
      window.removeEventListener('resize', handleResize);
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
      if (stationRef.current) {
        stationRef.current.dispose();
      }
    };
  }, []);

  console.log('渲染DOM');
  return (
    <Box sx={{ 
      height: 'calc(100vh - 32px)',
      p: 3,
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Box ref={containerRef} sx={{ 
        flex: 1,
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: 3,
        bgcolor: '#ffffff',
        width: '100%',
        position: 'relative',
        minHeight: '400px', // 添加最小高度
        minWidth: '600px',  // 添加最小宽度
      }} />
    </Box>
  );
};

export default InspectionView;