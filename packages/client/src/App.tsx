import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import SystemSelector from './views/SystemSelector';
import DeviceManagement from './views/DeviceManagement';
import DocumentManagement from './views/DocumentManagement';
import RiskAnalysis from './views/RiskAnalysis';
import EmergencySupplies from './views/EmergencySupplies';
import SafetyAlert from './views/SafetyAlert';
import EmergencyResponse from './views/EmergencyResponse';
import ModelViewer from './components/ModelViewer';

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
        <Route
          path="/document-management"
          element={
            <MainLayout>
              <DocumentManagement />
            </MainLayout>
          }
        />
        <Route
          path="/risk-analysis"
          element={
            <MainLayout>
              <RiskAnalysis />
            </MainLayout>
          }
        />
        <Route
          path="/emergency-supplies"
          element={
            <MainLayout>
              <EmergencySupplies />
            </MainLayout>
          }
        />
        <Route
          path="/safety-alert"
          element={
            <MainLayout>
              <SafetyAlert />
            </MainLayout>
          }
        />
        <Route
          path="/emergency-response"
          element={
            <MainLayout>
              <EmergencyResponse />
            </MainLayout>
          }
        />
        <Route path="/monitoring" element={<ModelViewer />} />
      </Routes>
    </Router>
  );
}

export default App;