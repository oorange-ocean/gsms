import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Alert,
  Stack,
  Grid
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { AlertRecord, AlertLevel } from '../types/alert';

// 预警级别对应的样式
const alertLevelConfig: Record<AlertLevel, { color: string; pulseColor: string }> = {
  [AlertLevel.NORMAL]: { 
    color: '#4CAF50',
    pulseColor: 'rgba(76, 175, 80, 0.3)'
  },
  [AlertLevel.WARNING]: { 
    color: '#FF9800',
    pulseColor: 'rgba(255, 152, 0, 0.3)'
  },
  [AlertLevel.DANGER]: { 
    color: '#F44336',
    pulseColor: 'rgba(244, 67, 54, 0.3)'
  },
  [AlertLevel.CRITICAL]: { 
    color: '#D32F2F',
    pulseColor: 'rgba(211, 47, 47, 0.3)'
  }
};

// 阀门SVG组件
const ValveComponent: React.FC<{
  alert: AlertRecord;
  onClick: () => void;
}> = ({ alert, onClick }) => {
  const config = alertLevelConfig[alert.alertLevel];
  
  return (
    <Box
      sx={{
        position: 'relative',
        width: 200,
        height: 200,
        cursor: 'pointer',
        '&:hover': {
          transform: 'scale(1.05)',
          transition: 'transform 0.2s'
        }
      }}
      onClick={onClick}
    >
      {/* 脉冲动画效果 */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 160,
          height: 160,
          borderRadius: '50%',
          backgroundColor: config.pulseColor,
          animation: alert.alertLevel !== AlertLevel.NORMAL ? 'pulse 2s infinite' : 'none',
          '@keyframes pulse': {
            '0%': {
              transform: 'translate(-50%, -50%) scale(0.95)',
              opacity: 0.5,
            },
            '70%': {
              transform: 'translate(-50%, -50%) scale(1.1)',
              opacity: 0.3,
            },
            '100%': {
              transform: 'translate(-50%, -50%) scale(0.95)',
              opacity: 0.5,
            },
          },
        }}
      />
      
      {/* 阀门SVG */}
      <svg width="200" height="200" viewBox="0 0 200 200">
        {/* 管道 */}
        <path
          d="M40 100 H160"
          stroke="#666"
          strokeWidth="20"
          fill="none"
        />
        
        {/* 阀门主体 */}
        <circle
          cx="100"
          cy="100"
          r="40"
          fill={config.color}
          stroke="#444"
          strokeWidth="4"
        />
        
        {/* 阀门手轮 */}
        <circle
          cx="100"
          cy="100"
          r="30"
          fill="none"
          stroke="#444"
          strokeWidth="4"
        />
        
        {/* 手轮辐条 */}
        {[0, 45, 90, 135].map((angle) => (
          <line
            key={angle}
            x1="100"
            y1="100"
            x2={100 + Math.cos(angle * Math.PI / 180) * 30}
            y2={100 + Math.sin(angle * Math.PI / 180) * 30}
            stroke="#444"
            strokeWidth="4"
          />
        ))}
      </svg>

      {/* 阀门信息 */}
      <Box sx={{ textAlign: 'center', mt: 1 }}>
        <Typography variant="subtitle2" sx={{ color: config.color, fontWeight: 'bold' }}>
          {alert.device.deviceCode}
        </Typography>
        <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
          {alert.alertType}: {alert.currentValue}
        </Typography>
      </Box>
    </Box>
  );
};

const SafetyAlert: React.FC = () => {
  const [alerts, setAlerts] = useState<AlertRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAlert, setSelectedAlert] = useState<AlertRecord | null>(null);
  const [processNote, setProcessNote] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  // 获取预警记录
  const fetchAlerts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3000/alerts/records?processed=false');
      if (!response.ok) throw new Error('获取预警记录失败');
      const data = await response.json();
      console.log('获取到的预警数据:', data); // 添加日志
      setAlerts(data);
    } catch (err) {
      console.error('获取预警记录错误:', err); // 添加错误日志
      setError(err instanceof Error ? err.message : '未知错误');
    } finally {
      setLoading(false);
    }
  };

  // 处理预警
  const handleProcessAlert = async () => {
    if (!selectedAlert) return;
    try {
      const response = await fetch(`http://localhost:3000/alerts/records/${selectedAlert._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ processNote })
      });
      if (!response.ok) throw new Error('处理预警失败');
      await fetchAlerts();
      setDialogOpen(false);
      setProcessNote('');
      setSelectedAlert(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知错误');
    }
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 30000);
    return () => clearInterval(interval);
  }, []);

  // 过滤预警记录
  const filteredAlerts = useMemo(() => {
    if (!alerts || alerts.length === 0) return [];
    return alerts.filter(alert => 
      alert?.deviceId?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [alerts, searchTerm]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h6">安全预警监控</Typography>
        <IconButton onClick={fetchAlerts} size="small">
          <RefreshIcon />
        </IconButton>
      </Stack>

      <TextField
        size="small"
        placeholder="搜索设备编号或名称..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
        }}
        sx={{ mb: 2 }}
      />

      {filteredAlerts.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
          <Typography color="text.secondary">暂无预警</Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredAlerts.map((alert) => (
            <Grid item key={alert._id}>
              <ValveComponent
                alert={{
                  ...alert,
                  device: {
                    _id: alert.deviceId,
                    deviceCode: alert.deviceId,
                    name: alert.deviceId, // 暂时使用设备ID作为名称
                    processArea: '未知区域'
                  }
                }}
                onClick={() => {
                  setSelectedAlert(alert);
                  setDialogOpen(true);
                }}
              />
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>处理预警 - {selectedAlert?.deviceId}</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              预警类型: {selectedAlert?.alertType}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              当前值: {selectedAlert?.currentValue} (阈值: {selectedAlert?.threshold})
            </Typography>
            <Typography variant="body2" color="text.secondary">
              时间: {selectedAlert?.timestamp && new Date(selectedAlert.timestamp).toLocaleString()}
            </Typography>
          </Box>
          <TextField
            autoFocus
            margin="dense"
            label="处理说明"
            fullWidth
            multiline
            rows={4}
            value={processNote}
            onChange={(e) => setProcessNote(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>取消</Button>
          <Button onClick={handleProcessAlert} variant="contained">
            确认处理
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SafetyAlert; 