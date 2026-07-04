import { useState, useRef, useEffect } from 'react';
import {
  LayoutDashboard, Calendar, Users, FileText, BarChart2,
  Search, Bell, MessageSquare, ChevronDown, Plus, X,
  CheckCircle, Clock, AlertCircle, UserCheck
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, active: true },
  { label: 'Calendar', icon: Calendar, active: false },
  { label: 'Employees', icon: Users, active: false },
  { label: 'Documents', icon: FileText, active: false },
  { label: 'Reports', icon: BarChart2, active: false },
];

const notifications = [
  { icon: UserCheck, color: '#6B8E5A', title: 'Arjun Mehta checked in', time: '2 min ago', sub: 'On time arrival' },
  { icon: CheckCircle, color: '#6B7B95', title: 'Payroll generated', time: '1h ago', sub: 'June payroll processed' },
  { icon: CheckCircle, color: '#6B8E5A', title: 'Leave approved', time: '2h ago', sub: 'Priya Sharma - Annual leave' },
  { icon: AlertCircle, color: '#C49A4A', title: 'Attendance corrected', time: '3h ago', sub: 'Rahul Verma - Thu 27 Jun' },
  { icon: UserCheck, color: '#8B7BA0', title: 'Profile updated', time: '5h ago', sub: 'Neha Joshi updated details' },
];

const searchCategories = [
  { label: 'Employees', results: ['Arjun Mehta', 'Priya Sharma', 'Rahul Verma'] },
  { label: 'Departments', results: ['Engineering', 'Sales', 'HR'] },
  { label: 'Attendance', results: ['Today\'s report', 'Weekly summary'] },
];

export default function Header() {
  const [showNotifs, setShowNotifs] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const notifRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifs(false);
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowSearch(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <header className="h-[72px] bg-white border-b flex items-center px-7 gap-6 sticky top-0 z-50" style={{ borderColor: '#E8DFD3', boxShadow: '0 1px 3px rgba(45,36,25,0.04)' }}>
      {/* Logo */}
      <div className="flex items-center gap-2.5 mr-2">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm" style={{ background: '#A0785A' }}>
          <Users size={18} color="white" strokeWidth={2.5} />
        </div>
        <span className="font-serif text-[17px] tracking-tight" style={{ color: '#2D2419', fontWeight: 600 }}>HRFlow</span>
      </div>

      {/* Nav */}
      <nav className="flex items-center gap-1">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[13px] font-medium transition-all duration-150 ${
              item.active
                ? 'text-white shadow-sm'
                : 'hover:bg-[#F5EDE0]'
            }`}
            style={item.active ? { background: '#A0785A', color: 'white' } : { color: '#8A7B6A' }}
          >
            <item.icon size={15} strokeWidth={2} />
            {item.label}
          </button>
        ))}
      </nav>

      {/* Center spacer */}
      <div className="flex-1" />

      {/* Date Range */}
      <button className="flex items-center gap-2 px-3.5 py-2 rounded-xl border text-[13px] font-medium hover:bg-[#F5EDE0] transition-all" style={{ borderColor: '#E8DFD3', color: '#8A7B6A' }}>
        <Calendar size={15} style={{ color: '#A89A88' }} />
        <span>Today</span>
        <ChevronDown size={13} style={{ color: '#A89A88' }} />
      </button>

      {/* Add Employee */}
      <button className="btn-primary gap-1.5">
        <Plus size={15} strokeWidth={2.5} />
        Add Employee
      </button>

      {/* Search */}
      <div className="relative" ref={searchRef}>
        <button
          onClick={() => { setShowSearch(!showSearch); setShowNotifs(false); }}
          className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-[#F5EDE0] transition-all"
          style={{ color: '#A89A88' }}
        >
          <Search size={18} />
        </button>
        {showSearch && (
          <div className="search-panel p-4">
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl mb-3" style={{ background: '#F5F0E8' }}>
              <Search size={15} style={{ color: '#A89A88' }} />
              <input
                autoFocus
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search employees, leaves, payroll..."
                className="flex-1 bg-transparent text-[13px] outline-none placeholder:text-[#A89A88]"
                style={{ color: '#2D2419' }}
              />
              {searchQuery && <button onClick={() => setSearchQuery('')}><X size={13} style={{ color: '#A89A88' }} /></button>}
            </div>
            {searchCategories.map(cat => (
              <div key={cat.label} className="mb-3">
                <p className="text-[11px] font-600 uppercase tracking-wide mb-1.5 px-1" style={{ color: '#A89A88', fontWeight: 600 }}>{cat.label}</p>
                {cat.results.map(r => (
                  <button key={r} className="w-full text-left px-3 py-2 rounded-xl text-[13px] hover:bg-[#F5EDE0] transition-all" style={{ color: '#8A7B6A' }}>{r}</button>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Notifications */}
      <div className="relative" ref={notifRef}>
        <button
          onClick={() => { setShowNotifs(!showNotifs); setShowSearch(false); }}
          className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-[#F5EDE0] transition-all relative"
          style={{ color: '#A89A88' }}
        >
          <Bell size={18} />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ background: '#B5654E' }} />
        </button>
        {showNotifs && (
          <div className="notification-panel p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="font-serif text-[15px]" style={{ color: '#2D2419', fontWeight: 600 }}>Notifications</p>
              <span className="badge-green">5 new</span>
            </div>
            {notifications.map((n, i) => (
              <div key={i} className="flex items-start gap-3 py-2.5 border-b last:border-0" style={{ borderColor: '#F5F0E8' }}>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: n.color + '20' }}>
                  <n.icon size={15} style={{ color: n.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-500 leading-tight" style={{ color: '#2D2419', fontWeight: 500 }}>{n.title}</p>
                  <p className="text-[11px] mt-0.5" style={{ color: '#A89A88' }}>{n.sub}</p>
                </div>
                <span className="text-[10px] flex-shrink-0 mt-0.5" style={{ color: '#A89A88' }}>{n.time}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Messages */}
      <button className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-[#F5EDE0] transition-all" style={{ color: '#A89A88' }}>
        <MessageSquare size={18} />
      </button>

      {/* Avatar */}
      <div className="flex items-center gap-2 cursor-pointer">
        <div className="w-8 h-8 rounded-xl overflow-hidden border-2" style={{ borderColor: '#E8DFD3' }}>
          <img
            src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100"
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <ChevronDown size={13} style={{ color: '#A89A88' }} />
      </div>
    </header>
  );
}
