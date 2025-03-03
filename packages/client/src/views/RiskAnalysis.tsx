import React, { useEffect, useRef, useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  List, 
  ListItem, 
  ListItemText,
  Toolbar,
  IconButton,
  Tooltip,
  Slider,
  Stack
} from '@mui/material';
import {
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  Refresh as RefreshIcon,
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
  Save as SaveIcon,
  Search as SearchIcon,
  Engineering as EngineeringIcon,
  ElectricBolt as ElectricIcon,
  Warning as WarningIcon,
  Healing as HealingIcon,
  Build as BuildIcon,
  Speed as SpeedIcon,
  Construction as ConstructionIcon
} from '@mui/icons-material';
import * as d3 from 'd3';
import { RiskNode, riskData } from '../types/risk';
import { createRoot } from 'react-dom/client';

// 定义风险类型的颜色和图标映射
const riskTypeConfig: {
  [key: string]: {
    color: string;
    icon: React.ComponentType;
    darkColor: string;
  }
} = {
  'inspection': {
    color: '#2196F3',
    icon: EngineeringIcon,
    darkColor: '#1565C0'
  },
  'venting': {
    color: '#FF9800',
    icon: SpeedIcon,
    darkColor: '#EF6C00'
  },
  'drainage': {
    color: '#4CAF50',
    icon: WarningIcon,
    darkColor: '#2E7D32'
  },
  'valve_maintenance': {
    color: '#9C27B0',
    icon: BuildIcon,
    darkColor: '#6A1B9A'
  },
  'instrument': {
    color: '#F44336',
    icon: ConstructionIcon,
    darkColor: '#C62828'
  },
  'electrical': {
    color: '#E91E63',
    icon: ElectricIcon,
    darkColor: '#AD1457'
  },
  'pigging': {
    color: '#795548',
    icon: HealingIcon,
    darkColor: '#4E342E'
  }
};

