import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Stethoscope } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div 
        className="max-w-md w-full glass-card p-10 border border-white/50 relative overflow-hidden"
      >
        {/* Decorative Background Element */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-primary rounded-[28px] flex items-center justify-center shadow-xl shadow-primary/30">
              <Stethoscope className="text-white w-10 h-10" />
            </div>
          </div>
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-2">
            MediCare Pro
          </h2>
          <p className="text-center text-gray-400 mb-10 font-medium">Healthcare management simplified.</p>
          
          {error && (
            <div 
              className="bg-red-50 text-red-500 p-4 rounded-2xl text-sm mb-8 border border-red-100 flex items-center gap-2"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-600 ml-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl border border-gray-100 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all outline-none bg-white/50 shadow-sm"
                placeholder="admin@hospital.com"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-600 ml-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl border border-gray-100 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all outline-none bg-white/50 shadow-sm"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-white font-bold py-4 rounded-2xl hover:bg-primary/90 focus:ring-4 focus:ring-primary/20 transition-all shadow-xl shadow-primary/20 active:scale-[0.98] mt-4"
            >
              Sign In
            </button>
          </form>
          
          <div className="mt-10 pt-8 border-t border-gray-50 text-center">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Demo Access (Password: password)</h4>
            <div className="grid grid-cols-1 gap-2">
              {[
                { role: 'Admin', email: 'admin@hospital.com' },
                { role: 'Doctor', email: 'doctor@hospital.com' },
                { role: 'Nurse', email: 'nurse@hospital.com' }
              ].map((cred) => (
                <button 
                  key={cred.role}
                  onClick={() => { setEmail(cred.email); setPassword('password'); }}
                  className="bg-gray-50 hover:bg-primary/5 hover:text-primary py-2.5 rounded-xl text-[10px] font-bold text-gray-500 uppercase transition-all border border-transparent hover:border-primary/10"
                >
                  {cred.role}: {cred.email}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
