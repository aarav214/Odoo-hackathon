import { FileText, Download, FileSpreadsheet, Wallet, Calendar } from 'lucide-react';

const salaryData = [42, 58, 35, 48, 62, 55, 40, 52, 45, 60, 38, 50];

export default function PayrollSummaryCard() {
  return (
    <div className="card p-5 flex flex-col" style={{ borderRadius: 24, height: 300 }}>
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-serif text-[20px] leading-tight" style={{ color: '#2D2419', fontWeight: 600 }}>Payroll Reports</h2>
        <span className="badge-green">Processed</span>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="rounded-2xl p-2.5" style={{ background: '#FBF8F3' }}>
          <div className="flex items-center gap-1.5 mb-1">
            <Wallet size={12} style={{ color: '#A0785A' }} />
            <span className="text-[10px]" style={{ color: '#A89A88' }}>Processed</span>
          </div>
          <p className="font-serif text-[18px] leading-none" style={{ color: '#2D2419', fontWeight: 600 }}>168</p>
        </div>
        <div className="rounded-2xl p-2.5" style={{ background: '#FBF8F3' }}>
          <div className="flex items-center gap-1.5 mb-1">
            <Calendar size={12} style={{ color: '#C49A4A' }} />
            <span className="text-[10px]" style={{ color: '#A89A88' }}>Pending</span>
          </div>
          <p className="font-serif text-[18px] leading-none" style={{ color: '#2D2419', fontWeight: 600 }}>12</p>
        </div>
        <div className="rounded-2xl p-2.5" style={{ background: '#FBF8F3' }}>
          <p className="text-[10px] mb-1" style={{ color: '#A89A88' }}>Monthly Payroll</p>
          <p className="font-serif text-[18px] leading-none" style={{ color: '#2D2419', fontWeight: 600 }}>₹18.4 L</p>
        </div>
        <div className="rounded-2xl p-2.5" style={{ background: '#FBF8F3' }}>
          <p className="text-[10px] mb-1" style={{ color: '#A89A88' }}>Avg Salary</p>
          <p className="font-serif text-[18px] leading-none" style={{ color: '#2D2419', fontWeight: 600 }}>₹58k</p>
        </div>
      </div>

      {/* Mini bar chart */}
      <div className="mb-2">
        <p className="text-[10px] mb-1.5" style={{ color: '#A89A88' }}>Salary Distribution</p>
        <div className="flex items-end gap-1 h-12">
          {salaryData.map((v, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-sm transition-opacity hover:opacity-100"
              style={{ height: `${(v / 65) * 100}%`, background: '#A0785A', opacity: 0.8, animation: `scaleIn 0.5s ease forwards`, animationDelay: `${i * 30}ms`, transformOrigin: 'bottom' }}
            />
          ))}
        </div>
      </div>

      {/* Next payroll */}
      <div className="flex items-center gap-2 mb-3 text-[11px]" style={{ color: '#8A7B6A' }}>
        <Calendar size={12} style={{ color: '#A0785A' }} />
        <span>Next payroll: <span className="font-600" style={{ color: '#2D2419', fontWeight: 600 }}>28 July</span></span>
      </div>

      {/* Buttons */}
      <div className="flex gap-1.5 mt-auto">
        <button className="btn-primary flex-1 justify-center text-[11px] py-2">
          <FileText size={12} /> Generate
        </button>
        <button className="btn-secondary flex-1 justify-center text-[11px] py-2">
          <Download size={12} /> PDF
        </button>
        <button className="btn-secondary flex-1 justify-center text-[11px] py-2">
          <FileSpreadsheet size={12} /> Excel
        </button>
      </div>
    </div>
  );
}
