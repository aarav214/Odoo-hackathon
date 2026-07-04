import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, User, Plus, Clock, Check, AlertCircle } from 'lucide-react';
import { apiRequest, checkBackendStatus } from '../api';

interface Event {
  id: number;
  title: string;
  type: 'leave' | 'holiday' | 'event';
  startDate: string;
  endDate: string;
  color: string;
  status?: string;
  description?: string;
}

const staticEvents: Event[] = [
  { id: 101, title: 'Independence Day (Holiday)', type: 'holiday', startDate: '2026-07-04', endDate: '2026-07-04', color: '#E07A5F', description: 'National holiday' },
  { id: 102, title: 'Company Anniversary Celebration', type: 'event', startDate: '2026-07-15', endDate: '2026-07-15', color: '#A98E74', description: 'All-hands event' },
];

export default function CalendarSection() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 6, 1)); // Seeding July 2026
  const [events, setEvents] = useState<Event[]>(staticEvents);
  const [showApplyModal, setShowApplyModal] = useState(false);
  
  // Leave form states
  const [leaveType, setLeaveType] = useState('paid');
  const [startDate, setStartDate] = useState('2026-07-10');
  const [endDate, setEndDate] = useState('2026-07-12');
  const [remarks, setRemarks] = useState('');

  const loadLeaves = async () => {
    try {
      const isOnline = await checkBackendStatus();
      if (isOnline) {
        const data = await apiRequest('/leave/');
        const leaveEvents = data.map((l: any) => ({
          id: l.id,
          title: `My Leave (${l.leave_type})`,
          type: 'leave' as const,
          startDate: l.start_date,
          endDate: l.end_date,
          color: l.status === 'approved' ? '#7BAE7F' : l.status === 'pending' ? '#C4AA8E' : '#E07A5F',
          status: l.status,
          description: l.remarks || 'Personal leave request'
        }));
        setEvents([...staticEvents, ...leaveEvents]);
      }
    } catch (e) {
      console.error('Failed to load leaves in employee calendar:', e);
    }
  };

  useEffect(() => {
    loadLeaves();
  }, []);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleApplyLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const isOnline = await checkBackendStatus();
      if (isOnline) {
        await apiRequest('/leave/', {
          method: 'POST',
          body: JSON.stringify({
            leave_type: leaveType,
            start_date: startDate,
            end_date: endDate,
            remarks
          })
        });
        alert('Leave request submitted successfully!');
        loadLeaves();
        setShowApplyModal(false);
      } else {
        const mockNew: Event = {
          id: Date.now(),
          title: `My Leave (${leaveType})`,
          type: 'leave',
          startDate,
          endDate,
          color: '#C4AA8E',
          status: 'pending',
          description: remarks
        };
        setEvents([...events, mockNew]);
        alert('Leave simulated successfully (offline mode)');
        setShowApplyModal(false);
      }
    } catch (e: any) {
      alert(e.message || 'Failed to submit leave request');
    }
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const daysArray = [];
  for (let i = 0; i < firstDayIndex; i++) daysArray.push(null);
  for (let i = 1; i <= daysInMonth; i++) daysArray.push(i);

  const getEventsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(e => dateStr >= e.startDate && dateStr <= e.endDate);
  };

  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  return (
    <div className="flex gap-5 min-h-[500px]">
      {/* Calendar Area */}
      <div className="flex-1 bg-white rounded-3xl border border-[#EDE8E0] p-6 warm-shadow">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#7BAE7F15] text-[#7BAE7F] flex items-center justify-center">
              <CalendarIcon size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#2F2A26]">{monthName} {year}</h3>
              <p className="text-xs text-[#6E675F]">Check your leaves and holidays calendar</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={handlePrevMonth} className="p-2 rounded-xl hover:bg-[#F4EFE7] text-[#6E675F]">
              <ChevronLeft size={18} />
            </button>
            <button onClick={handleNextMonth} className="p-2 rounded-xl hover:bg-[#F4EFE7] text-[#6E675F]">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <span key={d} className="text-[11px] font-bold py-1 uppercase tracking-wider text-[#A09890]">
              {d}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1.5 min-h-[350px]">
          {daysArray.map((day, idx) => {
            if (day === null) return <div key={`empty-${idx}`} className="bg-[#FAF8F4] opacity-40 rounded-xl" />;
            const dayEvents = getEventsForDay(day);
            const isToday = new Date().getDate() === day && new Date().getMonth() === month && new Date().getFullYear() === year;

            return (
              <div
                key={day}
                className={`p-2 bg-[#FAF8F4] border rounded-xl flex flex-col justify-between hover:border-[#7BAE7F] transition-all min-h-[70px] cursor-pointer ${
                  isToday ? 'border-[#7BAE7F] bg-[#7BAE7F10]' : 'border-[#EDE8E0]'
                }`}
              >
                <span className="text-xs font-semibold text-[#2F2A26]">{day}</span>
                <div className="flex flex-col gap-0.5 mt-1">
                  {dayEvents.map((e, idx) => (
                    <div
                      key={idx}
                      className="text-[9px] px-1.5 py-0.5 rounded-md truncate font-semibold text-white"
                      style={{ background: e.color }}
                      title={e.title}
                    >
                      {e.title.replace('My Leave', 'Leave')}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Control Area */}
      <div style={{ width: 280, flexShrink: 0 }} className="flex flex-col gap-5">
        <div className="bg-white rounded-3xl border border-[#EDE8E0] p-5 warm-shadow flex flex-col justify-between flex-1">
          <div>
            <h4 className="font-bold text-[#2F2A26] text-sm mb-2">Calendar Info</h4>
            <p className="text-xs text-[#6E675F] leading-relaxed mb-4">
              Here is a list of your upcoming events. You can submit a leave request by clicking the button below.
            </p>

            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#7BAE7F]" />
                <span className="text-[11px] text-[#6E675F]">Approved Leaves</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#C4AA8E]" />
                <span className="text-[11px] text-[#6E675F]">Pending Leaves</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#E07A5F]" />
                <span className="text-[11px] text-[#6E675F]">Holidays & Rejected Leaves</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowApplyModal(true)}
            className="w-full bg-[#7BAE7F] hover:bg-[#5A9260] text-white text-xs font-medium py-2.5 rounded-xl flex items-center justify-center gap-1.5 btn-scale"
          >
            <Plus size={14} /> Request Time Off
          </button>
        </div>
      </div>

      {/* Apply Leave Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-[#2d2a2650] backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm border border-[#EDE8E0] shadow-2xl">
            <h4 className="text-[#2F2A26] font-bold text-base mb-4">Request Leave</h4>
            <form onSubmit={handleApplyLeave} className="space-y-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-[#6E675F] block mb-1">Leave Type</label>
                <select
                  value={leaveType}
                  onChange={e => setLeaveType(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-[#EDE8E0] bg-white outline-none focus:border-[#7BAE7F]"
                >
                  <option value="paid">Paid Leave</option>
                  <option value="sick">Sick Leave</option>
                  <option value="unpaid">Unpaid Leave</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#6E675F] block mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    className="w-full p-2 text-xs rounded-xl border border-[#EDE8E0] outline-none focus:border-[#7BAE7F]"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#6E675F] block mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    className="w-full p-2 text-xs rounded-xl border border-[#EDE8E0] outline-none focus:border-[#7BAE7F]"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-[#6E675F] block mb-1">Reason / Remarks</label>
                <textarea
                  value={remarks}
                  onChange={e => setRemarks(e.target.value)}
                  required
                  placeholder="E.g. family medical visit"
                  rows={3}
                  className="w-full p-2.5 text-xs rounded-xl border border-[#EDE8E0] outline-none resize-none focus:border-[#7BAE7F]"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 bg-[#7BAE7F] text-white text-xs font-semibold py-2.5 rounded-xl hover:bg-[#5A9260]">
                  Submit Request
                </button>
                <button type="button" onClick={() => setShowApplyModal(false)} className="flex-1 bg-[#F4EFE7] text-[#2F2A26] text-xs font-semibold py-2.5 rounded-xl hover:bg-[#EDE8E0]">
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
