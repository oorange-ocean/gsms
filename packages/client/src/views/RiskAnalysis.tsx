import React, { useEffect, useRef, useState } from 'react';
import { Box, Paper, Typography, Dialog, DialogTitle, DialogContent, List, ListItem, ListItemText } from '@mui/material';
import * as d3 from 'd3';
import { RiskNode, riskData } from '../types/risk';

const RiskAnalysis: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedRisk, setSelectedRisk] = useState<RiskNode | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

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
    
    // 计算每个节点的子节点数量，用于调整垂直间距
    const nodeSize = { width: 150, height: 60 };
    const margin = { top: 20, right: 120, bottom: 20, left: 120 };
    
    // 设置树形图布局，调整大小以适应节点数量
    const treeLayout = d3.tree<RiskNode>()
      .nodeSize([nodeSize.height * 2, nodeSize.width * 2])
      .separation((a, b) => {
        return a.parent === b.parent ? 1.5 : 2;
      });

    // 计算节点位置
    const rootNode = treeLayout(root);

    // 获取布局的边界
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    rootNode.each(d => {
      minX = Math.min(minX, d.x);
      maxX = Math.max(maxX, d.x);
      minY = Math.min(minY, d.y);
      maxY = Math.max(maxY, d.y);
    });

    // 创建SVG容器，设置合适的大小
    const svg = d3.select(svgRef.current)
      .attr('width', maxY - minY + margin.left + margin.right)
      .attr('height', maxX - minX + margin.top + margin.bottom);

    // 创建主要绘图区域，调整整体位置
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${-minX + margin.top})`);

    // 创建连接线
    const links = g.selectAll('.link')
      .data(rootNode.links())
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('d', d3.linkHorizontal<any, [number, number]>()
        .source(d => [d.source.y, d.source.x])
        .target(d => [d.target.y, d.target.x])
      )
      .attr('fill', 'none')
      .attr('stroke', '#ccc')
      .attr('stroke-width', 2)
      .attr('stroke-opacity', 0.6);

    // 创建节点组
    const nodes = g.selectAll('.node')
      .data(rootNode.descendants())
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.y},${d.x})`);

    // 添加节点背景
    nodes.append('rect')
      .attr('x', -70)
      .attr('y', -25)
      .attr('width', 140)
      .attr('height', 50)
      .attr('rx', 5)
      .attr('ry', 5)
      .attr('fill', d => {
        if (d.depth === 0) return '#1a237e';
        if (d.depth === 1) return '#1976d2';
        return '#2196f3';
      })
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
      .on('click', (event, d: any) => {
        if (d.data.description || d.data.measures) {
          setSelectedRisk(d.data);
        }
      });

    // 添加节点文本
    nodes.append('text')
      .attr('dy', '0.35em')
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .style('font-size', d => d.depth === 0 ? '16px' : '14px')
      .style('font-weight', 'bold') // 加粗文字
      .style('pointer-events', 'none')
      .each(function(d) {
        const text = d3.select(this);
        const words = d.data.title.split(/(?<=[\u4e00-\u9fa5])/g);
        
        if (words.length > 4) {
          // 文本过长时分两行显示
          text.append('tspan')
            .attr('x', 0)
            .attr('dy', '-0.6em')
            .text(words.slice(0, 4).join(''));
          text.append('tspan')
            .attr('x', 0)
            .attr('dy', '1.2em')
            .text(words.slice(4).join(''));
        } else {
          // 短文本直接显示
          text.text(d.data.title);
        }
      });

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

  return (
    <Box sx={{ p: 3, height: 'calc(100vh - 32px)' }}>
      <Typography variant="h4" sx={{ mb: 4 }}>风险分析</Typography>
      
      <Paper 
        elevation={3} 
        sx={{ 
          p: 2,
          height: 'calc(100% - 100px)',
          overflow: 'auto',
          backgroundColor: '#f5f5f5'
        }}
      >
        <svg
          ref={svgRef}
          style={{ 
            minWidth: '1600px', // 增加最小宽度
            minHeight: '1000px'  // 增加最小高度
          }}
        />
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