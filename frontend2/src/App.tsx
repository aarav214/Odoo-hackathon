import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ProfileCard from './components/ProfileCard';
import AttendanceCard from './components/AttendanceCard';
import QuickSummaryCard from './components/QuickSummaryCard';
import WorkingHoursChart from './components/WorkingHoursChart';
import LeaveCard from './components/LeaveCard';
import DocumentsCard from './components/DocumentsCard';
import PayrollCard from './components/PayrollCard';
import ActivityFeed from './components/ActivityFeed';

function App() {
  return (
    <div className="min-h-screen bg-[#F8F6F2]">
      <Sidebar />
      <Header />

      <main className="ml-[220px] mt-[72px] p-7">
        {/* Page heading */}
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#2F2A26]">Good morning, Sarah</h1>
            <p className="text-sm text-[#6E675F] mt-1">Here's your workday at a glance.</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="text-xs font-medium text-[#6E675F] bg-white border border-[#EDE8E0] hover:bg-[#F4EFE7] px-3 py-2 rounded-xl btn-scale">
              This Week
            </button>
            <button className="text-xs font-medium text-white bg-[#7BAE7F] hover:bg-[#5A9260] px-3 py-2 rounded-xl btn-scale">
              Apply Leave
            </button>
          </div>
        </div>

        {/* Grid: 75% left, 25% right */}
        <div className="grid grid-cols-12 gap-5">
          {/* Left area 75% */}
          <div className="col-span-12 lg:col-span-9 grid grid-cols-12 gap-5 stagger">
            {/* Profile - large vertical, spans 4 cols */}
            <div className="col-span-12 md:col-span-4">
              <ProfileCard />
            </div>

            {/* Right of profile: attendance + summary stacked, 8 cols */}
            <div className="col-span-12 md:col-span-8 flex flex-col gap-5">
              <AttendanceCard />
              <div className="grid grid-cols-12 gap-5">
                <div className="col-span-12 md:col-span-5">
                  <QuickSummaryCard />
                </div>
                <div className="col-span-12 md:col-span-7">
                  <WorkingHoursChart />
                </div>
              </div>
            </div>

            {/* Leave - full width */}
            <div className="col-span-12">
              <LeaveCard />
            </div>

            {/* Documents - full width */}
            <div className="col-span-12">
              <DocumentsCard />
            </div>
          </div>

          {/* Right sidebar 25% */}
          <div className="col-span-12 lg:col-span-3 flex flex-col gap-5 stagger">
            <div className="lg:sticky lg:top-[88px] flex flex-col gap-5">
              <PayrollCard />
              <ActivityFeed />
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 pt-6 border-t border-[#EDE8E0] flex items-center justify-between text-xs text-[#A09890]">
          <span>&copy; 2026 HRMSPro Employee Portal</span>
          <div className="flex items-center gap-4">
            <button className="hover:text-[#6E675F]">Privacy</button>
            <button className="hover:text-[#6E675F]">Terms</button>
            <button className="hover:text-[#6E675F]">Support</button>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App;
