import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Activity, 
  Stethoscope, 
  Utensils, 
  Wallet, 
  Video, 
  User, 
  Menu, 
  X,
  Moon,
  Sun,
  LogOut,
  Dumbbell,
  Briefcase,
  Watch,
  Sparkles
} from 'lucide-react';
import AIChatbot from './AIChatbot';

interface LayoutProps {
  children: React.ReactNode;
  darkMode: boolean;
  toggleTheme: () => void;
  onLogout?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, darkMode, toggleTheme, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const isAuthPage = location.pathname === '/login' || location.pathname === '/onboarding';
  
  if (isAuthPage) {
      return (
        <div className={darkMode ? 'dark' : ''}>
            <div className="absolute top-4 right-4 z-50">
                <button onClick={toggleTheme} className="p-2 rounded-full bg-white dark:bg-slate-800 shadow-md">
                     {darkMode ? <Sun size={20} className="text-yellow-400"/> : <Moon size={20} className="text-slate-600"/>}
                </button>
            </div>
            {children}
        </div>
      );
  }

  const navItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/' },
    { name: 'AI Coach', icon: <Sparkles size={20} />, path: '/ai-coach' }, // New Highlighted Link
    { name: 'Training', icon: <Dumbbell size={20} />, path: '/training' },
    { name: 'Device Metrics', icon: <Watch size={20} />, path: '/device-metrics' },
    { name: 'Performance', icon: <Activity size={20} />, path: '/performance' },
    { name: 'Injury & Rehab', icon: <Stethoscope size={20} />, path: '/injury' },
    { name: 'Jobs & Events', icon: <Briefcase size={20} />, path: '/jobs' },
    { name: 'Diet & Nutrition', icon: <Utensils size={20} />, path: '/diet' },
    { name: 'Practice Capture', icon: <Video size={20} />, path: '/practice' },
    { name: 'Career & Finance', icon: <Wallet size={20} />, path: '/career' },
    { name: 'Profile', icon: <User size={20} />, path: '/profile' },
  ];

  const isActive = (path: string) => location.pathname === path;

  // TODO: Replace with the actual URL of the uploaded logo
  const LOGO_URL = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

  return (
    <div className={`min-h-screen flex flex-col md:flex-row ${darkMode ? 'dark' : ''}`}>
      {/* Mobile Header */}
      <header className="md:hidden bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-md p-4 flex justify-between items-center shadow-sm z-20 sticky top-0 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
            <img src={LOGO_URL} alt="Athlete360" className="w-8 h-8 object-contain" />
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500">Athlete360</h1>
        </div>
        <div className="flex items-center gap-4">
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
                {darkMode ? <Sun size={20} className="text-yellow-400"/> : <Moon size={20} className="text-slate-600"/>}
            </button>
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <X size={24} className="text-slate-700 dark:text-slate-200" /> : <Menu size={24} className="text-slate-700 dark:text-slate-200" />}
            </button>
        </div>
      </header>

      {/* Sidebar - Modern Glassmorphic Look */}
      <aside className={`
        fixed inset-y-0 left-0 z-20 w-72 bg-white/90 dark:bg-[#0f172a]/90 backdrop-blur-xl border-r border-slate-200 dark:border-slate-800 transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0 flex flex-col
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 hidden md:flex items-center gap-3">
            <img src={LOGO_URL} alt="Athlete360" className="w-10 h-10 object-contain drop-shadow-sm" />
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">Athlete360</h1>
        </div>
        
        <nav className="mt-2 px-4 flex-1 overflow-y-auto custom-scrollbar">
          <ul className="space-y-1.5">
            {navItems.map((item) => {
              const active = isActive(item.path);
              const isAi = item.path === '/ai-coach';
              return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`relative flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group overflow-hidden ${
                    active
                      ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 font-semibold shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                  } ${isAi && !active ? 'border border-indigo-100 dark:border-indigo-900/30 bg-indigo-50/50 dark:bg-indigo-900/10' : ''}`}
                >
                  {/* Hover Effect */}
                  <div className={`absolute inset-0 w-1 bg-emerald-500 rounded-r-full transition-transform duration-200 ${active ? 'scale-y-100' : 'scale-y-0 group-hover:scale-y-50'} left-0`} />
                  
                  <span className={`relative z-10 ${isAi ? 'text-indigo-500 dark:text-indigo-400' : ''}`}>
                    {item.icon}
                  </span>
                  <span className="relative z-10">{item.name}</span>
                  
                  {isAi && (
                      <span className="ml-auto relative z-10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 rounded-full">
                          New
                      </span>
                  )}
                </Link>
              </li>
            )})}
          </ul>
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-3 bg-slate-50/50 dark:bg-black/20">
           <div className="flex items-center justify-between p-2 rounded-xl">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400 ml-2">Dark Mode</span>
              <button 
                onClick={toggleTheme} 
                className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${darkMode ? 'bg-slate-700' : 'bg-slate-300'}`}
              >
                  <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-300 ${darkMode ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
           </div>
           {onLogout && (
               <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:shadow-sm transition-all text-sm font-semibold">
                    <LogOut size={18} /> Sign Out
               </button>
           )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto h-[calc(100vh-64px)] md:h-screen relative bg-slate-50 dark:bg-[#0b1121]">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
        {/* Floating Chatbot only shown if NOT on the dedicated AI page */}
        {location.pathname !== '/ai-coach' && <AIChatbot />}
      </main>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-10 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;