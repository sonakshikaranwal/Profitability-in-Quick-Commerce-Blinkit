import React from 'react';
import { FileText, Download, Table, FileSpreadsheet } from 'lucide-react';

function StrategicReports() {
  // Mock Data for Reports
  const reports = [
    { 
      id: 1, 
      title: "Q3 2025: Quick Commerce Profitability Outlook", 
      author: "Strategy Team",
      domain: "Financials",
      date: "Dec 15, 2025", 
      type: "PDF" 
    },
    { 
      id: 2, 
      title: "Impact of Dark Store Density on Last Mile Costs", 
      author: "Ops Research",
      domain: "Operations",
      date: "Nov 20, 2025", 
      type: "PDF" 
    },
    { 
      id: 3, 
      title: "Consumer Sensitivity to Delivery Fees in Tier 2 Cities", 
      author: "Market Intel",
      domain: "Marketing",
      date: "Oct 05, 2025", 
      type: "XLSX" 
    },
    { 
      id: 4, 
      title: "Zepto vs Blinkit: Speed vs Assortment Analysis", 
      author: "Competitive Intel",
      domain: "Strategy",
      date: "Sep 12, 2025", 
      type: "PDF" 
    },
  ];

  // FUNCTION: Simulate a File Download
  const handleDownload = (report) => {
    // 1. Create dummy content based on file type
    let content = "";
    let mimeType = "";
    let extension = "";

    if (report.type === "XLSX") {
      content = "Report Title,Date,Metric,Value\n" + report.title + "," + report.date + ",ROI,15%\n";
      mimeType = "text/csv"; // CSV opens in Excel automatically
      extension = "csv";
    } else {
      content = "STRATEGIC REPORT: " + report.title + "\n\nDATE: " + report.date + "\n\nEXECUTIVE SUMMARY:\nThis document analyzes the core unit economics...\n(This is a simulated PDF for the demo).";
      mimeType = "text/plain";
      extension = "txt"; // Browsers can't generate real PDFs without heavy libraries, but this proves the concept.
    }

    // 2. Create a Blob (Virtual File)
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);

    // 3. Create a fake link and click it
    const link = document.createElement("a");
    link.href = url;
    link.download = `${report.title.replace(/ /g, "_")}_${report.date}.${extension}`;
    document.body.appendChild(link);
    link.click();
    
    // 4. Cleanup
    document.body.removeChild(link);
  };

  return (
    <div className="p-8">
      <header className="mb-8 flex justify-between items-end">
         <div>
            <h2 className="text-2xl font-bold text-slate-800">📑 Strategic Reports Repository</h2>
            <p className="text-slate-500 mt-1">Access executive summaries, financial models, and operational deep-dives.</p>
         </div>
         <div className="text-right">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Reports</span>
            <p className="text-2xl font-bold text-slate-800">{reports.length}</p>
         </div>
      </header>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-5 font-semibold text-slate-600 text-sm uppercase tracking-wide">Report Details</th>
              <th className="p-5 font-semibold text-slate-600 text-sm uppercase tracking-wide">Domain</th>
              <th className="p-5 font-semibold text-slate-600 text-sm uppercase tracking-wide">Date</th>
              <th className="p-5 font-semibold text-slate-600 text-sm uppercase tracking-wide text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {reports.map((report) => (
              <tr key={report.id} className="hover:bg-blue-50/50 transition duration-150 group">
                <td className="p-5">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${report.type === 'XLSX' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {report.type === 'XLSX' ? <FileSpreadsheet size={20} /> : <FileText size={20} />}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-700 group-hover:text-blue-700 transition">{report.title}</h4>
                      <span className="text-xs text-slate-400">Authored by {report.author}</span>
                    </div>
                  </div>
                </td>
                <td className="p-5">
                  <span className="px-3 py-1 bg-slate-100 text-xs font-bold text-slate-600 rounded-full border border-slate-200">
                    {report.domain}
                  </span>
                </td>
                <td className="p-5 text-sm text-slate-500 font-medium">{report.date}</td>
                <td className="p-5 text-right">
                  <button 
                    onClick={() => handleDownload(report)}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                  >
                    <Download size={16} />
                    Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StrategicReports;