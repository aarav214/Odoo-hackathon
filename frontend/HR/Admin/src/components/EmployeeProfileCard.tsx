import { Mail, Shield, Star, Eye, Edit2, Settings, CheckCircle } from 'lucide-react';

interface EmployeeProfileCardProps {
  onViewProfile?: () => void;
  onEditProfile?: () => void;
  onSettings?: () => void;
}

export default function EmployeeProfileCard({ onViewProfile, onEditProfile, onSettings }: EmployeeProfileCardProps = {}) {
  return (
    <div className="card flex flex-col overflow-hidden" style={{ borderRadius: 24 }}>
      {/* Photo area */}
      <div className="relative h-44 overflow-hidden" style={{ borderRadius: '24px 24px 0 0' }}>
        <img
          src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400"
          alt="Arjun Mehta"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(45,36,25,0.65), rgba(45,36,25,0.1) 40%, transparent)' }} />
        {/* Status badge */}
        <div className="absolute top-3 right-3">
          <span className="badge-green flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: '#6B8E5A' }} />
            Active
          </span>
        </div>
        {/* Experience badge */}
        <div className="absolute bottom-3 left-3">
          <span className="text-[11px] font-500 text-white/90 px-2.5 py-1 rounded-lg" style={{ fontWeight: 500, background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)' }}>
            4+ years experience
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex-1 flex flex-col" style={{ background: '#FBF8F3' }}>
        <div className="mb-3">
          <h3 className="font-serif text-[17px] leading-tight" style={{ color: '#2D2419', fontWeight: 600 }}>Arjun Mehta</h3>
          <p className="text-[12px] mt-0.5" style={{ color: '#A89A88' }}>EMP-2024-0047</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[12px] font-500" style={{ color: '#8A7B6A', fontWeight: 500 }}>Engineering</span>
            <span style={{ color: '#D1C7B8' }}>·</span>
            <span className="text-[12px]" style={{ color: '#8A7B6A' }}>Senior Dev</span>
          </div>
        </div>

        {/* Badges */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="flex items-center gap-1 text-[10px] font-600 px-2 py-1 rounded-lg" style={{ fontWeight: 600, color: '#6B8E5A', background: '#E8F0E0' }}>
            <CheckCircle size={10} /> Email Verified
          </span>
          <span className="flex items-center gap-1 text-[10px] font-600 px-2 py-1 rounded-lg" style={{ fontWeight: 600, color: '#6B7B95', background: '#E4E8EE' }}>
            <Shield size={10} /> 2FA Enabled
          </span>
        </div>

        {/* Profile completion */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px]" style={{ color: '#A89A88' }}>Profile Completion</span>
            <span className="text-[11px] font-600" style={{ color: '#A0785A', fontWeight: 600 }}>96%</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#F0E9DE' }}>
            <div className="h-full rounded-full transition-all duration-700" style={{ width: '96%', background: '#A0785A' }} />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 mt-auto">
          <button onClick={onViewProfile} className="btn-secondary flex-1 justify-center text-[12px] py-2">
            <Eye size={13} /> View
          </button>
          <button onClick={onEditProfile} className="btn-secondary flex-1 justify-center text-[12px] py-2">
            <Edit2 size={13} /> Edit
          </button>
          <button onClick={onSettings} className="btn-secondary px-2.5 py-2">
            <Settings size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
