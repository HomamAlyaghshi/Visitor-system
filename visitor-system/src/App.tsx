import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import LoginPage from './pages/LoginPage';
import ManagerDashboard from './pages/ManagerDashboard';
import GateGuardDashboard from './pages/GateGuardDashboard';



function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />} 
        />
        <Route 
          path="/" 
          element={
            isAuthenticated ? (
              user?.role === 'MANAGER' ? (
                <Navigate to="/manager" replace />
              ) : (
                <Navigate to="/gate-guard" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
        <Route 
          path="/manager" 
          element={
            isAuthenticated && user?.role === 'MANAGER' ? (
              <ManagerDashboard />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
        <Route 
          path="/gate-guard" 
          element={
            isAuthenticated && user?.role === 'GATE_GUARD' ? (
              <GateGuardDashboard />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
