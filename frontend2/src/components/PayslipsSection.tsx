import { useState } from 'react';
import { DollarSign, FileDown, ShieldCheck, HelpCircle } from 'lucide-react';

interface Payslip {
  month: string;
  basic: number;
  hra: number;
  allowance: number;
  pf: number;
  tax: number;
  net: number;
}

const mockPayslips: Payslip[] = [
  { month: 'June 2026', basic: 5500, hra: 2200, allowance: 1100, pf: 660, tax: 880, net: 7260 },
  { month: 'May 2026', basic: 5500, hra: 2200, allowance: 1100, pf: 660, tax: 880, net: 7260 },
  { month: 'April 2026', basic: 5500, hra: 2200, allowance: 1100, pf: 660, tax: 880, net: 7260 },
];

export default function PayslipsSection() {
  const [payslips, setPayslips] = useState<Payslip[]>(mockPayslips);
  const [selectedIdx, setSelectedIdx] = useState(0);

  const active = payslips[selectedIdx] || mockPayslips[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* Payslip history list */}
      <div className="bg-white rounded-3xl border border-[#EDE8E0] p-6 warm-shadow flex flex-col">
        <h3 className="text-lg font-bold text-[#2F2A26] mb-1">Payslip History</h3>
        <p className="text-xs text-[#6E675F] mb-4">Select a month to view detailed breakdown</p>

        <div className="space-y-2 flex-1">
          {payslips.map((p, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedIdx(idx)}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                selectedIdx === idx ? 'border-[#7BAE7F] bg-[#7BAE7F10]' : 'border-[#EDE8E0] bg-[#FAF8F4] hover:bg-[#F4EFE7]'
              }`}
            >
              <div>
                <p className="text-xs font-bold text-[#2F2A26]">{p.month}</p>
                <p className="text-[10px] text-[#A09890]">Generated: MTD</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-[#2F2A26]">${p.net.toLocaleString()}</p>
                <p className="text-[9px] text-[#7BAE7F] font-semibold">Net Pay</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payslip breakdown card */}
      <div className="lg:col-span-2 bg-white rounded-3xl border border-[#EDE8E0] p-6 warm-shadow flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-lg font-bold text-[#2F2A26]">{active.month} Payslip</h3>
              <p className="text-xs text-[#6E675F]">Detailed payroll structural allocations</p>
            </div>
            <button
              onClick={() => alert(`Downloading payslip for ${active.month}...`)}
              className="px-3.5 py-1.5 bg-[#7BAE7F] hover:bg-[#5A9260] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 btn-scale"
            >
              <FileDown size={13} /> PDF Copy
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Earnings */}
            <div className="bg-[#FAF8F4] p-4.5 rounded-2xl border border-[#EDE8E0]">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#7BAE7F] mb-3 border-b pb-1 border-[#EDE8E0]">Earnings</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#6E675F]">Basic Salary</span>
                  <span className="font-semibold text-[#2F2A26]">${active.basic.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6E675F]">HRA (House Rent Allowance)</span>
                  <span className="font-semibold text-[#2F2A26]">${active.hra.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6E675F]">Special Allowances</span>
                  <span className="font-semibold text-[#2F2A26]">${active.allowance.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-t pt-2 font-bold text-sm text-[#2F2A26]">
                  <span>Gross Earnings</span>
                  <span>${(active.basic + active.hra + active.allowance).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Deductions */}
            <div className="bg-[#FAF8F4] p-4.5 rounded-2xl border border-[#EDE8E0]">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#E07A5F] mb-3 border-b pb-1 border-[#EDE8E0]">Deductions</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#6E675F]">Provident Fund (PF)</span>
                  <span className="font-semibold text-[#2F2A26]">${active.pf.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6E675F]">Professional Tax (PT)</span>
                  <span className="font-semibold text-[#2F2A26]">${active.tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-t pt-2 font-bold text-sm text-[#2F2A26]">
                  <span>Total Deductions</span>
                  <span>${(active.pf + active.tax).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Net pay highlight */}
          <div className="mt-6 p-4 rounded-2xl bg-[#7BAE7F10] border border-[#7BAE7F20] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#7BAE7F] text-white flex items-center justify-center">
                <DollarSign size={18} />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-[#6E675F]">Net Disbursed Pay</p>
                <p className="text-xl font-bold text-[#2F2A26]">${active.net.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-[#5A9260] font-semibold">
              <ShieldCheck size={14} /> Transferred to Bank Account
            </div>
          </div>
        </div>

        <div className="mt-5 text-[10px] text-[#A09890] flex items-center gap-1">
          <HelpCircle size={12} />
          For salary queries or structure questions, please raise an IT/HR support ticket.
        </div>
      </div>
    </div>
  );
}
