import { useState } from 'react';
import {
  CheckCircle2, Clock, DollarSign, Megaphone, FileText, Calendar, Cake, Bell,
} from 'lucide-react';

const activities = [
  { id: 1, icon: CheckCircle2, text: 'Leave request approved', sub: 'Casual leave - Jul 10', time: '2m ago', read: false, color: 'bg-[#7BAE7F15] text-[#5A9260]' },
  { id: 2, icon: Clock, text: 'Attendance recorded', sub: 'Check-in at 09:05 AM', time: '1h ago', read: false, color: 'bg-[#A98E7415] text-[#A98E74]' },
  { id: 3, icon: DollarSign, text: 'Payslip generated', sub: 'June 2026 salary slip', time: '3h ago', read: false, color: 'bg-[#C4AA8E15] text-[#C4AA8E]' },
  { id: 4, icon: Megaphone, text: 'HR Announcement', sub: 'New work-from-home policy', time: '5h ago', read: true, color: 'bg-[#7BAE7F15] text-[#5A9260]' },
  { id: 5, icon: FileText, text: 'Document updated', sub: 'Employee Handbook v2.4', time: '1d ago', read: true, color: 'bg-[#A98E7415] text-[#A98E74]' },
  { id: 6, icon: Calendar, text: 'Company Holiday Notice', sub: 'Independence Day - Jul 15', time: '2d ago', read: true, color: 'bg-[#C4AA8E15] text-[#C4AA8E]' },
  { id: 7, icon: Cake, text: 'Birthday Wishes', sub: 'Happy Birthday from the team!', time: '3d ago', read: true, color: 'bg-[#7BAE7F15] text-[#5A9260]' },
];

export default function ActivityFeed() {
  const [items, setItems] = useState(activities);
  const unread = items.filter(i => !i.read).length;

  const markAllRead = () => setItems(items.map(i => ({ ...i, read: true })));

  return (
    <div className="bg-white rounded-3xl border border-[#EDE8E0] warm-shadow card-hover p-5 fade-in-up">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-bold text-[#2F2A26]">Recent Activity</h3>
          {unread > 0 && (
            <span className="text-[10px] bg-[#E07A5F20] text-[#E07A5F] px-1.5 py-0.5 rounded-full font-medium">{unread} new</span>
          )}
        </div>
        <button onClick={markAllRead} className="text-[11px] text-[#7BAE7F] hover:underline font-medium">Mark all read</button>
      </div>

      <div className="space-y-1 max-h-[420px] overflow-y-auto pr-1">
        {items.map(({ id, icon: Icon, text, sub, time, read, color }) => (
          <div
            key={id}
            className={`flex items-start gap-3 p-2.5 rounded-2xl transition-colors slide-in ${!read ? 'bg-[#FAF8F4]' : 'hover:bg-[#FAF8F4]'}`}
          >
            <div className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center shrink-0`}>
              <Icon size={15} />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-xs ${read ? 'text-[#6E675F]' : 'text-[#2F2A26] font-medium'}`}>{text}</p>
              <p className="text-[11px] text-[#A09890] mt-0.5 truncate">{sub}</p>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <span className="text-[10px] text-[#A09890]">{time}</span>
              {!read && <div className="w-1.5 h-1.5 rounded-full bg-[#7BAE7F]" />}
            </div>
          </div>
        ))}
      </div>

      <button className="mt-3 w-full flex items-center justify-center gap-1.5 text-xs font-medium text-[#7BAE7F] hover:bg-[#7BAE7F10] py-2 rounded-xl transition-colors">
        <Bell size={12} /> View all activity
      </button>
    </div>
  );
}
