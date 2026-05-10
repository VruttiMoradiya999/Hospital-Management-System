import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { 
  User, 
  Mail, 
  Shield, 
  Lock, 
  Bell, 
  Save,
  Camera
} from 'lucide-react';
import { motion } from 'framer-motion';

const Settings = () => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    department: user?.department || '',
    currentPassword: '',
    newPassword: ''
  });

  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });
    
    try {
      const res = await api.put('/users/profile', formData);
      setMessage({ text: 'Profile updated successfully!', type: 'success' });
      // Update local storage if needed or refresh context
    } catch (err) {
      setMessage({ 
        text: err.response?.data?.message || 'Failed to update profile', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Account Settings</h1>
        <p className="text-gray-400 mt-1 font-medium">Manage your personal information and security.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Navigation Tabs Placeholder */}
        <div className="space-y-2">
          {[
            { label: 'Profile', icon: User, active: true },
            { label: 'Security', icon: Lock },
            { label: 'Notifications', icon: Bell },
            { label: 'Permissions', icon: Shield }
          ].map((item) => (
            <button 
              key={item.label}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all ${item.active ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-400 hover:bg-white hover:text-primary'}`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </div>

        {/* Settings Form */}
        <div className="md:col-span-2 space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8"
          >
            <div className="flex items-center gap-6 mb-10">
              <div className="relative group">
                <div className="w-24 h-24 rounded-[32px] bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold border-4 border-white shadow-xl">
                  {user?.name[0]}
                </div>
                <button className="absolute -bottom-2 -right-2 p-2 bg-white rounded-xl shadow-lg text-primary hover:scale-110 transition-transform">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">{user?.name}</h3>
                <p className="text-gray-400 font-medium text-sm">{user?.role} • {user?.department || 'Medical Staff'}</p>
              </div>
            </div>

            {message.text && (
              <div className={`p-4 rounded-2xl mb-6 text-sm font-bold border ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-600 ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
                    <input 
                      type="text" 
                      className="w-full pl-12 pr-6 py-4 rounded-2xl border border-gray-100 focus:border-primary/50 outline-none transition-all bg-gray-50/50 font-bold text-gray-700"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-600 ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
                    <input 
                      type="email" 
                      className="w-full pl-12 pr-6 py-4 rounded-2xl border border-gray-100 focus:border-primary/50 outline-none transition-all bg-gray-50/50 font-bold text-gray-700"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600 ml-1">Department</label>
                <input 
                  type="text" 
                  className="w-full px-6 py-4 rounded-2xl border border-gray-100 focus:border-primary/50 outline-none transition-all bg-gray-50/50 font-bold text-gray-700"
                  value={formData.department}
                  onChange={(e) => setFormData({...formData, department: e.target.value})}
                />
              </div>

              <div className="pt-6 border-t border-gray-50">
                <button 
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 active:scale-95 disabled:opacity-50"
                >
                  <Save className="w-5 h-5" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-8 border-red-50"
          >
            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Lock className="w-5 h-5 text-red-500" />
              Security Preference
            </h3>
            <p className="text-sm text-gray-400 font-medium mb-6">
              It is recommended to use a unique password that you don't use on any other website.
            </p>
            <button className="text-red-500 font-bold text-sm hover:underline">
              Change Login Password
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
