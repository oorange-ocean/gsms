import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, styled } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Schedule as ScheduleIcon,
  Analytics as AnalyticsIcon,
  Build as BuildIcon,
  Folder as FolderIcon,
  Assessment as AssessmentIcon,
  Inventory2 as Inventory2Icon,
  Warning as WarningIcon,
  Emergency as EmergencyIcon,
  Map as MapIcon
} from '@mui/icons-material';

const DRAWER_WIDTH = 240;

const menuItems = [
  { title: '日常巡检', icon: <ScheduleIcon />, path: '/inspection' },
  { title: '数据监测', icon: <AnalyticsIcon />, path: '/monitoring' },
  { title: '设备管理', icon: <BuildIcon />, path: '/device-management' },
  { title: '资料管理', icon: <FolderIcon />, path: '/document-management' },
  { title: '风险分析', icon: <AssessmentIcon />, path: '/risk-analysis' },
  { title: '应急物资', icon: <Inventory2Icon />, path: '/emergency-supplies' },
  { title: '安全预警', icon: <WarningIcon />, path: '/safety-alert' },
  { title: '应急响应', icon: <EmergencyIcon />, path: '/emergency-response' },
  { title: '二维地图', icon: <MapIcon />, path: '/map' },
  { title: '三维地图', icon: <MapIcon />, path: '/map3d' }
];

const StyledDrawer = styled(Drawer)({
  width: DRAWER_WIDTH,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: DRAWER_WIDTH,
    boxSizing: 'border-box',
    backgroundColor: '#1a237e',
    color: 'white'
  }
});

const StyledListItem = styled(ListItem)<{ active?: boolean }>(({ active }) => ({
  margin: '8px 16px',
  borderRadius: '8px',
  backgroundColor: active ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.2)'
  },
  '& .MuiListItemIcon-root': {
    color: active ? '#fff' : 'rgba(255, 255, 255, 0.7)'
  },
  '& .MuiListItemText-root': {
    color: active ? '#fff' : 'rgba(255, 255, 255, 0.7)'
  }
}));

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex' }}>
      <StyledDrawer variant="permanent">
        <Box sx={{ 
          mt: 2, 
          mb: 2, 
          textAlign: 'center',
          px: 2
        }}>
          <img 
            src="/assets/logo-dark.svg"
            alt="安全监控系统"
            style={{
              width: '80%',
              maxWidth: 120,
              height: 'auto'
            }} 
          />
        </Box>
        <List>
          {menuItems.map((item) => (
            <StyledListItem
              key={item.path}
              active={location.pathname === item.path}
              onClick={() => navigate(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.title} />
            </StyledListItem>
          ))}
        </List>
      </StyledDrawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout; 