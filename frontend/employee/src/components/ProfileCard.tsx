import { useState, useEffect } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Award,
  ShieldCheck,
  CheckCircle2,
  User,
  FileText,
  Pencil,
  X,
} from 'lucide-react';
import { apiRequest, checkBackendStatus } from '../api';

function useCountUp(target: number, duration = 1000) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(eased * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return val;
}

export default function ProfileCard({ onTabChange }: { onTabChange?: (tab: string) => void }) {
  const completion = useCountUp(98);
  const [profile, setProfile] = useState<any>(null);

  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [phone, setPhone] = useState(() => localStorage.getItem('profile_phone') || '+1 (555) 234-5678');
  const [personalEmail, setPersonalEmail] = useState(() => localStorage.getItem('profile_personal_email') || 'sarah.chen.personal@gmail.com');
  const [address, setAddress] = useState(() => localStorage.getItem('profile_address') || '120 Hawthorne St, Palo Alto, CA 94301');
  const [emergencyContact, setEmergencyContact] = useState(() => localStorage.getItem('profile_emergency') || 'John Chen (Spouse) - +1 (555) 987-6543');
  const [dob, setDob] = useState(() => localStorage.getItem('profile_dob') || 'August 24, 1994');
  const [bloodGroup, setBloodGroup] = useState(() => localStorage.getItem('profile_blood') || 'O-positive');

  useEffect(() => {
    async function loadProfile() {
      try {
        const isOnline = await checkBackendStatus();
        if (isOnline) {
          const data = await apiRequest('/profile/me');
          setProfile(data);
        }
      } catch (err) {
        console.error('Failed to load profile card details:', err);
      }
    }
    loadProfile();
  }, []);

  const name = profile?.name || 'Sarah Chen';
  const designation = profile?.designation || 'Senior Product Designer';
  const employeeId = profile?.employee_id || 'EMP-2021-0487';
  const department = profile?.department || 'Design Team';
  const email = profile?.email || 'sarah.chen@hrmspro.com';
  const status = profile?.status || 'active';

  // Edit form states
  const [editName, setEditName] = useState(name);
  const [editEmail, setEditEmail] = useState(email);
  const [editPhone, setEditPhone] = useState(phone);
  const [editPersonalEmail, setEditPersonalEmail] = useState(personalEmail);
  const [editAddress, setEditAddress] = useState(address);
  const [editEmergency, setEditEmergency] = useState(emergencyContact);
  const [editDob, setEditDob] = useState(dob);
  const [editBlood, setEditBlood] = useState(bloodGroup);

  const openEdit = () => {
    setEditName(name);
    setEditEmail(email);
    setEditPhone(phone);
    setEditPersonalEmail(personalEmail);
    setEditAddress(address);
    setEditEmergency(emergencyContact);
    setEditDob(dob);
    setEditBlood(bloodGroup);
    setShowEditModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const isOnline = await checkBackendStatus();
      if (isOnline) {
        const updated = await apiRequest('/profile/me', {
          method: 'PATCH',
          body: JSON.stringify({ name: editName, email: editEmail })
        });
        setProfile(updated);
      } else {
        setProfile((prev: any) => ({ ...(prev || {}), name: editName, email: editEmail }));
      }
      
      setPhone(editPhone);
      setPersonalEmail(editPersonalEmail);
      setAddress(editAddress);
      setEmergencyContact(editEmergency);
      setDob(editDob);
      setBloodGroup(editBlood);
      
      localStorage.setItem('profile_phone', editPhone);
      localStorage.setItem('profile_personal_email', editPersonalEmail);
      localStorage.setItem('profile_address', editAddress);
      localStorage.setItem('profile_emergency', editEmergency);
      localStorage.setItem('profile_dob', editDob);
      localStorage.setItem('profile_blood', editBlood);
      
      setShowEditModal(false);
      alert('Profile updated successfully!');
    } catch (err: any) {
      alert(err.message || 'Failed to update profile');
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-[#EDE8E0] warm-shadow card-hover overflow-hidden fade-in-up">
      {/* Cover gradient */}
      <div className="h-20 bg-gradient-to-r from-[#7BAE7F30] via-[#A98E7420] to-[#F4EFE7] relative">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #7BAE7F40, transparent 40%)' }} />
      </div>

      {/* Avatar */}
      <div className="px-6 -mt-12 relative">
        <div className="relative inline-block">
          <img
            src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop"
            alt={name}
            className="w-24 h-24 rounded-2xl object-cover border-4 border-white warm-shadow"
          />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#7BAE7F] rounded-full border-2 border-white flex items-center justify-center">
            <CheckCircle2 size={12} className="text-white" />
          </div>
        </div>
      </div>

      {/* Name + role */}
      <div className="px-6 pt-3">
        <h2 className="text-xl font-bold text-[#2F2A26]">{name}</h2>
        <p className="text-sm text-[#6E675F] mt-0.5">{designation}</p>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-[11px] bg-[#7BAE7F15] text-[#5A9260] px-2.5 py-1 rounded-full font-medium">{employeeId}</span>
          <span className="text-[11px] bg-[#F4EFE7] text-[#6E675F] px-2.5 py-1 rounded-full font-medium">{department}</span>
        </div>
      </div>

      {/* Info grid */}
      <div className="px-6 pt-5 space-y-3">
        {[
          { icon: User, label: 'Manager', value: 'Michael Rodriguez' },
          { icon: Calendar, label: 'Joined', value: 'Mar 14, 2021' },
          { icon: Award, label: 'Experience', value: '6.5 years' },
          { icon: Briefcase, label: 'Status', value: 'Full-time' },
          { icon: Mail, label: 'Email', value: email },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#F4EFE7] flex items-center justify-center shrink-0">
              <Icon size={14} className="text-[#A98E74]" />
            </div>
            <span className="text-xs text-[#6E675F] w-16">{label}</span>
            <span className="text-sm font-medium text-[#2F2A26] flex-1 truncate">{label === 'Email' ? email : value}</span>
          </div>
        ))}
      </div>

      {/* Profile completion */}
      <div className="px-6 pt-5">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium text-[#6E675F]">Profile Completion</span>
          <span className="text-xs font-bold text-[#7BAE7F]">{completion}%</span>
        </div>
        <div className="h-2 bg-[#F4EFE7] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#7BAE7F] to-[#5A9260] rounded-full transition-all duration-1000"
            style={{ width: `${completion}%` }}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="px-6 pt-5 grid grid-cols-3 gap-2">
        <button
          onClick={() => setShowViewModal(true)}
          className="flex items-center justify-center gap-1.5 bg-[#7BAE7F] hover:bg-[#5A9260] text-white text-xs font-medium py-2.5 rounded-xl btn-scale"
        >
          <User size={13} /> View
        </button>
        <button
          onClick={openEdit}
          className="flex items-center justify-center gap-1.5 bg-[#F4EFE7] hover:bg-[#EDE8E0] text-[#2F2A26] text-xs font-medium py-2.5 rounded-xl btn-scale"
        >
          <Pencil size={13} /> Edit
        </button>
        <button
          onClick={() => onTabChange?.('Documents')}
          className="flex items-center justify-center gap-1.5 bg-[#F4EFE7] hover:bg-[#EDE8E0] text-[#2F2A26] text-xs font-medium py-2.5 rounded-xl btn-scale"
        >
          <FileText size={13} /> Docs
        </button>
      </div>

      {/* Badges */}
      <div className="px-6 py-5 mt-1 border-t border-[#EDE8E0] bg-[#FAF8F4]">
        <div className="flex flex-wrap gap-2">
          <span className="flex items-center gap-1 text-[11px] bg-[#7BAE7F15] text-[#5A9260] px-2.5 py-1.5 rounded-full font-medium">
            <span className="w-1.5 h-1.5 bg-[#7BAE7F] rounded-full" /> Active Employee
          </span>
          <span className="flex items-center gap-1 text-[11px] bg-[#A98E7415] text-[#A98E74] px-2.5 py-1.5 rounded-full font-medium">
            <Briefcase size={10} /> Full-Time
          </span>
          <span className="flex items-center gap-1 text-[11px] bg-[#7BAE7F15] text-[#5A9260] px-2.5 py-1.5 rounded-full font-medium">
            <ShieldCheck size={10} /> Email Verified
          </span>
          <span className="flex items-center gap-1 text-[11px] bg-[#F4EFE7] text-[#6E675F] px-2.5 py-1.5 rounded-full font-medium">
            Profile {completion}% Complete
          </span>
        </div>
      </div>

      {/* View Profile Modal */}
      {showViewModal && (
        <div className="fixed inset-0 bg-[#2d2a2650] backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm border border-[#EDE8E0] shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-[#2F2A26] font-bold text-base">Employee Profile Details</h4>
              <button onClick={() => setShowViewModal(false)} className="text-[#6E675F] hover:text-[#2F2A26] p-1">
                <X size={16} />
              </button>
            </div>
            <div className="space-y-3.5 my-4 text-left overflow-y-auto max-h-[300px] pr-1">
              {[
                { label: 'Full Name', value: name },
                { label: 'Official Email', value: email },
                { label: 'Personal Email', value: personalEmail },
                { label: 'Phone', value: phone },
                { label: 'Residence Address', value: address },
                { label: 'Emergency Contact', value: emergencyContact },
                { label: 'Date of Birth', value: dob },
                { label: 'Blood Group', value: bloodGroup },
                { label: 'Work Schedule', value: 'Mon - Fri, 9:00 AM - 6:00 PM' },
                { label: 'Department', value: department },
                { label: 'Designation', value: designation }
              ].map(({ label, value }) => (
                <div key={label} className="border-b border-[#EDE8E0] pb-2">
                  <span className="text-[10px] uppercase font-bold text-[#A09890] block">{label}</span>
                  <span className="text-xs font-semibold text-[#2F2A26]">{value}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setShowViewModal(false)} className="w-full bg-[#7BAE7F] hover:bg-[#5A9260] text-white text-xs font-semibold py-2.5 rounded-xl mt-2">
              Close Detail
            </button>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-[#2d2a2650] backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm border border-[#EDE8E0] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between mb-4 shrink-0">
              <h4 className="text-[#2F2A26] font-bold text-base">Edit Personal Details</h4>
              <button onClick={() => setShowEditModal(false)} className="text-[#6E675F] hover:text-[#2F2A26] p-1">
                <X size={16} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="space-y-4 overflow-y-auto flex-1 pr-1 py-1">
              <div>
                <label className="text-[10px] uppercase font-bold text-[#6E675F] block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="w-full p-2 text-xs rounded-xl border border-[#EDE8E0] outline-none focus:border-[#7BAE7F]"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-[#6E675F] block mb-1">Official Email</label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={e => setEditEmail(e.target.value)}
                  className="w-full p-2 text-xs rounded-xl border border-[#EDE8E0] outline-none focus:border-[#7BAE7F]"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-[#6E675F] block mb-1">Personal Email</label>
                <input
                  type="email"
                  required
                  value={editPersonalEmail}
                  onChange={e => setEditPersonalEmail(e.target.value)}
                  className="w-full p-2 text-xs rounded-xl border border-[#EDE8E0] outline-none focus:border-[#7BAE7F]"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-[#6E675F] block mb-1">Phone</label>
                <input
                  type="text"
                  required
                  value={editPhone}
                  onChange={e => setEditPhone(e.target.value)}
                  className="w-full p-2 text-xs rounded-xl border border-[#EDE8E0] outline-none focus:border-[#7BAE7F]"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-[#6E675F] block mb-1">Residence Address</label>
                <input
                  type="text"
                  required
                  value={editAddress}
                  onChange={e => setEditAddress(e.target.value)}
                  className="w-full p-2 text-xs rounded-xl border border-[#EDE8E0] outline-none focus:border-[#7BAE7F]"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-[#6E675F] block mb-1">Emergency Contact</label>
                <input
                  type="text"
                  required
                  value={editEmergency}
                  onChange={e => setEditEmergency(e.target.value)}
                  className="w-full p-2 text-xs rounded-xl border border-[#EDE8E0] outline-none focus:border-[#7BAE7F]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#6E675F] block mb-1">Date of Birth</label>
                  <input
                    type="text"
                    required
                    value={editDob}
                    onChange={e => setEditDob(e.target.value)}
                    className="w-full p-2 text-xs rounded-xl border border-[#EDE8E0] outline-none focus:border-[#7BAE7F]"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#6E675F] block mb-1">Blood Group</label>
                  <input
                    type="text"
                    required
                    value={editBlood}
                    onChange={e => setEditBlood(e.target.value)}
                    className="w-full p-2 text-xs rounded-xl border border-[#EDE8E0] outline-none focus:border-[#7BAE7F]"
                  />
                </div>
              </div>
              
              <div className="flex gap-2 pt-2 shrink-0">
                <button type="submit" className="flex-1 bg-[#7BAE7F] text-white text-xs font-semibold py-2.5 rounded-xl hover:bg-[#5A9260]">
                  Save Profile
                </button>
                <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 bg-[#F4EFE7] text-[#2F2A26] text-xs font-semibold py-2.5 rounded-xl hover:bg-[#EDE8E0]">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
