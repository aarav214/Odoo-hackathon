import { useState, useEffect } from 'react';
import Header from './components/Header';
import EmployeeProfileCard from './components/EmployeeProfileCard';
import AttendanceCard from './components/AttendanceCard';
import QuickStatsCard from './components/QuickStatsCard';
import WorkingHoursCard from './components/WorkingHoursCard';
import EmployeeManagementCard from './components/EmployeeManagementCard';
import LeaveOverviewCard from './components/LeaveOverviewCard';
import LeaveApprovalCard from './components/LeaveApprovalCard';
import PayrollSummaryCard from './components/PayrollSummaryCard';
import Login from './components/Login';
import { apiRequest, checkBackendStatus } from './api';

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Dashboard');

  const fetchProfile = async () => {
    try {
      const isOnline = await checkBackendStatus();
      if (isOnline && token && !token.startsWith('mock-')) {
        const userProfile = await apiRequest('/profile/me');
        setUser(userProfile);
      } else if (token && token.startsWith('mock-')) {
        // Mock profile in offline mode
        setUser({
          name: 'Admin User',
          email: 'admin@example.com',
          role: 'admin',
          employee_id: 'ADM001',
          department: 'HR Operations',
          designation: 'HR Director'
        });
      }
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
      // If token expired/invalid, clear it
      handleLogout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [token]);

  const handleLoginSuccess = (newToken: string) => {
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F0E8] text-sm font-semibold" style={{ color: '#A0785A' }}>
        Loading Session...
      </div>
    );
  }

  if (!token) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'Calendar':
        return (
          <div className="flex gap-5">
            <div className="flex-1">
              <LeaveApprovalCard />
            </div>
            <div style={{ width: 330, flexShrink: 0 }}>
              <LeaveOverviewCard />
            </div>
          </div>
        );
      case 'Employees':
        return (
          <div className="flex gap-5">
            <div className="flex-1">
              <EmployeeManagementCard />
            </div>
            <div style={{ width: 330, flexShrink: 0 }} className="flex flex-col gap-5">
              <EmployeeProfileCard />
              <QuickStatsCard />
            </div>
          </div>
        );
      case 'Documents':
        return (
          <div className="flex gap-5">
            <div className="flex-1">
              <div className="card p-6 flex flex-col gap-4" style={{ borderRadius: 24, background: 'white' }}>
                <h2 className="font-serif text-[20px] leading-tight" style={{ color: '#2D2419', fontWeight: 600 }}>Company Documents</h2>
                <p className="text-[12px]" style={{ color: '#8A7B6A' }}>Access and manage global organizational templates, employee records, and onboarding files.</p>
                <div className="border border-dashed p-10 rounded-2xl flex flex-col items-center justify-center gap-3" style={{ borderColor: '#EDE8E0' }}>
                  <span className="text-[12px]" style={{ color: '#A89A88' }}>Upload new company document templates (.pdf, .docx, .xlsx)</span>
                  <button className="btn-primary py-2 px-4 rounded-xl text-[12px]">Upload Document</button>
                </div>
                <div className="flex flex-col gap-2 mt-2">
                  {[
                    { name: 'Employee_Handbook_2026.pdf', size: '2.4 MB', date: 'Jul 1, 2026' },
                    { name: 'NDA_Template.docx', size: '1.1 MB', date: 'Jun 12, 2026' },
                    { name: 'Leave_Policy_v4.pdf', size: '940 KB', date: 'May 20, 2026' },
                  ].map((doc, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl border" style={{ borderColor: '#F5F0E8' }}>
                      <div>
                        <p className="text-[12px] font-500" style={{ color: '#2D2419', fontWeight: 500 }}>{doc.name}</p>
                        <p className="text-[10px]" style={{ color: '#A89A88' }}>{doc.size} · Uploaded on {doc.date}</p>
                      </div>
                      <button className="text-[12px] font-600 hover:underline" style={{ color: '#A0785A', fontWeight: 600 }}>Download</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ width: 330, flexShrink: 0 }}>
              <EmployeeProfileCard />
            </div>
          </div>
        );
      case 'Reports':
        return (
          <div className="flex gap-5">
            <div className="flex-1 flex flex-col gap-5">
              <WorkingHoursCard />
              <PayrollSummaryCard />
            </div>
            <div style={{ width: 330, flexShrink: 0 }} className="flex flex-col gap-5">
              <QuickStatsCard />
            </div>
          </div>
        );
      default:
        return (
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
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7]">
      <Header onLogout={handleLogout} adminName={user?.name || 'Admin User'} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main content - 1440px max, 28px padding, 20px gap */}
      <div className="mx-auto" style={{ maxWidth: 1440, padding: 28 }}>
        {renderContent()}
      </div>
    </div>
  );
}

export default App;
