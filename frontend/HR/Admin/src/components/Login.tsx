import React, { useState, useEffect } from 'react';
import { Shield, Key, AlertCircle, Database, Check } from 'lucide-react';
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
        // Verify if admin role
        try {
          const userProfile = await apiRequest('/profile/me');
          if (userProfile.role !== 'admin') {
            localStorage.removeItem('token');
            throw new Error('Access denied. This portal requires an HR Admin role.');
          }
          onLoginSuccess(response.access_token);
        } catch (err: any) {
          localStorage.removeItem('token');
          throw err;
        }
      } else {
        // Offline Mock Fallback
        if (email === 'admin@example.com' && password === 'admin123') {
          const mockToken = 'mock-admin-token-12345';
          localStorage.setItem('token', mockToken);
          onLoginSuccess(mockToken);
        } else if (email.startsWith('emp') && password === 'emp123') {
          setError('Access denied. This portal requires an HR Admin role.');
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
    <div className="min-h-screen flex items-center justify-center bg-[#F5F0E8] px-4">
      {/* Background radial effects */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 10% 20%, #A0785A30, transparent 40%), radial-gradient(circle at 90% 80%, #6B8E5A20, transparent 40%)' }} />

      <div className="card w-full max-w-[420px] p-8 relative bg-white border border-[#E8DFD3]" style={{ borderRadius: 28 }}>
        
        {/* Connection status tag */}
        <div className="absolute -top-3 right-6">
          {isBackendOnline ? (
            <span className="flex items-center gap-1 text-[10px] bg-[#E8F0E0] text-[#6B8E5A] px-2.5 py-1 rounded-full font-bold border border-[#D5E5C8]">
              <span className="w-1.5 h-1.5 bg-[#6B8E5A] rounded-full animate-pulse" /> Live Backend Online
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[10px] bg-[#F5EBD8] text-[#C49A4A] px-2.5 py-1 rounded-full font-bold border border-[#EADBBD]">
              <span className="w-1.5 h-1.5 bg-[#C49A4A] rounded-full" /> Local Offline Mode
            </span>
          )}
        </div>

        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-[#F5EDE0] rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ border: '1px solid #E8DFD3' }}>
            <Shield size={22} style={{ color: '#A0785A' }} />
          </div>
          <h1 className="font-serif text-2xl font-bold" style={{ color: '#2D2419' }}>HR Portal</h1>
          <p className="text-xs mt-1" style={{ color: '#8A7B6A' }}>Human Resource Management System · Admin Log In</p>
        </div>

        {error && (
          <div className="flex items-start gap-2 p-3.5 mb-4 rounded-xl text-xs bg-[#F2E0D8] text-[#B5654E] border border-[#E8C5B9]">
            <AlertCircle size={14} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold mb-1.5 uppercase tracking-wider" style={{ color: '#8A7B6A' }}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="w-full px-4 py-3 rounded-xl text-sm border focus:outline-none transition-all"
              style={{
                background: '#FBF8F3',
                borderColor: '#E8DFD3',
                color: '#2D2419'
              }}
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold mb-1.5 uppercase tracking-wider" style={{ color: '#8A7B6A' }}>Password</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl text-sm border focus:outline-none transition-all"
                style={{
                  background: '#FBF8F3',
                  borderColor: '#E8DFD3',
                  color: '#2D2419'
                }}
                required
              />
              <Key size={14} className="absolute right-4 top-3.5" style={{ color: '#A89A88' }} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-white text-xs font-bold transition-all flex items-center justify-center gap-2 hover:opacity-90"
            style={{
              background: '#A0785A',
              boxShadow: '0 4px 12px rgba(160, 120, 90, 0.2)'
            }}
          >
            {loading ? 'Logging in...' : 'Sign In as Admin'}
          </button>
        </form>

        {/* Quick Select demo box */}
        <div className="mt-6 pt-5 border-t border-[#F0E9DE]">
          <p className="text-[10px] font-bold uppercase tracking-wider text-center mb-3" style={{ color: '#A89A88' }}>Quick Select Demo Account</p>
          <button
            onClick={() => handleQuickLogin('admin@example.com', 'admin123')}
            className="w-full flex items-center justify-between p-2.5 rounded-xl text-[11px] border text-left transition-all hover:bg-[#F5EDE0]"
            style={{
              background: '#FBF8F3',
              borderColor: '#E8DFD3',
              color: '#2D2419'
            }}
          >
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#A0785A]" />
              <div>
                <p className="font-bold">HR Administrator</p>
                <p className="text-[9px]" style={{ color: '#A89A88' }}>admin@example.com / admin123</p>
              </div>
            </div>
            {email === 'admin@example.com' && <Check size={12} className="text-[#6B8E5A]" />}
          </button>
        </div>

        {/* Status indicator footer */}
        <div className="mt-5 flex items-center justify-center gap-1.5 text-[10px]" style={{ color: '#A89A88' }}>
          <Database size={10} />
          <span>Local database: seed.py ready</span>
        </div>
      </div>
    </div>
  );
}
