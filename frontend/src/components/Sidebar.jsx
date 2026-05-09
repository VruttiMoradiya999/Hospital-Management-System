import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Settings, 
  LogOut,
  Activity
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Patients', path: '/patients', icon: <Users size={20} /> },
    // Only Admin can see users management
    ...(user?.role === 'Admin' ? [{ name: 'Staff', path: '/staff', icon: <Settings size={20} /> }] : []),
    { name: 'Appointments', path: '/appointments', icon: <Calendar size={20} /> },
  ];

  return (
    <div className="w-72 bg-white border-r border-gray-100 flex flex-col shadow-sm">
      <div className="p-8 flex items-center gap-4">
        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
          <Activity className="text-white w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800 tracking-tight">MediCare</h1>
          <p className="text-xs text-blue-600 font-medium tracking-wide uppercase">Pro System</p>
        </div>
      </div>

      <div className="px-6 pb-6">
        <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100/50">
          <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
          <p className="text-xs text-blue-600 font-medium mt-0.5">{user?.role}</p>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
              }`
            }
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3.5 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 transition-all duration-200"
        >
          <LogOut size={20} />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
