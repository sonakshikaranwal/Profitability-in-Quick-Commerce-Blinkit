import React, { useState, useEffect } from 'react';
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
  Award, 
  ArrowUpRight, 
  ArrowDownRight,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend, PointElement, LineElement, Filler);

function MarketAnalysis() {
  const [marketData, setMarketData] = useState({});
  const [loading, setLoading] = useState(true);
  const [marketShareChart, setMarketShareChart] = useState(null);

  // --- DEFAULT FALLBACK DATA (If cache is empty) ---
  const defaultScenarios = {
    "Blinkit": { 
      inputs: { orders_per_day: 3000, aov: 450 }, 
      result: { net_profit_monthly: 120000, contribution_margin: 18.5, break_even_orders: 2500, strategic_verdict: "Market Leader (Default)" } 
    },
    "Zepto": { 
      inputs: { orders_per_day: 2200, aov: 350 }, 
      result: { net_profit_monthly: -45000, contribution_margin: 12.0, break_even_orders: 3100, strategic_verdict: "High Burn (Default)" } 
    },
    "Instamart": { 
      inputs: { orders_per_day: 2500, aov: 650 }, 
      result: { net_profit_monthly: 15000, contribution_margin: 16.5, break_even_orders: 2800, strategic_verdict: "Sustainable (Default)" } 
    }
  };

  useEffect(() => {
    // 1. READ FROM BROWSER CACHE (The "scenarioCache" we created in Simulator)
    const cachedRaw = localStorage.getItem('scenarioCache');
    let activeData = defaultScenarios;

    if (cachedRaw) {
      const parsedCache = JSON.parse(cachedRaw);
      // Merge: Start with defaults, overwrite with any actual simulations user ran
      activeData = { ...defaultScenarios, ...parsedCache };
    }

    setMarketData(activeData);

    // 2. CALCULATE DYNAMIC MARKET SHARE (Revenue Based)
    // Formula: Monthly Revenue = AOV * Daily Orders * 30
    const labels = [];
    const revenueData = [];
    const colors = [];
    const colorMap = { "Blinkit": "#fbbf24", "Zepto": "#a855f7", "Instamart": "#f97316" };

    Object.entries(activeData).forEach(([company, data]) => {
      const monthlyRevenue = (data.inputs.aov * data.inputs.orders_per_day * 30);
      labels.push(company);
      revenueData.push(monthlyRevenue);
      colors.push(colorMap[company] || "#cbd5e1");
    });

    setMarketShareChart({
      labels: labels,
      datasets: [{
        data: revenueData,
        backgroundColor: colors,
        borderWidth: 0,
        hoverOffset: 10,
      }],
    });

    setLoading(false);
  }, []);

  // Safe Accessor Helper
  const get = (company) => marketData[company] || defaultScenarios[company];

  const blinkit = get("Blinkit");
  const zepto = get("Zepto");
  const instamart = get("Instamart");

  // --- STATIC RADAR DATA (Hard to simulate UX/Speed, so we keep this representative) ---
  const radarData = {
    labels: ['Delivery Speed', 'Product Variety', 'Dark Store Density', 'Tech/UX', 'Loyalty', 'Price'],
    datasets: [
      {
        label: 'Blinkit',
        data: [85, 95, 90, 88, 82, 75],
        backgroundColor: 'rgba(251, 191, 36, 0.2)', // Yellow Fill
        borderColor: '#fbbf24',
        borderWidth: 2,
      },
      {
        label: 'Zepto',
        data: [98, 70, 80, 92, 78, 85],
        backgroundColor: 'rgba(168, 85, 247, 0.2)', // Purple Fill
        borderColor: '#a855f7',
        borderWidth: 2,
      },
      {
        label: 'Instamart',
        data: [75, 92, 85, 90, 95, 80], // Strong Loyalty/UX, Lower Speed
        backgroundColor: 'rgba(249, 115, 22, 0.2)', // Orange Fill
        borderColor: '#f97316',
        borderWidth: 2,
      }
    ],
  };

  const radarOptions = {
    scales: { r: { angleLines: { color: '#e2e8f0' }, grid: { color: '#e2e8f0' }, ticks: { display: false }, pointLabels: { font: { size: 12 }, color: '#64748b' } } },
    plugins: { legend: { position: 'bottom', labels: { usePointStyle: true } } }
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen fade-in">
      <header className="mb-10 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Market Intelligence</h2>
          <p className="text-slate-500 mt-2 text-lg">Analysis derived from your latest simulation scenarios.</p>
        </div>
        {!loading && <span className="flex items-center text-emerald-600 gap-2 font-medium bg-emerald-50 px-3 py-1 rounded-full text-sm"><RefreshCw size={16} /> Data Synced from Simulator</span>}
      </header>

      {/* KPI GRID (Dynamic) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        {["Blinkit", "Zepto", "Instamart"].map(comp => {
          const data = get(comp);
          const profit = data.result.net_profit_monthly;
          const isProfitable = profit >= 0;
          return (
             <div key={comp} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-1 h-full ${isProfitable ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider">{comp} Net Profit</h3>
                <p className={`text-2xl font-bold mt-2 ${isProfitable ? 'text-emerald-700' : 'text-rose-700'}`}>
                   {isProfitable ? '+' : ''}₹{(profit/1000).toFixed(1)}k
                </p>
                <p className="text-xs text-slate-400 mt-1">Monthly Projected</p>
             </div>
          )
        })}
         <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-center items-center text-center">
            <Target className="text-blue-500 mb-2" />
            <span className="text-xs font-bold text-slate-400 uppercase">Analysis Source</span>
            <span className="text-sm font-bold text-slate-700 mt-1">Live Simulation Cache</span>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
        {/* DYNAMIC MARKET SHARE CHART */}
        <div className="lg:col-span-5 bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center">
          <div className="w-full flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800 text-lg">Projected Revenue Share</h3>
            <span className="text-xs font-semibold bg-blue-50 text-blue-700 px-2 py-1 rounded">Based on AOV × Vol</span>
          </div>
          <div className="w-64 h-64 relative">
             {marketShareChart && <Doughnut data={marketShareChart} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, padding: 20 } } } }} />}
          </div>
        </div>

        {/* RADAR CHART (Static Context) */}
        <div className="lg:col-span-7 bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
           <h3 className="font-bold text-slate-800 text-lg mb-6">Strategic Capabilities Audit</h3>
           <div className="h-80 w-full flex justify-center"><Radar data={radarData} options={radarOptions} /></div>
        </div>
      </div>

      {/* DYNAMIC BATTLE CARD TABLE */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
            <Award size={20} className="text-yellow-600" /> Competitor Battle Card
          </h3>
          <span className="text-xs text-slate-500">Live data from Simulation Engine</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                <th className="p-5 font-semibold">Metric</th>
                <th className="p-5 font-semibold text-yellow-700 bg-yellow-50/30 border-l border-slate-100">Blinkit</th>
                <th className="p-5 font-semibold text-purple-700 bg-purple-50/30 border-l border-slate-100">Zepto</th>
                <th className="p-5 font-semibold text-orange-700 bg-orange-50/30 border-l border-slate-100">Instamart</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              <tr className="hover:bg-slate-50 group">
                <td className="p-5 font-medium text-slate-700 flex items-center gap-2 group-hover:text-blue-600 transition-colors">
                  <TrendingUp size={16} /> Monthly Net Profit
                </td>
                <td className="p-5 font-bold text-slate-800 border-l border-slate-100">₹{blinkit.result.net_profit_monthly.toLocaleString()}</td>
                <td className="p-5 font-bold text-slate-800 border-l border-slate-100">₹{zepto.result.net_profit_monthly.toLocaleString()}</td>
                <td className="p-5 font-bold text-slate-800 border-l border-slate-100">₹{instamart.result.net_profit_monthly.toLocaleString()}</td>
              </tr>
              <tr className="hover:bg-slate-50 group">
                <td className="p-5 font-medium text-slate-700 flex items-center gap-2 group-hover:text-blue-600 transition-colors">
                  <Zap size={16} /> Contribution Margin
                </td>
                <td className="p-5 font-bold text-slate-800 border-l border-slate-100">₹{blinkit.result.contribution_margin}</td>
                <td className="p-5 font-bold text-slate-800 border-l border-slate-100">₹{zepto.result.contribution_margin}</td>
                <td className="p-5 font-bold text-slate-800 border-l border-slate-100">₹{instamart.result.contribution_margin}</td>
              </tr>
               <tr className="hover:bg-slate-50 group">
                <td className="p-5 font-medium text-slate-700 flex items-center gap-2 group-hover:text-blue-600 transition-colors">
                  <Target size={16} /> Break-Even Vol
                </td>
                <td className="p-5 text-slate-600 border-l border-slate-100">{blinkit.result.break_even_orders} orders</td>
                <td className="p-5 text-slate-600 border-l border-slate-100">{zepto.result.break_even_orders} orders</td>
                <td className="p-5 text-slate-600 border-l border-slate-100">{instamart.result.break_even_orders} orders</td>
              </tr>
               <tr className="hover:bg-slate-50 group">
                <td className="p-5 font-medium text-slate-700 flex items-center gap-2 group-hover:text-blue-600 transition-colors">
                  <AlertTriangle size={16} /> Strategic Verdict
                </td>
                <td className="p-5 text-xs font-bold text-yellow-700 uppercase border-l border-slate-100">{blinkit.result.strategic_verdict}</td>
                <td className="p-5 text-xs font-bold text-purple-700 uppercase border-l border-slate-100">{zepto.result.strategic_verdict}</td>
                <td className="p-5 text-xs font-bold text-orange-700 uppercase border-l border-slate-100">{instamart.result.strategic_verdict}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default MarketAnalysis;