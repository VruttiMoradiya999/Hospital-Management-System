import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Users, Activity, Calendar, TrendingUp } from 'lucide-react';
import api from '../services/api';

const DashboardCard = ({ title, value, icon: Icon, color, trend }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color} bg-opacity-10`}>
        <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
      </div>
      {trend && (
        <span className="flex items-center text-sm font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
          <TrendingUp className="w-4 h-4 mr-1" />
          {trend}
        </span>
      )}
    </div>
    <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
    <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
  </div>
);

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    patients: 0,
    appointments: 0,
    staff: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [patientsRes, appointmentsRes] = await Promise.all([
          api.get('/patients'),
          api.get('/appointments')
        ]);
        
        let staffCount = 0;
        if (user.role === 'Admin') {
          const staffRes = await api.get('/users');
          staffCount = staffRes.data.length;
        }

        setStats({
          patients: patientsRes.data.length,
          appointments: appointmentsRes.data.length,
          staff: staffCount
        });
      } catch (error) {
        console.error("Error fetching stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user.role]);

  if (loading) {
    return <div className="flex items-center justify-center h-full">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Overview</h1>
          <p className="text-gray-500 mt-1">Welcome back, {user?.name}</p>
        </div>
        <div className="text-sm font-medium text-gray-500 bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard 
          title="Total Patients" 
          value={stats.patients} 
          icon={Users} 
          color="bg-blue-500 text-blue-500"
          trend="+12%"
        />
        <DashboardCard 
          title="Appointments Today" 
          value={stats.appointments} 
          icon={Calendar} 
          color="bg-purple-500 text-purple-500"
          trend="+5%"
        />
        <DashboardCard 
          title="Active Treatments" 
          value={Math.floor(stats.patients * 0.4)} 
          icon={Activity} 
          color="bg-emerald-500 text-emerald-500"
        />
        {user.role === 'Admin' && (
          <DashboardCard 
            title="Total Staff" 
            value={stats.staff} 
            icon={Users} 
            color="bg-orange-500 text-orange-500"
          />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Appointments */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Recent Appointments</h2>
            <button className="text-blue-600 text-sm font-medium hover:text-blue-700">View All</button>
          </div>
          
          <div className="space-y-4">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-center p-4 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-100">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-4">
                  JS
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">John Smith</h4>
                  <p className="text-sm text-gray-500">General Checkup</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-800">10:00 AM</p>
                  <p className="text-xs text-gray-500">Today</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-4 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors">
              <span className="font-medium">Register Patient</span>
              <Users className="w-5 h-5" />
            </button>
            <button className="w-full flex items-center justify-between p-4 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors">
              <span className="font-medium">New Appointment</span>
              <Calendar className="w-5 h-5" />
            </button>
            {user.role === 'Doctor' && (
              <button className="w-full flex items-center justify-between p-4 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors">
                <span className="font-medium">Add Prescription</span>
                <Activity className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
