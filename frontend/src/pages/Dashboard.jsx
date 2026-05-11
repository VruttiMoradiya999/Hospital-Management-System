import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { 
  Users, 
  Calendar, 
  Activity, 
  Search, 
  Bell, 
  Star,
  ChevronRight,
  TrendingUp,
  CreditCard,
  User as UserIcon
} from 'lucide-react';
import { 
  AreaChart,
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { motion } from 'framer-motion';
import api from '../services/api';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div 
    className="glass-card p-6 flex flex-col items-center justify-center text-center group cursor-pointer hover:scale-[1.02] transition-all duration-300"
  >
    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:rotate-6 ${color}`}>
      <Icon className="w-8 h-8 text-white" />
    </div>
    <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider">{title}</h3>
    <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
  </div>
);

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await api.get('/stats');
        setData(res.data);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchDashboardData();
  }, [user]);

  if (loading) return (
    <div className="h-[80vh] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
    </div>
  );

  const { stats, recentPatients, doctorList, chartData } = data;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
      {/* Main Content Area */}
      <div className="xl:col-span-3 space-y-8">
        
        {/* Header */}
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Hello, {user?.name.split(' ')[0]}</h1>
            <p className="text-gray-400 mt-1">Have a nice day at work and stay healthy!</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative group">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="bg-white border border-transparent focus:border-primary/20 rounded-2xl py-3 pl-12 pr-6 w-64 shadow-sm focus:outline-none transition-all"
              />
            </div>
            <button className="p-3 bg-white rounded-2xl shadow-sm text-gray-400 hover:text-primary transition-colors">
              <Bell className="w-6 h-6" />
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Patients" value={stats.patients} icon={Users} color="bg-blue-400" />
          <StatCard title="Consultation" value={stats.appointments} icon={Calendar} color="bg-red-400" />
          <StatCard title="Staff" value={stats.staff} icon={Activity} color="bg-orange-300" />
          <StatCard title="Rooms" value={stats.rooms} icon={Users} color="bg-blue-300" />
        </div>

        {/* Chart Section */}
        <div 
          className="glass-card p-8"
        >
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <span className="text-sm font-medium text-gray-600">Male</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-accent"></div>
                <span className="text-sm font-medium text-gray-600">Female</span>
              </div>
            </div>
            <select className="bg-gray-50 border-none text-sm font-medium px-4 py-2 rounded-xl focus:ring-0">
              <option>Last 7 months</option>
            </select>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorMale" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6c5ce7" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6c5ce7" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorFemale" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fab1a0" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#fab1a0" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f2f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#b2bec3', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#b2bec3', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Area type="monotone" dataKey="male" stroke="#6c5ce7" strokeWidth={3} fillOpacity={1} fill="url(#colorMale)" />
                <Area type="monotone" dataKey="female" stroke="#fab1a0" strokeWidth={3} fillOpacity={1} fill="url(#colorFemale)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Patients Table */}
        <div 
          className="glass-card p-8"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Recent Patients</h2>
            <button className="text-primary text-sm font-semibold flex items-center hover:underline">
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-400 text-[11px] font-bold uppercase tracking-widest border-b border-gray-50">
                  <th className="pb-4">PATIENT</th>
                  <th className="pb-4">DATE</th>
                  <th className="pb-4">DISEASE</th>
                  <th className="pb-4">ROOM NO.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentPatients.map((patient, i) => (
                  <tr key={patient._id} className="group hover:bg-gray-50/50 transition-colors">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                          {patient.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="font-semibold text-gray-700">{patient.name}</span>
                      </div>
                    </td>
                    <td className="py-4 text-gray-500 text-sm font-medium">
                      {new Date(patient.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 text-gray-700 font-medium">
                      {patient.diagnosis[0]?.condition || 'General Checkup'}
                    </td>
                    <td className="py-4">
                      <span className="text-primary font-bold text-sm bg-primary/5 px-3 py-1 rounded-lg">
                        {patient.treatmentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Right Sidebar Section */}
      <div className="space-y-8">
        {/* Profile Card */}
        <div 
          className="glass-card overflow-hidden"
        >
          <div className="h-24 bg-secondary/20 relative"></div>
          <div className="px-6 pb-8 text-center -mt-12">
            <div className="w-24 h-24 rounded-full border-4 border-white mx-auto overflow-hidden bg-gray-200 shadow-lg mb-4">
              <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100 font-bold text-2xl">
                {user?.name[0]}
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-800">{user?.name}</h3>
            <p className="text-gray-400 text-sm font-medium mt-1">{user?.role} • {user?.department || 'Medical Staff'}</p>
            <div className="flex justify-center gap-1 mt-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-4 h-4 fill-accent text-accent" />
              ))}
            </div>
          </div>
        </div>

        {/* Doctor List */}
        <div 
          className="glass-card p-8"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Doctor List</h2>
            <span className="text-xs font-bold text-gray-400">Current</span>
          </div>
          <div className="space-y-6">
            {doctorList.map((doc, i) => (
              <div key={doc._id} className="flex items-center gap-4 group cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-all font-bold">
                  {doc.name[0]}
                </div>
                <div>
                  <h4 className="font-bold text-gray-700 text-sm group-hover:text-primary transition-colors">{doc.name}</h4>
                  <p className="text-xs text-gray-400 font-medium">{doc.department || 'General'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Balance Card */}
        <div 
          className="bg-primary rounded-[32px] p-8 text-white relative overflow-hidden shadow-xl"
        >
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Balance</h2>
              <CreditCard className="w-6 h-6 opacity-50" />
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
                 <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-white/60 text-sm font-medium italic">income</p>
                <h3 className="text-3xl font-bold">$95,000</h3>
              </div>
            </div>
          </div>
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
