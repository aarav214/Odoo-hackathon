import { useState } from 'react';
import { Search, Bell, MessageSquare, Settings, X, ChevronDown, Send } from 'lucide-react';

const notifications = [
  { id: 1, text: 'Leave request approved', time: '2m ago', read: false, color: 'bg-[#7BAE7F]' },
  { id: 2, text: 'Payslip for June generated', time: '1h ago', read: false, color: 'bg-[#A98E74]' },
  { id: 3, text: 'Attendance recorded', time: '3h ago', read: true, color: 'bg-[#7BAE7F]' },
  { id: 4, text: 'Company holiday: July 15', time: '1d ago', read: true, color: 'bg-[#C4AA8E]' },
];

const today = new Date();
const dateStr = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
const weekNum = Math.ceil(((today.getTime() - new Date(today.getFullYear(), 0, 1).getTime()) / 86400000 + 1) / 7);

interface HeaderProps {
  onLogout?: () => void;
  employeeName?: string;
  employeeRole?: string;
  onTabChange?: (tab: string) => void;
}

export default function Header({ onLogout, employeeName = 'Sarah Chen', employeeRole = 'Product Designer', onTabChange }: HeaderProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<any[]>([
    { id: 1, text: 'Hello! Welcome to HRMS Support. How can we help you today?', sender: 'hr', time: '12:00 PM' },
  ]);
  const [chatInput, setChatInput] = useState('');

  // Settings mock states
  const [notifyEnabled, setNotifyEnabled] = useState(true);
  const [highContrast, setHighContrast] = useState(false);
  const [timezone, setTimezone] = useState('IST (UTC+05:30)');

  const unread = notifications.filter(n => !n.read).length;

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Portal preferences saved successfully!');
    setSettingsOpen(false);
  };

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const newMsg = {
      id: Date.now(),
      text: chatInput,
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages(prev => [...prev, newMsg]);
    setChatInput('');
    
    setTimeout(() => {
      const hrReply = {
        id: Date.now() + 1,
        text: 'Thank you for your message. An HR representative has been notified and will reply shortly!',
        sender: 'hr',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, hrReply]);
    }, 1000);
  };

  return (
    <header className="fixed top-0 left-[220px] right-0 h-[72px] bg-white/90 backdrop-blur-md border-b border-[#EDE8E0] flex items-center px-7 z-10 warm-shadow">
      {/* Left: date + week */}
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-[#2F2A26]">{dateStr}</span>
        <span className="text-[11px] text-[#6E675F]">Week {weekNum} &middot; Today's Schedule: 3 events</span>
      </div>

      {/* Center spacer */}
      <div className="flex-1" />

      {/* Search */}
      <div className="relative mr-3">
        {searchOpen ? (
          <div className="flex items-center gap-2 bg-[#F4EFE7] rounded-xl px-3 py-2 w-64 border border-[#EDE8E0] dropdown-fade">
            <Search size={15} className="text-[#6E675F] shrink-0" />
            <input
              autoFocus
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              placeholder="Search anything..."
              className="bg-transparent text-sm text-[#2F2A26] placeholder-[#A09890] outline-none flex-1"
            />
            <button onClick={() => { setSearchOpen(false); setSearchVal(''); }}>
              <X size={14} className="text-[#6E675F] hover:text-[#2F2A26]" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 bg-[#F4EFE7] hover:bg-[#EDE8E0] rounded-xl px-3 py-2 text-sm text-[#6E675F] transition-colors"
          >
            <Search size={15} />
            <span>Search...</span>
          </button>
        )}
      </div>

      {/* Icons */}
      <div className="flex items-center gap-1">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative w-9 h-9 rounded-xl flex items-center justify-center hover:bg-[#F4EFE7] transition-colors"
          >
            <Bell size={18} className="text-[#6E675F]" />
            {unread > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#E07A5F] rounded-full pulse-dot" />
            )}
          </button>
          {notifOpen && (
            <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl border border-[#EDE8E0] warm-shadow-lg z-50 dropdown-fade overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#EDE8E0]">
                <span className="font-semibold text-sm text-[#2F2A26]">Notifications</span>
                <span className="text-xs bg-[#7BAE7F20] text-[#7BAE7F] px-2 py-0.5 rounded-full font-medium">{unread} new</span>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.map(n => (
                  <div key={n.id} className={`flex items-start gap-3 px-4 py-3 hover:bg-[#F8F6F2] transition-colors slide-in ${!n.read ? 'bg-[#F8F6F2]' : ''}`}>
                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.color}`} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${n.read ? 'text-[#6E675F]' : 'text-[#2F2A26] font-medium'}`}>{n.text}</p>
                      <p className="text-[11px] text-[#A09890] mt-0.5">{n.time}</p>
                    </div>
                    {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-[#7BAE7F] mt-2 shrink-0" />}
                  </div>
                ))}
              </div>
              <div className="px-4 py-2.5 border-t border-[#EDE8E0]">
                <button onClick={() => onTabChange && onTabChange('Help Center')} className="text-xs font-medium text-[#7BAE7F] hover:underline">View all notifications</button>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => setChatOpen(!chatOpen)}
          className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-[#F4EFE7] transition-colors"
          title="Messages"
        >
          <MessageSquare size={18} className="text-[#6E675F]" />
        </button>

        <button
          onClick={() => setSettingsOpen(true)}
          className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-[#F4EFE7] transition-colors"
          title="Portal Settings"
        >
          <Settings size={18} className="text-[#6E675F]" />
        </button>

        {/* Avatar & Log Out */}
        <div className="flex items-center gap-3">
          <div className="ml-2 flex items-center gap-2 rounded-xl px-2 py-1.5">
            <img
              src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop"
              alt="Employee"
              className="w-8 h-8 rounded-lg object-cover"
            />
            <div className="text-left">
              <p className="text-xs font-semibold text-[#2F2A26] leading-tight">{employeeName}</p>
              <p className="text-[10px] text-[#6E675F]">{employeeRole}</p>
            </div>
          </div>
          {onLogout && (
            <button
              onClick={onLogout}
              className="text-[11px] font-bold px-3 py-2 rounded-xl transition-all border border-[#EDE8E0] hover:bg-[#F2E0D8] text-[#E07A5F] btn-scale"
            >
              Log Out
            </button>
          )}
        </div>
      </div>

      {/* Settings Modal */}
      {settingsOpen && (
        <div className="fixed inset-0 bg-[#2d2a2650] backdrop-blur-sm flex items-center justify-center z-[150] p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm border border-[#EDE8E0] shadow-2xl">
            <h4 className="text-[#2F2A26] font-bold text-base mb-4">Portal Preferences</h4>
            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#2F2A26] font-medium">Desktop Notifications</span>
                <input
                  type="checkbox"
                  checked={notifyEnabled}
                  onChange={e => setNotifyEnabled(e.target.checked)}
                  className="w-4 h-4 accent-[#7BAE7F] cursor-pointer"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#2F2A26] font-medium">Increase Contrast (Theme)</span>
                <input
                  type="checkbox"
                  checked={highContrast}
                  onChange={e => setHighContrast(e.target.checked)}
                  className="w-4 h-4 accent-[#7BAE7F] cursor-pointer"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-[#6E675F] block mb-1">Timezone</label>
                <select
                  value={timezone}
                  onChange={e => setTimezone(e.target.value)}
                  className="w-full p-2 text-xs rounded-xl border border-[#EDE8E0] bg-white outline-none focus:border-[#7BAE7F]"
                >
                  <option value="IST (UTC+05:30)">India (IST - UTC+05:30)</option>
                  <option value="EST (UTC-05:00)">New York (EST - UTC-05:00)</option>
                  <option value="GMT (UTC+00:00)">London (GMT - UTC+00:00)</option>
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 bg-[#7BAE7F] text-white text-xs font-semibold py-2.5 rounded-xl hover:bg-[#5A9260]">
                  Save Changes
                </button>
                <button type="button" onClick={() => setSettingsOpen(false)} className="flex-1 bg-[#F4EFE7] text-[#2F2A26] text-xs font-semibold py-2.5 rounded-xl hover:bg-[#EDE8E0]">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Chat Drawer Widget */}
      {chatOpen && (
        <div className="fixed bottom-6 right-6 w-80 h-[380px] bg-white rounded-3xl border border-[#EDE8E0] shadow-2xl flex flex-col z-[200] overflow-hidden justify-between fade-in-up">
          <div className="flex items-center justify-between px-4 py-3 bg-[#7BAE7F] text-white">
            <div className="flex items-center gap-2">
              <MessageSquare size={16} />
              <span className="font-bold text-xs">HR Support Chat</span>
            </div>
            <button onClick={() => setChatOpen(false)} className="hover:opacity-80">
              <X size={15} />
            </button>
          </div>
          <div className="flex-1 p-3 overflow-y-auto space-y-2 bg-[#FAF8F4] flex flex-col">
            {chatMessages.map(msg => (
              <div key={msg.id} className={`max-w-[85%] rounded-2xl p-2.5 text-[11px] leading-relaxed ${
                msg.sender === 'me'
                  ? 'self-end bg-[#7BAE7F] text-white'
                  : 'self-start bg-white text-[#2F2A26] border border-[#EDE8E0]'
              }`}>
                <p>{msg.text}</p>
                <span className="text-[8px] opacity-70 mt-1 block text-right">{msg.time}</span>
              </div>
            ))}
          </div>
          <form onSubmit={handleSendChatMessage} className="p-2 bg-white border-t border-[#EDE8E0] flex items-center gap-1.5">
            <input
              type="text"
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-[#FAF8F4] rounded-xl px-3 py-1.5 text-xs outline-none focus:border-[#7BAE7F] border border-[#EDE8E0]"
            />
            <button type="submit" className="p-2 bg-[#7BAE7F] text-white rounded-xl hover:bg-[#5A9260] transition-colors">
              <Send size={12} />
            </button>
          </form>
        </div>
      )}
    </header>
  );
}
