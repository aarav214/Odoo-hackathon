import { useState, useEffect } from 'react';
import { Download, History, FileText, TrendingUp, Wallet, Calendar } from 'lucide-react';

function useCountUp(target: number, duration = 1000, prefix = '') {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(eased * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return val;
}

const salaryData = [8200, 8200, 8450, 8450, 8700, 8700, 8900];

export default function PayrollCard({ onTabChange }: { onTabChange?: (tab: string) => void }) {
  const salary = useCountUp(8900);

  const w = 100, h = 40;
  const max = Math.max(...salaryData);
  const min = Math.min(...salaryData);
  const pts = salaryData.map((d, i) => {
    const x = (i / (salaryData.length - 1)) * w;
    const y = h - ((d - min) / (max - min || 1)) * h * 0.8 - h * 0.1;
    return { x, y };
  });
  const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `${path} L ${w} ${h} L 0 ${h} Z`;

  return (
    <div className="bg-white rounded-3xl border border-[#EDE8E0] warm-shadow card-hover p-5 fade-in-up">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-[#2F2A26]">Payroll Summary</h3>
        <span className="text-[11px] bg-[#7BAE7F15] text-[#5A9260] px-2.5 py-1 rounded-full font-medium">July 2026</span>
      </div>

      {/* Salary */}
      <div className="bg-gradient-to-br from-[#7BAE7F12] to-[#A98E7410] rounded-2xl p-4 border border-[#EDE8E0]">
        <div className="flex items-center gap-1.5 mb-1">
          <Wallet size={12} className="text-[#5A9260]" />
          <span className="text-[11px] text-[#6E675F]">Monthly Salary</span>
        </div>
        <p className="text-2xl font-bold text-[#2F2A26]">
          ${salary.toLocaleString()}<span className="text-sm font-medium text-[#6E675F]">.00</span>
        </p>
        <div className="flex items-center gap-1 mt-1">
          <TrendingUp size={11} className="text-[#5A9260]" />
          <span className="text-[11px] text-[#5A9260] font-medium">+$200 from last review</span>
        </div>
      </div>

      {/* Mini chart */}
      <div className="mt-3">
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-16" preserveAspectRatio="none">
          <defs>
            <linearGradient id="payGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#A98E74" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#A98E74" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={areaPath} fill="url(#payGrad)" />
          <path d={path} fill="none" stroke="#A98E74" strokeWidth="1.2" strokeLinecap="round" className="chart-line" />
        </svg>
      </div>

      {/* Details */}
      <div className="mt-3 space-y-2">
        {[
          { label: 'Last Credited', value: '$8,700.00', date: 'Jul 01', icon: Calendar },
          { label: 'Next Payroll', value: 'Aug 01, 2026', date: 'in 28 days', icon: Calendar },
          { label: 'PF Contribution', value: '$1,068.00', date: '12%', icon: Wallet },
          { label: 'Tax Deduction', value: '$1,335.00', date: '15%', icon: FileText },
        ].map(({ label, value, date, icon: Icon }) => (
          <div key={label} className="flex items-center justify-between py-1.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#F4EFE7] flex items-center justify-center">
                <Icon size={12} className="text-[#A98E74]" />
              </div>
              <span className="text-xs text-[#6E675F]">{label}</span>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-[#2F2A26]">{value}</p>
              <p className="text-[10px] text-[#A09890]">{date}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <button
          onClick={() => onTabChange?.('Payslips')}
          className="flex items-center justify-center gap-1 bg-[#7BAE7F] hover:bg-[#5A9260] text-white text-[11px] font-medium py-2 rounded-xl btn-scale"
        >
          <Download size={12} /> Payslip
        </button>
        <button
          onClick={() => onTabChange?.('Payslips')}
          className="flex items-center justify-center gap-1 bg-[#F4EFE7] hover:bg-[#EDE8E0] text-[#2F2A26] text-[11px] font-medium py-2 rounded-xl btn-scale"
        >
          <History size={12} /> History
        </button>
        <button
          onClick={() => onTabChange?.('Payslips')}
          className="flex items-center justify-center gap-1 bg-[#F4EFE7] hover:bg-[#EDE8E0] text-[#2F2A26] text-[11px] font-medium py-2 rounded-xl btn-scale"
        >
          <FileText size={12} /> Tax
        </button>
      </div>
    </div>
  );
}
