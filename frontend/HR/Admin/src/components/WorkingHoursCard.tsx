import { useState } from 'react';

const data = [7.5, 8.2, 8.5, 7.8, 8.4, 8.1, 8.2];
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function WorkingHoursCard() {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const w = 280, h = 100, pad = 10;
  const max = 9, min = 6.5;
  const xStep = (w - pad * 2) / (data.length - 1);
  const points = data.map((v, i) => {
    const x = pad + i * xStep;
    const y = h - pad - ((v - min) / (max - min)) * (h - pad * 2);
    return { x, y, v };
  });

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaD = `${pathD} L ${points[points.length - 1].x} ${h - pad} L ${points[0].x} ${h - pad} Z`;

  return (
    <div className="card p-5 flex flex-col" style={{ borderRadius: 24 }}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="font-serif text-[20px] leading-tight" style={{ color: '#2D2419', fontWeight: 600 }}>Working Hours</h2>
          <p className="text-[12px] mt-0.5" style={{ color: '#A89A88' }}>Past 7 days</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: '#A0785A' }} />
            <span className="text-[11px]" style={{ color: '#A89A88' }}>Hours</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="relative flex-1 min-h-[100px]">
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="wh-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#A0785A" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#A0785A" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={areaD} fill="url(#wh-grad)" />
          <path d={pathD} fill="none" stroke="#A0785A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="chart-line" />
          {points.map((p, i) => (
            <g key={i}>
              <circle
                cx={p.x} cy={p.y} r={hoverIdx === i ? 5 : 3.5}
                fill="white" stroke="#A0785A" strokeWidth="2"
                className="transition-all"
                onMouseEnter={() => setHoverIdx(i)}
                onMouseLeave={() => setHoverIdx(null)}
              />
              {hoverIdx === i && (
                <g>
                  <rect x={p.x - 18} y={p.y - 24} width="36" height="18" rx="6" fill="#2D2419" />
                  <text x={p.x} y={p.y - 12} textAnchor="middle" fill="white" fontSize="10" fontWeight="600">{p.v}h</text>
                </g>
              )}
            </g>
          ))}
        </svg>
        <div className="flex justify-between mt-1 px-1">
          {days.map(d => <span key={d} className="text-[9px]" style={{ color: '#A89A88' }}>{d}</span>)}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mt-3 pt-3" style={{ borderTop: '1px solid #F0E9DE' }}>
        <div>
          <p className="text-[10px]" style={{ color: '#A89A88' }}>Average</p>
          <p className="font-serif text-[16px]" style={{ color: '#2D2419', fontWeight: 600 }}>8.2<span className="text-[10px] font-400 ml-0.5" style={{ color: '#A89A88' }}>hrs</span></p>
        </div>
        <div>
          <p className="text-[10px]" style={{ color: '#A89A88' }}>Weekly</p>
          <p className="font-serif text-[16px]" style={{ color: '#2D2419', fontWeight: 600 }}>41<span className="text-[10px] font-400 ml-0.5" style={{ color: '#A89A88' }}>hrs</span></p>
        </div>
        <div>
          <p className="text-[10px]" style={{ color: '#A89A88' }}>Overtime</p>
          <p className="font-serif text-[16px]" style={{ color: '#2D2419', fontWeight: 600 }}>3.5<span className="text-[10px] font-400 ml-0.5" style={{ color: '#A89A88' }}>hrs</span></p>
        </div>
      </div>
    </div>
  );
}
