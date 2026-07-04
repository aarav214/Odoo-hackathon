import { useState } from 'react';
import { FileText, Search, Plus, Filter, Download, Trash2, Upload, File, FileSpreadsheet, Image } from 'lucide-react';

interface CompanyDoc {
  id: number;
  name: string;
  category: 'policy' | 'template' | 'record' | 'legal';
  size: string;
  uploadedBy: string;
  uploadDate: string;
  type: 'pdf' | 'docx' | 'xlsx' | 'png';
}

const mockDocs: CompanyDoc[] = [
  { id: 1, name: 'Employee_Handbook_2026.pdf', category: 'policy', size: '2.4 MB', uploadedBy: 'HR Director', uploadDate: '2026-07-01', type: 'pdf' },
  { id: 2, name: 'NDA_Standard_Template.docx', category: 'template', size: '1.1 MB', uploadedBy: 'Legal Counsel', uploadDate: '2026-06-12', type: 'docx' },
  { id: 3, name: 'Standard_Leave_Policy_v4.pdf', category: 'policy', size: '940 KB', uploadedBy: 'HR Manager', uploadDate: '2026-05-20', type: 'pdf' },
  { id: 4, name: 'Yearly_Appraisal_Form_2026.xlsx', category: 'template', size: '580 KB', uploadedBy: 'HR Director', uploadDate: '2026-06-30', type: 'xlsx' },
  { id: 5, name: 'HQ_Office_Floor_Map.png', category: 'record', size: '4.2 MB', uploadedBy: 'Operations Lead', uploadDate: '2026-04-15', type: 'png' },
];

