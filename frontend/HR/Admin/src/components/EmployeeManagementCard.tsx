import { Users, UserPlus, ChevronRight } from 'lucide-react';

const departments = [
  { name: 'Engineering', count: 72, color: '#A0785A' },
  { name: 'Sales', count: 34, color: '#6B7B95' },
  { name: 'HR', count: 18, color: '#8B7BA0' },
  { name: 'Marketing', count: 26, color: '#C49A4A' },
  { name: 'Finance', count: 21, color: '#B5654E' },
  { name: 'Operations', count: 13, color: '#8A7B6A' },
];

interface EmployeeManagementCardProps {
  onViewEmployees?: () => void;
  onAddEmployee?: () => void;
}

export default function EmployeeManagementCard({ onViewEmployees, onAddEmployee }: EmployeeManagementCardProps = {}) {
  const total = departments.reduce((s, d) => s + d.count, 0);
  const radius = 52;
  const circ = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="card p-5 flex flex-col" style={{ borderRadius: 24 }}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="font-serif text-[20px] leading-tight" style={{ color: '#2D2419', fontWeight: 600 }}>Employee Management</h2>
          <p className="text-[12px] mt-0.5" style={{ color: '#A89A88' }}>Department distribution</p>
        </div>
        <div className="flex items-center gap-1.5" style={{ color: '#A0785A' }}>
          <Users size={14} />
          <span className="text-[11px] font-600" style={{ fontWeight: 600 }}>Active</span>
        </div>
      </div>

      <div className="flex items-center gap-4 flex-1">
        {/* Left: big number + list */}
        <div className="flex-1">
          <p className="font-serif text-[28px] leading-none" style={{ color: '#2D2419', fontWeight: 600 }}>184</p>
          <p className="text-[11px] mb-3" style={{ color: '#A89A88' }}>Total Employees</p>
          <div className="space-y-1.5">
            {departments.slice(0, 5).map(d => (
              <div key={d.name} className="flex items-center gap-2 group cursor-pointer">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.color }} />
                <span className="text-[11px] flex-1" style={{ color: '#8A7B6A' }}>{d.name}</span>
                <span className="text-[11px] font-600" style={{ color: '#2D2419', fontWeight: 600 }}>{d.count}</span>
                <ChevronRight size={11} className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#D1C7B8' }} />
              </div>
            ))}
          </div>
        </div>

        {/* Right: donut */}
        <div className="relative w-32 h-32 flex-shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            {departments.map((d) => {
              const len = (d.count / total) * circ;
              const seg = (
                <circle
                  key={d.name}
                  cx="60" cy="60" r={radius}
                  fill="none"
                  stroke={d.color}
                  strokeWidth="14"
                  strokeDasharray={`${len} ${circ - len}`}
                  strokeDashoffset={-offset}
                  className="donut-segment"
                />
              );
              offset += len;
              return seg;
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-serif text-[20px] leading-none" style={{ color: '#2D2419', fontWeight: 600 }}>184</span>
            <span className="text-[9px] mt-0.5" style={{ color: '#A89A88' }}>Total</span>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 mt-3 pt-3" style={{ borderTop: '1px solid #F0E9DE' }}>
        <button onClick={onViewEmployees} className="btn-secondary flex-1 justify-center text-[12px] py-2">
          <Users size={13} /> View Employees
        </button>
        <button onClick={onAddEmployee} className="btn-primary flex-1 justify-center text-[12px] py-2">
          <UserPlus size={13} /> Add Employee
        </button>
      </div>
    </div>
  );
}
