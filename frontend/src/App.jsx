import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, TrendingUp, Activity, Briefcase } from 'lucide-react';

// Import Pages
import Simulator from './pages/Simulator';
import MarketAnalysis from './pages/MarketAnalysis';
import StrategicReports from './pages/StrategicReports';

// Sidebar Component (Internal to App.jsx for simplicity)
const Sidebar = () => {
  const location = useLocation(); // To highlight active tab

  const isActive = (path) => location.pathname === path 
    ? "bg-blue-900/30 text-blue-400 font-medium" 
    : "text-slate-400 hover:text-white hover:bg-white/5";

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 hidden md:flex flex-col p-6 fixed h-full shadow-2xl z-10">
      <div className="flex items-center gap-3 mb-10 text-white">
        <TrendingUp className="w-8 h-8 text-blue-400" />
        <h1 className="text-xl font-bold tracking-tight">ProfitEngine<span className="text-blue-400">.AI</span></h1>
      </div>
      <nav className="space-y-2">
        <Link to="/" className={`flex items-center gap-3 p-3 rounded-lg transition ${isActive('/')}`}>
          <LayoutDashboard size={20} />
          <span>Simulator</span>
        </Link>
        <Link to="/market-analysis" className={`flex items-center gap-3 p-3 rounded-lg transition ${isActive('/market-analysis')}`}>
          <Activity size={20} />
          <span>Market Analysis</span>
        </Link>
        <Link to="/reports" className={`flex items-center gap-3 p-3 rounded-lg transition ${isActive('/reports')}`}>
          <Briefcase size={20} />
          <span>Strategic Reports</span>
        </Link>
      </nav>
      <div className="mt-auto pt-6 border-t border-slate-700">
        <p className="text-xs text-slate-500">v1.3.0 • EMBA Edition</p>
      </div>
    </aside>
  );
};

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-slate-50 font-sans text-slate-800">
        <Sidebar />
        
        {/* Main Content Area */}
        <main className="flex-1 md:ml-64 transition-all duration-300">
          <Routes>
            <Route path="/" element={<Simulator />} />
            <Route path="/market-analysis" element={<MarketAnalysis />} />
            <Route path="/reports" element={<StrategicReports />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;