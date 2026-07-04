import { useState } from 'react';
import { Search, Download, Trash2, Upload, FileText, FileSpreadsheet, Eye } from 'lucide-react';

interface Document {
  id: number;
  name: string;
  category: string;
  size: string;
  uploadedDate: string;
}

const initialCompanyDocs: Document[] = [
  { id: 1, name: 'Employee_Handbook_2026.pdf', category: 'Company Policy', size: '2.4 MB', uploadedDate: '2026-07-01' },
  { id: 2, name: 'NDA_Standard_Template.docx', category: 'Legal Templates', size: '1.1 MB', uploadedDate: '2026-06-12' },
  { id: 3, name: 'Standard_Leave_Policy_v4.pdf', category: 'Company Policy', size: '940 KB', uploadedDate: '2026-05-20' },
];

export default function DocumentsSection() {
  const [companyDocs, setCompanyDocs] = useState<Document[]>(initialCompanyDocs);
  const [myDocs, setMyDocs] = useState<Document[]>([
    { id: 101, name: 'Sarah_Chen_Passport.pdf', category: 'ID Proofs', size: '1.8 MB', uploadedDate: '2026-06-10' },
  ]);
  const [searchVal, setSearchVal] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleSimulatedUpload = () => {
    setUploading(true);
    setTimeout(() => {
      const newDoc: Document = {
        id: Date.now(),
        name: 'Sarah_Chen_June_Expenses.xlsx',
        category: 'Reimbursements',
        size: '220 KB',
        uploadedDate: new Date().toISOString().split('T')[0],
      };
      setMyDocs([newDoc, ...myDocs]);
      setUploading(false);
      alert('Expense sheet uploaded to HR team successfully!');
    }, 1200);
  };

  const handleDeletePersonal = (id: number) => {
    if (confirm('Are you sure you want to remove this uploaded document?')) {
      setMyDocs(myDocs.filter(d => d.id !== id));
    }
  };

  const filteredCompany = companyDocs.filter(d => d.name.toLowerCase().includes(searchVal.toLowerCase()));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* Downloads area */}
      <div className="lg:col-span-2 bg-white rounded-3xl border border-[#EDE8E0] p-6 warm-shadow flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-lg font-bold text-[#2F2A26]">Company Templates</h3>
              <p className="text-xs text-[#6E675F]">Global resource guides and templates</p>
            </div>
            <div className="relative w-48">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A09890]" />
              <input
                type="text"
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                placeholder="Search resources..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-[#EDE8E0] outline-none focus:border-[#7BAE7F]"
              />
            </div>
          </div>

          <div className="space-y-2.5">
            {filteredCompany.map(doc => (
              <div key={doc.id} className="flex items-center justify-between p-3.5 rounded-2xl border border-[#EDE8E0] bg-[#FAF8F4] hover:bg-[#F4EFE7] transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#7BAE7F15] text-[#7BAE7F] flex items-center justify-center">
                    <FileText size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#2F2A26]">{doc.name}</p>
                    <p className="text-[10px] text-[#A09890]">{doc.category} &middot; {doc.size}</p>
                  </div>
                </div>
                <button
                  onClick={() => alert(`Downloading ${doc.name}...`)}
                  className="p-2 bg-white rounded-xl border border-[#EDE8E0] text-[#6E675F] hover:text-[#7BAE7F] hover:border-[#7BAE7F] transition-all flex items-center gap-1.5 text-xs font-medium"
                >
                  <Download size={13} /> Download
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Uploads and employee records */}
      <div className="bg-white rounded-3xl border border-[#EDE8E0] p-6 warm-shadow flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-[#2F2A26] mb-1">My Uploads</h3>
          <p className="text-xs text-[#6E675F] mb-4">Upload personal forms to the HR department</p>

          <div
            onClick={handleSimulatedUpload}
            className="border-2 border-dashed border-[#EDE8E0] rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#7BAE7F] hover:bg-[#FAF8F4] transition-all mb-4"
          >
            <div className="w-9 h-9 rounded-full bg-[#7BAE7F15] text-[#7BAE7F] flex items-center justify-center">
              <Upload size={16} />
            </div>
            <div className="text-center">
              <p className="text-xs font-bold text-[#2F2A26]">Upload form or receipt</p>
              <p className="text-[10px] text-[#A09890]">PDF, Image, Excel up to 5MB</p>
            </div>
          </div>

          {uploading && (
            <div className="mb-4 text-center text-xs text-[#7BAE7F] font-semibold animate-pulse">
              Sending file to HR repository...
            </div>
          )}

          <div className="space-y-2">
            <p className="text-[10px] font-bold text-[#A09890] uppercase tracking-wider mb-2">Recently Uploaded</p>
            {myDocs.map(doc => (
              <div key={doc.id} className="flex items-center justify-between p-2.5 rounded-xl border border-[#EDE8E0] bg-[#FAF8F4]">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-[#2F2A26] truncate">{doc.name}</p>
                  <p className="text-[9px] text-[#A09890]">{doc.category} &middot; {doc.size}</p>
                </div>
                <button
                  onClick={() => handleDeletePersonal(doc.id)}
                  className="p-1 hover:bg-[#F2E0D8] text-[#E07A5F] rounded-lg"
                  title="Remove document"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
