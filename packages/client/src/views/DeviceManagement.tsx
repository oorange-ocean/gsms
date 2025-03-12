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
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { ProcessArea, Device, PressureClass } from '../types/device';

const DeviceManagement: React.FC = () => {
  const [currentArea, setCurrentArea] = useState<ProcessArea>(ProcessArea.INLET);
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [formData, setFormData] = useState({
    deviceCode: '',
    name: '',
    pressureClass: PressureClass.CLASS150,
    specification: '',
    quickLink: '',
    processArea: ProcessArea.INLET
  });

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
    setFormData(prev => ({
      ...prev,
      processArea: newValue
    }));
  };

  // 添加设备
  const handleAdd = async () => {
    try {
      const response = await fetch('http://localhost:3000/devices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (!response.ok) throw new Error('添加设备失败');
      await fetchDevices(currentArea);
      setDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('添加设备失败:', error);
    }
  };

  // 更新设备
  const handleUpdate = async () => {
    if (!selectedDevice?._id) return;
    try {
      const response = await fetch(`http://localhost:3000/devices/${selectedDevice._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (!response.ok) throw new Error('更新设备失败');
      await fetchDevices(currentArea);
      setDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('更新设备失败:', error);
    }
  };

  // 删除设备
  const handleDelete = async () => {
    if (!selectedDevice?._id) return;
    try {
      const response = await fetch(`http://localhost:3000/devices/${selectedDevice._id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('删除设备失败');
      await fetchDevices(currentArea);
      setDeleteDialogOpen(false);
      setSelectedDevice(null);
    } catch (error) {
      console.error('删除设备失败:', error);
    }
  };

  // 重置表单
  const resetForm = () => {
    setFormData({
      deviceCode: '',
      name: '',
      pressureClass: PressureClass.CLASS150,
      specification: '',
      quickLink: '',
      processArea: currentArea
    });
    setSelectedDevice(null);
  };

  // 打开编辑对话框
  const handleEdit = (device: Device) => {
    setSelectedDevice(device);
    setFormData({
      deviceCode: device.deviceCode,
      name: device.name,
      pressureClass: device.pressureClass,
      specification: device.specification,
      quickLink: device.quickLink,
      processArea: device.processArea
    });
    setDialogOpen(true);
  };

  // 处理表单输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name as string]: value
    }));
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: 'calc(100vh - 32px)', // 减去 padding
      overflow: 'hidden'
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">设备管理</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            resetForm();
            setDialogOpen(true);
          }}
        >
          添加设备
        </Button>
      </Box>
      
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

      {/* 添加/编辑设备对话框 */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedDevice ? '编辑设备' : '添加设备'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              name="deviceCode"
              label="设备编号"
              value={formData.deviceCode}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              name="name"
              label="设备名称"
              value={formData.name}
              onChange={handleInputChange}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>压力等级</InputLabel>
              <Select
                name="pressureClass"
                value={formData.pressureClass}
                onChange={(e) => handleInputChange(e as React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>)}
                label="压力等级"
              >
                {Object.values(PressureClass).map(pc => (
                  <MenuItem key={pc} value={pc}>{pc}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              name="specification"
              label="规格尺寸"
              value={formData.specification}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              name="quickLink"
              label="快速链接"
              value={formData.quickLink}
              onChange={handleInputChange}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>取消</Button>
          <Button onClick={selectedDevice ? handleUpdate : handleAdd} variant="contained">
            {selectedDevice ? '更新' : '添加'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* 删除确认对话框 */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>确认删除</DialogTitle>
        <DialogContent>
          确定要删除设备 {selectedDevice?.name} 吗？此操作不可撤销。
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>取消</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            删除
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DeviceManagement; 