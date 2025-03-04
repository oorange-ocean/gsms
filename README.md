# LNG 接收站安全管理系统

## 项目简介
本系统是一个基于 Web 的 LNG(液化天然气)接收站安全管理系统。系统集成了实时监控、设备管理、应急响应等功能,并提供了二维和三维地图可视化界面。

## 主要功能
- 📍 场景导览: 支持多个关键场景的快速切换和查看
- 🗺️ 三维地图: 基于 Mapbox GL JS 的三维地图展示
- 📏 测量工具: 支持距离和面积测量
- 🛠️ 设备管理: 设备状态监控和管理
- ⚠️ 预警系统: 实时监测和预警
- 🚨 应急响应: 应急物资管理和应急联系人
- 📊 数据分析: 设备运行数据分析
- 📋 日常巡检: 巡检任务管理和执行
- 📁 资料管理: 文档资料的存储和管理
- 📈 风险分析: 安全风险评估和分析

## 技术栈
- 前端: React + TypeScript + Material-UI
- 后端: NestJS + MongoDB
- 地图: Mapbox GL JS
- 3D 模型: Three.js
- 状态管理: React Context
- UI 组件库: Material-UI (MUI)
- 图表库: ECharts

## 系统模块
- 日常巡检 (/inspection)
- 数据监测 (/monitoring)
- 设备管理 (/device-management)
- 资料管理 (/document-management)
- 风险分析 (/risk-analysis)
- 应急物资 (/emergency-supplies)
- 安全预警 (/safety-alert)
- 应急响应 (/emergency-response)
- 二维地图 (/map)
- 三维地图 (/map3d)

### 环境要求
- Node.js >= 16
- MongoDB >= 4.4
- Mapbox Access Token

## 项目结构
