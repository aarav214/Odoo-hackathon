import { useState, useEffect } from 'react';
import { Users, Search, Plus, Filter, Mail, Shield, UserX, UserCheck } from 'lucide-react';
import { apiRequest, checkBackendStatus } from '../api';

interface Employee {
  id: number;
  employee_id: string;
  name: string;
  email: string;
  role: string;
  department?: string;
  designation?: string;
  status?: string;
}

const mockEmployees: Employee[] = [
  { id: 1, employee_id: 'EMP001', name: 'Arjun Mehta', email: 'emp1@example.com', role: 'employee', department: 'Engineering', designation: 'Senior Developer', status: 'active' },
  { id: 2, employee_id: 'EMP002', name: 'Priya Sharma', email: 'emp2@example.com', role: 'employee', department: 'Engineering', designation: 'UI/UX Designer', status: 'active' },
  { id: 3, employee_id: 'EMP003', name: 'Rahul Verma', email: 'emp3@example.com', role: 'employee', department: 'Sales', designation: 'Account Executive', status: 'active' },
  { id: 4, employee_id: 'EMP004', name: 'Neha Joshi', email: 'emp4@example.com', role: 'employee', department: 'Marketing', designation: 'Marketing Lead', status: 'suspended' },
];

interface EmployeesSectionProps {
  searchQuery?: string;
  setSearchQuery?: (q: string) => void;
  showAddForm?: boolean;
  setShowAddForm?: (show: boolean) => void;
}

