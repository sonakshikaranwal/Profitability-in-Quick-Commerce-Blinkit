import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { TrendingUp, Activity, Save, Zap, Truck, ShoppingBag, CheckCircle } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Simulator() {
  // 1. INPUTS STATE (Sticky: Loads from browser memory on refresh)
  const [inputs, setInputs] = useState(() => {
    const savedInputs = localStorage.getItem('current_simulation_inputs');
    return savedInputs ? JSON.parse(savedInputs) : {
      company_name: "Blinkit",
      city_tier: "Tier 1 (Delhi)",
      aov: 450,
      orders_per_day: 3000,
      delivery_cost: 55,
      commission_rate: 0.15,
      discount_rate: 5.0,
      fixed_cost_monthly: 200000
    };
  });

  // 2. HISTORY STATE (Cache Object: Keyed by Company Name)
  const [history, setHistory] = useState(() => {
    return JSON.parse(localStorage.getItem("scenarioCache")) || {};
  });

  const [result, setResult] = useState(null);
  const [savedStatus, setSavedStatus] = useState("");

  const entities = [
    { 
      id: "Blinkit", name: "Blinkit", focus: "Scale-First", desc: "High volume, optimized logistics.",
      icon: <Truck size={20} />, color: "bg-yellow-100 text-yellow-700",
      defaults: { aov: 450, orders_per_day: 3000, delivery_cost: 55, fixed_cost_monthly: 200000 }
    },
    { 
      id: "Zepto", name: "Zepto", focus: "Speed-First", desc: "Lower AOV, higher delivery cost.",
      icon: <Zap size={20} />, color: "bg-purple-100 text-purple-700",
      defaults: { aov: 350, orders_per_day: 2200, delivery_cost: 75, fixed_cost_monthly: 180000 }
    },
    { 
      id: "Instamart", name: "Instamart", focus: "Ecosystem", desc: "High AOV, leveraged fleet.",
      icon: <ShoppingBag size={20} />, color: "bg-orange-100 text-orange-700",
      defaults: { aov: 650, orders_per_day: 2500, delivery_cost: 60, fixed_cost_monthly: 150000 }
    },
  ];

  // --- HANDLERS ---
  const handleEntitySelect = (entity) => {
    const newInputs = { ...inputs, company_name: entity.id, ...entity.defaults };
    setInputs(newInputs);
    localStorage.setItem('current_simulation_inputs', JSON.stringify(newInputs));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newInputs = { ...inputs, [name]: name === "company_name" || name === "city_tier" ? value : parseFloat(value) };
    setInputs(newInputs);
    localStorage.setItem('current_simulation_inputs', JSON.stringify(newInputs));
  };

  const handleSimulate = async () => {
    try {
      // Use your Vercel URL here
      const response = await axios.post('https://quick-commerce-backend-livid.vercel.app/simulate', inputs);
      setResult(response.data);
      setSavedStatus("");
    } catch (error) {
      console.error("Connection Error", error);
    }
  };

  // Auto-calculate on input change
  useEffect(() => {
    const timer = setTimeout(() => handleSimulate(), 500);
    return () => clearTimeout(timer);
  }, [inputs]);

  // --- UPDATED SAVE LOGIC (Overwrite Strategy) ---
  const saveScenario = () => {
    if (!result) return;

    try {
      setSavedStatus("Saving...");

      // A. Update History Cache (For Sidebar) - Object Merge
      const updatedCache = {
        ...history,
        [inputs.company_name]: {
          inputs: { ...inputs },
          result: { ...result },
          updatedAt: Date.now()
        }
      };

      setHistory(updatedCache);
      localStorage.setItem("scenarioCache", JSON.stringify(updatedCache));

      // B. Update Market Data (For Market Analysis Page)
      const existingData = JSON.parse(localStorage.getItem('marketData') || '{}');
      existingData[inputs.company_name] = {
        ...result,
        strategic_verdict: result.strategic_verdict,
        net_profit_monthly: result.net_profit_monthly,
        contribution_margin: result.contribution_margin,
        break_even_orders: result.break_even_orders
      };
      localStorage.setItem('marketData', JSON.stringify(existingData));

      setSavedStatus("✅ Scenario Updated!");
      setTimeout(() => setSavedStatus(""), 2500);
    } catch (err) {
      console.error(err);
      setSavedStatus("❌ Save Failed");
    }
  };

  // --- CHART DATA ---
  const barData = result ? {
    labels: ['Revenue', 'Var Cost', 'Contribution'],
    datasets: [{
      label: 'Metrics (₹)',
      data: [result.revenue_per_order, result.variable_cost_per_order, result.contribution_margin],
      backgroundColor: ['#6366f1', '#f43f5e', result.contribution_margin > 0 ? '#10b981' : '#ef4444'],
      borderRadius: 6,
    }],
  } : null;

  return (
    <div className="p-8 fade-in">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Profitability Simulator</h2>
          <p className="text-slate-500 text-sm">Adjust levers to analyze unit economics viability.</p>
        </div>
        <div className="flex flex-col items-end gap-2">
            <button onClick={saveScenario} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-md transition">
              <Save size={16} /> Update {inputs.company_name} Scenario
            </button>
            {savedStatus && <span className="text-xs font-bold text-emerald-600 animate-pulse">{savedStatus}</span>}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: CONTROLS */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
             <div className="mb-6">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block">Target Entity</label>
                <div className="space-y-3">
                  {entities.map(c => (
                    <button key={c.id} onClick={() => handleEntitySelect(c)}
                      className={`w-full flex items-start justify-between p-3 rounded-xl border transition-all duration-200 ${inputs.company_name === c.id ? 'border-blue-600 bg-blue-50/50 shadow-md ring-1 ring-blue-600 scale-[1.02]' : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'}`}>
                      <div className="flex gap-3">
                        <div className={`p-2 rounded-lg h-fit ${c.color}`}>{c.icon}</div>
                        <div className="text-left">
                          <span className={`block font-bold text-sm ${inputs.company_name === c.id ? 'text-blue-900' : 'text-slate-700'}`}>{c.name}</span>
                          <span className="text-xs text-slate-500 block">{c.focus}</span>
                        </div>
                      </div>
                      {inputs.company_name === c.id && <CheckCircle size={18} className="text-blue-600 mt-1" />}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-6 pt-4 border-t border-slate-100">
                <div>
                  <div className="flex justify-between mb-2"><label className="text-sm font-medium text-slate-600">AOV (₹)</label><span className="text-sm font-bold text-blue-600">{inputs.aov}</span></div>
                  <input type="range" min="100" max="1000" step="10" name="aov" value={inputs.aov} onChange={handleChange} className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
                </div>
                <div>
                  <div className="flex justify-between mb-2"><label className="text-sm font-medium text-slate-600">Daily Orders</label><span className="text-sm font-bold text-blue-600">{inputs.orders_per_day}</span></div>
                  <input type="range" min="100" max="5000" step="100" name="orders_per_day" value={inputs.orders_per_day} onChange={handleChange} className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
                </div>
                <div>
                  <div className="flex justify-between mb-2"><label className="text-sm font-medium text-slate-600">Delivery Cost (₹)</label><span className="text-sm font-bold text-red-500">{inputs.delivery_cost}</span></div>
                  <input type="range" min="20" max="150" step="5" name="delivery_cost" value={inputs.delivery_cost} onChange={handleChange} className="w-full accent-red-500 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
                </div>
                 <div>
                  <div className="flex justify-between mb-2"><label className="text-sm font-medium text-slate-600">Fixed Cost (Monthly)</label><span className="text-sm font-bold text-slate-600">₹{(inputs.fixed_cost_monthly/1000).toFixed(0)}k</span></div>
                  <input type="range" min="50000" max="300000" step="5000" name="fixed_cost_monthly" value={inputs.fixed_cost_monthly} onChange={handleChange} className="w-full accent-slate-500 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
                </div>
              </div>
          </div>
          
          {/* UPDATED HISTORY LIST (OBJECT MAP) */}
          {Object.entries(history).length > 0 && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="font-semibold text-slate-700 mb-4">📜 Active Scenarios</h3>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {Object.entries(history)
                    .sort(([,a], [,b]) => b.updatedAt - a.updatedAt) // Sort by newest first
                    .map(([company, h]) => (
                    <div key={company} className="p-3 text-sm bg-slate-50 rounded-lg border border-slate-100 flex justify-between items-center">
                       <div>
                           <span className="font-bold block text-slate-700">{company}</span>
                           <span className="text-xs text-slate-400">Updated: {new Date(h.updatedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                       </div>
                       <div className={`font-bold ${h.result.net_profit_monthly > 0 ? 'text-green-600' : 'text-red-500'}`}>
                           {h.result.net_profit_monthly > 0 ? '+' : ''}{(h.result.net_profit_monthly/1000).toFixed(1)}k
                       </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>

        {/* RIGHT COLUMN: RESULTS */}
        <div className="lg:col-span-8 space-y-6">
           {result ? (
             <>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 border-l-4 border-l-blue-500">
                    <p className="text-slate-500 text-sm">Contribution Margin</p>
                    <h3 className="text-2xl font-bold text-slate-800">₹{result.contribution_margin}</h3>
                  </div>
                  <div className={`bg-white p-5 rounded-xl shadow-sm border border-slate-100 border-l-4 ${result.net_profit_monthly > 0 ? 'border-l-green-500' : 'border-l-red-500'}`}>
                    <p className="text-slate-500 text-sm">Net Profit (Monthly)</p>
                    <h3 className="text-2xl font-bold text-slate-800">{result.net_profit_monthly.toLocaleString()}</h3>
                  </div>
                  <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 border-l-4 border-l-purple-500">
                    <p className="text-slate-500 text-sm">Break Even Orders</p>
                    <h3 className="text-2xl font-bold text-slate-800">{result.break_even_orders === -1 ? "∞" : result.break_even_orders.toLocaleString()}</h3>
                  </div>
               </div>
               
               <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-8 rounded-2xl shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-6 opacity-5"><Activity size={120} /></div>
                  <div className="flex items-center gap-3 mb-2 relative z-10">
                    <TrendingUp className="text-blue-400" />
                    <h3 className="text-lg font-bold">AI Strategic Verdict</h3>
                  </div>
                  <p className="text-xl font-semibold mb-2 relative z-10 text-yellow-400">{result.strategic_verdict}</p>
                  <p className="text-slate-300 font-light relative z-10 leading-relaxed">{result.ai_recommendation}</p>
               </div>

               <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-80">
                 <h3 className="text-lg font-semibold text-slate-700 mb-6">Unit Economics Breakdown</h3>
                 {barData && <div className="h-60 w-full"><Bar data={barData} options={{ responsive: true, maintainAspectRatio: false, scales: { y: { grid: { display: false } }, x: { grid: { display: false } } }, plugins: { legend: { display: false } } }} /></div>}
               </div>
             </>
           ) : <div className="flex items-center justify-center h-full text-slate-400">Loading Simulation Engine...</div>}
        </div>
      </div>
    </div>
  );
}

export default Simulator;