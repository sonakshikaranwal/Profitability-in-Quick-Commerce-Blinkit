import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { 
  FileText, 
  Download, 
  CheckCircle, 
  AlertCircle, 
  PieChart, 
  TrendingUp, 
  Shield 
} from 'lucide-react';

function StrategicReports() {
  const [dataReady, setDataReady] = useState(false);
  const [cacheData, setCacheData] = useState({});

  useEffect(() => {
    const cachedRaw = localStorage.getItem('scenarioCache');
    if (cachedRaw) {
      setCacheData(JSON.parse(cachedRaw));
      setDataReady(true);
    }
  }, []);

  // --- 🎨 ADVANCED CHART ENGINE (AUTO-SCALING) ---
  const drawCharts = (doc, companies, data) => {
    
    // --- CHART 1: PROFITABILITY LANDSCAPE (Diverging Bar Chart) ---
    let startY = 145;
    doc.setFontSize(14);
    doc.setTextColor(30, 41, 59); // Dark Slate
    doc.text("3. Profitability Landscape (Net Profit)", 14, startY);
    
    // 1. Calculate Max Value for Scaling
    const profits = companies.map(c => data[c]?.result.net_profit_monthly || 0);
    const maxProfitAbs = Math.max(...profits.map(Math.abs)) || 1; // Avoid divide by zero
    const chartWidth = 70; // Max width of bar in one direction
    const scaleFactor = chartWidth / maxProfitAbs;
    
    const centerX = 105; // Middle of page
    const rowHeight = 15;

    // Draw Background Grid
    doc.setFillColor(248, 250, 252); // Very light gray
    doc.rect(14, startY + 5, 180, (companies.length * rowHeight) + 10, 'F');
    
    // Draw Center Axis
    doc.setDrawColor(203, 213, 225); // Slate 300
    doc.setLineWidth(0.5);
    doc.line(centerX, startY + 5, centerX, startY + 5 + (companies.length * rowHeight) + 10);

    companies.forEach((comp, i) => {
        const profit = data[comp]?.result.net_profit_monthly || 0;
        const barWidth = Math.abs(profit) * scaleFactor;
        const yPos = startY + 15 + (i * rowHeight);
        
        // Company Label
        doc.setFontSize(10);
        doc.setTextColor(71, 85, 105);
        doc.text(comp, 20, yPos + 5); // Label on far left

        // Draw Bar
        if (profit >= 0) {
            // Positive (Green, Right)
            doc.setFillColor(22, 163, 74); 
            doc.rect(centerX, yPos, barWidth, 8, 'F');
            // Value Label
            doc.setFontSize(9);
            doc.setTextColor(22, 163, 74);
            doc.text(`+${(profit/1000).toFixed(0)}k`, centerX + barWidth + 2, yPos + 5);
        } else {
            // Negative (Red, Left)
            doc.setFillColor(220, 38, 38); 
            doc.rect(centerX - barWidth, yPos, barWidth, 8, 'F');
            // Value Label
            doc.setFontSize(9);
            doc.setTextColor(220, 38, 38);
            doc.text(`${(profit/1000).toFixed(0)}k`, centerX - barWidth - 15, yPos + 5); // Shift label left
        }
    });

    // --- CHART 2: REVENUE VOLUME (Vertical Bar Chart) ---
    startY = 220; // Move further down
    doc.setFontSize(14);
    doc.setTextColor(30, 41, 59);
    doc.text("4. Projected Monthly Revenue Volume", 14, startY);

    // 1. Calculate Max Revenue for Scaling
    const revenues = companies.map(c => {
        const d = data[c]?.inputs;
        return (d?.aov * d?.orders_per_day * 30) || 0;
    });
    const maxRev = Math.max(...revenues) || 1;
    
    const chartBottom = startY + 50;
    const maxBarHeight = 35;
    const colWidth = 30;
    const startX = 45;
    const gap = 45;

    companies.forEach((comp, i) => {
        const d = data[comp]?.inputs;
        const rev = (d?.aov * d?.orders_per_day * 30) || 0;
        const barHeight = (rev / maxRev) * maxBarHeight;
        const xPos = startX + (i * gap);

        // Draw Bar
        doc.setFillColor(59, 130, 246); // Blue
        doc.rect(xPos, chartBottom - barHeight, colWidth, barHeight, 'F');
        
        // Axis Line at bottom
        doc.setDrawColor(203, 213, 225);
        doc.line(14, chartBottom, 196, chartBottom);

        // Labels
        doc.setFontSize(10);
        doc.setTextColor(30, 41, 59);
        doc.text(comp, xPos + (colWidth/2), chartBottom + 5, { align: 'center' }); // Centered text

        // Value on Top
        doc.setFontSize(8);
        doc.setTextColor(100);
        doc.text(`INR ${(rev/10000000).toFixed(2)}Cr`, xPos + (colWidth/2), chartBottom - barHeight - 2, { align: 'center' });
    });
  };

  const generateReport = (type) => {
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString();
    
    // -- 1. BRANDING HEADER --
    let headerColor = [15, 23, 42]; 
    let title = "Report";
    if (type === 'executive') { headerColor = [30, 58, 138]; title = "Executive Strategy Brief"; } 
    if (type === 'financial') { headerColor = [6, 78, 59]; title = "Financial Audit Report"; }
    if (type === 'investor')  { headerColor = [88, 28, 135]; title = "Investment Memorandum"; }

    // Header Box
    doc.setFillColor(...headerColor);
    doc.rect(0, 0, 210, 35, 'F');
    
    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    doc.text(title, 14, 18);
    
    // Subtitle
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(203, 213, 225);
    doc.text(`Generated: ${date} | Confidential Analysis`, 14, 26);

    const companies = ["Blinkit", "Zepto", "Instamart"];
    
    if (type === 'executive') {
        // --- EXECUTIVE CONTENT ---
        
        // Section 1: Text
        doc.setTextColor(30, 41, 59);
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("1. Operational Verdict", 14, 50);
        
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        doc.setTextColor(51, 65, 85);
        const summary = "Based on current unit economics, the market demonstrates divergent strategies. Profitability requires a Contribution Margin > INR 15 per order. Companies falling below this threshold are flagged for immediate operational intervention (e.g., Delivery Fee hikes or Dark Store optimization).";
        
        // Fix: Explicit width of 180 to prevent cutoff
        const splitText = doc.splitTextToSize(summary, 180);
        doc.text(splitText, 14, 60);

        // Section 2: Table
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(30, 41, 59);
        doc.text("2. Performance Matrix", 14, 85);
        
        const rows = companies.map(c => {
            const d = cacheData[c] || { result: { net_profit_monthly: 0, contribution_margin: 0, strategic_verdict: "No Data" } };
            return [c, `INR ${d.result.net_profit_monthly.toLocaleString()}`, `INR ${d.result.contribution_margin}`, d.result.strategic_verdict];
        });

        autoTable(doc, {
            startY: 90,
            head: [['Entity', 'Net Profit (Monthly)', 'Unit Margin', 'Strategic Verdict']],
            body: rows,
            theme: 'grid',
            headStyles: { fillColor: [30, 58, 138], fontStyle: 'bold' },
            styles: { fontSize: 10, cellPadding: 3 },
            columnStyles: {
                1: { halign: 'right' }, // Right align numbers
                2: { halign: 'right' }
            }
        });

        // Section 3 & 4: Graphs
        drawCharts(doc, companies, cacheData);
    } 
    // ... (Keep 'financial' and 'investor' logic same as previous, just adjust startY if needed) ...
    else if (type === 'financial') {
         // Re-insert previous financial logic here
         doc.setTextColor(30, 41, 59);
         doc.setFontSize(16);
         doc.text("1. Cost Structure Analysis", 14, 55);
         autoTable(doc, {
            startY: 65,
            head: [['Entity', 'Revenue/Order (AOV)', 'Var Cost/Order', 'Break-Even Vol']],
            body: companies.map(c => {
                 const d = cacheData[c] || { inputs: { aov: 0 }, result: { variable_cost_per_order: 0, break_even_orders: 0 } };
                 const aov = d.inputs?.aov || 0;
                 const varCost = d.result?.variable_cost_per_order || 0;
                 return [c, `INR ${aov}`, `INR ${varCost}`, `${d.result?.break_even_orders} daily`];
            }),
            theme: 'striped',
            headStyles: { fillColor: [6, 78, 59] },
        });
    }
    else if (type === 'investor') {
         // Re-insert previous investor logic here
         doc.setTextColor(88, 28, 135);
         doc.setFontSize(16);
         doc.text("1. Investment Thesis & TAM", 14, 55);
         doc.setFontSize(11);
         doc.setTextColor(71, 85, 105);
         const thesis = "The Q-Commerce sector is a 'Winner-Take-Most' market. We are evaluating assets based on Annualized GMV and scalability.";
         doc.text(doc.splitTextToSize(thesis, 180), 14, 65);
         
         const investorRows = companies.map(c => {
            const d = cacheData[c] || { inputs: { aov: 0, orders_per_day: 0 }, result: { strategic_verdict: "N/A" } };
            const annualGMV = (d.inputs?.aov * d.inputs?.orders_per_day * 365) || 0;
            const gmvCr = (annualGMV / 10000000).toFixed(2); 
            return [c, `INR ${gmvCr} Cr`, d.result?.strategic_verdict === "Market Leader" ? "Alpha (Buy)" : "Beta (Hold)", d.result?.strategic_verdict];
        });

        autoTable(doc, {
            startY: 85,
            head: [['Asset Class', 'Proj. Annual GMV', 'Rating', 'Competitive Moat']],
            body: investorRows,
            theme: 'grid',
            headStyles: { fillColor: [88, 28, 135] },
        });
    }

    // -- FOOTER --
    const pageCount = doc.internal.getNumberOfPages();
    for(var i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text('Page ' + i + ' of ' + pageCount, 195, 290, null, null, "right");
        doc.text('Quick Commerce Simulator © 2025 - Private & Confidential', 14, 290);
    }

    doc.save(`${type}_Deck_2025.pdf`);
  };

  return (
    <div className="p-8 fade-in min-h-screen bg-slate-50">
      <header className="mb-12">
        <h2 className="text-3xl font-extrabold text-slate-900">Strategic Reporting Hub</h2>
        <p className="text-slate-500 mt-2 text-lg">Generate board-ready documentation from your simulation data.</p>
      </header>

      <div className={`mb-10 p-4 rounded-lg border flex items-center gap-3 ${dataReady ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
        {dataReady ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
        <div>
            <h4 className="font-bold">{dataReady ? "Simulation Data Ready" : "No Simulation Data Found"}</h4>
            <p className="text-sm opacity-80">{dataReady ? "The engine has successfully cached your latest scenarios for export." : "Run a simulation in the 'Simulator' tab to populate reports."}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Executive */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-all group">
            <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform"><FileText size={28} /></div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Executive Brief</h3>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">Operational overview with visual Profit/Loss bridges and volume analysis.</p>
            <button onClick={() => generateReport('executive')} disabled={!dataReady} className="w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 transition-colors"><Download size={18} /> Download Brief</button>
        </div>
        
        {/* Financial */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-all group">
            <div className="w-14 h-14 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-transform"><TrendingUp size={28} /></div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Financial Audit</h3>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">Cost structure deep-dive. Analyzes Variable Costs, Fixed Costs, and Break-Even thresholds.</p>
            <button onClick={() => generateReport('financial')} disabled={!dataReady} className="w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 border-2 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 disabled:opacity-50 transition-all"><Download size={18} /> Download Audit</button>
        </div>

        {/* Investor */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-all group">
            <div className="w-14 h-14 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition-transform"><PieChart size={28} /></div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Investor Pitch Data</h3>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">Growth-focused analysis. Calculates Annualized GMV and assigns Investment Ratings.</p>
             <button onClick={() => generateReport('investor')} disabled={!dataReady} className="w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 border-2 border-purple-200 text-purple-700 hover:bg-purple-50 disabled:opacity-50 transition-all"><Download size={18} /> Download Memo</button>
        </div>
      </div>
    </div>
  );
}

export default StrategicReports;