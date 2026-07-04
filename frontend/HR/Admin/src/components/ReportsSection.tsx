import { DollarSign, Users, Award, Clock, ArrowUpRight, ArrowDownRight, FileDown } from 'lucide-react';

export default function ReportsSection() {
  const metrics = [
    { label: 'Total Payroll Budget', val: '$182,500/mo', change: '+3.4% vs last month', up: true, icon: DollarSign, color: '#6B8E5A' },
    { label: 'Active Workforce', val: '92.5%', change: '+1.2% this week', up: true, icon: Users, color: '#6B7B95' },
    { label: 'Leave Utilization', val: '8.4%', change: '-0.5% vs average', up: false, icon: Award, color: '#C49A4A' },
    { label: 'Avg worked hours', val: '38.2h/wk', change: '+0.8h shift increase', up: true, icon: Clock, color: '#8B7BA0' },
  ];

  const deptBreakdowns = [
    { name: 'Engineering', employees: 24, budget: '$78,400', attendPct: 94.8, leavesCount: 4 },
    { name: 'Sales & Marketing', employees: 18, budget: '$42,500', attendPct: 91.2, leavesCount: 2 },
    { name: 'Finance & Accounts', employees: 8, budget: '$28,000', attendPct: 96.5, leavesCount: 1 },
    { name: 'Human Resources', employees: 5, budget: '$18,600', attendPct: 98.2, leavesCount: 0 },
    { name: 'Operations', employees: 12, budget: '$15,000', attendPct: 88.4, leavesCount: 3 },
  ];

  return (
    <div className="flex flex-col gap-5">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, idx) => (
          <div key={idx} className="card p-5 bg-white flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: '#A89A88' }}>{m.label}</p>
                <h3 className="font-serif text-[22px] font-bold mt-1.5" style={{ color: '#2D2419' }}>{m.val}</h3>
              </div>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm" style={{ background: m.color + '15', color: m.color }}>
                <m.icon size={18} />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-4 text-[11px]">
              {m.up ? <ArrowUpRight size={13} className="text-[#6B8E5A]" /> : <ArrowDownRight size={13} className="text-[#B5654E]" />}
              <span className="font-semibold" style={{ color: m.up ? '#6B8E5A' : '#B5654E' }}>{m.change.split(' ')[0]}</span>
              <span style={{ color: '#A89A88' }}>{m.change.substring(m.change.indexOf(' '))}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Details Row: Department Breakdown & Budget Allocations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Department Table */}
        <div className="lg:col-span-2 card p-6 bg-white">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-serif text-[18px] font-bold" style={{ color: '#2D2419' }}>Departmental Analytics</h3>
              <p className="text-[11px]" style={{ color: '#8A7B6A' }}>Workforce counts, budget shares, and attendance metrics</p>
            </div>
            <button
              onClick={() => alert('Exporting departmental report...')}
              className="btn-secondary py-1.5 px-3 rounded-lg text-[11px] gap-1.5"
            >
              <FileDown size={14} /> Export Report
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[12px]">
              <thead>
                <tr className="border-b" style={{ borderColor: '#F5F0E8', color: '#A89A88' }}>
                  <th className="pb-2 font-600 uppercase tracking-wider">Department</th>
                  <th className="pb-2 font-600 uppercase tracking-wider">Employees</th>
                  <th className="pb-2 font-600 uppercase tracking-wider">Monthly Budget</th>
                  <th className="pb-2 font-600 uppercase tracking-wider">Avg Attendance</th>
                  <th className="pb-2 font-600 uppercase tracking-wider text-right">Leaves Used (MTD)</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: '#F5F0E8' }}>
                {deptBreakdowns.map((d, idx) => (
                  <tr key={idx} className="hover:bg-[#FBF8F3] transition-colors">
                    <td className="py-3 font-semibold" style={{ color: '#2D2419' }}>{d.name}</td>
                    <td className="py-3" style={{ color: '#8A7B6A' }}>{d.employees}</td>
                    <td className="py-3 font-medium" style={{ color: '#2D2419' }}>{d.budget}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold" style={{ color: d.attendPct >= 92 ? '#6B8E5A' : '#C49A4A' }}>{d.attendPct}%</span>
                        <div className="w-16 h-1.5 bg-[#EDE8E0] rounded-full overflow-hidden hidden sm:block">
                          <div className="h-full rounded-full" style={{ width: `${d.attendPct}%`, background: d.attendPct >= 92 ? '#6B8E5A' : '#C49A4A' }} />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-right" style={{ color: '#8A7B6A' }}>{d.leavesCount} days</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Budget Allocation Panel */}
        <div className="card p-6 bg-white flex flex-col justify-between">
          <div>
            <h3 className="font-serif text-[18px] font-bold mb-4" style={{ color: '#2D2419' }}>Budget Allocations</h3>
            <p className="text-[11px] mb-5" style={{ color: '#8A7B6A' }}>Breakdown of monthly payroll across primary operational departments.</p>

            <div className="space-y-4">
              {[
                { name: 'Engineering', pct: 43, color: '#6B8E5A' },
                { name: 'Sales & Marketing', pct: 23, color: '#6B7B95' },
                { name: 'Finance & Accounts', pct: 15, color: '#8B7BA0' },
                { name: 'Human Resources', pct: 10, color: '#C49A4A' },
                { name: 'Operations', pct: 9, color: '#B5654E' },
              ].map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold" style={{ color: '#2D2419' }}>{item.name}</span>
                    <span style={{ color: '#8A7B6A' }}>{item.pct}%</span>
                  </div>
                  <div className="h-2 bg-[#EDE8E0] rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${item.pct}%`, background: item.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t text-[11px] leading-relaxed" style={{ borderColor: '#F5F0E8', color: '#8A7B6A' }}>
            Budget figures are calculated based on salary structures and allowances. Updates to salary variables under payroll configuration will update values here automatically.
          </div>
        </div>
      </div>
    </div>
  );
}
