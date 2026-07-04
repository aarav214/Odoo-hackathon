import { useState, useEffect } from 'react';
import { CalendarDays, TrendingUp, Clock, Hourglass, ArrowUpRight } from 'lucide-react';

function useCountUp(target: number, duration = 1000) {
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

const kpis = [
  { icon: CalendarDays, label: 'Leave Balance', value: 14, suffix: ' Days', trend: '+2', color: 'from-[#7BAE7F] to-[#5A9260]', bg: 'bg-[#7BAE7F15]' },
  { icon: TrendingUp, label: 'Attendance Rate', value: 96, suffix: '%', trend: '+3%', color: 'from-[#A98E74] to-[#8A7257]', bg: 'bg-[#A98E7415]' },
  { icon: Hourglass, label: 'Pending Requests', value: 2, suffix: '', trend: '0', color: 'from-[#C4AA8E] to-[#A98E74]', bg: 'bg-[#C4AA8E15]' },
  { icon: Clock, label: "This Month's Hours", value: 168, suffix: ' hrs', trend: '+12', color: 'from-[#7BAE7F] to-[#A98E74]', bg: 'bg-[#7BAE7F15]' },
];

export default function QuickSummaryCard() {
  return (
    <div className="bg-white rounded-3xl border border-[#EDE8E0] warm-shadow card-hover p-5 fade-in-up">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-[#2F2A26]">Quick Summary</h3>
        <span className="text-[11px] text-[#6E675F]">This month</span>
      </div>
      <div className="space-y-3">
        {kpis.map(({ icon: Icon, label, value, suffix, trend, color, bg }) => {
          const v = useCountUp(value);
          return (
            <div key={label} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-[#FAF8F4] transition-colors">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shrink-0`}>
                <Icon size={16} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-[#6E675F]">{label}</p>
                <p className="text-lg font-bold text-[#2F2A26] leading-tight">
                  {v}<span className="text-sm font-medium text-[#6E675F]">{suffix}</span>
                </p>
              </div>
              <div className="flex items-center gap-0.5 text-[10px] font-medium text-[#5A9260] bg-[#7BAE7F15] px-1.5 py-0.5 rounded-full">
                <ArrowUpRight size={10} /> {trend}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
