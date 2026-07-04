import { useState } from 'react';
import { Clock, Plus, AlertTriangle, CheckCircle, Calendar } from 'lucide-react';

interface AttendanceLog {
  date: string;
  status: 'present' | 'absent' | 'half-day';
  checkIn: string;
  checkOut: string;
  hours: number;
}

const initialLogs: AttendanceLog[] = [
  { date: '2026-07-03', status: 'present', checkIn: '09:05 AM', checkOut: '05:30 PM', hours: 8.4 },
  { date: '2026-07-02', status: 'present', checkIn: '08:58 AM', checkOut: '06:05 PM', hours: 9.1 },
  { date: '2026-07-01', status: 'present', checkIn: '09:12 AM', checkOut: '05:45 PM', hours: 8.5 },
  { date: '2026-06-30', status: 'absent', checkIn: '--', checkOut: '--', hours: 0 },
];

export default function AttendanceSection() {
  const [logs, setLogs] = useState<AttendanceLog[]>(initialLogs);
  const [showCorrection, setShowCorrection] = useState(false);
  const [correctionDate, setCorrectionDate] = useState('2026-07-04');
  const [correctionIn, setCorrectionIn] = useState('09:00 AM');
  const [correctionOut, setCorrectionOut] = useState('05:00 PM');
  const [correctionReason, setCorrectionReason] = useState('');

  const handleSubmitCorrection = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Correction request for ${correctionDate} submitted to HR administrator!`);
    setShowCorrection(false);
    setCorrectionReason('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* Logs Table (2/3 width) */}
      <div className="lg:col-span-2 bg-white rounded-3xl border border-[#EDE8E0] p-6 warm-shadow flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-lg font-bold text-[#2F2A26]">Attendance History</h3>
              <p className="text-xs text-[#6E675F]">Recent clock-in logs and shift hours</p>
            </div>
            <button
              onClick={() => setShowCorrection(true)}
              className="px-3.5 py-1.5 bg-[#7BAE7F] hover:bg-[#5A9260] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 btn-scale"
            >
              <Plus size={13} /> Request Correction
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#EDE8E0] text-[#A09890] font-bold">
                  <th className="pb-2">Date</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2">Clock In</th>
                  <th className="pb-2">Clock Out</th>
                  <th className="pb-2 text-right">Work Hours</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EDE8E0]">
                {logs.map((log, idx) => (
                  <tr key={idx} className="hover:bg-[#FAF8F4] transition-colors">
                    <td className="py-3 font-semibold text-[#2F2A26]">{log.date}</td>
                    <td className="py-3">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        log.status === 'present' ? 'bg-[#7BAE7F15] text-[#5A9260]' : 'bg-[#E07A5F15] text-[#E07A5F]'
                      }`}>
                        {log.status === 'present' ? 'Present' : 'Absent'}
                      </span>
                    </td>
                    <td className="py-3 text-[#6E675F]">{log.checkIn}</td>
                    <td className="py-3 text-[#6E675F]">{log.checkOut}</td>
                    <td className="py-3 text-right font-bold text-[#2F2A26]">{log.hours}h</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Clock summary and info panel */}
      <div className="bg-white rounded-3xl border border-[#EDE8E0] p-6 warm-shadow flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-[#2F2A26] mb-1">Shift Insights</h3>
          <p className="text-xs text-[#6E675F] mb-4">Current pay cycle statistics</p>

          <div className="space-y-3.5">
            {[
              { label: 'Work Days Logged', val: '21 Days', icon: Calendar, color: 'bg-[#7BAE7F15] text-[#5A9260]' },
              { label: 'Average Daily Hours', val: '8.6 Hours', icon: Clock, color: 'bg-[#A98E7415] text-[#A98E74]' },
            ].map((stat, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl border border-[#EDE8E0] bg-[#FAF8F4] flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl ${stat.color} flex items-center justify-center`}>
                  <stat.icon size={16} />
                </div>
                <div>
                  <p className="text-[10px] text-[#A09890]">{stat.label}</p>
                  <p className="text-sm font-bold text-[#2F2A26]">{stat.val}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 text-[10px] text-[#A09890] leading-relaxed">
          Clock-in events are fetched automatically from office bio-metrics. If you forgot to clock in, please submit a correction request.
        </div>
      </div>

      {/* Correction Modal */}
      {showCorrection && (
        <div className="fixed inset-0 bg-[#2d2a2650] backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm border border-[#EDE8E0] shadow-2xl">
            <h4 className="text-[#2F2A26] font-bold text-base mb-4">Request Attendance Correction</h4>
            <form onSubmit={handleSubmitCorrection} className="space-y-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-[#6E675F] block mb-1">Select Date</label>
                <input
                  type="date"
                  required
                  value={correctionDate}
                  onChange={e => setCorrectionDate(e.target.value)}
                  className="w-full p-2 text-xs rounded-xl border border-[#EDE8E0] outline-none focus:border-[#7BAE7F]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#6E675F] block mb-1">Clock In Time</label>
                  <input
                    type="text"
                    required
                    value={correctionIn}
                    onChange={e => setCorrectionIn(e.target.value)}
                    className="w-full p-2 text-xs rounded-xl border border-[#EDE8E0] outline-none focus:border-[#7BAE7F]"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#6E675F] block mb-1">Clock Out Time</label>
                  <input
                    type="text"
                    required
                    value={correctionOut}
                    onChange={e => setCorrectionOut(e.target.value)}
                    className="w-full p-2 text-xs rounded-xl border border-[#EDE8E0] outline-none focus:border-[#7BAE7F]"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-[#6E675F] block mb-1">Reason for Adjustment</label>
                <textarea
                  value={correctionReason}
                  onChange={e => setCorrectionReason(e.target.value)}
                  required
                  placeholder="E.g. forgot biometric card, client site visit"
                  rows={3}
                  className="w-full p-2.5 text-xs rounded-xl border border-[#EDE8E0] outline-none resize-none focus:border-[#7BAE7F]"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 bg-[#7BAE7F] text-white text-xs font-semibold py-2.5 rounded-xl hover:bg-[#5A9260]">
                  Submit Correction
                </button>
                <button type="button" onClick={() => setShowCorrection(false)} className="flex-1 bg-[#F4EFE7] text-[#2F2A26] text-xs font-semibold py-2.5 rounded-xl hover:bg-[#EDE8E0]">
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