const RiskAnalysis: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mainGroupRef = useRef<SVGGElement | null>(null);
  const [selectedRisk, setSelectedRisk] = useState<RiskNode | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // 添加布局相关的状态
  const [layoutBounds, setLayoutBounds] = useState({
    minX: 0,
    maxX: 0,
    minY: 0,
    maxY: 0
  });

  // 定义固定的布局参数
  const nodeSize = { width: 140, height: 40 };
  const margin = { top: 20, right: 60, bottom: 20, left: 60 };

  useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current?.parentElement) {
        setDimensions({
          width: svgRef.current.parentElement.offsetWidth,
          height: svgRef.current.parentElement.offsetHeight
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    if (!dimensions.width || !dimensions.height || !svgRef.current) return;

    // 清除现有内容
    d3.select(svgRef.current).selectAll('*').remove();

    // 创建分层布局
    const root = d3.hierarchy(riskData);
    
    // 设置树形图布局
    const treeLayout = d3.tree<RiskNode>()
      .nodeSize([nodeSize.height * 1.2, nodeSize.width * 1.5])
      .separation((a, b) => {
        return a.parent === b.parent ? 1 : 1.2;
      });

    // 计算节点位置
    const rootNode = treeLayout(root);

    // 获取布局边界
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    rootNode.each(d => {
      minX = Math.min(minX, d.x);
      maxX = Math.max(maxX, d.x);
      minY = Math.min(minY, d.y);
      maxY = Math.max(maxY, d.y);
    });

    // 保存布局边界
    setLayoutBounds({ minX, maxX, minY, maxY });

    // 创建SVG容器
    const svg = d3.select(svgRef.current)
      .attr('width', Math.abs(maxY - minY) + margin.left + margin.right)
      .attr('height', maxX - minX + margin.top + margin.bottom);

    // 创建主要绘图区域
    const g = svg.append('g')
      .attr('transform', `translate(${Math.abs(maxY - minY) / 2 + margin.left},${-minX + margin.top})`);
    
    mainGroupRef.current = g.node();

    // 创建连接线
    const links = g.selectAll('.link')
      .data(rootNode.links())
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('d', d3.linkHorizontal<any, any>()
        .x(d => d.y)
        .y(d => d.x)
      )
      .attr('fill', 'none')
      .attr('stroke', d => {
        const sourceType = d.source.data.id.split('_')[0];
        return riskTypeConfig[sourceType]?.color || '#ccc';
      })
      .attr('stroke-width', 2)
      .attr('stroke-opacity', 0.6)
      .style('filter', 'url(#glow)'); // 添加发光效果

    // 创建节点组
    const nodes = g.selectAll('.node')
      .data(rootNode.descendants())
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.y},${d.x})`);

    // 修改节点背景大小
    nodes.append('rect')
      .attr('x', -65)
      .attr('y', -20)
      .attr('width', 130)
      .attr('height', 40)
      .attr('rx', 6)
      .attr('ry', 6)
      .attr('fill', d => {
        if (d.depth === 0) return '#1a237e';
        const type = d.data.id.split('_')[0];
        return riskTypeConfig[type]?.color || '#2196f3';
      })
      .attr('filter', 'url(#shadow)') // 添加阴影效果
      .attr('opacity', 0.9)
      .attr('cursor', 'pointer')
      .on('mouseover', function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('opacity', 1)
          .attr('transform', 'scale(1.1)');
      })
      .on('mouseout', function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('opacity', 0.9)
          .attr('transform', 'scale(1)');
      })
      .on('click', (d) => {
        if (d.data.description || d.data.measures) {
          setSelectedRisk(d.data);
        }
      });

    // 修改图标位置和大小
    nodes.each(function(d) {
      if (d.depth > 0) {
        const type = d.data.id.split('_')[0];
        const IconComponent = riskTypeConfig[type]?.icon;
        if (IconComponent) {
          const icon = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
          icon.setAttribute('x', '-60');
          icon.setAttribute('y', '-12');
          icon.setAttribute('width', '24');
          icon.setAttribute('height', '24');
          
          const div = document.createElement('div');
          div.style.width = '100%';
          div.style.height = '100%';
          div.style.display = 'flex';
          div.style.alignItems = 'center';
          div.style.justifyContent = 'center';
          div.style.color = 'white';
          
          icon.appendChild(div);
          this.appendChild(icon);
          
          const root = createRoot(div);
          root.render(<IconComponent />);
        }
      }
    });

    // 调整文本位置
    nodes.append('text')
      .attr('x', d => d.depth > 0 ? -30 : 0)
      .attr('dy', '0.35em')
      .attr('text-anchor', d => d.depth === 0 ? 'middle' : 'start')
      .attr('fill', 'white')
      .style('font-size', d => d.depth === 0 ? '16px' : '14px')
      .style('font-weight', 'bold')
      .style('pointer-events', 'none')
      .style('text-shadow', '1px 1px 2px rgba(0,0,0,0.3)')
      .each(function(d) {
        const text = d3.select(this);
        const words = d.data.title.split(/(?<=[\u4e00-\u9fa5])/g);
        
        if (words.length > 4) {
          text.append('tspan')
            .attr('x', d.depth > 0 ? -30 : 0)
            .attr('dy', '-0.6em')
            .text(words.slice(0, 4).join(''));
          text.append('tspan')
            .attr('x', d.depth > 0 ? -30 : 0)
            .attr('dy', '1.2em')
            .text(words.slice(4).join(''));
        } else {
          text.text(d.data.title);
        }
      });

    // 添加特效滤镜
    const defs = svg.append('defs');
    
    // 发光效果
    const glow = defs.append('filter')
      .attr('id', 'glow')
      .attr('x', '-40%')
      .attr('y', '-40%')
      .attr('width', '180%')
      .attr('height', '180%');
      
    glow.append('feGaussianBlur')
      .attr('stdDeviation', '3')
      .attr('result', 'coloredBlur');
      
    const glowMerge = glow.append('feMerge');
    glowMerge.append('feMergeNode')
      .attr('in', 'coloredBlur');
    glowMerge.append('feMergeNode')
      .attr('in', 'SourceGraphic');

    // 阴影效果
    const shadow = defs.append('filter')
      .attr('id', 'shadow')
      .attr('x', '-20%')
      .attr('y', '-20%')
      .attr('width', '140%')
      .attr('height', '140%');
      
    shadow.append('feDropShadow')
      .attr('dx', '2')
      .attr('dy', '2')
      .attr('stdDeviation', '3')
      .attr('flood-opacity', '0.3');

    // 添加连接线动画
    links.each(function() {
      const length = this.getTotalLength();
      d3.select(this)
        .attr('stroke-dasharray', `${length} ${length}`)
        .attr('stroke-dashoffset', length)
        .transition()
        .duration(1000)
        .attr('stroke-dashoffset', 0);
    });

  }, [dimensions]);

  useEffect(() => {
    if (!mainGroupRef.current) return;

    d3.select(mainGroupRef.current)
      .transition()
      .duration(50)
      .attr('transform', `translate(${Math.abs(layoutBounds.maxY - layoutBounds.minY) / 2 + margin.left + translate.x},${-layoutBounds.minX + margin.top + translate.y}) scale(${scale})`);

  }, [scale, translate, layoutBounds]);

  useEffect(() => {
    const container = svgRef.current?.parentElement;
    if (!container) return;

    // 处理鼠标滚轮事件
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const sensitivity = 1;
      
      // 按住 Ctrl 键时进行缩放
      if (e.ctrlKey) {
        const delta = -e.deltaY * 0.01;
        setScale(prev => Math.min(Math.max(prev + delta * sensitivity, 0.5), 2));
      } else {
        // 不按 Ctrl 时进行平移
        setTranslate(prev => ({
          x: prev.x - e.deltaX * sensitivity,
          y: prev.y - e.deltaY * sensitivity
        }));
      }
    };

    // 处理触控板事件
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        setIsDragging(true);
        setDragStart({
          x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
          y: (e.touches[0].clientY + e.touches[1].clientY) / 2
        });
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches.length === 2) {
        const currentX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        const currentY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
        
        setTranslate(prev => ({
          x: prev.x + (currentX - dragStart.x),
          y: prev.y + (currentY - dragStart.y)
        }));
        
        setDragStart({
          x: currentX,
          y: currentY
        });
      }
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
    };

    // 添加事件监听器
    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('touchstart', handleTouchStart);
    container.addEventListener('touchmove', handleTouchMove);
    container.addEventListener('touchend', handleTouchEnd);

    // 清理事件监听器
    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, dragStart]);

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev * 1.2, 2));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev / 1.2, 0.5));
  };

  const handleReset = () => {
    setScale(1);
    setTranslate({ x: 0, y: 0 });
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleSaveImage = () => {
    if (!svgRef.current) return;
    
    // 创建一个新的 Blob
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    
    // 创建下载链接
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = '风险分析图.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSearch = () => {
    // TODO: 实现搜索功能
  };

  return (
    <Box sx={{ p: 3, height: 'calc(100vh - 32px)' }}>
      <Typography variant="h4" sx={{ mb: 4 }}>风险分析</Typography>
      
      <Paper 
        elevation={3} 
        sx={{ 
          height: 'calc(100% - 100px)',
          display: 'flex',
          flexDirection: 'column'
        }}
        ref={containerRef}
      >
        <Toolbar 
          variant="dense" 
          sx={{ 
            borderBottom: 1, 
            borderColor: 'divider',
            backgroundColor: '#f5f5f5'
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Tooltip title="放大">
              <IconButton onClick={handleZoomIn}>
                <ZoomInIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="缩小">
              <IconButton onClick={handleZoomOut}>
                <ZoomOutIcon />
              </IconButton>
            </Tooltip>
            <Slider
              value={scale}
              min={0.5}
              max={2}
              step={0.1}
              onChange={(_, value) => setScale(value as number)}
              sx={{ width: 100 }}
              valueLabelDisplay="auto"
              valueLabelFormat={value => `${Math.round(value * 100)}%`}
            />
            <Tooltip title="重置视图">
              <IconButton onClick={handleReset}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={isFullscreen ? "退出全屏" : "全屏显示"}>
              <IconButton onClick={handleFullscreen}>
                {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
              </IconButton>
            </Tooltip>
            <Tooltip title="保存为图片">
              <IconButton onClick={handleSaveImage}>
                <SaveIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="搜索">
              <IconButton onClick={handleSearch}>
                <SearchIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Toolbar>

        <Box sx={{ 
          p: 2,
          flex: 1,
          overflow: 'hidden',
          backgroundColor: '#f5f5f5',
          touchAction: 'none'
        }}>
          <svg
            ref={svgRef}
            style={{ 
              minWidth: '1600px',
              minHeight: '1000px',
              cursor: isDragging ? 'grabbing' : 'grab'
            }}
          />
        </Box>
      </Paper>

      <Dialog 
        open={!!selectedRisk} 
        onClose={() => setSelectedRisk(null)} 
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle 
          sx={{ 
            backgroundColor: '#1976d2',
            color: 'white'
          }}
        >
          {selectedRisk?.title}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {selectedRisk?.description && (
            <Typography paragraph>
              {selectedRisk.description}
            </Typography>
          )}
          {selectedRisk?.measures && (
            <>
              <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                预防措施：
              </Typography>
              <List>
                {selectedRisk.measures.map((measure, index) => (
                  <ListItem key={index}>
                    <ListItemText 
                      primary={`${index + 1}. ${measure}`}
                      sx={{
                        '& .MuiListItemText-primary': {
                          color: '#333'
                        }
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default RiskAnalysis; 