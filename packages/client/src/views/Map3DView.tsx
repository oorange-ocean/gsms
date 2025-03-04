import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { Box, Typography, ToggleButton, ToggleButtonGroup } from '@mui/material';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const Map3DView: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [viewMode, setViewMode] = useState('satellite');

  const resizeMap = () => {
    if (map.current) {
      map.current.resize();
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!mapContainer.current) return;

      const centerPoint = {
        lng: 114.41703647375107,
        lat: 23.10750961303711,
        zoom: 15,
        pitch: 45,
        bearing: -17.6,
        antialias: true
      };

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: viewMode === 'satellite' 
          ? 'mapbox://styles/mapbox/satellite-streets-v12'
          : 'mapbox://styles/mapbox/streets-v12',
        center: [centerPoint.lng, centerPoint.lat],
        zoom: centerPoint.zoom,
        pitch: centerPoint.pitch,
        bearing: centerPoint.bearing,
        antialias: true
      });

      // 添加标记点
      new mapboxgl.Marker()
        .setLngLat([centerPoint.lng, centerPoint.lat])
        .setPopup(new mapboxgl.Popup().setHTML('<h3>惠州LNG接收站</h3>'))
        .addTo(map.current);

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      map.current.addControl(new mapboxgl.ScaleControl(), 'bottom-left');

      // 添加3D建筑图层
      map.current.on('load', () => {
        map.current?.addLayer({
          'id': '3d-buildings',
          'source': 'composite',
          'source-layer': 'building',
          'filter': ['==', 'extrude', 'true'],
          'type': 'fill-extrusion',
          'minzoom': 15,
          'paint': {
            'fill-extrusion-color': '#aaa',
            'fill-extrusion-height': [
              'interpolate', ['linear'], ['zoom'],
              15, 0,
              15.05, ['get', 'height']
            ],
            'fill-extrusion-base': ['get', 'min_height'],
            'fill-extrusion-opacity': 0.6
          }
        });

        setMapInitialized(true);
        resizeMap();
      });

      window.addEventListener('resize', resizeMap);
    }, 300);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', resizeMap);
      map.current?.remove();
    };
  }, [viewMode]);

  const handleViewModeChange = (event: React.MouseEvent<HTMLElement>, newMode: string) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  return (
    <Box sx={{ 
      p: 3, 
      height: 'calc(100vh - 32px)', 
      overflow: 'hidden',
      width: '100%',
      minWidth: '800px',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 3 
      }}>
        <Typography variant="h4">三维地图</Typography>
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={handleViewModeChange}
          size="small"
        >
          <ToggleButton value="satellite">
            卫星影像
          </ToggleButton>
          <ToggleButton value="streets">
            街道地图
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      
      <Box 
        ref={mapContainer} 
        sx={{ 
          flex: 1,
          width: '100%',
          minWidth: '800px',
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: 3,
          position: 'relative'
        }} 
      />
    </Box>
  );
};

export default Map3DView;