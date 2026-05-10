import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  Users, 
  Mail, 
  FileText, 
  Settings, 
  LogOut,
  Stethoscope
} from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
    window.location.reload();
  };

  const navItems = [
    { icon: Home, path: '/', label: 'Dashboard' },
    { icon: Calendar, path: '/appointments', label: 'Appointments' },
    { icon: Users, path: '/patients', label: 'Patients' },
    { icon: Mail, path: '/messages', label: 'Messages' },
    { icon: FileText, path: '/reports', label: 'Reports' },
    { icon: Settings, path: '/settings', label: 'Settings' },
  ];

  return (
    <aside className="w-24 h-screen fixed left-0 top-0 bg-white border-r border-gray-100 flex flex-col items-center py-8 z-50">
      {/* Logo */}
      <div className="w-14 h-14 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mb-12 shadow-sm">
        <Stethoscope className="w-8 h-8" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-6">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `sidebar-link ${isActive ? 'active' : ''}`
            }
            title={item.label}
          >
            <item.icon className="sidebar-icon" />
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <button 
        onClick={handleLogout}
        className="sidebar-link hover:text-red-500 hover:bg-red-50"
        title="Logout"
      >
        <LogOut className="sidebar-icon" />
      </button>
    </aside>
  );
};

export default Sidebar;
