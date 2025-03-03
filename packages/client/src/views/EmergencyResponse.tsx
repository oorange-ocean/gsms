import React, { useEffect, useRef, useState } from 'react';
import { Box, Tab, Tabs, Typography } from '@mui/material';
import * as d3 from 'd3';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert
} from '@mui/material';
import { EmergencyContact } from '../types/emergency-contact';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`emergency-tabpanel-${index}`}
      aria-labelledby={`emergency-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

interface FlowNode {
  id: string;
  type: 'start' | 'end' | 'process' | 'decision' | 'subprocess';
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface FlowLink {
  source: string;
  target: string;
  label?: string;
}

const EmergencyFlowChart: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    // 清除之前的内容
    d3.select(svgRef.current).selectAll("*").remove();

    const width = 1000;
    const height = 800;
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    // 定义流程图数据
    const nodes: FlowNode[] = [
      { id: 'start', type: 'start', label: '发生生产事故/突发事件', x: 500, y: 50, width: 160, height: 60 },
      { id: 'warning', type: 'process', label: '发布预警信息', x: 500, y: 150, width: 140, height: 50 },
      { id: 'check1', type: 'decision', label: '是否达到启动应急响应条件', x: 500, y: 250, width: 200, height: 80 },
      { id: 'normal', type: 'process', label: '常规处置', x: 800, y: 250, width: 120, height: 50 },
      { id: 'plan', type: 'process', label: '启动对应的应急预案', x: 500, y: 350, width: 160, height: 50 },
      { id: 'response', type: 'subprocess', label: '应急响应与应急行动', x: 500, y: 450, width: 180, height: 60 },
      { id: 'check2', type: 'decision', label: '需启动其它专项应急预案', x: 500, y: 550, width: 180, height: 80 },
      { id: 'contact', type: 'process', label: '与上级单位和地方政府相关部门联系', x: 800, y: 550, width: 200, height: 60 },
      { id: 'monitor', type: 'process', label: '跟踪掌握有关事态发展情况', x: 500, y: 650, width: 180, height: 60 },
      { id: 'end', type: 'end', label: '发布应急结束命令\n应急结束', x: 500, y: 750, width: 160, height: 60 }
    ];

    const links: FlowLink[] = [
      { source: 'start', target: 'warning' },
      { source: 'warning', target: 'check1' },
      { source: 'check1', target: 'normal', label: '否' },
      { source: 'check1', target: 'plan', label: '是' },
      { source: 'plan', target: 'response' },
      { source: 'response', target: 'check2' },
      { source: 'check2', target: 'contact', label: '是' },
      { source: 'check2', target: 'monitor', label: '否' },
      { source: 'contact', target: 'monitor' },
      { source: 'monitor', target: 'end' }
    ];

    // 绘制连接线
    const drawPath = (d: FlowLink) => {
      const source = nodes.find(n => n.id === d.source)!;
      const target = nodes.find(n => n.id === d.target)!;
      
      let path = '';
      if (target.x === source.x) {
        // 垂直连线
        path = `M ${source.x} ${source.y + source.height/2} L ${target.x} ${target.y - target.height/2}`;
      } else {
        // 水平连线
        const midY = (source.y + target.y) / 2;
        path = `M ${source.x} ${source.y + source.height/2} 
                L ${source.x} ${midY} 
                L ${target.x} ${midY} 
                L ${target.x} ${target.y - target.height/2}`;
      }
      return path;
    };

    // 绘制连接线
    svg.append('g')
      .selectAll('path')
      .data(links)
      .enter()
      .append('path')
      .attr('d', drawPath)
      .attr('stroke', '#999')
      .attr('stroke-width', 2)
      .attr('fill', 'none')
      .attr('marker-end', 'url(#arrowhead)');

    // 添加箭头标记
    svg.append('defs').append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '-10 -10 20 20')
      .attr('refX', 0)
      .attr('refY', 0)
      .attr('markerWidth', 8)
      .attr('markerHeight', 8)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M -10,-10 L 0,0 L -10,10')
      .attr('fill', '#999');

    // 绘制节点
    const nodeGroups = svg.append('g')
      .selectAll('g')
      .data(nodes)
      .enter()
      .append('g')
      .attr('transform', d => `translate(${d.x - d.width/2},${d.y - d.height/2})`);

    // 根据节点类型绘制不同形状
    nodeGroups.each(function(d) {
      const group = d3.select(this);
      switch(d.type) {
        case 'start':
        case 'end':
          group.append('ellipse')
            .attr('cx', d.width/2)
            .attr('cy', d.height/2)
            .attr('rx', d.width/2)
            .attr('ry', d.height/2)
            .attr('fill', '#fff')
            .attr('stroke', '#666');
          break;
        case 'decision':
          group.append('path')
            .attr('d', `M ${d.width/2} 0 L ${d.width} ${d.height/2} L ${d.width/2} ${d.height} L 0 ${d.height/2} Z`)
            .attr('fill', '#fff')
            .attr('stroke', '#666');
          break;
        case 'subprocess':
          group.append('rect')
            .attr('width', d.width)
            .attr('height', d.height)
            .attr('rx', 5)
            .attr('fill', '#fff')
            .attr('stroke', '#666')
            .attr('stroke-dasharray', '5,5');
          break;
        default:
          group.append('rect')
            .attr('width', d.width)
            .attr('height', d.height)
            .attr('rx', 5)
            .attr('fill', '#fff')
            .attr('stroke', '#666');
      }

      // 添加文本
      const text = group.append('text')
        .attr('x', d.width/2)
        .attr('y', d.height/2)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .style('font-size', '12px');

      // 处理文本换行
      d.label.split('\n').forEach((line, i) => {
        text.append('tspan')
          .attr('x', d.width/2)
          .attr('dy', i ? '1.2em' : '-0.6em')
          .text(line);
      });
    });

    // 添加连接线标签
    svg.append('g')
      .selectAll('text')
      .data(links.filter(l => l.label))
      .enter()
      .append('text')
      .attr('x', d => {
        const source = nodes.find(n => n.id === d.source)!;
        const target = nodes.find(n => n.id === d.target)!;
        return (source.x + target.x) / 2;
      })
      .attr('y', d => {
        const source = nodes.find(n => n.id === d.source)!;
        const target = nodes.find(n => n.id === d.target)!;
        return (source.y + target.y) / 2;
      })
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .style('font-size', '12px')
      .text(d => d.label!);
  }, []);

  return <svg ref={svgRef}></svg>;
};

const EmergencyContactList: React.FC = () => {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch('http://localhost:3000/emergency-contacts');
        if (!response.ok) throw new Error('获取联系人列表失败');
        const data = await response.json();
        setContacts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '未知错误');
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
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
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="emergency contacts table">
        <TableHead>
          <TableRow>
            <TableCell>姓名</TableCell>
            <TableCell>职务</TableCell>
            <TableCell>部门</TableCell>
            <TableCell>办公电话</TableCell>
            <TableCell>手机</TableCell>
            <TableCell>职责</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {contacts.map((contact) => (
            <TableRow
              key={contact._id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {contact.name}
              </TableCell>
              <TableCell>{contact.title}</TableCell>
              <TableCell>{contact.department}</TableCell>
              <TableCell>{contact.phone}</TableCell>
              <TableCell>{contact.mobile}</TableCell>
              <TableCell>{contact.responsibility}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const EmergencyResponse: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ 
      width: '100%', 
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative', // 添加相对定位
      overflow: 'hidden'    // 防止溢出
    }}>
      {/* 固定在顶部的 Tab 栏 */}
      <Box sx={{ 
        position: 'absolute', // 改为绝对定位
        top: 0,
        left: 0,
        right: 0,
        borderBottom: 1, 
        borderColor: 'divider',
        height: '48px',      // 固定高度
        backgroundColor: 'background.paper',
        zIndex: 2,          // 确保在最上层
      }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="应急处理" />
          <Tab label="应急联系" />
        </Tabs>
      </Box>
      
      {/* 内容区域，添加上边距留出 Tab 栏的空间 */}
      <Box sx={{ 
        flex: 1,
        mt: '48px',        // 为 Tab 栏留出空间
        overflow: 'auto',  // 内容区域可滚动
        position: 'relative'
      }}>
        <TabPanel value={tabValue} index={0}>
          <Typography variant="h6" sx={{ mb: 2 }}>应急处理流程</Typography>
          <EmergencyFlowChart />
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" sx={{ mb: 2 }}>应急联系人</Typography>
          <EmergencyContactList />
        </TabPanel>
      </Box>
    </Box>
  );
};

export default EmergencyResponse; 