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
import CalendarSection from './components/CalendarSection';
import EmployeesSection from './components/EmployeesSection';
import DocumentsSection from './components/DocumentsSection';
import ReportsSection from './components/ReportsSection';
import { apiRequest, checkBackendStatus } from './api';

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [employeeSearchQuery, setEmployeeSearchQuery] = useState('');
  const [showAddEmployeeForm, setShowAddEmployeeForm] = useState(false);

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
        return <CalendarSection />;
      case 'Employees':
        return (
          <EmployeesSection
            searchQuery={employeeSearchQuery}
            setSearchQuery={setEmployeeSearchQuery}
            showAddForm={showAddEmployeeForm}
            setShowAddForm={setShowAddEmployeeForm}
          />
        );
      case 'Documents':
        return <DocumentsSection />;
      case 'Reports':
        return <ReportsSection />;
      default:
        return (
          <div className="flex gap-5">
            {/* Left content area - 75% */}
            <div className="flex-1" style={{ flex: '0 0 75%' }}>
              {/* Top row */}
              <div className="flex gap-5 mb-5">
                {/* Card 1: Employee Profile - 330 wide */}
                <div style={{ width: 330, flexShrink: 0 }}>
                  <EmployeeProfileCard
                    onViewProfile={() => {
                      setActiveTab('Employees');
                      setEmployeeSearchQuery('Arjun Mehta');
                    }}
                    onEditProfile={() => {
                      setActiveTab('Employees');
                      setEmployeeSearchQuery('Arjun Mehta');
                    }}
                    onSettings={() => alert('Settings panel is under development')}
                  />
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
                  <EmployeeManagementCard
                    onViewEmployees={() => {
                      setActiveTab('Employees');
                      setEmployeeSearchQuery('');
                    }}
                    onAddEmployee={() => {
                      setActiveTab('Employees');
                      setShowAddEmployeeForm(true);
                    }}
                  />
                </div>
                {/* Card 6: Leave Overview - 190 wide */}
                <div style={{ width: 190, flexShrink: 0 }}>
                  <LeaveOverviewCard
                    onManageLeave={() => setActiveTab('Calendar')}
                  />
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
      <Header
        onLogout={handleLogout}
        adminName={user?.name || 'Admin User'}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onAddEmployee={() => {
          setActiveTab('Employees');
          setShowAddEmployeeForm(true);
        }}
        onSearchSelect={(category, item) => {
          if (category === 'Employees') {
            setActiveTab('Employees');
            setEmployeeSearchQuery(item);
          } else if (category === 'Departments') {
            setActiveTab('Employees');
            setEmployeeSearchQuery(item);
          } else if (category === 'Attendance') {
            setActiveTab('Dashboard');
          }
        }}
      />

      {/* Main content - 1440px max, 28px padding, 20px gap */}
      <div className="mx-auto" style={{ maxWidth: 1440, padding: 28 }}>
        {renderContent()}
      </div>
    </div>
  );
}

export default App;
