import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import SystemSelector from './views/SystemSelector';
import DeviceManagement from './views/DeviceManagement';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SystemSelector />} />
        <Route
          path="/device-management"
          element={
            <MainLayout>
              <DeviceManagement />
            </MainLayout>
          }
        />
        {/* 其他路由也使用 MainLayout */}
      </Routes>
    </Router>
  );
}

export default App;