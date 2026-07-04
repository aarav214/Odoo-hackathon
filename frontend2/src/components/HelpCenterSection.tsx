import { useState } from 'react';
import { HelpCircle, Search, ChevronDown, Plus, FileText, Send, CheckCircle2 } from 'lucide-react';

interface Ticket {
  id: number;
  subject: string;
  category: 'payroll' | 'it' | 'admin';
  status: 'open' | 'resolved';
  date: string;
}

const faqs = [
  { q: 'How do I download my monthly payslips?', a: 'Navigate to the Payslips tab from the sidebar, select the target month from history, and click on the "PDF Copy" button to download.' },
  { q: 'What is the annual leave quota policy?', a: 'All full-time employees receive 24 days of paid time off per calendar year. You can request leaves from the Calendar tab.' },
  { q: 'How can I adjust clock-in mismatches?', a: 'Go to the Attendance tab, review your log, and click "Request Correction" to submit the actual timing adjust requests to HR.' },
  { q: 'Who do I contact for insurance enrollment?', a: 'Please open an IT/HR support ticket here choosing the "Administrative" category and the HR team will contact you.' }
];

export default function HelpCenterSection() {
  const [tickets, setTickets] = useState<Ticket[]>([
    { id: 101, subject: 'Biometric scan issue at entrance', category: 'it', status: 'resolved', date: '2026-06-25' },
  ]);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [showNewTicket, setShowNewTicket] = useState(false);
  
  // Ticket form states
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<'payroll' | 'it' | 'admin'>('payroll');
  const [description, setDescription] = useState('');

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const newT: Ticket = {
      id: Date.now(),
      subject,
      category,
      status: 'open',
      date: new Date().toISOString().split('T')[0]
    };
    setTickets([newT, ...tickets]);
    setSubject('');
    setDescription('');
    setShowNewTicket(false);
    alert('Support ticket created and assigned to queue!');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* FAQ Workspace */}
      <div className="lg:col-span-2 bg-white rounded-3xl border border-[#EDE8E0] p-6 warm-shadow flex flex-col">
        <h3 className="text-lg font-bold text-[#2F2A26] mb-1">Knowledge Center</h3>
        <p className="text-xs text-[#6E675F] mb-5">Frequently asked questions and guides</p>

        <div className="space-y-2.5">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border border-[#EDE8E0] rounded-2xl overflow-hidden bg-[#FAF8F4]">
              <button
                onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between p-4 text-xs font-bold text-[#2F2A26] text-left outline-none hover:bg-[#F4EFE7] transition-all"
              >
                <span>{faq.q}</span>
                <ChevronDown size={14} className={`text-[#6E675F] transition-transform duration-200 ${expandedFaq === idx ? 'rotate-180' : ''}`} />
              </button>
              {expandedFaq === idx && (
                <div className="px-4 pb-4 text-xs text-[#6E675F] leading-relaxed border-t border-[#EDE8E0]/60 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Ticket center */}
      <div className="bg-white rounded-3xl border border-[#EDE8E0] p-6 warm-shadow flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-[#2F2A26]">My Support Tickets</h3>
            <button
              onClick={() => setShowNewTicket(true)}
              className="p-1 text-[#7BAE7F] hover:bg-[#7BAE7F15] rounded-lg"
              title="Open support ticket"
            >
              <Plus size={16} />
            </button>
          </div>

          <div className="space-y-2">
            {tickets.map(t => (
              <div key={t.id} className="p-3 rounded-xl border border-[#EDE8E0] bg-[#FAF8F4] flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#2F2A26] truncate max-w-[150px]">{t.subject}</p>
                  <p className="text-[9px] text-[#A09890] capitalize">Category: {t.category} &middot; {t.date}</p>
                </div>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                  t.status === 'resolved' ? 'bg-[#7BAE7F20] text-[#5A9260]' : 'bg-[#C4AA8E20] text-[#C4AA8E]'
                }`}>
                  {t.status === 'resolved' ? 'Resolved' : 'Pending'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Create Ticket Modal Inline */}
        {showNewTicket && (
          <div className="fixed inset-0 bg-[#2d2a2650] backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div className="bg-white rounded-3xl p-6 w-full max-w-sm border border-[#EDE8E0] shadow-2xl">
              <h4 className="text-[#2F2A26] font-bold text-base mb-4">Open Support Ticket</h4>
              <form onSubmit={handleCreateTicket} className="space-y-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#6E675F] block mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    placeholder="Short summary of issue"
                    className="w-full p-2.5 text-xs rounded-xl border border-[#EDE8E0] outline-none focus:border-[#7BAE7F]"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#6E675F] block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className="w-full p-2.5 text-xs rounded-xl border border-[#EDE8E0] bg-white outline-none focus:border-[#7BAE7F]"
                  >
                    <option value="payroll">Payroll Query</option>
                    <option value="it">IT Support</option>
                    <option value="admin">Administrative</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#6E675F] block mb-1">Details</label>
                  <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    required
                    placeholder="Provide full description of your issue"
                    rows={4}
                    className="w-full p-2.5 text-xs rounded-xl border border-[#EDE8E0] outline-none resize-none focus:border-[#7BAE7F]"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button type="submit" className="flex-1 bg-[#7BAE7F] text-white text-xs font-semibold py-2.5 rounded-xl hover:bg-[#5A9260] flex items-center justify-center gap-1">
                    <Send size={12} /> Submit
                  </button>
                  <button type="button" onClick={() => setShowNewTicket(false)} className="flex-1 bg-[#F4EFE7] text-[#2F2A26] text-xs font-semibold py-2.5 rounded-xl hover:bg-[#EDE8E0]">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