export default function DocumentsSection() {
  const [docs, setDocs] = useState<CompanyDoc[]>(mockDocs);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this document?')) {
      setDocs(docs.filter(d => d.id !== id));
    }
  };

  const handleSimulatedUpload = () => {
    setUploading(true);
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            const newDoc: CompanyDoc = {
              id: Date.now(),
              name: 'Employee_Salary_Structure_Template.xlsx',
              category: 'template',
              size: '412 KB',
              uploadedBy: 'Admin User',
              uploadDate: new Date().toISOString().split('T')[0],
              type: 'xlsx'
            };
            setDocs([newDoc, ...docs]);
            setUploading(false);
            alert('File uploaded and catalogued successfully!');
          }, 400);
          return 100;
        }
        return prev + 25;
      });
    }, 150);
  };

  const filtered = docs.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || doc.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'xlsx':
        return <FileSpreadsheet size={18} className="text-[#6B8E5A]" />;
      case 'png':
        return <Image size={18} className="text-[#8B7BA0]" />;
      default:
        return <FileText size={18} className="text-[#A0785A]" />;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* File List Table - Left Area (2/3 width) */}
      <div className="lg:col-span-2 card p-6 bg-white flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-serif text-[22px] font-bold" style={{ color: '#2D2419' }}>Company Documents</h2>
            <span className="badge-amber">{docs.length} total files</span>
          </div>

          {/* Search and filter toolbar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#A89A88' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search templates, policy guides..."
                className="w-full pl-9 pr-4 py-2 text-[13px] rounded-xl border outline-none placeholder:text-[#A89A88] transition-all focus:border-[#A0785A]"
                style={{ borderColor: '#E8DFD3', color: '#2D2419' }}
              />
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border" style={{ borderColor: '#E8DFD3' }}>
              <Filter size={13} style={{ color: '#A89A88' }} />
              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className="text-[12px] bg-transparent outline-none font-medium cursor-pointer"
                style={{ color: '#8A7B6A' }}
              >
                <option value="All">All Categories</option>
                <option value="policy">Policies</option>
                <option value="template">Templates</option>
                <option value="record">Records</option>
                <option value="legal">Legal Files</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[12px]">
              <thead>
                <tr className="border-b" style={{ borderColor: '#F5F0E8', color: '#A89A88' }}>
                  <th className="pb-2 font-600 uppercase tracking-wider">File Name</th>
                  <th className="pb-2 font-600 uppercase tracking-wider">Category</th>
                  <th className="pb-2 font-600 uppercase tracking-wider">Size</th>
                  <th className="pb-2 font-600 uppercase tracking-wider">Uploaded By</th>
                  <th className="pb-2 font-600 uppercase tracking-wider">Date</th>
                  <th className="pb-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: '#F5F0E8' }}>
                {filtered.map(doc => (
                  <tr key={doc.id} className="hover:bg-[#FBF8F3] transition-colors">
                    <td className="py-3 font-semibold flex items-center gap-2" style={{ color: '#2D2419' }}>
                      {getIcon(doc.type)}
                      <span className="truncate max-w-[180px]">{doc.name}</span>
                    </td>
                    <td className="py-3 capitalize" style={{ color: '#8A7B6A' }}>{doc.category}</td>
                    <td className="py-3" style={{ color: '#A89A88' }}>{doc.size}</td>
                    <td className="py-3" style={{ color: '#8A7B6A' }}>{doc.uploadedBy}</td>
                    <td className="py-3" style={{ color: '#A89A88' }}>{doc.uploadDate}</td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => alert(`Downloading ${doc.name}...`)}
                          className="p-1.5 rounded-lg hover:bg-[#F5EDE0] transition-colors"
                          style={{ color: '#A0785A' }}
                          title="Download"
                        >
                          <Download size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(doc.id)}
                          className="p-1.5 rounded-lg hover:bg-[#F2E0D8] transition-colors"
                          style={{ color: '#B5654E' }}
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="py-10 text-center text-[12px]" style={{ color: '#A89A88' }}>No documents matched your search</div>
            )}
          </div>
        </div>
      </div>

      {/* Upload Panel - Right Column (1/3 width) */}
      <div className="card p-6 bg-white flex flex-col justify-between">
        <div>
          <h3 className="font-serif text-[18px] font-bold mb-3" style={{ color: '#2D2419' }}>Upload Center</h3>
          <p className="text-[12px] mb-5" style={{ color: '#8A7B6A' }}>Add global HR guidelines, employee onboarding booklets, contract templates, and review logs.</p>

          <div
            onClick={handleSimulatedUpload}
            className="border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-[#A0785A] hover:bg-[#FBF8F3] transition-all"
            style={{ borderColor: '#E8DFD3' }}
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#F5EDE0] text-[#A0785A]">
              <Upload size={18} />
            </div>
            <div className="text-center">
              <p className="text-[12px] font-semibold" style={{ color: '#2D2419' }}>Click to upload file</p>
              <p className="text-[10px] mt-0.5" style={{ color: '#A89A88' }}>PDF, DOCX, XLSX up to 10MB</p>
            </div>
          </div>

          {uploading && (
            <div className="mt-4 p-3.5 rounded-xl bg-[#FBF8F3] border" style={{ borderColor: '#F0E9DE' }}>
              <div className="flex items-center justify-between text-[11px] font-bold mb-1.5" style={{ color: '#8A7B6A' }}>
                <span>Uploading spreadsheet...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="h-1.5 bg-[#EDE8E0] rounded-full overflow-hidden">
                <div className="h-full bg-[#A0785A] transition-all duration-150" style={{ width: `${uploadProgress}%` }} />
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 pt-4 border-t" style={{ borderColor: '#F5F0E8' }}>
          <h4 className="text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: '#A89A88' }}>Upload Guidelines</h4>
          <ul className="text-[10px] space-y-1.5 list-disc pl-4 leading-relaxed" style={{ color: '#8A7B6A' }}>
            <li>Upload only finalized templates to keep repository organized.</li>
            <li>Use descriptive names (e.g. `Handbook_2026` rather than `temp_doc`).</li>
            <li>All files uploaded here are visible to employees under their portal downloads.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
