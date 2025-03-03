import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Stage } from '@react-three/drei';
import { Box, CircularProgress } from '@mui/material';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { useLoader } from '@react-three/fiber';

interface ModelProps {
  path: string;
}

function Model({ path }: ModelProps) {
  const { scene } = useGLTF(path);
  return <primitive object={scene} />;
}

function OBJModel({ path }: ModelProps) {
  const materials = useLoader(MTLLoader, path.replace('.obj', '.mtl'));
  const obj = useLoader(OBJLoader, path, (loader) => {
    materials.preload();
    loader.setMaterials(materials);
  });
  
  return <primitive object={obj} />;
}

const ModelViewer: React.FC = () => {
  const [models, setModels] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 这里应该从后端获取模型列表
    // 暂时使用硬编码的路径
    setModels([
      '/models/factory_emergency_telephone/scene.gltf',
      '/models/factory_emergency_telephone/scene.gltf',
      // 添加更多模型路径
    ]);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100vh', width: '100%' }}>
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        <Stage environment="city" intensity={0.6}>
          {models.map((modelPath, index) => (
            modelPath.endsWith('.obj') ? 
              <OBJModel key={index} path={modelPath} /> :
              <Model key={index} path={modelPath} />
          ))}
        </Stage>
        <OrbitControls autoRotate />
      </Canvas>
    </Box>
  );
}

export default ModelViewer; 