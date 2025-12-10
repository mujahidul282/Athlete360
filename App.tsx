import React, { useState, useEffect, Suspense } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import { Loader2 } from 'lucide-react';

// Lazy Load Components for Performance
const Dashboard = React.lazy(() => import('./components/Dashboard'));
const Performance = React.lazy(() => import('./components/Performance'));
const InjuryRehab = React.lazy(() => import('./components/InjuryRehab'));
const PracticeCapture = React.lazy(() => import('./components/PracticeCapture'));
const Profile = React.lazy(() => import('./components/Profile'));
const Login = React.lazy(() => import('./components/Login'));
const Onboarding = React.lazy(() => import('./components/Onboarding'));
const TrainingCenter = React.lazy(() => import('./components/TrainingCenter'));
const DeviceMetrics = React.lazy(() => import('./components/DeviceMetrics'));
const JobsEvents = React.lazy(() => import('./components/JobsEvents'));
const AIAssistantPage = React.lazy(() => import('./components/AIAssistantPage'));

// Properly lazy load named exports
const DietSection = React.lazy(() => import('./components/DietCareerFinance').then(module => ({ default: module.DietSection })));
const FinanceCareerSection = React.lazy(() => import('./components/DietCareerFinance').then(module => ({ default: module.FinanceCareerSection })));

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-[calc(100vh-100px)]">
    <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
        <p className="text-slate-500 text-sm font-medium animate-pulse">Loading Athlete360...</p>
    </div>
  </div>
);

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
      setIsAuthenticated(false);
  };

  return (
    <HashRouter>
      <Layout darkMode={darkMode} toggleTheme={toggleTheme} onLogout={isAuthenticated ? handleLogout : undefined}>
        <Suspense fallback={<LoadingFallback />}>
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
        </Suspense>
      </Layout>
    </HashRouter>
  );
};

export default App;