import { useState } from 'react';
import { TrendingUp, Clock, Zap, BarChart3 } from 'lucide-react';

const data = [7.5, 8.2, 7.8, 8.5, 6.8, 8.1, 6.8];
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const stats = [
  { icon: Clock, label: 'Avg Daily', value: '8.3 hrs', color: 'text-[#7BAE7F]' },
  { icon: BarChart3, label: 'Weekly', value: '41 hrs', color: 'text-[#A98E74]' },
  { icon: Zap, label: 'Overtime', value: '2.5 hrs', color: 'text-[#C4AA8E]' },
];

export default function WorkingHoursChart() {
  const [hover, setHover] = useState<number | null>(null);

  const w = 100;
  const h = 100;
  const max = 9;
  const pts = data.map((d, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - (d / max) * h;
    return { x, y, val: d };
  });

  const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `${path} L ${w} ${h} L 0 ${h} Z`;

  return (
    <div className="bg-white rounded-3xl border border-[#EDE8E0] warm-shadow card-hover p-6 fade-in-up">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-[#2F2A26]">Working Hours</h3>
          <p className="text-xs text-[#6E675F] mt-0.5">Last 7 working days</p>
        </div>
        <div className="flex items-center gap-1 text-xs font-medium text-[#5A9260] bg-[#7BAE7F15] px-2.5 py-1.5 rounded-full">
          <TrendingUp size={12} /> +8% vs last week
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {stats.map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="bg-[#FAF8F4] rounded-2xl p-3 border border-[#EDE8E0]">
            <div className="flex items-center gap-1.5 mb-1">
              <Icon size={12} className={color} />
              <span className="text-[10px] text-[#6E675F]">{label}</span>
            </div>
            <p className="text-base font-bold text-[#2F2A26]">{value}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="relative">
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-40" preserveAspectRatio="none">
          <defs>
            <linearGradient id="areaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#7BAE7F" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#7BAE7F" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7BAE7F" />
              <stop offset="100%" stopColor="#A98E74" />
            </linearGradient>
          </defs>
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map(y => (
            <line key={y} x1="0" y1={y} x2={w} y2={y} stroke="#EDE8E0" strokeWidth="0.3" />
          ))}
          <path d={areaPath} fill="url(#areaGrad)" />
          <path d={path} fill="none" stroke="url(#lineGrad)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="chart-line" />
          {pts.map((p, i) => (
            <g key={i}>
              <circle
                cx={p.x} cy={p.y} r={hover === i ? 1.8 : 1.2}
                fill={hover === i ? '#7BAE7F' : '#fff'}
                stroke="#7BAE7F" strokeWidth="0.6"
                className="transition-all"
              />
              {hover === i && (
                <circle cx={p.x} cy={p.y} r="3" fill="#7BAE7F30" />
              )}
            </g>
          ))}
        </svg>

        {/* Tooltip */}
        {hover !== null && (
          <div
            className="absolute -translate-x-1/2 -translate-y-full bg-white border border-[#EDE8E0] rounded-xl px-2.5 py-1.5 warm-shadow pointer-events-none z-10"
            style={{ left: `${pts[hover].x}%`, top: `${pts[hover].y}%` }}
          >
            <p className="text-[10px] text-[#6E675F]">{days[hover]}</p>
            <p className="text-xs font-bold text-[#2F2A26]">{data[hover]} hrs</p>
          </div>
        )}
      </div>

      {/* X labels */}
      <div className="flex justify-between mt-2 px-1">
        {days.map((d, i) => (
          <button
            key={d}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
            className={`text-[10px] transition-colors ${hover === i ? 'text-[#7BAE7F] font-semibold' : 'text-[#6E675F]'}`}
          >
            {d}
          </button>
        ))}
      </div>
    </div>
  );
}
