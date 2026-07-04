import { useState } from 'react';
import { Clock, Coffee, TrendingUp, LogIn, LogOut, AlertCircle, X } from 'lucide-react';
import { apiRequest, checkBackendStatus } from '../api';

const weekDays = [
  { day: 'Mon', status: 'present' },
  { day: 'Tue', status: 'present' },
  { day: 'Wed', status: 'present' },
  { day: 'Thu', status: 'present' },
  { day: 'Fri', status: 'present' },
  { day: 'Sat', status: 'absent' },
  { day: 'Sun', status: 'absent' },
];

export default function AttendanceCard() {
  const [checkedIn, setCheckedIn] = useState(true);
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);
  const [correctionDate, setCorrectionDate] = useState('2026-07-04');
  const [correctionType, setCorrectionType] = useState('check-in');
  const [correctionTime, setCorrectionTime] = useState('09:00');
  const [correctionReason, setCorrectionReason] = useState('');

  const handleCheckIn = async () => {
    try {
      const isOnline = await checkBackendStatus();
      if (isOnline) {
        await apiRequest('/attendance/check-in', {
          method: 'POST',
          body: JSON.stringify({ lat: 28.6139, lng: 77.2090 })
        });
        alert('Successfully checked in!');
      } else {
        alert('Mock Check In recorded (Offline Mode)');
      }
      setCheckedIn(true);
    } catch (err: any) {
      alert(err.message || 'Failed to check in.');
    }
  };

  const handleCheckOut = async () => {
    try {
      const isOnline = await checkBackendStatus();
      if (isOnline) {
        await apiRequest('/attendance/check-out', {
          method: 'POST'
        });
        alert('Successfully checked out!');
      } else {
        alert('Mock Check Out recorded (Offline Mode)');
      }
      setCheckedIn(false);
    } catch (err: any) {
      alert(err.message || 'Failed to check out.');
    }
  };

  const handleCorrectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!correctionReason) {
      alert('Please provide a reason for the correction.');
      return;
    }
    try {
      const isOnline = await checkBackendStatus();
      if (isOnline) {
        let attendanceId = 1;
        try {
          const records = await apiRequest('/attendance/me');
          if (records && records.length > 0) {
            attendanceId = records[0].id;
          }
        } catch (err) {}

        await apiRequest('/corrections/', {
          method: 'POST',
          body: JSON.stringify({
            attendance_id: attendanceId,
            requested_change: `${correctionType === 'check-in' ? 'Check-in time' : 'Check-out time'} to ${correctionTime} on ${correctionDate}`,
            reason: correctionReason
          })
        });
        alert('Attendance correction request submitted successfully!');
      } else {
        alert(`Mock correction submitted (Offline Mode):\nRequested ${correctionType} time correction to ${correctionTime} on ${correctionDate}.\nReason: ${correctionReason}`);
      }
      setShowCorrectionModal(false);
      setCorrectionReason('');
    } catch (err: any) {
      alert(err.message || 'Failed to submit correction request.');
    }
  };

  return (
    <div className="card p-5 flex flex-col" style={{ borderRadius: 24 }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-serif text-[20px] leading-tight" style={{ color: '#2D2419', fontWeight: 600 }}>Today's Attendance</h2>
          <p className="text-[12px] mt-0.5" style={{ color: '#A89A88' }}>Thursday, 4 July 2026</p>
        </div>
        <span className="badge-green flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full inline-block animate-pulse" style={{ background: '#6B8E5A' }} />
          Present
        </span>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="rounded-2xl p-3" style={{ background: '#FBF8F3' }}>
          <div className="flex items-center gap-1.5 mb-1">
            <Clock size={13} style={{ color: '#A0785A' }} />
            <span className="text-[11px]" style={{ color: '#A89A88' }}>Working Hours</span>
          </div>
          <p className="font-serif text-[20px] leading-tight" style={{ color: '#2D2419', fontWeight: 600 }}>6h 42m</p>
        </div>
        <div className="rounded-2xl p-3" style={{ background: '#FBF8F3' }}>
          <div className="flex items-center gap-1.5 mb-1">
            <LogIn size={13} style={{ color: '#6B7B95' }} />
            <span className="text-[11px]" style={{ color: '#A89A88' }}>Check In</span>
          </div>
          <p className="font-serif text-[20px] leading-tight" style={{ color: '#2D2419', fontWeight: 600 }}>09:02</p>
        </div>
        <div className="rounded-2xl p-3" style={{ background: '#FBF8F3' }}>
          <div className="flex items-center gap-1.5 mb-1">
            <Coffee size={13} style={{ color: '#C49A4A' }} />
            <span className="text-[11px]" style={{ color: '#A89A88' }}>Break Time</span>
          </div>
          <p className="font-serif text-[20px] leading-tight" style={{ color: '#2D2419', fontWeight: 600 }}>38m</p>
        </div>
      </div>

      {/* Productivity ring + weekly timeline */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="relative w-16 h-16">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="26" fill="none" stroke="#F0E9DE" strokeWidth="6" />
              <circle
                cx="32" cy="32" r="26" fill="none" stroke="#A0785A" strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 26}
                strokeDashoffset={2 * Math.PI * 26 * (1 - 0.87)}
                className="donut-segment"
                style={{ transition: 'stroke-dashoffset 1.2s ease' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-serif text-[16px] leading-none" style={{ color: '#2D2419', fontWeight: 600 }}>87%</span>
              <span className="text-[8px] mt-0.5" style={{ color: '#A89A88' }}>Score</span>
            </div>
          </div>
          <div>
            <p className="text-[12px] font-600" style={{ color: '#2D2419', fontWeight: 600 }}>Productivity</p>
            <p className="text-[11px]" style={{ color: '#A89A88' }}>Above team avg</p>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp size={11} style={{ color: '#6B8E5A' }} />
              <span className="text-[10px] font-600" style={{ color: '#6B8E5A', fontWeight: 600 }}>+4% this week</span>
            </div>
          </div>
        </div>

        {/* Weekly dots */}
        <div className="flex items-center gap-1.5">
          {weekDays.map((d) => (
            <div key={d.day} className="flex flex-col items-center gap-1">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: d.status === 'present' ? '#A0785A' : '#E8DFD3' }}
                title={d.status}
              />
              <span className="text-[9px]" style={{ color: '#A89A88' }}>{d.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 mt-auto">
        <button
          onClick={handleCheckIn}
          className="flex-1 py-2.5 rounded-xl text-[12px] font-600 transition-all flex items-center justify-center gap-1.5"
          style={checkedIn
            ? { background: '#A0785A', color: 'white', fontWeight: 600 }
            : { background: '#FBF8F3', color: '#8A7B6A', border: '1px solid #E8DFD3', fontWeight: 600 }
          }
        >
          <LogIn size={13} /> Check In
        </button>
        <button
          onClick={handleCheckOut}
          className="flex-1 py-2.5 rounded-xl text-[12px] font-600 transition-all flex items-center justify-center gap-1.5"
          style={!checkedIn
            ? { background: '#B5654E', color: 'white', fontWeight: 600 }
            : { background: '#FBF8F3', color: '#8A7B6A', border: '1px solid #E8DFD3', fontWeight: 600 }
          }
        >
          <LogOut size={13} /> Check Out
        </button>
        <button
          onClick={() => setShowCorrectionModal(true)}
          className="flex-1 py-2.5 rounded-xl text-[12px] font-600 transition-all flex items-center justify-center gap-1.5"
          style={{ background: '#FBF8F3', color: '#8A7B6A', border: '1px solid #E8DFD3', fontWeight: 600 }}
        >
          <AlertCircle size={13} /> Correction
        </button>
      </div>

      {showCorrectionModal && (
        <div className="fixed inset-0 bg-[#2d241950] backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border" style={{ borderColor: '#E8DFD3' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-[18px] font-bold" style={{ color: '#2D2419' }}>Attendance Correction</h3>
              <button onClick={() => setShowCorrectionModal(false)} className="hover:bg-[#F5EDE0] p-1 rounded-lg" style={{ color: '#A89A88' }}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCorrectionSubmit} className="space-y-3.5">
              <div>
                <label className="text-[10px] font-600 block mb-1 uppercase tracking-wider" style={{ color: '#8A7B6A', fontWeight: 600 }}>Date</label>
                <input
                  type="date"
                  value={correctionDate}
                  onChange={e => setCorrectionDate(e.target.value)}
                  className="w-full p-2 text-[12px] rounded-lg border outline-none focus:border-[#A0785A]"
                  style={{ borderColor: '#E8DFD3' }}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-600 block mb-1 uppercase tracking-wider" style={{ color: '#8A7B6A', fontWeight: 600 }}>Type</label>
                  <select
                    value={correctionType}
                    onChange={e => setCorrectionType(e.target.value)}
                    className="w-full p-2.5 text-[12px] rounded-lg border outline-none bg-white cursor-pointer"
                    style={{ borderColor: '#E8DFD3' }}
                  >
                    <option value="check-in">Check In</option>
                    <option value="check-out">Check Out</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-600 block mb-1 uppercase tracking-wider" style={{ color: '#8A7B6A', fontWeight: 600 }}>Correct Time</label>
                  <input
                    type="time"
                    value={correctionTime}
                    onChange={e => setCorrectionTime(e.target.value)}
                    className="w-full p-2 text-[12px] rounded-lg border outline-none focus:border-[#A0785A]"
                    style={{ borderColor: '#E8DFD3' }}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-600 block mb-1 uppercase tracking-wider" style={{ color: '#8A7B6A', fontWeight: 600 }}>Reason</label>
                <textarea
                  value={correctionReason}
                  onChange={e => setCorrectionReason(e.target.value)}
                  placeholder="Reason for correction request..."
                  rows={3}
                  className="w-full p-2 text-[12px] rounded-lg border outline-none focus:border-[#A0785A]"
                  style={{ borderColor: '#E8DFD3' }}
                  required
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 btn-primary py-2 justify-center rounded-xl text-[12px]">
                  Submit Request
                </button>
                <button type="button" onClick={() => setShowCorrectionModal(false)} className="flex-1 btn-secondary py-2 justify-center rounded-xl text-[12px]">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
