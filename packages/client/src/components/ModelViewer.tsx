import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Stage } from '@react-three/drei';
import { Box, CircularProgress, Grid, Paper, Typography, Chip } from '@mui/material';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { useLoader } from '@react-three/fiber';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
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

// 默认设备配置
const DEFAULT_DEVICE = {
  id: 'BV301113',
  name: '杭甬杭湖站区主干线气液联动阀',
  model: '/models/factory_emergency_telephone/scene.gltf'
};

const ModelViewer: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [realTimeData, setRealTimeData] = useState<DeviceRealTimeData | null>(null);
  const [historicalData, setHistoricalData] = useState<DeviceRealTimeData[]>([]);

  useEffect(() => {
    const fetchRealTimeData = async () => {
      try {
        console.log('开始获取实时数据...');
        const response = await fetch(`http://localhost:3000/alerts/real-time?deviceId=${DEFAULT_DEVICE.id}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        console.log('获取到的实时数据:', data);
        
        if (data && data.length > 0) {
          setRealTimeData(data[0]); // 获取最新一条数据
          setHistoricalData(prev => {
            const newData = [...prev, data[0]];
            return newData.slice(-30); // 保留最近30条数据
          });
        }
        
        setLoading(false); // 无论是否有数据，都设置 loading 为 false
      } catch (error) {
        console.error('获取实时数据失败:', error);
        setLoading(false); // 发生错误时也要设置 loading 为 false
        setTimeout(fetchRealTimeData, 5000);
      }
    };

    console.log('组件挂载，开始首次获取数据');
    fetchRealTimeData();
    const interval = setInterval(fetchRealTimeData, 5000);
    return () => clearInterval(interval);
  }, []);

  // 添加调试信息
  console.log('当前状态:', {
    loading,
    hasRealTimeData: !!realTimeData,
    historicalDataCount: historicalData.length
  });

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>加载中...</Typography>
      </Box>
    );
  }

  // 如果没有数据，显示提示信息
  if (!realTimeData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography>暂无设备数据</Typography>
      </Box>
    );
  }

  const getStatusColor = (value: number, type: string) => {
    switch (type) {
      case 'temperature':
        return value > 70 ? 'error' : value > 50 ? 'warning' : 'success';
      case 'pressure':
        return value > 7 ? 'error' : value > 6 ? 'warning' : 'success';
      case 'gasConcentration':
        return value > 4 ? 'error' : value > 3 ? 'warning' : 'success';
      default:
        return 'default';
    }
  };

  return (
    <Grid container spacing={2} sx={{ height: '100vh', p: 2 }}>
      {/* 左侧数据面板 */}
      <Grid item xs={3}>
        <Paper sx={{ p: 2, height: '100%', overflow: 'auto' }}>
          <Typography variant="h6" gutterBottom>{DEFAULT_DEVICE.name}</Typography>
          {realTimeData && (
            <Box sx={{ mt: 2 }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>设备状态</Typography>
                <Chip 
                  label={realTimeData.valveStatus ? '开启' : '关闭'}
                  color={realTimeData.valveStatus ? 'success' : 'error'}
                  sx={{ mr: 1 }}
                />
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>实时参数</Typography>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <Chip 
                      label={`温度: ${realTimeData.temperature}°C`}
                      color={getStatusColor(realTimeData.temperature || 0, 'temperature')}
                      sx={{ mr: 1, mb: 1 }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Chip 
                      label={`压力: ${realTimeData.pressure} MPa`}
                      color={getStatusColor(realTimeData.pressure || 0, 'pressure')}
                      sx={{ mr: 1, mb: 1 }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Chip 
                      label={`流量: ${realTimeData.flowRate} m³/h`}
                      color="primary"
                      sx={{ mr: 1, mb: 1 }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Chip 
                      label={`气体浓度: ${realTimeData.gasConcentration}%`}
                      color={getStatusColor(realTimeData.gasConcentration || 0, 'gasConcentration')}
                      sx={{ mr: 1 }}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Box>
          )}
        </Paper>
      </Grid>

      {/* 中间3D模型 - 减小高度 */}
      <Grid item xs={6}>
        <Paper sx={{ height: '40vh', overflow: 'hidden', mb: 2 }}>
          <Canvas camera={{ position: [0, 10, 0], fov: 50, rotation: [-Math.PI / 2, 0, 0] }}>
            <Stage 
              environment="city" 
              intensity={0.6}
              preset="rembrandt"
            >
              <Model path={DEFAULT_DEVICE.model} />
            </Stage>
            <OrbitControls 
              autoRotate={false}
              enableZoom={true}
              minPolarAngle={0}
              maxPolarAngle={Math.PI / 2}
            />
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
          </Canvas>
        </Paper>
        
        {/* 模型下方放置图表 */}
        <Paper sx={{ height: 'calc(60vh - 32px)', p: 2, overflow: 'hidden' }}>
          <Typography variant="h6" gutterBottom>趋势图表</Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Box sx={{ height: '25vh' }}>
                <Typography variant="subtitle2" align="center">温度趋势</Typography>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="timestamp"
                      tickFormatter={(time) => new Date(time).toLocaleTimeString()}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(label) => new Date(label).toLocaleString()}
                      formatter={(value) => [`${value}°C`, '温度']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="temperature" 
                      name="温度" 
                      stroke="#8884d8" 
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ height: '25vh' }}>
                <Typography variant="subtitle2" align="center">压力趋势</Typography>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="timestamp"
                      tickFormatter={(time) => new Date(time).toLocaleTimeString()}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(label) => new Date(label).toLocaleString()}
                      formatter={(value) => [`${value} MPa`, '压力']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="pressure" 
                      name="压力" 
                      stroke="#82ca9d" 
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ height: '25vh' }}>
                <Typography variant="subtitle2" align="center">流量趋势</Typography>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="timestamp"
                      tickFormatter={(time) => new Date(time).toLocaleTimeString()}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(label) => new Date(label).toLocaleString()}
                      formatter={(value) => [`${value} m³/h`, '流量']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="flowRate" 
                      name="流量" 
                      stroke="#ffc658" 
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ height: '25vh' }}>
                <Typography variant="subtitle2" align="center">气体浓度趋势</Typography>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="timestamp"
                      tickFormatter={(time) => new Date(time).toLocaleTimeString()}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(label) => new Date(label).toLocaleString()}
                      formatter={(value) => [`${value}%`, '气体浓度']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="gasConcentration" 
                      name="气体浓度" 
                      stroke="#ff7300" 
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Grid>

      {/* 右侧信息面板 */}
      <Grid item xs={3}>
        <Paper sx={{ p: 2, height: '100%', overflow: 'auto' }}>
          <Typography variant="h6" gutterBottom>设备信息</Typography>
          <Typography variant="body2" gutterBottom>设备编号：{DEFAULT_DEVICE.id}</Typography>
          <Typography variant="body2" gutterBottom>设备类型：电动球阀</Typography>
          <Typography variant="body2" gutterBottom>安装位置：杭嘉线来气越站</Typography>
          <Typography variant="body2" gutterBottom>规格型号：300*250</Typography>
          {/* 可以添加更多设备信息 */}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ModelViewer; 