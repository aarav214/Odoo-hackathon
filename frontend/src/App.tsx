import Header from './components/Header';
import EmployeeProfileCard from './components/EmployeeProfileCard';
import AttendanceCard from './components/AttendanceCard';
import QuickStatsCard from './components/QuickStatsCard';
import WorkingHoursCard from './components/WorkingHoursCard';
import EmployeeManagementCard from './components/EmployeeManagementCard';
import LeaveOverviewCard from './components/LeaveOverviewCard';
import LeaveApprovalCard from './components/LeaveApprovalCard';
import PayrollSummaryCard from './components/PayrollSummaryCard';

function App() {
  return (
    <div className="min-h-screen bg-[#F4F5F7]">
      <Header />

      {/* Main content - 1440px max, 28px padding, 20px gap */}
      <div className="mx-auto" style={{ maxWidth: 1440, padding: 28 }}>
        <div className="flex gap-5">
          {/* Left content area - 75% */}
          <div className="flex-1" style={{ flex: '0 0 75%' }}>
            {/* Top row */}
            <div className="flex gap-5 mb-5">
              {/* Card 1: Employee Profile - 330 wide */}
              <div style={{ width: 330, flexShrink: 0 }}>
                <EmployeeProfileCard />
              </div>
              {/* Card 2: Attendance - largest, fills remaining */}
              <div className="flex-1">
                <AttendanceCard />
              </div>
              {/* Card 3: Quick Stats - 190 wide */}
              <div style={{ width: 190, flexShrink: 0 }}>
                <QuickStatsCard />
              </div>
            </div>

            {/* Bottom row */}
            <div className="flex gap-5">
              {/* Card 4: Working Hours - 330 wide */}
              <div style={{ width: 330, flexShrink: 0 }}>
                <WorkingHoursCard />
              </div>
              {/* Card 5: Employee Management - fills remaining */}
              <div className="flex-1">
                <EmployeeManagementCard />
              </div>
              {/* Card 6: Leave Overview - 190 wide */}
              <div style={{ width: 190, flexShrink: 0 }}>
                <LeaveOverviewCard />
              </div>
            </div>
          </div>

          {/* Right sidebar - 25%, fixed column */}
          <div style={{ width: 310, flexShrink: 0 }} className="flex flex-col gap-5">
            <LeaveApprovalCard />
            <PayrollSummaryCard />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
