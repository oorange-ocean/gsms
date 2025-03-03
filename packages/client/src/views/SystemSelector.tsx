import React from 'react';
import BigGear from '../components/BigGear';
import SmallGear from '../components/SmallGear';
import '@/styles/SystemSelector.scss';

// 默认用户信息，实际应用中可能从API获取
const defaultUser = {
  name: '系统用户',
  icon: 'account_circle', // 使用 Material Icons 的字符串名称
};

// 模块定义
const modules = [
  { 
    title: '日常巡检', 
    icon: 'schedule',
    color: '#4CAF50',
    position: 'top' as const
  },
  { 
    title: '数据监测', 
    icon: 'analytics',
    color: '#2196F3',
    position: 'top-right' as const
  },
  { 
    title: '设备管理', 
    icon: 'build',
    color: '#FF9800',
    position: 'right' as const
  },
  { 
    title: '资料管理', 
    icon: 'folder',
    color: '#9C27B0',
    position: 'bottom-right' as const
  },
  { 
    title: '风险分析', 
    icon: 'assessment',
    color: '#F44336',
    position: 'bottom' as const
  },
  { 
    title: '应急物资', 
    icon: 'inventory_2',
    color: '#795548',
    position: 'bottom-left' as const
  },
  { 
    title: '安全预警', 
    icon: 'warning',
    color: '#FF5722',
    position: 'left' as const
  },
  { 
    title: '应急响应', 
    icon: 'emergency',
    color: '#607D8B',
    position: 'top-left' as const
  },
];

const SystemSelector: React.FC = () => {
  const handleModuleClick = (moduleName: string) => {
    console.log(`选择了 ${moduleName} 模块`);
    // 这里可以添加导航逻辑
  };

  return (
    <div className="system-selector-container">
      <div className="gear-system">
        <BigGear userName={defaultUser.name} userIcon={defaultUser.icon} />
        
        {modules.map((module, index) => (
          <SmallGear
            key={index}
            title={module.title}
            icon={module.icon}
            backgroundColor={module.color}
            position={module.position}
            onClick={() => handleModuleClick(module.title)}
          />
        ))}
      </div>
    </div>
  );
};

export default SystemSelector;