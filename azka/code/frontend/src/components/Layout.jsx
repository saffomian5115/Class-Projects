import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Briefcase, 
  Bell, 
  Settings, 
  LogOut, 
  Plus,
  Sparkles,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/jobs', icon: Briefcase, label: 'Applications' },
    { path: '/reminders', icon: Bell, label: 'Reminders' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-dark-900 flex">
      {/* Mobile Menu Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-dark-800 rounded-lg border border-dark-700"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static w-[280px] h-screen bg-dark-800/50 backdrop-blur-xl 
                   border-r border-dark-700 flex flex-col z-40 transition-transform duration-300
                   ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-dark-700">
          <NavLink to="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 
                          flex items-center justify-center font-display font-bold text-white">
              JT
            </div>
            <span className="font-display font-semibold text-xl">JobTrackr</span>
          </NavLink>
        </div>

        {/* User Info */}
        <div className="p-4 m-4 rounded-xl bg-dark-700/50 border border-dark-600">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 
                          flex items-center justify-center font-semibold text-white">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{user?.name}</p>
              <p className="text-sm text-dark-400 truncate">{user?.email}</p>
            </div>
          </div>
          {user?.isPremium && (
            <div className="mt-3 flex items-center gap-2 text-primary-400 text-sm">
              <Sparkles size={14} />
              <span>Premium Member</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 
                ${isActive 
                  ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30' 
                  : 'text-dark-300 hover:bg-dark-700 hover:text-white'}`
              }
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Add Job Button */}
        <div className="p-4">
          <NavLink
            to="/jobs/add"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r 
                     from-primary-500 to-primary-600 rounded-xl font-semibold hover:from-primary-600 
                     hover:to-primary-700 transition-all shadow-lg shadow-primary-500/25"
          >
            <Plus size={20} />
            <span>Add Application</span>
          </NavLink>
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-dark-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-dark-400 
                     hover:bg-red-500/10 hover:text-red-400 transition-all"
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-0 overflow-auto">
        <div className="p-4 lg:p-8 pt-16 lg:pt-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
