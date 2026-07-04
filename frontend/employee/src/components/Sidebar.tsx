import { useState } from 'react';
import {
  LayoutDashboard,
  Calendar,
  FileText,
  DollarSign,
  HelpCircle,
  Clock,
  LogOut,
  ChevronRight,
} from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', active: true },
  { icon: Calendar, label: 'Calendar', active: false },
  { icon: FileText, label: 'Documents', active: false },
  { icon: DollarSign, label: 'Payslips', active: false },
  { icon: Clock, label: 'Attendance', active: false },
  { icon: HelpCircle, label: 'Help Center', active: false },
];

interface SidebarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onLogout?: () => void;
}

export default function Sidebar({ activeTab = 'Dashboard', onTabChange, onLogout }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 h-full w-[220px] bg-white border-r border-[#EDE8E0] flex flex-col z-20 warm-shadow">
      {/* Logo */}
      <div className="h-[72px] flex items-center px-6 border-b border-[#EDE8E0]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7BAE7F] to-[#A98E74] flex items-center justify-center">
            <span className="text-white font-bold text-sm">H</span>
          </div>
          <div>
            <p className="font-bold text-[#2F2A26] text-sm leading-tight">HRMSPro</p>
            <p className="text-[10px] text-[#6E675F]">Employee Portal</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 pt-6 space-y-1">
        {navItems.map(({ icon: Icon, label }) => {
          const isActive = label === activeTab;
          return (
            <button
              key={label}
              onClick={() => onTabChange && onTabChange(label)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                isActive
                  ? 'bg-gradient-to-r from-[#7BAE7F18] to-[#A98E7410] text-[#2F2A26] border border-[#7BAE7F30]'
                  : 'text-[#6E675F] hover:bg-[#F4EFE7] hover:text-[#2F2A26]'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                isActive ? 'bg-[#7BAE7F20]' : 'group-hover:bg-[#EDE8E0]'
              }`}>
                <Icon size={16} className={isActive ? 'text-[#7BAE7F]' : ''} />
              </div>
              <span>{label}</span>
              {isActive && (
                <ChevronRight size={14} className="ml-auto text-[#7BAE7F]" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-6 space-y-1">
        <div className="mx-3 mb-4 p-3 rounded-xl bg-gradient-to-br from-[#7BAE7F15] to-[#A98E7415] border border-[#EDE8E0]">
          <p className="text-xs font-semibold text-[#2F2A26]">Need help?</p>
          <p className="text-[11px] text-[#6E675F] mt-0.5">Contact HR support</p>
          <button onClick={() => onTabChange && onTabChange('Help Center')} className="mt-2 text-[11px] font-medium text-[#7BAE7F] hover:underline">Open ticket</button>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#6E675F] hover:bg-[#F4EFE7] hover:text-[#2F2A26] transition-all"
        >
          <div className="w-8 h-8 rounded-lg flex items-center justify-center">
            <LogOut size={16} />
          </div>
          Sign Out
        </button>
      </div>
    </aside>
  );
}
