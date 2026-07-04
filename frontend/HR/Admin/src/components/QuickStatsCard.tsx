import { Calendar, Plane, Clock, Home, TrendingUp } from 'lucide-react';

const stats = [
  { icon: Calendar, label: 'Attendance', value: '94%', trend: '+2%', color: '#A0785A', bg: '#F5EDE0' },
  { icon: Plane, label: 'Leave Used', value: '8/24', trend: '33%', color: '#6B7B95', bg: '#E4E8EE' },
  { icon: Clock, label: 'Pending', value: '3', trend: '+1', color: '#C49A4A', bg: '#F5EBD8' },
  { icon: Home, label: 'Remote Days', value: '5', trend: '+1', color: '#8B7BA0', bg: '#ECE6F0' },
];

export default function QuickStatsCard() {
  return (
    <div className="card p-4 flex flex-col" style={{ borderRadius: 24 }}>
      <h2 className="font-serif text-[15px] mb-3" style={{ color: '#2D2419', fontWeight: 600 }}>Quick Statistics</h2>
      <div className="flex flex-col gap-2 flex-1">
        {stats.map((s, i) => (
          <div key={s.label} className="flex items-center gap-2.5 p-2.5 rounded-2xl transition-all animate-fade-in hover:bg-[#F5EDE0]" style={{ background: '#FBF8F3', animationDelay: `${i * 80}ms` }}>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: s.bg }}>
              <s.icon size={15} style={{ color: s.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] leading-none" style={{ color: '#A89A88' }}>{s.label}</p>
              <p className="font-serif text-[15px] mt-1 leading-none" style={{ color: '#2D2419', fontWeight: 600 }}>{s.value}</p>
            </div>
            <div className="flex items-center gap-0.5">
              <TrendingUp size={10} style={{ color: '#6B8E5A' }} />
              <span className="text-[10px] font-600" style={{ color: '#6B8E5A', fontWeight: 600 }}>{s.trend}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
