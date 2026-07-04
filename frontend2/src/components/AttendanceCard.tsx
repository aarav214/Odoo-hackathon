import { useState, useEffect } from 'react';
import { Clock, LogIn, LogOut, Coffee, History, CheckCircle2 } from 'lucide-react';

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

const weekDays = [
  { day: 'Mon', status: 'present', hours: '8h 12m' },
  { day: 'Tue', status: 'present', hours: '8h 05m' },
  { day: 'Wed', status: 'present', hours: '7h 48m' },
  { day: 'Thu', status: 'present', hours: '8h 30m' },
  { day: 'Fri', status: 'present', hours: '6h 47m' },
  { day: 'Sat', status: 'weekend', hours: '-' },
  { day: 'Sun', status: 'weekend', hours: '-' },
];

const statusColor = (s: string) => {
  if (s === 'present') return 'bg-[#7BAE7F]';
  if (s === 'weekend') return 'bg-[#E0D8CC]';
  if (s === 'leave') return 'bg-[#A98E74]';
  if (s === 'absent') return 'bg-[#E07A5F]';
  return 'bg-[#E0D8CC]';
};

export default function AttendanceCard() {
  const progress = useCountUp(85);
  const [checkedIn, setCheckedIn] = useState(true);

  const circumference = 2 * Math.PI * 52;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="bg-white rounded-3xl border border-[#EDE8E0] warm-shadow card-hover p-6 fade-in-up">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-lg font-bold text-[#2F2A26]">Today's Attendance</h3>
          <p className="text-xs text-[#6E675F] mt-0.5">Friday, July 4, 2026</p>
        </div>
        <span className="flex items-center gap-1.5 text-xs font-medium bg-[#7BAE7F15] text-[#5A9260] px-3 py-1.5 rounded-full">
          <span className="w-1.5 h-1.5 bg-[#7BAE7F] rounded-full pulse-dot" /> Present
        </span>
      </div>

      <div className="flex items-center gap-6">
        {/* Progress ring */}
        <div className="relative w-32 h-32 shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="52" fill="none" stroke="#F4EFE7" strokeWidth="10" />
            <circle
              cx="60" cy="60" r="52" fill="none" stroke="url(#attGrad)" strokeWidth="10"
              strokeLinecap="round" strokeDasharray={circumference}
              strokeDashoffset={offset} className="progress-ring-circle"
            />
            <defs>
              <linearGradient id="attGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7BAE7F" />
                <stop offset="100%" stopColor="#5A9260" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-[#2F2A26]">{progress}%</span>
            <span className="text-[10px] text-[#6E675F]">Day Progress</span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex-1 grid grid-cols-2 gap-3">
          {[
            { icon: Clock, label: 'Working Hours', value: '6h 47m', color: 'text-[#7BAE7F]' },
            { icon: LogIn, label: 'Check In', value: '09:05 AM', color: 'text-[#A98E74]' },
            { icon: Coffee, label: 'Current Break', value: '18 min', color: 'text-[#C4AA8E]' },
            { icon: Clock, label: 'Remaining', value: '1h 13m', color: 'text-[#6E675F]' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="bg-[#FAF8F4] rounded-2xl p-3 border border-[#EDE8E0]">
              <div className="flex items-center gap-1.5 mb-1">
                <Icon size={12} className={color} />
                <span className="text-[10px] text-[#6E675F]">{label}</span>
              </div>
              <p className="text-base font-bold text-[#2F2A26]">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly timeline */}
      <div className="mt-5 pt-5 border-t border-[#EDE8E0]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-[#2F2A26]">Weekly Attendance</span>
          <span className="text-[11px] text-[#6E675F]">5/5 days present</span>
        </div>
        <div className="flex items-center justify-between">
          {weekDays.map(({ day, status, hours }) => (
            <div key={day} className="flex flex-col items-center gap-1.5">
              <span className="text-[10px] text-[#6E675F] font-medium">{day}</span>
              <div className={`w-7 h-7 rounded-full ${statusColor(status)} flex items-center justify-center transition-transform hover:scale-110`}>
                {status === 'present' && <CheckCircle2 size={12} className="text-white" />}
              </div>
              <span className="text-[9px] text-[#A09890]">{hours}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-5 grid grid-cols-3 gap-2">
        <button
          onClick={() => setCheckedIn(true)}
          disabled={checkedIn}
          className={`flex items-center justify-center gap-1.5 text-xs font-medium py-2.5 rounded-xl btn-scale ${
            checkedIn
              ? 'bg-[#7BAE7F20] text-[#5A9260] cursor-default'
              : 'bg-[#7BAE7F] hover:bg-[#5A9260] text-white'
          }`}
        >
          <LogIn size={13} /> {checkedIn ? 'Checked In' : 'Check In'}
        </button>
        <button className="flex items-center justify-center gap-1.5 bg-[#F4EFE7] hover:bg-[#EDE8E0] text-[#2F2A26] text-xs font-medium py-2.5 rounded-xl btn-scale">
          <LogOut size={13} /> Check Out
        </button>
        <button className="flex items-center justify-center gap-1.5 bg-[#F4EFE7] hover:bg-[#EDE8E0] text-[#2F2A26] text-xs font-medium py-2.5 rounded-xl btn-scale">
          <History size={13} /> History
        </button>
      </div>
    </div>
  );
}
