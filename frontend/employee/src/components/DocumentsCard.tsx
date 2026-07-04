import { FileText, Download, Eye, UploadCloud, FileCheck, Receipt, BookOpen, FileSignature } from 'lucide-react';

const docs = [
  { name: 'Offer Letter', date: 'Mar 14, 2021', icon: FileSignature, color: 'bg-[#7BAE7F15] text-[#5A9260]' },
  { name: 'Appointment Letter', date: 'Mar 14, 2021', icon: FileCheck, color: 'bg-[#A98E7415] text-[#A98E74]' },
  { name: 'Salary Slip - June', date: 'Jul 01, 2026', icon: Receipt, color: 'bg-[#C4AA8E15] text-[#C4AA8E]' },
  { name: 'Tax Form 2025', date: 'Apr 15, 2026', icon: FileText, color: 'bg-[#7BAE7F15] text-[#5A9260]' },
  { name: 'Employee Handbook', date: 'Jan 02, 2026', icon: BookOpen, color: 'bg-[#A98E7415] text-[#A98E74]' },
];

export default function DocumentsCard({ onTabChange }: { onTabChange?: (tab: string) => void }) {
  return (
    <div className="bg-white rounded-3xl border border-[#EDE8E0] warm-shadow card-hover p-6 fade-in-up">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-lg font-bold text-[#2F2A26]">My Documents</h3>
          <p className="text-xs text-[#6E675F] mt-0.5">Recent documents</p>
        </div>
        <span className="text-[11px] bg-[#F4EFE7] text-[#6E675F] px-2.5 py-1 rounded-full font-medium">{docs.length} files</span>
      </div>

      <div className="space-y-2">
        {docs.map(({ name, date, icon: Icon, color }) => (
          <div
            key={name}
            className="flex items-center gap-3 p-3 rounded-2xl hover:bg-[#FAF8F4] transition-colors group"
          >
            <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center shrink-0`}>
              <Icon size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#2F2A26] truncate">{name}</p>
              <p className="text-[11px] text-[#6E675F]">Uploaded {date}</p>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => alert(`Opening secure preview for: ${name}`)}
                className="w-8 h-8 rounded-lg bg-[#F4EFE7] hover:bg-[#EDE8E0] flex items-center justify-center transition-colors"
                title="Preview"
              >
                <Eye size={13} className="text-[#6E675F]" />
              </button>
              <button
                onClick={() => alert(`Initiating secure download for: ${name}`)}
                className="w-8 h-8 rounded-lg bg-[#7BAE7F15] hover:bg-[#7BAE7F25] flex items-center justify-center transition-colors"
                title="Download"
              >
                <Download size={13} className="text-[#5A9260]" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => onTabChange?.('Documents')}
        className="mt-4 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#7BAE7F15] to-[#A98E7415] hover:from-[#7BAE7F25] hover:to-[#A98E7425] border border-dashed border-[#A98E7450] text-[#5A9260] text-sm font-medium py-3 rounded-2xl btn-scale"
      >
        <UploadCloud size={15} /> Upload Document
      </button>
    </div>
  );
}
