import React, { useState, useEffect } from 'react';
import {
  Box,
  Tab,
  Tabs,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Link,
  Typography,
  CircularProgress
} from '@mui/material';
import { ProcessArea, Device } from '../types/device';

const DeviceManagement: React.FC = () => {
  const [currentArea, setCurrentArea] = useState<ProcessArea>(ProcessArea.INLET);
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('DeviceManagement 组件已挂载');
    console.log('当前工艺区域:', currentArea);
    fetchDevices(currentArea);
  }, [currentArea]);

  const fetchDevices = async (area: ProcessArea) => {
    setLoading(true);
    console.log('开始获取设备数据, 区域:', area);
    try {
      const response = await fetch(`http://localhost:3000/devices?area=${area}`);
      console.log('API响应:', response);
      const data = await response.json();
      console.log('获取到的设备数据:', data);
      setDevices(data);
    } catch (error) {
      console.error('获取设备数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAreaChange = (_: React.SyntheticEvent, newValue: ProcessArea) => {
    setCurrentArea(newValue);
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: 'calc(100vh - 32px)', // 减去 padding
      overflow: 'hidden'
    }}>
      <Typography variant="h4" sx={{ mb: 3, flexShrink: 0 }}>设备管理</Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3, flexShrink: 0 }}>
        <Tabs 
          value={currentArea} 
          onChange={handleAreaChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="进站区" value={ProcessArea.INLET} />
          <Tab label="过滤区" value={ProcessArea.FILTRATION} />
          <Tab label="计量区" value={ProcessArea.METERING} />
          <Tab label="调压区" value={ProcessArea.PRESSURE_REGULATION} />
          <Tab label="出站区" value={ProcessArea.OUTLET} />
        </Tabs>
      </Box>

      <TableContainer 
        component={Paper} 
        sx={{ 
          flex: 1,
          overflow: 'auto',
          position: 'relative',
          minHeight: 200 // 确保即使没有数据也有最小高度
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>设备编号</TableCell>
              <TableCell>名称</TableCell>
              <TableCell>压力等级</TableCell>
              <TableCell>规格尺寸</TableCell>
              <TableCell>快速跳转</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!loading && devices.map((device) => (
              <TableRow 
                key={device._id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell>{device.deviceCode}</TableCell>
                <TableCell>{device.name}</TableCell>
                <TableCell>{device.pressureClass}</TableCell>
                <TableCell>{device.specification}</TableCell>
                <TableCell>
                  <Link href={device.quickLink} target="_blank" rel="noopener">
                    查看监控
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {loading && (
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}>
            <CircularProgress />
          </Box>
        )}
        
        {!loading && devices.length === 0 && (
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            color: 'text.secondary'
          }}>
            <Typography>该区域暂无设备数据</Typography>
          </Box>
        )}
      </TableContainer>
    </Box>
  );
};

export default DeviceManagement; 