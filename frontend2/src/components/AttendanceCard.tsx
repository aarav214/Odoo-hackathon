import { useState, useEffect } from 'react';
import { Clock, LogIn, LogOut, Coffee, History, CheckCircle2 } from 'lucide-react';
import { apiRequest, checkBackendStatus } from '../api';

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
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkedOut, setCheckedOut] = useState(false);
  const [checkInTimeStr, setCheckInTimeStr] = useState('--:--');
  const [checkOutTimeStr, setCheckOutTimeStr] = useState('--:--');
  const [workingHoursStr, setWorkingHoursStr] = useState('0h 00m');

  useEffect(() => {
    async function loadAttendance() {
      try {
        const isOnline = await checkBackendStatus();
        if (isOnline) {
          const records: any[] = await apiRequest('/attendance/me');
          const localDate = new Date();
          const localDateStr = `${localDate.getFullYear()}-${String(localDate.getMonth() + 1).padStart(2, '0')}-${String(localDate.getDate()).padStart(2, '0')}`;
          const utcDateStr = localDate.toISOString().split('T')[0];
          
          const todayRecord = records.find(r => {
            if (!r.date) return false;
            const recDateOnly = r.date.split('T')[0];
            return recDateOnly === localDateStr || recDateOnly === utcDateStr;
          });

          if (todayRecord) {
            if (todayRecord.check_in_time) {
              setCheckedIn(true);
              const checkInDate = new Date(todayRecord.check_in_time);
              setCheckInTimeStr(checkInDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
              
              if (!todayRecord.check_out_time) {
                const diffMs = new Date().getTime() - checkInDate.getTime();
                const diffHrs = Math.max(0, Math.floor(diffMs / 3600000));
                const diffMins = Math.max(0, Math.floor((diffMs % 3600000) / 60000));
                setWorkingHoursStr(`${diffHrs}h ${diffMins}m`);
              }
            }
            if (todayRecord.check_out_time) {
              setCheckedOut(true);
              const checkOutDate = new Date(todayRecord.check_out_time);
              setCheckOutTimeStr(checkOutDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
              
              const diffMs = new Date(todayRecord.check_out_time).getTime() - new Date(todayRecord.check_in_time).getTime();
              const diffHrs = Math.floor(diffMs / 3600000);
              const diffMins = Math.floor((diffMs % 3600000) / 60000);
              setWorkingHoursStr(`${diffHrs}h ${diffMins}m`);
            }
          }
        }
      } catch (e) {
        console.error('Failed to load attendance:', e);
      }
    }
    loadAttendance();
  }, []);

  const handleCheckIn = async () => {
    try {
      const isOnline = await checkBackendStatus();
      if (isOnline) {
        await apiRequest('/attendance/check-in', {
          method: 'POST',
          body: JSON.stringify({ lat: 0, lng: 0 })
        });
      }
      setCheckedIn(true);
      setCheckInTimeStr(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch (err: any) {
      alert(err.message || 'Check-in failed');
    }
  };

  const handleCheckOut = async () => {
    try {
      const isOnline = await checkBackendStatus();
      if (isOnline) {
        await apiRequest('/attendance/check-out', { method: 'POST' });
      }
      setCheckedOut(true);
      setCheckOutTimeStr(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch (err: any) {
      alert(err.message || 'Check-out failed');
    }
  };

  const circumference = 2 * Math.PI * 52;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="bg-white rounded-3xl border border-[#EDE8E0] warm-shadow card-hover p-6 fade-in-up">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-lg font-bold text-[#2F2A26]">Today's Attendance</h3>
          <p className="text-xs text-[#6E675F] mt-0.5">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>
        <span className="flex items-center gap-1.5 text-xs font-medium bg-[#7BAE7F15] text-[#5A9260] px-3 py-1.5 rounded-full">
          <span className="w-1.5 h-1.5 bg-[#7BAE7F] rounded-full pulse-dot" /> {checkedIn ? (checkedOut ? 'Checked Out' : 'Active') : 'Not Checked In'}
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
            <span className="text-2xl font-bold text-[#2F2A26]">{checkedIn ? (checkedOut ? '100%' : '75%') : '0%'}</span>
            <span className="text-[10px] text-[#6E675F]">Day Progress</span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex-1 grid grid-cols-2 gap-3">
          {[
            { icon: Clock, label: 'Working Hours', value: checkedIn ? workingHoursStr : '--:--', color: 'text-[#7BAE7F]' },
            { icon: LogIn, label: 'Check In', value: checkedIn ? checkInTimeStr : '--:--', color: 'text-[#A98E74]' },
            { icon: Coffee, label: 'Current Break', value: checkedIn && !checkedOut ? '18 min' : '--:--', color: 'text-[#C4AA8E]' },
            { icon: LogOut, label: 'Check Out', value: checkedOut ? checkOutTimeStr : '--:--', color: 'text-[#E07A5F]' },
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
          <span className="text-[11px] text-[#6E675F]">{checkedIn ? '5/5' : '4/5'} days present</span>
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
          onClick={handleCheckIn}
          disabled={checkedIn}
          className={`flex items-center justify-center gap-1.5 text-xs font-medium py-2.5 rounded-xl btn-scale ${
            checkedIn
              ? 'bg-[#7BAE7F20] text-[#5A9260] cursor-default'
              : 'bg-[#7BAE7F] hover:bg-[#5A9260] text-white'
          }`}
        >
          <LogIn size={13} /> {checkedIn ? 'Checked In' : 'Check In'}
        </button>
        <button
          onClick={handleCheckOut}
          disabled={!checkedIn || checkedOut}
          className={`flex items-center justify-center gap-1.5 text-xs font-medium py-2.5 rounded-xl btn-scale ${
            !checkedIn || checkedOut
              ? 'bg-[#EDE8E0] text-[#A09890] cursor-default'
              : 'bg-[#F4EFE7] hover:bg-[#EDE8E0] text-[#2F2A26]'
          }`}
        >
          <LogOut size={13} /> {checkedOut ? 'Checked Out' : 'Check Out'}
        </button>
        <button className="flex items-center justify-center gap-1.5 bg-[#F4EFE7] hover:bg-[#EDE8E0] text-[#2F2A26] text-xs font-medium py-2.5 rounded-xl btn-scale">
          <History size={13} /> History
        </button>
      </div>
    </div>
  );
}
