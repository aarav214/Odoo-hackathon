import { useState, useEffect } from 'react';
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
import Login from './components/Login';
import CalendarSection from './components/CalendarSection';
import DocumentsSection from './components/DocumentsSection';
import PayslipsSection from './components/PayslipsSection';
import AttendanceSection from './components/AttendanceSection';
import HelpCenterSection from './components/HelpCenterSection';
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
        // Offline Fallback User
        setUser({
          id: 1,
          name: 'Sarah Chen',
          email: 'sarah.chen@hrmspro.com',
          role: 'employee',
          employee_id: 'EMP-2021-0487',
          department: 'Design Team',
          designation: 'Senior Product Designer',
          status: 'active'
        });
      }
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
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
      <div className="min-h-screen flex items-center justify-center bg-[#F8F6F2] text-sm font-semibold" style={{ color: '#7BAE7F' }}>
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
        return <CalendarSection />;
      case 'Documents':
        return <DocumentsSection />;
      case 'Payslips':
        return <PayslipsSection />;
      case 'Attendance':
        return <AttendanceSection />;
      case 'Help Center':
        return <HelpCenterSection />;
      default:
        return (
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
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F6F2]">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} onLogout={handleLogout} />
      <Header onLogout={handleLogout} employeeName={user?.name} employeeRole={user?.designation || user?.role} />

      <main className="ml-[220px] mt-[72px] p-7">
        {/* Page heading */}
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#2F2A26]">Good morning, {user?.name ? user.name.split(' ')[0] : 'Employee'}</h1>
            <p className="text-sm text-[#6E675F] mt-1">Here's your workday at a glance.</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setActiveTab('Attendance')} className="text-xs font-medium text-[#6E675F] bg-white border border-[#EDE8E0] hover:bg-[#F4EFE7] px-3 py-2 rounded-xl btn-scale">
              Clock Logs
            </button>
            <button onClick={() => setActiveTab('Calendar')} className="text-xs font-medium text-white bg-[#7BAE7F] hover:bg-[#5A9260] px-3 py-2 rounded-xl btn-scale">
              Apply Leave
            </button>
          </div>
        </div>

        {renderContent()}

        {/* Footer */}
        <footer className="mt-8 pt-6 border-t border-[#EDE8E0] flex items-center justify-between text-xs text-[#A09890]">
          <span>&copy; 2026 HRMSPro Employee Portal</span>
          <div className="flex items-center gap-4">
            <button onClick={() => alert('Privacy Guidelines')} className="hover:text-[#6E675F]">Privacy</button>
            <button onClick={() => alert('Terms of Service')} className="hover:text-[#6E675F]">Terms</button>
            <button onClick={() => setActiveTab('Help Center')} className="hover:text-[#6E675F]">Support</button>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App;
