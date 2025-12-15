import React from 'react';

function MarketAnalysis() {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">📊 Market Analysis & Competitor Benchmarking</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Example Static Card 1 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="font-semibold text-lg text-slate-700 mb-4">Market Share (Tier 1 Cities)</h3>
          <div className="h-4 bg-gray-100 rounded-full mb-3 overflow-hidden">
            <div className="h-full bg-yellow-400" style={{ width: '46%' }}></div>
          </div>
          <div className="flex justify-between text-sm text-slate-600 mb-4">
            <span>Blinkit (46%)</span>
            <span>Market Leader</span>
          </div>
           <div className="h-4 bg-gray-100 rounded-full mb-3 overflow-hidden">
            <div className="h-full bg-purple-500" style={{ width: '32%' }}></div>
          </div>
           <div className="flex justify-between text-sm text-slate-600">
            <span>Zepto (32%)</span>
            <span>Challenger</span>
          </div>
        </div>

        {/* Example Static Card 2 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="font-semibold text-lg text-slate-700 mb-4">Strategic Positioning Map</h3>
          <div className="border-l-2 border-b-2 border-slate-300 h-48 relative p-4">
            <span className="absolute bottom-[-25px] right-0 text-xs font-bold text-slate-500">Speed</span>
            <span className="absolute top-0 left-[-25px] text-xs font-bold text-slate-500 -rotate-90">Variety</span>
            
            <div className="absolute top-10 right-10 w-4 h-4 bg-yellow-400 rounded-full shadow-lg" title="Blinkit"></div>
            <div className="absolute bottom-10 right-4 w-4 h-4 bg-purple-500 rounded-full shadow-lg" title="Zepto"></div>
            <div className="absolute top-4 left-20 w-4 h-4 bg-orange-500 rounded-full shadow-lg" title="Instamart"></div>
          </div>
          <p className="text-xs text-slate-400 mt-4 text-center">Bubble size = Market Cap</p>
        </div>
      </div>
    </div>
  );
}
export default MarketAnalysis;