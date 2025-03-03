import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Tabs,
  Tab,
  Chip,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Alert,
  Stack
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Check as CheckIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { AlertRecord, AlertLevel, AlertType } from '../types/alert';
import { Device, ProcessArea } from '../types/device';

// 预警级别对应的样式
const alertLevelConfig: Record<AlertLevel, { color: string; severity: 'success' | 'warning' | 'error' }> = {
  [AlertLevel.NORMAL]: { color: '#4CAF50', severity: 'success' },
  [AlertLevel.WARNING]: { color: '#FF9800', severity: 'warning' },
  [AlertLevel.DANGER]: { color: '#F44336', severity: 'error' },
  [AlertLevel.CRITICAL]: { color: '#D32F2F', severity: 'error' }
};

const SafetyAlert: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
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
      const processed = tabValue === 1;
      const response = await fetch(`http://localhost:3000/alerts/records?processed=${processed}`);
      if (!response.ok) throw new Error('获取预警记录失败');
      const data = await response.json();
      setAlerts(data);
    } catch (err) {
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
  }, [tabValue]);

  // 过滤预警记录
  const filteredAlerts = alerts.filter(alert => 
    alert.device.deviceCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alert.device.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h6">安全预警</Typography>
        <IconButton onClick={() => fetchAlerts()} size="small">
          <RefreshIcon />
        </IconButton>
      </Stack>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
          <Tab label="未处理预警" />
          <Tab label="已处理预警" />
        </Tabs>
      </Box>

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

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper} sx={{ flex: 1 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>时间</TableCell>
              <TableCell>设备编号</TableCell>
              <TableCell>设备名称</TableCell>
              <TableCell>预警类型</TableCell>
              <TableCell>预警级别</TableCell>
              <TableCell>当前值</TableCell>
              <TableCell>阈值</TableCell>
              {tabValue === 0 && <TableCell>操作</TableCell>}
              {tabValue === 1 && <TableCell>处理说明</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : filteredAlerts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  暂无预警记录
                </TableCell>
              </TableRow>
            ) : (
              filteredAlerts.map((alert) => (
                <TableRow key={alert._id}>
                  <TableCell>{new Date(alert.timestamp).toLocaleString()}</TableCell>
                  <TableCell>{alert.device.deviceCode}</TableCell>
                  <TableCell>{alert.device.name}</TableCell>
                  <TableCell>{alert.alertType}</TableCell>
                  <TableCell>
                    <Chip
                      label={alert.alertLevel}
                      size="small"
                      sx={{
                        bgcolor: alertLevelConfig[alert.alertLevel].color,
                        color: 'white'
                      }}
                    />
                  </TableCell>
                  <TableCell>{alert.currentValue}</TableCell>
                  <TableCell>{alert.threshold}</TableCell>
                  {tabValue === 0 ? (
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => {
                          setSelectedAlert(alert);
                          setDialogOpen(true);
                        }}
                      >
                        <CheckIcon />
                      </IconButton>
                    </TableCell>
                  ) : (
                    <TableCell>{alert.processNote}</TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>处理预警</DialogTitle>
        <DialogContent>
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
            确认
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SafetyAlert; 