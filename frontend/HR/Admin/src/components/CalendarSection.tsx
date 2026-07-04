import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, MapPin, User, Check, X } from 'lucide-react';
import { apiRequest, checkBackendStatus } from '../api';

interface Event {
  id: number;
  title: string;
  type: 'leave' | 'holiday' | 'event';
  startDate: string;
  endDate: string;
  color: string;
  userName?: string;
  description?: string;
}

const staticHolidays: Event[] = [
  { id: 101, title: 'Independence Day', type: 'holiday', startDate: '2026-07-04', endDate: '2026-07-04', color: '#B5654E', description: 'National holiday' },
  { id: 102, title: 'Company Foundation Day', type: 'event', startDate: '2026-07-15', endDate: '2026-07-15', color: '#8B7BA0', description: 'All-hands party at HQ' },
  { id: 103, title: 'Mid-Year Review Event', type: 'event', startDate: '2026-07-22', endDate: '2026-07-24', color: '#6B7B95', description: 'Department performance alignment sessions' },
];

export default function CalendarSection() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 6, 1)); // Defaulting to July 2026 for demo seeding
  const [events, setEvents] = useState<Event[]>(staticHolidays);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventType, setNewEventType] = useState<'holiday' | 'event'>('event');

  const loadLeaves = async () => {
    try {
      const isOnline = await checkBackendStatus();
      if (isOnline) {
        const data = await apiRequest('/leave/');
        const leaveEvents = await Promise.all(data.map(async (leave: any) => {
          let name = `Employee ${leave.user_id}`;
          try {
            const profile = await apiRequest(`/profile/${leave.user_id}`);
            name = profile.name;
          } catch (e) {}

          return {
            id: leave.id,
            title: `${name} - ${leave.leave_type || 'Leave'}`,
            type: 'leave' as const,
            startDate: leave.start_date,
            endDate: leave.end_date,
            color: leave.status === 'approved' ? '#6B8E5A' : leave.status === 'pending' ? '#C49A4A' : '#B5654E',
            userName: name,
            description: leave.reason || leave.remarks || 'No remarks provided.',
            status: leave.status,
          };
        }));
        setEvents([...staticHolidays, ...leaveEvents]);
      }
    } catch (e) {
      console.error('Failed to load leaves for calendar:', e);
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

  // Calendar calculations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const daysArray = [];
  // Prefix empty slots
  for (let i = 0; i < firstDayIndex; i++) {
    daysArray.push(null);
  }
  // Fill month days
  for (let i = 1; i <= daysInMonth; i++) {
    daysArray.push(i);
  }

  const getEventsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(e => {
      const start = e.startDate;
      const end = e.endDate;
      return dateStr >= start && dateStr <= end;
    });
  };

  const handleAddEvent = () => {
    if (!selectedDay || !newEventTitle) return;
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
    const newEvent: Event = {
      id: Date.now(),
      title: newEventTitle,
      type: newEventType,
      startDate: dateStr,
      endDate: dateStr,
      color: newEventType === 'holiday' ? '#B5654E' : '#8B7BA0',
      description: 'Added via calendar dashboard.',
    };
    setEvents([...events, newEvent]);
    setNewEventTitle('');
    setShowAddEvent(false);
  };

  const handleDecideLeave = async (id: number, status: 'approved' | 'rejected') => {
    try {
      const isOnline = await checkBackendStatus();
      if (isOnline) {
        await apiRequest(`/leave/${id}/decide`, {
          method: 'PATCH',
          body: JSON.stringify({
            status,
            comment: `Decided from calendar dashboard on ${new Date().toLocaleDateString()}`
          })
        });
        alert(`Leave request successfully ${status}!`);
        loadLeaves();
        setSelectedEvent(null);
      }
    } catch (e: any) {
      alert(e.message || 'Failed to update leave request');
    }
  };

  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  return (
    <div className="flex gap-5 min-h-[500px]">
      {/* Calendar Grid - Card */}
      <div className="flex-1 card p-6 bg-white flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#F5EDE0', color: '#A0785A' }}>
              <CalendarIcon size={20} />
            </div>
            <div>
              <h2 className="font-serif text-[22px] font-bold leading-tight" style={{ color: '#2D2419' }}>
                {monthName} {year}
              </h2>
              <p className="text-[11px]" style={{ color: '#8A7B6A' }}>Monitor company events and employee leaves</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={handlePrevMonth} className="p-2 rounded-xl hover:bg-[#F5EDE0] transition-colors" style={{ color: '#8A7B6A' }}>
              <ChevronLeft size={18} />
            </button>
            <button onClick={handleNextMonth} className="p-2 rounded-xl hover:bg-[#F5EDE0] transition-colors" style={{ color: '#8A7B6A' }}>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Days of week */}
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <span key={d} className="text-[11px] font-bold py-1 uppercase tracking-wider" style={{ color: '#A89A88' }}>
              {d}
            </span>
          ))}
        </div>

        {/* Month grid */}
        <div className="grid grid-cols-7 gap-1.5 flex-1 min-h-[350px]">
          {daysArray.map((day, idx) => {
            if (day === null) {
              return <div key={`empty-${idx}`} className="bg-[#FBF8F3] opacity-30 rounded-xl" />;
            }

            const dayEvents = getEventsForDay(day);
            const isToday = new Date().getDate() === day && new Date().getMonth() === month && new Date().getFullYear() === year;

            return (
              <div
                key={`day-${day}`}
                onClick={() => {
                  setSelectedDay(day);
                  setShowAddEvent(false);
                  if (dayEvents.length > 0) {
                    setSelectedEvent(dayEvents[0]);
                  } else {
                    setSelectedEvent(null);
                  }
                }}
                className={`p-2 bg-[#FBF8F3] border rounded-xl flex flex-col justify-between cursor-pointer hover:border-[#A0785A] transition-all min-h-[70px] ${
                  isToday ? 'border-[#A0785A] bg-[#F5EDE0]' : 'border-[#F0E9DE]'
                }`}
              >
                <span className={`text-[12px] font-semibold ${isToday ? 'text-[#2D2419]' : 'text-[#8A7B6A]'}`}>
                  {day}
                </span>

                {/* Event stacks */}
                <div className="flex flex-col gap-0.5 mt-1">
                  {dayEvents.slice(0, 2).map((ev, i) => (
                    <div
                      key={i}
                      className="text-[9px] px-1.5 py-0.5 rounded-md truncate font-semibold text-white leading-normal"
                      style={{ background: ev.color }}
                      title={ev.title}
                    >
                      {ev.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <span className="text-[8px] font-bold text-center block mt-0.5" style={{ color: '#A89A88' }}>
                      +{dayEvents.length - 2} more
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail Panel - Sidebar */}
      <div style={{ width: 330, flexShrink: 0 }} className="flex flex-col gap-5">
        {/* Selected Event / Day Details Card */}
        <div className="card p-5 bg-white flex-1 flex flex-col">
          <h3 className="font-serif text-[18px] font-bold mb-4" style={{ color: '#2D2419' }}>
            {selectedDay ? `Details for July ${selectedDay}, 2026` : 'Select a day'}
          </h3>

          {selectedDay ? (
            <div className="flex-1 flex flex-col justify-between">
              <div>
                {getEventsForDay(selectedDay).length === 0 ? (
                  <div className="py-8 text-center">
                    <p className="text-[12px]" style={{ color: '#A89A88' }}>No logs or events scheduled.</p>
                    <button
                      onClick={() => setShowAddEvent(true)}
                      className="btn-primary mt-3 text-[11px] py-1.5 px-3 rounded-lg"
                    >
                      <Plus size={13} /> Add Event
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {getEventsForDay(selectedDay).map(ev => (
                      <div
                        key={ev.id}
                        onClick={() => setSelectedEvent(ev)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all ${
                          selectedEvent?.id === ev.id ? 'border-[#A0785A] bg-[#FBF8F3]' : 'border-[#F0E9DE]'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ background: ev.color }} />
                          <h4 className="text-[12px] font-bold truncate" style={{ color: '#2D2419' }}>{ev.title}</h4>
                        </div>
                        <p className="text-[10px]" style={{ color: '#8A7B6A' }}>
                          Type: <span className="font-semibold capitalize">{ev.type}</span>
                        </p>
                        {ev.description && (
                          <p className="text-[10px] mt-1.5 leading-relaxed" style={{ color: '#A89A88' }}>
                            {ev.description}
                          </p>
                        )}
                        {ev.type === 'leave' && (ev as any).status === 'pending' && (
                          <div className="flex gap-1.5 mt-3">
                            <button
                              onClick={(e) => { e.stopPropagation(); handleDecideLeave(ev.id, 'approved'); }}
                              className="flex-1 py-1 rounded-md text-white text-[9px] font-bold flex items-center justify-center gap-0.5"
                              style={{ background: '#6B8E5A' }}
                            >
                              <Check size={10} /> Approve
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleDecideLeave(ev.id, 'rejected'); }}
                              className="flex-1 py-1 rounded-md text-[9px] font-bold flex items-center justify-center gap-0.5"
                              style={{ background: '#F2E0D8', color: '#B5654E' }}
                            >
                              <X size={10} /> Reject
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add event modal overlay in sidebar */}
              {showAddEvent && (
                <div className="p-4 rounded-2xl bg-[#FBF8F3] border border-[#E8DFD3] mt-4">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider mb-2.5" style={{ color: '#8A7B6A' }}>Create Event</h4>
                  <input
                    type="text"
                    value={newEventTitle}
                    onChange={e => setNewEventTitle(e.target.value)}
                    placeholder="Event title..."
                    className="w-full p-2 text-[12px] rounded-lg border outline-none mb-2"
                    style={{ borderColor: '#E8DFD3', color: '#2D2419' }}
                  />
                  <div className="flex gap-2 mb-3">
                    <button
                      onClick={() => setNewEventType('event')}
                      className={`flex-1 py-1 rounded-md text-[10px] font-bold border transition-colors ${
                        newEventType === 'event' ? 'bg-[#A0785A] text-white' : 'border-[#E8DFD3] text-[#8A7B6A]'
                      }`}
                    >
                      Company Event
                    </button>
                    <button
                      onClick={() => setNewEventType('holiday')}
                      className={`flex-1 py-1 rounded-md text-[10px] font-bold border transition-colors ${
                        newEventType === 'holiday' ? 'bg-[#A0785A] text-white' : 'border-[#E8DFD3] text-[#8A7B6A]'
                      }`}
                    >
                      Holiday
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={handleAddEvent} className="flex-1 btn-primary py-1.5 justify-center rounded-lg text-[10px]">Save</button>
                    <button onClick={() => setShowAddEvent(false)} className="flex-1 btn-secondary py-1.5 justify-center rounded-lg text-[10px]">Cancel</button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-[12px]" style={{ color: '#A89A88' }}>
              Click any date in the calendar grid to details or log events
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
