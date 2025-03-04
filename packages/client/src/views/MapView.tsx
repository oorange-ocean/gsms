import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { Box, Typography } from '@mui/material';
import 'mapbox-gl/dist/mapbox-gl.css';

// Mapbox access token
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const MapView: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapInitialized, setMapInitialized] = useState(false);

  // 设置地图大小的函数
  const resizeMap = () => {
    if (map.current) {
      map.current.resize();
      // 添加调试信息
      if (mapContainer.current) {
        console.log('Map container dimensions:', {
          width: mapContainer.current.offsetWidth,
          height: mapContainer.current.offsetHeight,
          parentWidth: mapContainer.current.parentElement?.offsetWidth,
          parentHeight: mapContainer.current.parentElement?.offsetHeight
        });
      }
    }
  };

  useEffect(() => {
    // 延迟初始化地图，确保DOM已完全渲染
    const timer = setTimeout(() => {
      if (!mapContainer.current) return;

      // 记录初始化前的容器尺寸
      console.log('Initial container dimensions:', {
        width: mapContainer.current.offsetWidth,
        height: mapContainer.current.offsetHeight
      });

      // 大连 LNG 接收站的大致坐标
      const dalianLNG = {
        lng: 121.8154,
        lat: 39.0456,
        zoom: 14
      };

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/satellite-streets-v12',
        center: [dalianLNG.lng, dalianLNG.lat],
        zoom: dalianLNG.zoom
      });

      // 添加导航控件
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      map.current.addControl(new mapboxgl.ScaleControl(), 'bottom-left');

      // 添加标记点
      new mapboxgl.Marker()
        .setLngLat([dalianLNG.lng, dalianLNG.lat])
        .setPopup(new mapboxgl.Popup().setHTML('<h3>国家管网集团辽宁大连LNG接收站</h3>'))
        .addTo(map.current);

      // 监听地图加载完成事件
      map.current.on('load', () => {
        setMapInitialized(true);
        
        // 立即调整一次大小
        resizeMap();
        
        // 延迟500ms后再次调整大小
        setTimeout(() => {
          resizeMap();
        }, 500);
      });

      // 添加窗口大小变化的监听器
      window.addEventListener('resize', resizeMap);
    }, 300);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', resizeMap);
      map.current?.remove();
    };
  }, []);

  // 当容器可见后调整地图大小
  useEffect(() => {
    if (mapInitialized) {
      resizeMap();
    }
  }, [mapInitialized]);

  return (
    <Box sx={{ 
      p: 3, 
      height: 'calc(100vh - 32px)', 
      overflow: 'hidden',
      width: '100%',
      minWidth: '800px', // 添加最小宽度
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Typography variant="h4" sx={{ mb: 3 }}>二维地图</Typography>
      <Box 
        ref={mapContainer} 
        sx={{ 
          flex: 1,
          width: '100%',
          minWidth: '800px',
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: 3,
          position: 'relative' // 确保定位上下文正确
        }} 
      />
    </Box>
  );
};

export default MapView;