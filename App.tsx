import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Performance from './components/Performance';
import InjuryRehab from './components/InjuryRehab';
import PracticeCapture from './components/PracticeCapture';
import Profile from './components/Profile';
import { DietSection, FinanceCareerSection } from './components/DietCareerFinance';
import Login from './components/Login';
import Onboarding from './components/Onboarding';
import TrainingCenter from './components/TrainingCenter';
import DeviceMetrics from './components/DeviceMetrics';
import JobsEvents from './components/JobsEvents';
import AIAssistantPage from './components/AIAssistantPage';

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
      // Simple auth check for prototype
      return localStorage.getItem('athlete_profile') !== null;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);

  const handleLogin = () => setIsAuthenticated(true);
  const handleLogout = () => {
      // For this demo we don't clear the profile to keep data, just "log out"
      // In a real app we would clear token
      setIsAuthenticated(false);
  };

  return (
    <HashRouter>
      <Layout darkMode={darkMode} toggleTheme={toggleTheme} onLogout={isAuthenticated ? handleLogout : undefined}>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={!isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} />
          <Route path="/onboarding" element={<Onboarding onLogin={handleLogin} />} />

          {/* Protected Routes */}
          <Route path="/" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/ai-coach" element={isAuthenticated ? <AIAssistantPage /> : <Navigate to="/login" />} />
          <Route path="/training" element={isAuthenticated ? <TrainingCenter /> : <Navigate to="/login" />} />
          <Route path="/device-metrics" element={isAuthenticated ? <DeviceMetrics /> : <Navigate to="/login" />} />
          <Route path="/jobs" element={isAuthenticated ? <JobsEvents /> : <Navigate to="/login" />} />
          <Route path="/performance" element={isAuthenticated ? <Performance /> : <Navigate to="/login" />} />
          <Route path="/injury" element={isAuthenticated ? <InjuryRehab /> : <Navigate to="/login" />} />
          <Route path="/practice" element={isAuthenticated ? <PracticeCapture /> : <Navigate to="/login" />} />
          <Route path="/diet" element={isAuthenticated ? <DietSection /> : <Navigate to="/login" />} />
          <Route path="/career" element={isAuthenticated ? <FinanceCareerSection /> : <Navigate to="/login" />} />
          <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;