export default function EmployeesSection({
  searchQuery: propSearchQuery,
  setSearchQuery: propSetSearchQuery,
  showAddForm: propShowAddForm,
  setShowAddForm: propSetShowAddForm
}: EmployeesSectionProps = {}) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [localSearchQuery, localSetSearchQuery] = useState('');
  const [localShowAddForm, localSetShowAddForm] = useState(false);

  const searchQuery = propSearchQuery !== undefined ? propSearchQuery : localSearchQuery;
  const setSearchQuery = propSetSearchQuery !== undefined ? propSetSearchQuery : localSetSearchQuery;
  const showAddForm = propShowAddForm !== undefined ? propShowAddForm : localShowAddForm;
  const setShowAddForm = propSetShowAddForm !== undefined ? propSetShowAddForm : localSetShowAddForm;

  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('employee');
  const [empId, setEmpId] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [designation, setDesignation] = useState('Software Engineer');

  const loadEmployees = async () => {
    try {
      const isOnline = await checkBackendStatus();
      if (isOnline) {
        const data = await apiRequest('/admin/employees');
        setEmployees(data.items || data);
      } else {
        setEmployees(mockEmployees);
      }
    } catch (e) {
      console.error('Failed to load employees:', e);
      setEmployees(mockEmployees);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !empId) {
      alert('Please fill in all mandatory fields');
      return;
    }

    try {
      const isOnline = await checkBackendStatus();
      if (isOnline) {
        // Register the new user
        await apiRequest('/auth/signup', {
          method: 'POST',
          body: JSON.stringify({
            employee_id: empId,
            name,
            email,
            password,
            role
          })
        });

        // Resolve user ID by getting profile or updating department metadata
        // Wait, the API routes handle updates at PATCH `/profile/{user_id}`
        // Let's query all employees to find this new user's ID
        const currentEmps = await apiRequest('/admin/employees');
        const listItems = currentEmps.items || currentEmps;
        const newlyCreated = listItems.find((u: any) => u.employee_id === empId);
        if (newlyCreated) {
          await apiRequest(`/profile/${newlyCreated.id}`, {
            method: 'PATCH',
            body: JSON.stringify({
              department,
              designation,
              status: 'active'
            })
          });
        }

        alert('Employee registered successfully!');
        loadEmployees();
        setShowAddForm(false);
        // Clear form
        setName('');
        setEmail('');
        setPassword('');
        setRole('employee');
        setEmpId('');
      } else {
        // Mock fallback
        const newEmp: Employee = {
          id: Date.now(),
          employee_id: empId,
          name,
          email,
          role,
          department,
          designation,
          status: 'active'
        };
        setEmployees([...employees, newEmp]);
        alert('Mock employee created (Offline Mode)');
        setShowAddForm(false);
      }
    } catch (e: any) {
      alert(e.message || 'Failed to register employee');
    }
  };

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    try {
      const isOnline = await checkBackendStatus();
      if (isOnline) {
        await apiRequest(`/profile/${id}`, {
          method: 'PATCH',
          body: JSON.stringify({ status: newStatus })
        });
        alert(`Employee status set to ${newStatus}!`);
        loadEmployees();
      } else {
        setEmployees(prev => prev.map(emp => emp.id === id ? { ...emp, status: newStatus } : emp));
      }
    } catch (e: any) {
      alert(e.message || 'Failed to update employee status');
    }
  };

  const filtered = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          emp.employee_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          emp.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDept = deptFilter === 'All' || emp.department === deptFilter;
    const matchesStatus = statusFilter === 'All' || 
                          (statusFilter === 'Active' && emp.status !== 'suspended') ||
                          (statusFilter === 'Suspended' && emp.status === 'suspended');

    return matchesSearch && matchesDept && matchesStatus;
  });

  return (
    <div className="flex flex-col gap-5">
      {/* Directory Controls */}
      <div className="card p-5 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="flex-1 max-w-md relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#A89A88' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by name, ID, or email..."
            className="w-full pl-10 pr-4 py-2 text-[13px] rounded-xl border outline-none placeholder:text-[#A89A88] transition-all focus:border-[#A0785A]"
            style={{ borderColor: '#E8DFD3', color: '#2D2419' }}
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Department */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border" style={{ borderColor: '#E8DFD3' }}>
            <Filter size={13} style={{ color: '#A89A88' }} />
            <select
              value={deptFilter}
              onChange={e => setDeptFilter(e.target.value)}
              className="text-[12px] bg-transparent outline-none font-medium cursor-pointer"
              style={{ color: '#8A7B6A' }}
            >
              <option value="All">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Sales">Sales</option>
              <option value="Marketing">Marketing</option>
              <option value="Finance">Finance</option>
              <option value="HR">HR</option>
            </select>
          </div>

          {/* Status */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border" style={{ borderColor: '#E8DFD3' }}>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="text-[12px] bg-transparent outline-none font-medium cursor-pointer"
              style={{ color: '#8A7B6A' }}
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>

          {/* Add Button */}
          <button onClick={() => setShowAddForm(true)} className="btn-primary py-2 text-[12px]">
            <Plus size={14} /> Add Employee
          </button>
        </div>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(emp => (
          <div key={emp.id} className="card p-5 bg-white flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 bg-[#FBF8F3]" style={{ borderColor: '#E8DFD3' }}>
                  <img
                    src={`https://images.pexels.com/photos/${emp.id % 2 === 0 ? '1239291' : '1222271'}/pexels-photo-${emp.id % 2 === 0 ? '1239291' : '1222271'}.jpeg?auto=compress&cs=tinysrgb&w=80`}
                    alt={emp.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className={emp.status === 'suspended' ? 'badge-red' : 'badge-green'}>
                  {emp.status === 'suspended' ? 'Suspended' : 'Active'}
                </span>
              </div>

              <h3 className="font-serif text-[16px] font-bold" style={{ color: '#2D2419' }}>{emp.name}</h3>
              <p className="text-[11px]" style={{ color: '#8A7B6A' }}>{emp.designation || 'Specialist'} · {emp.department || 'General'}</p>
              
              <div className="flex items-center gap-1.5 mt-3 text-[11px]" style={{ color: '#A89A88' }}>
                <Mail size={12} />
                <span className="truncate">{emp.email}</span>
              </div>
              <div className="flex items-center gap-1.5 mt-1.5 text-[11px]" style={{ color: '#A89A88' }}>
                <Shield size={12} />
                <span>ID: {emp.employee_id} · Role: <span className="capitalize">{emp.role}</span></span>
              </div>
            </div>

            {/* Admin actions */}
            <div className="flex gap-2 mt-5 pt-3 border-t" style={{ borderColor: '#F5F0E8' }}>
              {emp.status === 'suspended' ? (
                <button
                  onClick={() => handleUpdateStatus(emp.id, 'active')}
                  className="flex-1 py-1.5 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 hover:bg-[#F5EDE0] transition-colors"
                  style={{ color: '#6B8E5A', border: '1px solid #E8DFD3' }}
                >
                  <UserCheck size={12} /> Activate
                </button>
              ) : (
                <button
                  onClick={() => handleUpdateStatus(emp.id, 'suspended')}
                  className="flex-1 py-1.5 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 hover:bg-[#F5EDE0] transition-colors"
                  style={{ color: '#B5654E', border: '1px solid #E8DFD3' }}
                >
                  <UserX size={12} /> Suspend
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Employee Modal Overlay */}
      {showAddForm && (
        <div className="fixed inset-0 bg-[#2d241950] backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border" style={{ borderColor: '#E8DFD3' }}>
            <h3 className="font-serif text-[20px] font-bold mb-4" style={{ color: '#2D2419' }}>Add New Employee</h3>
            <form onSubmit={handleAddEmployee} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-600 block mb-1 uppercase" style={{ color: '#8A7B6A' }}>Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="E.g. Priya"
                    className="w-full p-2 text-[12px] rounded-lg border outline-none focus:border-[#A0785A]"
                    style={{ borderColor: '#E8DFD3' }}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-600 block mb-1 uppercase" style={{ color: '#8A7B6A' }}>Employee ID</label>
                  <input
                    type="text"
                    required
                    value={empId}
                    onChange={e => setEmpId(e.target.value)}
                    placeholder="EMP005"
                    className="w-full p-2 text-[12px] rounded-lg border outline-none focus:border-[#A0785A]"
                    style={{ borderColor: '#E8DFD3' }}
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-600 block mb-1 uppercase" style={{ color: '#8A7B6A' }}>Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full p-2 text-[12px] rounded-lg border outline-none focus:border-[#A0785A]"
                  style={{ borderColor: '#E8DFD3' }}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-600 block mb-1 uppercase" style={{ color: '#8A7B6A' }}>Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="min. 6 chars"
                    className="w-full p-2 text-[12px] rounded-lg border outline-none focus:border-[#A0785A]"
                    style={{ borderColor: '#E8DFD3' }}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-600 block mb-1 uppercase" style={{ color: '#8A7B6A' }}>Designation</label>
                  <input
                    type="text"
                    value={designation}
                    onChange={e => setDesignation(e.target.value)}
                    placeholder="Software Engineer"
                    className="w-full p-2 text-[12px] rounded-lg border outline-none focus:border-[#A0785A]"
                    style={{ borderColor: '#E8DFD3' }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-600 block mb-1 uppercase" style={{ color: '#8A7B6A' }}>Department</label>
                  <select
                    value={department}
                    onChange={e => setDepartment(e.target.value)}
                    className="w-full p-2 text-[12px] rounded-lg border outline-none bg-white cursor-pointer"
                    style={{ borderColor: '#E8DFD3' }}
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Sales">Sales</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Finance">Finance</option>
                    <option value="HR">HR</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-600 block mb-1 uppercase" style={{ color: '#8A7B6A' }}>System Role</label>
                  <select
                    value={role}
                    onChange={e => setRole(e.target.value)}
                    className="w-full p-2 text-[12px] rounded-lg border outline-none bg-white cursor-pointer"
                    style={{ borderColor: '#E8DFD3' }}
                  >
                    <option value="employee">Employee</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button type="submit" className="flex-1 btn-primary py-2 justify-center rounded-xl">Register Employee</button>
                <button type="button" onClick={() => setShowAddForm(false)} className="flex-1 btn-secondary py-2 justify-center rounded-xl">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
