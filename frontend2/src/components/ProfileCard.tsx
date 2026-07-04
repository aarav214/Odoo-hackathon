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
} from 'lucide-react';

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

export default function ProfileCard() {
  const completion = useCountUp(98);

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
            alt="Sarah Chen"
            className="w-24 h-24 rounded-2xl object-cover border-4 border-white warm-shadow"
          />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#7BAE7F] rounded-full border-2 border-white flex items-center justify-center">
            <CheckCircle2 size={12} className="text-white" />
          </div>
        </div>
      </div>

      {/* Name + role */}
      <div className="px-6 pt-3">
        <h2 className="text-xl font-bold text-[#2F2A26]">Sarah Chen</h2>
        <p className="text-sm text-[#6E675F] mt-0.5">Senior Product Designer</p>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-[11px] bg-[#7BAE7F15] text-[#5A9260] px-2.5 py-1 rounded-full font-medium">EMP-2021-0487</span>
          <span className="text-[11px] bg-[#F4EFE7] text-[#6E675F] px-2.5 py-1 rounded-full font-medium">Design Team</span>
        </div>
      </div>

      {/* Info grid */}
      <div className="px-6 pt-5 space-y-3">
        {[
          { icon: User, label: 'Manager', value: 'Michael Rodriguez' },
          { icon: Calendar, label: 'Joined', value: 'Mar 14, 2021' },
          { icon: Award, label: 'Experience', value: '6.5 years' },
          { icon: Briefcase, label: 'Status', value: 'Full-time' },
          { icon: Mail, label: 'Email', value: 'sarah.chen@hrmspro.com' },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#F4EFE7] flex items-center justify-center shrink-0">
              <Icon size={14} className="text-[#A98E74]" />
            </div>
            <span className="text-xs text-[#6E675F] w-16">{label}</span>
            <span className="text-sm font-medium text-[#2F2A26] flex-1">{value}</span>
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
        <button className="flex items-center justify-center gap-1.5 bg-[#7BAE7F] hover:bg-[#5A9260] text-white text-xs font-medium py-2.5 rounded-xl btn-scale">
          <User size={13} /> View
        </button>
        <button className="flex items-center justify-center gap-1.5 bg-[#F4EFE7] hover:bg-[#EDE8E0] text-[#2F2A26] text-xs font-medium py-2.5 rounded-xl btn-scale">
          <Pencil size={13} /> Edit
        </button>
        <button className="flex items-center justify-center gap-1.5 bg-[#F4EFE7] hover:bg-[#EDE8E0] text-[#2F2A26] text-xs font-medium py-2.5 rounded-xl btn-scale">
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
    </div>
  );
}
