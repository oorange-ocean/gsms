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
  CircularProgress,
  Stack
} from '@mui/material';
import { Warning as WarningIcon } from '@mui/icons-material';
import { EmergencySupply } from '../types/emergency-supply';

const EmergencySupplies: React.FC = () => {
  const [supplies, setSupplies] = useState<EmergencySupply[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSupplies();
  }, []);

  const fetchSupplies = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/emergency-supplies');
      const data = await response.json();
      setSupplies(data);
    } catch (error) {
      console.error('获取应急物资数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        应急物资管理
      </Typography>

      <TableContainer 
        component={Paper} 
        sx={{ 
          flex: 1,
          overflow: 'auto',
          position: 'relative',
          minHeight: 200
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ width: 80 }}>序号</TableCell>
              <TableCell>物资名称</TableCell>
              <TableCell>规格型号</TableCell>
              <TableCell>存放地点</TableCell>
              <TableCell>配置数量</TableCell>
              <TableCell>现存数量</TableCell>
              <TableCell>检定情况</TableCell>
              <TableCell>备注</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!loading && supplies.map((supply, index) => (
              <TableRow 
                key={supply._id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell align="center">{index + 1}</TableCell>
                <TableCell>{supply.name}</TableCell>
                <TableCell>{supply.specification}</TableCell>
                <TableCell>{supply.location}</TableCell>
                <TableCell>{supply.configuredQuantity}</TableCell>
                <TableCell 
                  sx={{
                    backgroundColor: supply.currentQuantity < supply.configuredQuantity 
                      ? 'error.lighter' 
                      : 'inherit',
                    color: supply.currentQuantity < supply.configuredQuantity 
                      ? 'error.main' 
                      : 'inherit'
                  }}
                >
                  <Stack 
                    direction="row" 
                    spacing={1} 
                    alignItems="center"
                  >
                    {supply.currentQuantity < supply.configuredQuantity && (
                      <WarningIcon 
                        color="error" 
                        sx={{ fontSize: 16 }} 
                      />
                    )}
                    <span>{supply.currentQuantity}</span>
                  </Stack>
                </TableCell>
                <TableCell>{supply.inspectionStatus}</TableCell>
                <TableCell>{supply.remarks || '-'}</TableCell>
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
        
        {!loading && supplies.length === 0 && (
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            color: 'text.secondary'
          }}>
            <Typography>暂无应急物资数据</Typography>
          </Box>
        )}
      </TableContainer>
    </Box>
  );
};

export default EmergencySupplies; 