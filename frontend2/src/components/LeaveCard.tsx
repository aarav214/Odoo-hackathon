import { useState, useEffect } from 'react';
import { CalendarPlus, History, Users, TrendingDown, TrendingUp, Clock, X } from 'lucide-react';

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

const categories = [
  { name: 'Casual Leave', value: 5, color: '#7BAE7F' },
  { name: 'Sick Leave', value: 2, color: '#A98E74' },
  { name: 'Paid Leave', value: 1, color: '#C4AA8E' },
  { name: 'Unpaid Leave', value: 0, color: '#E0D8CC' },
];

export default function LeaveCard() {
  const available = useCountUp(14);
  const used = useCountUp(8);
  const pending = useCountUp(2);
  const rejected = useCountUp(1);

  const total = categories.reduce((s, c) => s + c.value, 0) || 1;
  let acc = 0;
  const segments = categories.map(c => {
    const start = (acc / total) * 360;
    acc += c.value;
    const end = (acc / total) * 360;
    return { ...c, start, end };
  });

  const donut = (start: number, end: number, r: number, color: string) => {
    const rad = (a: number) => (a - 90) * (Math.PI / 180);
    const x1 = 50 + r * Math.cos(rad(start));
    const y1 = 50 + r * Math.sin(rad(start));
    const x2 = 50 + r * Math.cos(rad(end));
    const y2 = 50 + r * Math.sin(rad(end));
    const large = end - start > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
  };

  return (
    <div className="bg-white rounded-3xl border border-[#EDE8E0] warm-shadow card-hover p-6 fade-in-up">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-lg font-bold text-[#2F2A26]">Leave Management</h3>
          <p className="text-xs text-[#6E675F] mt-0.5">Annual leave overview</p>
        </div>
        <span className="text-[11px] bg-[#7BAE7F15] text-[#5A9260] px-2.5 py-1 rounded-full font-medium">2026</span>
      </div>

      <div className="grid grid-cols-5 gap-4">
        {/* Left: stats */}
        <div className="col-span-3 grid grid-cols-2 gap-3">
          {[
            { label: 'Available', value: available, suffix: '', icon: TrendingUp, color: 'bg-[#7BAE7F15] text-[#5A9260]' },
            { label: 'Used', value: used, suffix: '', icon: TrendingDown, color: 'bg-[#A98E7415] text-[#A98E74]' },
            { label: 'Pending', value: pending, suffix: '', icon: Clock, color: 'bg-[#C4AA8E15] text-[#C4AA8E]' },
            { label: 'Rejected', value: rejected, suffix: '', icon: X, color: 'bg-[#E07A5F15] text-[#E07A5F]' },
          ].map(({ label, value, suffix, icon: Icon, color }) => (
            <div key={label} className="bg-[#FAF8F4] rounded-2xl p-3 border border-[#EDE8E0]">
              <div className={`w-7 h-7 rounded-lg ${color} flex items-center justify-center mb-2`}>
                <Icon size={13} />
              </div>
              <p className="text-[10px] text-[#6E675F]">{label}</p>
              <p className="text-xl font-bold text-[#2F2A26]">{value}{suffix}</p>
            </div>
          ))}
        </div>

        {/* Right: donut */}
        <div className="col-span-2 flex flex-col items-center justify-center">
          <div className="relative w-28 h-28">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-0">
              <circle cx="50" cy="50" r="38" fill="none" stroke="#F4EFE7" strokeWidth="10" />
              {segments.map(s => (
                <path
                  key={s.name}
                  d={donut(s.start, s.end, 38, s.color)}
                  fill="none" stroke={s.color} strokeWidth="10" strokeLinecap="round"
                />
              ))}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-bold text-[#2F2A26]">{used}</span>
              <span className="text-[10px] text-[#6E675F]">used</span>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="mt-5 pt-5 border-t border-[#EDE8E0] grid grid-cols-4 gap-3">
        {categories.map(c => (
          <div key={c.name} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: c.color }} />
            <div className="min-w-0">
              <p className="text-[10px] text-[#6E675F] truncate">{c.name}</p>
              <p className="text-sm font-bold text-[#2F2A26]">{c.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="mt-5 grid grid-cols-3 gap-2">
        <button className="flex items-center justify-center gap-1.5 bg-[#7BAE7F] hover:bg-[#5A9260] text-white text-xs font-medium py-2.5 rounded-xl btn-scale">
          <CalendarPlus size={13} /> Apply Leave
        </button>
        <button className="flex items-center justify-center gap-1.5 bg-[#F4EFE7] hover:bg-[#EDE8E0] text-[#2F2A26] text-xs font-medium py-2.5 rounded-xl btn-scale">
          <History size={13} /> History
        </button>
        <button className="flex items-center justify-center gap-1.5 bg-[#F4EFE7] hover:bg-[#EDE8E0] text-[#2F2A26] text-xs font-medium py-2.5 rounded-xl btn-scale">
          <Users size={13} /> Team Cal
        </button>
      </div>
    </div>
  );
}
