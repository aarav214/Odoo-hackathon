import { Settings } from 'lucide-react';

const stats = [
  { label: 'Pending', value: 12, color: '#C49A4A', bg: '#F5EBD8' },
  { label: 'Approved', value: 48, color: '#6B8E5A', bg: '#E8F0E0' },
  { label: 'Rejected', value: 5, color: '#B5654E', bg: '#F2E0D8' },
  { label: "Today's Absent", value: 7, color: '#6B7B95', bg: '#E4E8EE' },
];

interface LeaveOverviewCardProps {
  onManageLeave?: () => void;
}

export default function LeaveOverviewCard({ onManageLeave }: LeaveOverviewCardProps = {}) {
  const total = stats.reduce((s, d) => s + d.value, 0);
  const radius = 38;
  const circ = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="card p-4 flex flex-col" style={{ borderRadius: 24 }}>
      <h2 className="font-serif text-[15px] mb-3" style={{ color: '#2D2419', fontWeight: 600 }}>Leave Overview</h2>

      {/* Donut */}
      <div className="relative w-24 h-24 mx-auto mb-3">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 96 96">
          {stats.map((s) => {
            const len = (s.value / total) * circ;
            const seg = (
              <circle
                key={s.label}
                cx="48" cy="48" r={radius}
                fill="none"
                stroke={s.color}
                strokeWidth="10"
                strokeDasharray={`${len} ${circ - len}`}
                strokeDashoffset={-offset}
                className="donut-segment"
              />
            );
            offset += len;
            return seg;
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-serif text-[16px] leading-none" style={{ color: '#2D2419', fontWeight: 600 }}>{total}</span>
          <span className="text-[8px]" style={{ color: '#A89A88' }}>Total</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-1.5 mb-3">
        {stats.map(s => (
          <div key={s.label} className="flex items-center gap-1.5 p-1.5 rounded-xl" style={{ background: s.bg }}>
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: s.color }} />
            <span className="text-[9px] flex-1 truncate" style={{ color: '#8A7B6A' }}>{s.label}</span>
            <span className="text-[11px] font-700" style={{ color: '#2D2419', fontWeight: 700 }}>{s.value}</span>
          </div>
        ))}
      </div>

      <button onClick={onManageLeave} className="btn-secondary w-full justify-center text-[11px] py-2 mt-auto">
        <Settings size={12} /> Manage Leave
      </button>
    </div>
  );
}
