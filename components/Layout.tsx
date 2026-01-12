
import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  TrendingUp, 
  Settings, 
  Menu, 
  X, 
  Search, 
  Bell, 
  PlusCircle,
  Truck,
  Ghost
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

const NavItem: React.FC<{ to: string; icon: React.ReactNode; label: string; active: boolean; collapsed: boolean; isDark: boolean }> = ({ to, icon, label, active, collapsed, isDark }) => (
  <Link 
    to={to} 
    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
      active 
        ? 'bg-cyan-500/20 text-cyan-500 border-l-4 border-cyan-500 font-bold neon-glow-text shadow-[inset_0_0_10px_rgba(34,211,238,0.2)]' 
        : isDark ? 'text-slate-400 hover:text-cyan-300 hover:bg-slate-800/50' : 'text-slate-500 hover:text-cyan-600 hover:bg-slate-200'
    }`}
  >
    <div className={`${active ? 'text-cyan-500' : ''}`}>{icon}</div>
    {!collapsed && <span className="text-sm font-medium tracking-wide whitespace-nowrap">{label}</span>}
  </Link>
);

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const location = useLocation();
  const { state } = useStore();
  const notificationRef = useRef<HTMLDivElement>(null);
  
  const isDark = state.settings.theme === 'dark';

  useEffect(() => {
    // Set grid opacity and body background dynamically
    if (isDark) {
      document.documentElement.style.setProperty('--grid-opacity', '0.8');
    } else {
      document.documentElement.style.setProperty('--grid-opacity', '0');
    }
  }, [isDark]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { to: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/sales', icon: <ShoppingCart size={20} />, label: 'Sales' },
    { to: '/purchases', icon: <Truck size={20} />, label: 'Purchases' },
    { to: '/inventory', icon: <Package size={20} />, label: 'Inventory' },
    { to: '/reports', icon: <TrendingUp size={20} />, label: 'Reports' },
    { to: '/settings', icon: <Settings size={20} />, label: 'Settings' },
  ];

  return (
    <div className={`min-h-screen transition-all duration-500 flex ${isDark ? 'bg-[#070A12] text-slate-200 grid-bg' : 'bg-slate-100 text-slate-900'}`}>
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 transition-all duration-300 backdrop-blur-xl border-r no-print ${
          collapsed ? 'w-20' : 'w-64'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} ${
          isDark ? 'bg-[#0c111d]/95 border-slate-800/50' : 'bg-white border-slate-200 shadow-xl'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className={`h-16 flex items-center justify-between px-6 border-b ${isDark ? 'border-slate-800/50' : 'border-slate-100'}`}>
            {!collapsed && (
              <span className="font-orbitron text-cyan-500 font-bold text-lg tracking-tighter">
                NEON<span className="text-purple-500">CIRCUIT</span>
              </span>
            )}
            <button 
              onClick={() => setCollapsed(!collapsed)}
              className={`hidden md:block transition-colors ${isDark ? 'text-slate-400 hover:text-cyan-400' : 'text-slate-500 hover:text-cyan-600'}`}
            >
              {collapsed ? <Menu size={20} /> : <X size={20} />}
            </button>
            <button 
              onClick={() => setMobileOpen(false)}
              className="md:hidden text-slate-400"
            >
              <X size={24} />
            </button>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-2">
            {navLinks.map((link) => (
              <NavItem 
                key={link.to}
                {...link} 
                active={location.pathname === link.to} 
                collapsed={collapsed}
                isDark={isDark}
              />
            ))}
          </nav>

          <div className={`p-4 border-t ${isDark ? 'border-slate-800/50' : 'border-slate-100'}`}>
            <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-600 to-purple-600 flex items-center justify-center font-bold text-white shadow-[0_0_10px_rgba(6,182,212,0.4)]">
                AD
              </div>
              {!collapsed && (
                <div>
                  <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Admin</p>
                  <p className="text-xs text-slate-500 uppercase tracking-tighter font-medium">Super User</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 flex flex-col transition-all duration-300 ${collapsed ? 'md:ml-20' : 'md:ml-64'}`}>
        <header className={`h-16 border-b backdrop-blur-md sticky top-0 z-40 px-4 md:px-8 flex items-center justify-between no-print ${
          isDark ? 'bg-[#070A12]/80 border-slate-800/50' : 'bg-white/80 border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setMobileOpen(true)}
              className={`md:hidden p-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}
            >
              <Menu size={24} />
            </button>
            <h1 className={`text-xl font-orbitron font-bold tracking-wide ${isDark ? 'text-white' : 'text-slate-800'}`}>
              {navLinks.find(l => l.to === location.pathname)?.label || 'Overview'}
            </h1>
          </div>

          <div className="flex items-center gap-2 md:gap-6 relative">
            <div className={`hidden md:flex items-center border rounded-full px-4 py-1.5 focus-within:border-cyan-500/50 transition-all ${
              isDark ? 'bg-slate-900/80 border-slate-700/50' : 'bg-slate-100 border-slate-200 shadow-inner'
            }`}>
              <Search size={18} className="text-slate-500" />
              <input 
                type="text" 
                placeholder="Search resources..." 
                className={`bg-transparent border-none outline-none text-sm ml-2 w-48 transition-colors ${
                  isDark ? 'text-slate-200' : 'text-slate-800'
                }`}
              />
            </div>

            <div className="flex items-center gap-2">
              <Link to="/sales/new" className="p-2 text-cyan-500 hover:bg-cyan-500/10 rounded-lg transition-colors" title="New Sale">
                <PlusCircle size={22} />
              </Link>
              <div ref={notificationRef} className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={`relative p-2 transition-colors rounded-lg ${
                    showNotifications 
                    ? 'text-cyan-500 bg-cyan-500/10' 
                    : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Bell size={22} />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-purple-500 rounded-full animate-pulse border border-[#070A12]"></span>
                </button>

                {/* Notifications Popover */}
                {showNotifications && (
                  <div className={`absolute right-0 mt-3 w-80 backdrop-blur-xl border rounded-xl shadow-2xl z-50 overflow-hidden animate-in slide-in-from-top-2 duration-200 ${
                    isDark ? 'bg-[#0c111d]/95 border-slate-800' : 'bg-white/95 border-slate-200'
                  }`}>
                    <div className={`px-4 py-3 border-b flex justify-between items-center ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Incoming Signals</span>
                      <button onClick={() => setShowNotifications(false)} className="text-slate-600 hover:text-rose-500"><X size={14}/></button>
                    </div>
                    <div className="p-8 flex flex-col items-center justify-center text-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${isDark ? 'bg-slate-900 text-slate-700' : 'bg-slate-100 text-slate-400'}`}>
                        <Ghost size={24} />
                      </div>
                      <p className={`text-sm font-bold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>No active signals</p>
                      <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-tight">The communication grid is currently silent.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 md:p-8 flex-1 animate-in fade-in duration-500">
          {children}
        </div>
      </main>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </div>
  );
};

export default AppLayout;
