import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import { LNGStation } from '../scenes/LNGStation';

const InspectionView: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stationRef = useRef<LNGStation | null>(null);

  useEffect(() => {
    if (!containerRef.current) {
      console.warn('容器元素未找到');
      return;
    }

    // 初始化LNG站场景
    stationRef.current = new LNGStation(containerRef.current);

    const handleResize = () => {
      if (!containerRef.current || !stationRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      stationRef.current.resize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (stationRef.current) {
        stationRef.current.dispose();
      }
    };
  }, []);

  return (
    <Box sx={{ 
      height: 'calc(100vh - 32px)',
      p: 3,
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Box ref={containerRef} sx={{ 
        flex: 1,
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: 3,
        bgcolor: '#ffffff',
        width: '100%',
        position: 'relative',
        minHeight: '400px',
        minWidth: '600px',
      }} />
    </Box>
  );
};

export default InspectionView;