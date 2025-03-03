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
  Typography
} from '@mui/material';
import { ProcessArea, Device } from '../types/device';

const DeviceManagement: React.FC = () => {
  const [currentArea, setCurrentArea] = useState<ProcessArea>(ProcessArea.INLET);
  const [devices, setDevices] = useState<Device[]>([]);

  useEffect(() => {
    console.log('DeviceManagement 组件已挂载');
    console.log('当前工艺区域:', currentArea);
    fetchDevices(currentArea);
  }, [currentArea]);

  const fetchDevices = async (area: ProcessArea) => {
    console.log('开始获取设备数据, 区域:', area);
    try {
      const response = await fetch(`http://localhost:3000/devices?area=${area}`);
      console.log('API响应:', response);
      const data = await response.json();
      console.log('获取到的设备数据:', data);
      setDevices(data);
    } catch (error) {
      console.error('获取设备数据失败:', error);
    }
  };

  const handleAreaChange = (_: React.SyntheticEvent, newValue: ProcessArea) => {
    setCurrentArea(newValue);
  };

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>设备管理</Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={currentArea} onChange={handleAreaChange}>
          <Tab label="进站区" value={ProcessArea.INLET} />
          <Tab label="过滤区" value={ProcessArea.FILTRATION} />
          <Tab label="计量区" value={ProcessArea.METERING} />
          <Tab label="调压区" value={ProcessArea.PRESSURE_REGULATION} />
          <Tab label="出站区" value={ProcessArea.OUTLET} />
        </Tabs>
      </Box>

      <TableContainer component={Paper}>
        <Table>
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
            {devices.map((device) => (
              <TableRow key={device._id}>
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
      </TableContainer>
    </Box>
  );
};

export default DeviceManagement; 