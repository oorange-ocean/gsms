import React, { useState } from 'react';
import { Box, Paper, Typography, Tooltip, Dialog, DialogTitle, DialogContent, List, ListItem, ListItemText } from '@mui/material';
import { riskData, RiskNode } from '../types/risk';

const RiskAnalysis: React.FC = () => {
  const [selectedRisk, setSelectedRisk] = useState<RiskNode | null>(null);

  const handleRiskClick = (risk: RiskNode) => {
    setSelectedRisk(risk);
  };

  const handleClose = () => {
    setSelectedRisk(null);
  };

  return (
    <Box sx={{ p: 3, height: 'calc(100vh - 32px)' }}>
      <Typography variant="h4" sx={{ mb: 4 }}>风险分析</Typography>
      
      <Box sx={{ 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 'calc(100% - 100px)'
      }}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4,
            width: '80%',
            height: '80%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative'
          }}
        >
          {/* 中心节点 */}
          <Paper
            elevation={2}
            sx={{
              p: 2,
              backgroundColor: '#1a237e',
              color: 'white',
              borderRadius: '50%',
              width: 150,
              height: 150,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              cursor: 'pointer',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 1
            }}
          >
            <Typography>{riskData.title}</Typography>
          </Paper>

          {/* 风险节点 */}
          {riskData.children?.map((risk, index) => {
            const angle = (index * 360) / riskData.children!.length;
            const radius = 250;
            const x = Math.cos((angle * Math.PI) / 180) * radius;
            const y = Math.sin((angle * Math.PI) / 180) * radius;

            return (
              <Tooltip key={risk.id} title={risk.description}>
                <Paper
                  elevation={2}
                  onClick={() => handleRiskClick(risk)}
                  sx={{
                    p: 2,
                    backgroundColor: '#2196F3',
                    color: 'white',
                    borderRadius: '50%',
                    width: 120,
                    height: 120,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    cursor: 'pointer',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: '#1976D2',
                      transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(1.1)`,
                    }
                  }}
                >
                  <Typography>{risk.title}</Typography>
                </Paper>
              </Tooltip>
            );
          })}
        </Paper>
      </Box>

      {/* 风险详情对话框 */}
      <Dialog open={!!selectedRisk} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedRisk?.title}</DialogTitle>
        <DialogContent>
          <Typography paragraph>{selectedRisk?.description}</Typography>
          <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>预防措施：</Typography>
          <List>
            {selectedRisk?.measures?.map((measure, index) => (
              <ListItem key={index}>
                <ListItemText primary={`${index + 1}. ${measure}`} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default RiskAnalysis; 