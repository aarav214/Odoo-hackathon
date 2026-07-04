import { useState, useEffect } from 'react';
import { Check, X, MoreHorizontal, Calendar } from 'lucide-react';
import { apiRequest, checkBackendStatus } from '../api';

type Status = 'pending' | 'approved' | 'rejected';

const requests = [
  {
    id: 991,
    name: 'Priya Sharma', dept: 'Engineering', leave_type: 'Annual Leave',
    start_date: '2026-07-08', end_date: '2026-07-12', reason: 'Family vacation to Goa, pre-booked flights and accommodation.',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=80',
    status: 'pending' as Status,
  },
  {
    id: 992,
    name: 'Rahul Verma', dept: 'Sales', leave_type: 'Sick Leave',
    start_date: '2026-07-04', end_date: '2026-07-05', reason: 'Fever and flu, doctor advised rest for 2 days.',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=80',
    status: 'pending' as Status,
  },
];

const filters: { label: string; value: Status | 'all' }[] = [
  { label: 'Pending', value: 'pending' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
];

export default function LeaveApprovalCard() {
  const [activeFilter, setActiveFilter] = useState<Status | 'all'>('pending');
  const [list, setList] = useState<any[]>([]);

  const loadRequests = async () => {
    try {
      const isOnline = await checkBackendStatus();
      if (isOnline) {
        const data = await apiRequest('/leave/');
        const populatedList = await Promise.all(data.map(async (leave: any) => {
          try {
            const userProfile = await apiRequest(`/profile/${leave.user_id}`);
            return {
              ...leave,
              name: userProfile.name,
              dept: userProfile.department || 'Engineering',
              avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=80',
            };
          } catch (e) {
            return {
              ...leave,
              name: `Employee ${leave.user_id}`,
              dept: 'General',
              avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=80',
            };
          }
        }));
        setList(populatedList);
      } else {
        setList(requests);
      }
    } catch (e) {
      console.error('Failed to load leave requests:', e);
      setList(requests);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const filtered = activeFilter === 'all' ? list : list.filter(r => r.status === activeFilter);

  const handleAction = async (id: number, action: 'approved' | 'rejected') => {
    try {
      const isOnline = await checkBackendStatus();
      if (isOnline && id < 900) {
        await apiRequest(`/leave/${id}/decide`, {
          method: 'PATCH',
          body: JSON.stringify({
            status: action,
            comment: `Decided by HR Admin on ${new Date().toLocaleDateString()}`
          })
        });
        alert(`Leave request successfully ${action}!`);
        loadRequests();
      } else {
        setList(prev => prev.map(r => r.id === id ? { ...r, status: action } : r));
      }
    } catch (e: any) {
      alert(e.message || 'Failed to decide leave request');
    }
  };

  return (
    <div className="card p-5 flex flex-col" style={{ borderRadius: 24, height: 430 }}>
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-serif text-[20px] leading-tight" style={{ color: '#2D2419', fontWeight: 600 }}>Leave Approval</h2>
        <span className="badge-amber">{list.filter(r => r.status === 'pending').length} pending</span>
      </div>

      {/* Filters */}
      <div className="flex gap-1 mb-3 p-1 rounded-xl" style={{ background: '#F5F0E8' }}>
        {filters.map(f => (
          <button
            key={f.value}
            onClick={() => setActiveFilter(f.value)}
            className="flex-1 py-1.5 rounded-lg text-[11px] font-600 transition-all"
            style={activeFilter === f.value
              ? { background: 'white', color: '#2D2419', fontWeight: 600, boxShadow: '0 1px 3px rgba(45,36,25,0.08)' }
              : { color: '#A89A88', fontWeight: 600 }
            }
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Scrollable list */}
      <div className="flex-1 overflow-y-auto scrollbar-hide -mx-1 px-1">
        {filtered.length === 0 && (
          <div className="flex items-center justify-center h-full text-[12px]" style={{ color: '#A89A88' }}>No requests in this category</div>
        )}
        {filtered.map((r, i) => {
          const start = new Date(r.start_date);
          const end = new Date(r.end_date);
          const diffTime = Math.abs(end.getTime() - start.getTime());
          const calculatedDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
          const displayDays = r.days || (isNaN(calculatedDays) ? 1 : calculatedDays);
          const displayDates = r.dates || `${r.start_date} to ${r.end_date}`;

          return (
            <div key={r.id || i} className="pb-3 mb-3 last:border-0 last:mb-0 last:pb-0" style={{ borderBottom: '1px solid #F5F0E8' }}>
              <div className="flex items-start gap-2.5">
                <img src={r.avatar} alt={r.name} className="w-9 h-9 rounded-xl object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-[12px] font-600 truncate" style={{ color: '#2D2419', fontWeight: 600 }}>{r.name}</p>
                      <p className="text-[10px]" style={{ color: '#A89A88' }}>{r.dept} · {r.leave_type || 'Leave'}</p>
                    </div>
                    <button className="flex-shrink-0 transition-colors" style={{ color: '#A89A88' }}>
                      <MoreHorizontal size={14} />
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <Calendar size={10} style={{ color: '#A89A88' }} />
                    <span className="text-[10px]" style={{ color: '#8A7B6A' }}>{displayDates}</span>
                    <span style={{ color: '#D1C7B8' }}>·</span>
                    <span className="text-[10px] font-600" style={{ color: '#8A7B6A', fontWeight: 600 }}>{displayDays} day{displayDays > 1 ? 's' : ''}</span>
                  </div>
                  <p className="text-[10px] mt-1.5 line-clamp-2 leading-relaxed" style={{ color: '#A89A88' }}>{r.reason || r.remarks || 'No reason specified'}</p>

                  {r.status === 'pending' ? (
                    <div className="flex gap-1.5 mt-2.5">
                      <button
                        onClick={() => handleAction(r.id, 'approved')}
                        className="flex-1 py-1.5 rounded-lg text-white text-[11px] font-600 flex items-center justify-center gap-1 transition-all"
                        style={{ background: '#6B8E5A', fontWeight: 600 }}
                      >
                        <Check size={12} /> Approve
                      </button>
                      <button
                        onClick={() => handleAction(r.id, 'rejected')}
                        className="flex-1 py-1.5 rounded-lg text-[11px] font-600 flex items-center justify-center gap-1 transition-all"
                        style={{ background: '#F2E0D8', color: '#B5654E', fontWeight: 600 }}
                      >
                        <X size={12} /> Reject
                      </button>
                    </div>
                  ) : (
                    <div className="mt-2.5">
                      <span className={r.status === 'approved' ? 'badge-green' : 'badge-red'}>
                        {r.status === 'approved' ? 'Approved' : 'Rejected'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

