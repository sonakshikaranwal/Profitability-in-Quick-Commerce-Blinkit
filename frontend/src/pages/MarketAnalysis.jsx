import React from 'react';
import { 
  Chart as ChartJS, 
  RadialLinearScale, 
  ArcElement, 
  Tooltip, 
  Legend, 
  PointElement, 
  LineElement, 
  Filler 
} from 'chart.js';
import { Doughnut, Radar } from 'react-chartjs-2';
import { 
  TrendingUp, 
  Users, 
  MapPin, 
  Target, 
  Zap, 
  ShoppingBag, 
  Award, 
  ArrowUpRight, 
  ArrowDownRight 
} from 'lucide-react';

// Register ChartJS components
ChartJS.register(
  RadialLinearScale, 
  ArcElement, 
  Tooltip, 
  Legend, 
  PointElement, 
  LineElement, 
  Filler
);

function MarketAnalysis() {
  // 1. CHART DATA: Market Share (Doughnut)
  const marketShareData = {
    labels: ['Blinkit', 'Zepto', 'Instamart', 'BigBasket BB Now', 'Others'],
    datasets: [
      {
        data: [46, 28, 18, 5, 3],
        backgroundColor: [
          '#fbbf24', // Blinkit Yellow
          '#a855f7', // Zepto Purple
          '#f97316', // Instamart Orange
          '#ef4444', // BB Red
          '#cbd5e1', // Others
        ],
        borderWidth: 0,
        hoverOffset: 10,
      },
    ],
  };

  // 2. CHART DATA: Competitive Capabilities (Radar)
  const radarData = {
    labels: ['Delivery Speed', 'Product Variety', 'Dark Store Density', 'Tech/UX', 'Customer Loyalty', 'Price Competitiveness'],
    datasets: [
      {
        label: 'Blinkit',
        data: [85, 95, 90, 88, 82, 75],
        backgroundColor: 'rgba(251, 191, 36, 0.2)',
        borderColor: '#fbbf24',
        borderWidth: 2,
      },
      {
        label: 'Zepto',
        data: [98, 70, 80, 92, 78, 85],
        backgroundColor: 'rgba(168, 85, 247, 0.2)',
        borderColor: '#a855f7',
        borderWidth: 2,
      },
    ],
  };

  const radarOptions = {
    scales: {
      r: {
        angleLines: { color: '#e2e8f0' },
        grid: { color: '#e2e8f0' },
        ticks: { display: false },
        pointLabels: { font: { size: 12, weight: '600' }, color: '#64748b' }
      }
    },
    plugins: {
      legend: { position: 'bottom', labels: { usePointStyle: true, font: { family: 'Inter', size: 11 } } }
    }
  };

  // 3. KPI CARDS DATA
  const kpiMetrics = [
    { title: "Total Addressable Market", value: "$45B", change: "+18%", trend: "up", icon: <Target className="text-blue-600" size={24} /> },
    { title: "Avg. Daily Orders (Tier 1)", value: "2.4M", change: "+12%", trend: "up", icon: <ShoppingBag className="text-emerald-600" size={24} /> },
    { title: "Active Dark Stores", value: "1,850", change: "+85", trend: "up", icon: <MapPin className="text-purple-600" size={24} /> },
    { title: "Customer Retention Rate", value: "62%", change: "-2%", trend: "down", icon: <Users className="text-rose-600" size={24} /> },
  ];

  return (
    <div className="p-8 bg-slate-50 min-h-screen fade-in">
      {/* HEADER */}
      <header className="mb-10">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Market Intelligence</h2>
        <p className="text-slate-500 mt-2 text-lg">Q3 2025 Competitive Landscape & Industry Benchmarks</p>
      </header>

      {/* KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {kpiMetrics.map((kpi, index) => (
          <div key={index} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-slate-50 rounded-lg">{kpi.icon}</div>
              <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${kpi.trend === 'up' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                {kpi.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {kpi.change}
              </div>
            </div>
            <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wide">{kpi.title}</h3>
            <p className="text-2xl font-bold text-slate-800 mt-1">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
        
        {/* Market Share Doughnut */}
        <div className="lg:col-span-5 bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center">
          <div className="w-full flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800 text-lg">Market Share Distribution</h3>
            <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2 py-1 rounded">Tier 1 Cities</span>
          </div>
          <div className="w-64 h-64 relative">
             <Doughnut data={marketShareData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, padding: 20 } } } }} />
             <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                <span className="text-3xl font-bold text-slate-800">46%</span>
                <span className="text-xs text-slate-400 font-medium">Blinkit Lead</span>
             </div>
          </div>
        </div>

        {/* Radar Chart */}
        <div className="lg:col-span-7 bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
           <div className="w-full flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800 text-lg">Strategic Capabilities Audit</h3>
            <span className="text-xs font-semibold bg-blue-50 text-blue-700 px-2 py-1 rounded">Blinkit vs. Zepto</span>
          </div>
          <div className="h-80 w-full flex justify-center">
            <Radar data={radarData} options={radarOptions} />
          </div>
        </div>
      </div>

      {/* COMPARISON MATRIX (The "Battle Card") */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-800 text-lg">Competitor Battle Card</h3>
          <button className="text-blue-600 text-sm font-semibold hover:underline">Download Report</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="p-5 font-semibold border-b border-slate-200">Metric</th>
                <th className="p-5 font-semibold border-b border-slate-200 text-yellow-700 bg-yellow-50/50">Blinkit (Market Leader)</th>
                <th className="p-5 font-semibold border-b border-slate-200 text-purple-700 bg-purple-50/50">Zepto (Challenger)</th>
                <th className="p-5 font-semibold border-b border-slate-200 text-orange-700 bg-orange-50/50">Swiggy Instamart</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="p-5 font-medium text-slate-700 flex items-center gap-2">
                  <Award size={16} className="text-slate-400" /> Key Value Prop
                </td>
                <td className="p-5 text-slate-600 bg-yellow-50/10">Wide assortment & Reliability</td>
                <td className="p-5 text-slate-600 bg-purple-50/10">Pure Speed (10-min promise)</td>
                <td className="p-5 text-slate-600 bg-orange-50/10">Food delivery ecosystem bundling</td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="p-5 font-medium text-slate-700 flex items-center gap-2">
                  <Zap size={16} className="text-slate-400" /> Avg. Delivery Time
                </td>
                <td className="p-5 font-bold text-slate-800 bg-yellow-50/10">14.5 mins</td>
                <td className="p-5 font-bold text-slate-800 bg-purple-50/10">10.2 mins</td>
                <td className="p-5 font-bold text-slate-800 bg-orange-50/10">16.0 mins</td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="p-5 font-medium text-slate-700 flex items-center gap-2">
                  <TrendingUp size={16} className="text-slate-400" /> Profitability Status
                </td>
                <td className="p-5 text-emerald-600 font-bold bg-yellow-50/10">Contribution Positive</td>
                <td className="p-5 text-rose-500 font-bold bg-purple-50/10">High Cash Burn</td>
                <td className="p-5 text-emerald-600 font-bold bg-orange-50/10">Near Break-even</td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                 <td className="p-5 font-medium text-slate-700 flex items-center gap-2">
                  <Target size={16} className="text-slate-400" /> Strategic Focus (2025)
                </td>
                <td className="p-5 text-slate-600 bg-yellow-50/10">Adding high-margin categories (Electronics)</td>
                <td className="p-5 text-slate-600 bg-purple-50/10">Expanding dark store density in Tier 2</td>
                <td className="p-5 text-slate-600 bg-orange-50/10">Cross-selling with food users</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default MarketAnalysis;