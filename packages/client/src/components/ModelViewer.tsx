import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Stage } from '@react-three/drei';
import { Box, CircularProgress, Grid, Paper, Typography } from '@mui/material';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { useLoader } from '@react-three/fiber';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { DeviceRealTimeData } from '../types/alert';

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
  const [realTimeData, setRealTimeData] = useState<DeviceRealTimeData[]>([]);
  const [historicalData, setHistoricalData] = useState<DeviceRealTimeData[]>([]);

  useEffect(() => {
    // 这里应该从后端获取模型列表
    // 暂时使用硬编码的路径
    setModels([
      '/models/factory_emergency_telephone/scene.gltf',
      '/models/factory_emergency_telephone/scene.gltf',
      // 添加更多模型路径
    ]);
    setLoading(false);

    // 获取实时数据
    const fetchRealTimeData = async () => {
      try {
        const response = await fetch('http://localhost:3000/alerts/real-time', {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setRealTimeData(data);
        setHistoricalData(prev => {
          const newData = [...prev, ...data];
          return newData.slice(-50); // 只保留最近50条数据
        });
      } catch (error) {
        console.error('获取实时数据失败:', error);
        // 5秒后重试
        setTimeout(fetchRealTimeData, 5000);
      }
    };

    fetchRealTimeData();
    const interval = setInterval(fetchRealTimeData, 5000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Grid container spacing={2} sx={{ height: '100vh', p: 2 }}>
      {/* 左侧数据面板 */}
      <Grid item xs={3}>
        <Paper sx={{ p: 2, height: '100%', overflow: 'auto' }}>
          <Typography variant="h6" gutterBottom>实时数据</Typography>
          {realTimeData.map((data, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Typography variant="subtitle2">{data.deviceId}</Typography>
              <Typography>温度: {data.temperature}°C</Typography>
              <Typography>压力: {data.pressure} MPa</Typography>
              <Typography>流量: {data.flowRate} m³/h</Typography>
              <Typography>阀门状态: {data.valveStatus ? '开启' : '关闭'}</Typography>
              <Typography>气体浓度: {data.gasConcentration}%</Typography>
            </Box>
          ))}
        </Paper>
      </Grid>

      {/* 中间3D模型 */}
      <Grid item xs={6}>
        <Box sx={{ height: '100%', width: '100%' }}>
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
      </Grid>

      {/* 右侧图表 */}
      <Grid item xs={3}>
        <Paper sx={{ p: 2, height: '100%', overflow: 'auto' }}>
          <Typography variant="h6" gutterBottom>趋势图表</Typography>
          <LineChart width={400} height={300} data={historicalData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="temperature" stroke="#8884d8" />
            <Line type="monotone" dataKey="pressure" stroke="#82ca9d" />
          </LineChart>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default ModelViewer; 