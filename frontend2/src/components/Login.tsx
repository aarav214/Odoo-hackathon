import React, { useState, useEffect } from 'react';
import { UserCheck, Key, AlertCircle, Database, Check } from 'lucide-react';
import { apiRequest, checkBackendStatus } from '../api';

interface LoginProps {
  onLoginSuccess: (token: string) => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isBackendOnline, setIsBackendOnline] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkBackendStatus().then(setIsBackendOnline);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setError(null);
    setLoading(true);

    try {
      if (isBackendOnline) {
        const response = await apiRequest('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        });
        localStorage.setItem('token', response.access_token);
        
        // Verify if employee/user exists
        try {
          await apiRequest('/profile/me');
          onLoginSuccess(response.access_token);
        } catch (err: any) {
          localStorage.removeItem('token');
          throw err;
        }
      } else {
        // Offline Fallback
        if (email.startsWith('emp') && password === 'emp123') {
          const mockToken = 'mock-employee-token-12345';
          localStorage.setItem('token', mockToken);
          onLoginSuccess(mockToken);
        } else if (email === 'admin@example.com' && password === 'admin123') {
          const mockToken = 'mock-employee-token-admin';
          localStorage.setItem('token', mockToken);
          onLoginSuccess(mockToken);
        } else {
          setError('Invalid email or password (offline mode)');
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F6F2] px-4">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-25 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, #7BAE7F30, transparent 40%), radial-gradient(circle at 20% 80%, #A98E7420, transparent 40%)' }} />

      <div className="bg-white rounded-3xl border border-[#EDE8E0] warm-shadow w-full max-w-[420px] p-8 relative">
        
        {/* Connection status tag */}
        <div className="absolute -top-3 right-6">
          {isBackendOnline ? (
            <span className="flex items-center gap-1 text-[10px] bg-[#7BAE7F15] text-[#5A9260] px-2.5 py-1 rounded-full font-bold border border-[#A8C9AB]">
              <span className="w-1.5 h-1.5 bg-[#7BAE7F] rounded-full animate-pulse" /> Live Backend Online
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[10px] bg-[#F4EFE7] text-[#6E675F] px-2.5 py-1 rounded-full font-bold border border-[#EDE8E0]">
              <span className="w-1.5 h-1.5 bg-[#6E675F] rounded-full" /> Local Offline Mode
            </span>
          )}
        </div>

        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-[#7BAE7F15] rounded-2xl flex items-center justify-center mx-auto mb-3">
            <UserCheck size={22} className="text-[#7BAE7F]" />
          </div>
          <h1 className="text-2xl font-bold text-[#2F2A26]">Employee Portal</h1>
          <p className="text-xs text-[#6E675F] mt-1">Human Resource Management System · Personal Access</p>
        </div>

        {error && (
          <div className="flex items-start gap-2 p-3.5 mb-4 rounded-xl text-xs bg-[#E07A5F15] text-[#E07A5F] border border-[#E07A5F30]">
            <AlertCircle size={14} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-[#6E675F] mb-1.5 uppercase tracking-wider">Work Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="emp1@example.com"
              className="w-full px-4 py-3 rounded-xl text-sm border border-[#EDE8E0] focus:border-[#7BAE7F] focus:outline-none transition-all bg-[#FAF8F4] text-[#2F2A26]"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#6E675F] mb-1.5 uppercase tracking-wider">Password</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl text-sm border border-[#EDE8E0] focus:border-[#7BAE7F] focus:outline-none transition-all bg-[#FAF8F4] text-[#2F2A26]"
                required
              />
              <Key size={14} className="absolute right-4 top-3.5 text-[#6E675F] opacity-50" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-white text-xs font-bold transition-all flex items-center justify-center gap-2 hover:bg-[#5A9260] bg-[#7BAE7F] btn-scale"
            style={{
              boxShadow: '0 4px 12px rgba(123, 174, 127, 0.2)'
            }}
          >
            {loading ? 'Verifying...' : 'Sign In to Portal'}
          </button>
        </form>

        {/* Quick Select demo box */}
        <div className="mt-6 pt-5 border-t border-[#EDE8E0]">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#A09890] text-center mb-3">Quick Select Demo Account</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Employee 1', email: 'emp1@example.com' },
              { label: 'Employee 2', email: 'emp2@example.com' },
              { label: 'Employee 3', email: 'emp3@example.com' },
              { label: 'Employee 4', email: 'emp4@example.com' },
            ].map((emp) => (
              <button
                key={emp.email}
                type="button"
                onClick={() => handleQuickLogin(emp.email, 'emp123')}
                className={`flex items-center justify-between p-2 rounded-xl text-[10px] border text-left transition-all hover:bg-[#F4EFE7] ${
                  email === emp.email ? 'border-[#7BAE7F] bg-[#7BAE7F05]' : 'border-[#EDE8E0] bg-[#FAF8F4]'
                }`}
              >
                <div>
                  <p className="font-bold text-[#2F2A26]">{emp.label}</p>
                  <p className="text-[9px] text-[#6E675F] truncate">{emp.email}</p>
                </div>
                {email === emp.email && <Check size={10} className="text-[#7BAE7F]" />}
              </button>
            ))}
          </div>
        </div>

        {/* Status indicator footer */}
        <div className="mt-5 flex items-center justify-center gap-1.5 text-[10px] text-[#A09890]">
          <Database size={10} />
          <span>Local database: seed.py ready</span>
        </div>
      </div>
    </div>
  );
}
