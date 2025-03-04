import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import { Box, Typography, ToggleButton, ToggleButtonGroup, Button, Stack, Snackbar, Alert, Paper, Dialog, DialogTitle, DialogContent } from '@mui/material';
import 'mapbox-gl/dist/mapbox-gl.css';
import * as turf from '@turf/turf';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const Map3DView: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [viewMode, setViewMode] = useState('satellite');
  const drawRef = useRef<MapboxDraw | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [currentTool, setCurrentTool] = useState('');
  const [helpMessage, setHelpMessage] = useState('');
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [selectedScene, setSelectedScene] = useState<Scene | null>(null);
  const [mediaDialogOpen, setMediaDialogOpen] = useState(false);

  const resizeMap = () => {
    if (map.current) {
      map.current.resize();
    }
  };

  const getHelpMessage = (mode: string) => {
    switch (mode) {
      case 'draw_line_string':
        return '点击地图开始绘制线段，继续点击添加节点，双击结束绘制。将显示线段总长度。';
      case 'draw_polygon':
        return '点击地图开始绘制多边形，继续点击添加顶点，点击起点或双击结束绘制。将显示多边形面积。';
      case 'draw_point':
        return '点击地图添加标记点。';
      default:
        return '';
    }
  };

  const handleDrawTool = (mode: string) => {
    if (!drawRef.current || !map.current) return;
    
    drawRef.current.changeMode(mode);
    setCurrentTool(mode);
    const message = getHelpMessage(mode);
    setHelpMessage(message);
    setSnackbarOpen(true);
  };

  const handleClearDraw = () => {
    if (!drawRef.current || !map.current) return;
    
    // 清除所有绘制
    drawRef.current.deleteAll();
    
    // 移除所有弹出窗口
    const popups = document.getElementsByClassName('mapboxgl-popup');
    while (popups[0]) {
      popups[0].remove();
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!mapContainer.current) return;

      const centerPoint = {
        lng: -74.0066,
        lat: 40.7135,
        zoom: 15,
        pitch: 45,
        bearing: -17.6,
        antialias: true
      };

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: viewMode === 'satellite' 
          ? 'mapbox://styles/mapbox/satellite-streets-v12'
          : 'mapbox://styles/mapbox/light-v10',
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

      // 初始化绘图工具
      drawRef.current = new MapboxDraw({
        displayControlsDefault: false,
        controls: {
          polygon: false,
          line_string: false,
          point: false,
          trash: false
        },
        defaultMode: 'simple_select',
        touchEnabled: false,
        boxSelect: false,
        clickBuffer: 4,
        touchBuffer: 25,
        keybindings: true,
        styles: [
          {
            id: 'gl-draw-line',
            type: 'line',
            filter: ['all', ['==', '$type', 'LineString'], ['!=', 'mode', 'static']],
            layout: {
              'line-cap': 'round',
              'line-join': 'round'
            },
            paint: {
              'line-color': '#438EE4',
              'line-dasharray': [0.2, 2],
              'line-width': 4,
              'line-opacity': 0.7
            }
          },
          {
            id: 'gl-draw-line-point',
            type: 'circle',
            filter: ['all', ['==', '$type', 'Point'], ['==', 'meta', 'vertex']],
            paint: {
              'circle-radius': 6,
              'circle-color': '#fff',
              'circle-stroke-color': '#438EE4',
              'circle-stroke-width': 2
            }
          },
          {
            id: 'gl-draw-polygon-fill',
            type: 'fill',
            filter: ['all', ['==', '$type', 'Polygon'], ['!=', 'mode', 'static']],
            paint: {
              'fill-color': '#438EE4',
              'fill-outline-color': '#438EE4',
              'fill-opacity': 0.1
            }
          },
          {
            id: 'gl-draw-polygon-stroke',
            type: 'line',
            filter: ['all', ['==', '$type', 'Polygon'], ['!=', 'mode', 'static']],
            layout: {
              'line-cap': 'round',
              'line-join': 'round'
            },
            paint: {
              'line-color': '#438EE4',
              'line-width': 3,
              'line-opacity': 0.7
            }
          },
          {
            id: 'gl-draw-polygon-vertex',
            type: 'circle',
            filter: ['all', ['==', 'meta', 'vertex'], ['==', '$type', 'Point']],
            paint: {
              'circle-radius': 6,
              'circle-color': '#fff',
              'circle-stroke-color': '#438EE4',
              'circle-stroke-width': 2
            }
          },
          {
            id: 'gl-draw-point-active',
            type: 'circle',
            filter: ['all', ['==', '$type', 'Point'], ['==', 'active', 'true']],
            paint: {
              'circle-radius': 7,
              'circle-color': '#fff',
              'circle-stroke-color': '#438EE4',
              'circle-stroke-width': 3
            }
          }
        ]
      });

      // 添加绘图控件
      map.current.addControl(drawRef.current);

      // 添加测量功能
      map.current.on('draw.create', (e) => {
        const data = e.features[0];
        if (data.geometry.type === 'LineString') {
          const coordinates = data.geometry.coordinates;
          let distance = 0;
          let segments = [];
          
          // 计算每段距离并存储
          for (let i = 0; i < coordinates.length - 1; i++) {
            const from = turf.point(coordinates[i]);
            const to = turf.point(coordinates[i + 1]);
            const segmentDistance = turf.distance(from, to);
            distance += segmentDistance;
            segments.push({
              start: coordinates[i],
              end: coordinates[i + 1],
              distance: segmentDistance
            });
          }

          // 只有当线段有超过2个点（多段）时才显示分段距离
          if (coordinates.length > 2) {
            segments.forEach(segment => {
              const midpoint = [
                (segment.start[0] + segment.end[0]) / 2,
                (segment.start[1] + segment.end[1]) / 2
              ];
              
              new mapboxgl.Popup({
                closeButton: false,
                closeOnClick: false,
                className: 'segment-popup'
              })
                .setLngLat(midpoint)
                .setHTML(`${segment.distance.toFixed(2)} 公里`)
                .addTo(map.current!);
            });
          }

          // 总是显示总距离
          new mapboxgl.Popup({
            closeButton: true,
            closeOnClick: false,
            className: 'total-distance-popup'
          })
            .setLngLat(coordinates[coordinates.length - 1])
            .setHTML(`<strong>总距离: ${distance.toFixed(2)} 公里</strong>`)
            .addTo(map.current!);
        } else if (data.geometry.type === 'Polygon') {
          // 计算面积
          const area = turf.area(data);
          const center = turf.center(data);
          new mapboxgl.Popup()
            .setLngLat(center.geometry.coordinates)
            .setHTML(`面积: ${(area / 1000000).toFixed(2)} 平方公里`)
            .addTo(map.current!);
        }
      });

      // 添加3D建筑图层
      map.current.on('load', () => {
        // 获取所有图层
        const layers = map.current?.getStyle().layers;
        let labelLayerId;
        
        // 查找标签图层
        for (const layer of layers || []) {
          if (layer.type === 'symbol' && layer.layout?.['text-field']) {
            labelLayerId = layer.id;
            break;
          }
        }

        // 确保在添加图层前先检查是否已存在
        if (map.current?.getLayer('3d-buildings')) {
          map.current.removeLayer('3d-buildings');
        }

        map.current?.addLayer({
          'id': '3d-buildings',
          'source': 'composite',
          'source-layer': 'building',
          'filter': ['==', 'extrude', 'true'],
          'type': 'fill-extrusion',
          'minzoom': 15,
          'paint': {
            'fill-extrusion-color': '#ffffff',
            'fill-extrusion-height': [
              'get', 'height'  // 直接使用建筑物高度
            ],
            'fill-extrusion-base': [
              'get', 'min_height'  // 直接使用建筑物基础高度
            ],
            'fill-extrusion-opacity': 0.9
          }
        }, labelLayerId);

        // 添加调试信息
        console.log('3D buildings layer added');
        console.log('Current layers:', map.current?.getStyle().layers);

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

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // 获取场景数据
  useEffect(() => {
    const fetchScenes = async () => {
      try {
        const response = await fetch('http://localhost:3000/scenes');
        const data = await response.json();
        setScenes(data);
      } catch (error) {
        console.error('获取场景数据失败:', error);
      }
    };
    fetchScenes();
  }, []);

  // 场景切换函数
  const handleSceneChange = (scene: Scene) => {
    if (!map.current) return;
    
    map.current.flyTo({
      center: [scene.location.lng, scene.location.lat],
      zoom: scene.location.zoom,
      pitch: scene.location.pitch,
      bearing: scene.location.bearing,
      duration: 2000
    });
    
    setSelectedScene(scene);
    setMediaDialogOpen(true);
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
        mb: 3,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 2,
        p: 2,
        boxShadow: 1
      }}>
        <Typography variant="h5" sx={{ fontWeight: 'medium' }}>三维地图</Typography>
        <Stack direction="row" spacing={3} alignItems="center">
          <Stack 
            direction="row" 
            spacing={1} 
            sx={{ 
              backgroundColor: 'background.paper',
              borderRadius: 1,
              p: 0.5
            }}
          >
            <Button 
              size="small" 
              variant="contained" 
              onClick={() => handleDrawTool('draw_line_string')}
              sx={{ minWidth: '88px' }}
            >
              距离测量
            </Button>
            <Button 
              size="small" 
              variant="contained" 
              onClick={() => handleDrawTool('draw_polygon')}
              sx={{ minWidth: '88px' }}
            >
              面积测量
            </Button>
            <Button 
              size="small" 
              variant="outlined" 
              onClick={() => handleDrawTool('draw_point')}
              sx={{ minWidth: '88px' }}
            >
              绘制点
            </Button>
            <Button 
              size="small" 
              variant="outlined" 
              onClick={() => handleDrawTool('draw_line_string')}
              sx={{ minWidth: '88px' }}
            >
              绘制线
            </Button>
            <Button 
              size="small" 
              variant="outlined" 
              onClick={() => handleDrawTool('draw_polygon')}
              sx={{ minWidth: '88px' }}
            >
              绘制面
            </Button>
            <Button 
              size="small" 
              variant="outlined" 
              onClick={handleClearDraw} 
              color="error"
              sx={{ minWidth: '88px' }}
            >
              清空标绘
            </Button>
          </Stack>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={handleViewModeChange}
            size="small"
            sx={{ 
              backgroundColor: 'background.paper',
              '& .MuiToggleButton-root': {
                px: 2,
                py: 0.5
              }
            }}
          >
            <ToggleButton value="satellite">卫星影像</ToggleButton>
            <ToggleButton value="streets">街道地图</ToggleButton>
          </ToggleButtonGroup>
        </Stack>
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
      
      {/* 添加操作提示 Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity="info" 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {helpMessage}
        </Alert>
      </Snackbar>

      {/* 添加场景选择器组件 */}
      <Box sx={{ position: 'absolute', top: 20, right: 20, zIndex: 1 }}>
        <Paper sx={{ p: 2, maxWidth: 300 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>场景导览</Typography>
          <Stack spacing={1}>
            {scenes.map((scene) => (
              <Button
                key={scene.name}
                variant="outlined"
                onClick={() => handleSceneChange(scene)}
                startIcon={<LocationOnIcon />}
              >
                {scene.name}
              </Button>
            ))}
          </Stack>
        </Paper>
      </Box>

      {/* 添加媒体弹窗组件 */}
      <Dialog
        open={mediaDialogOpen}
        onClose={() => setMediaDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedScene && (
          <>
            <DialogTitle>{selectedScene.name}</DialogTitle>
            <DialogContent>
              <Box sx={{ mb: 2 }}>
                <img 
                  src={selectedScene.imageUrl} 
                  alt={selectedScene.name}
                  style={{ width: '100%', borderRadius: 8 }}
                />
              </Box>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {selectedScene.description}
              </Typography>
              <Stack direction="row" spacing={2}>
                {selectedScene.audioUrl && (
                  <audio controls>
                    <source src={selectedScene.audioUrl} type="audio/mpeg" />
                  </audio>
                )}
                {selectedScene.videoUrl && (
                  <Button
                    variant="contained"
                    startIcon={<PlayArrowIcon />}
                    onClick={() => window.open(selectedScene.videoUrl)}
                  >
                    查看视频介绍
                  </Button>
                )}
              </Stack>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default Map3DView;