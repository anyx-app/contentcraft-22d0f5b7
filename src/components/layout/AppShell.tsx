import React, { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PenTool, 
  Image as ImageIcon, 
  Users, 
  Settings, 
  Menu, 
  X, 
  LogOut,
  ChevronRight,
  Search,
  Bell
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AppShell() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { label: 'Posts', icon: PenTool, path: '/posts' },
    { label: 'Media Library', icon: ImageIcon, path: '/media' },
    { label: 'Subscribers', icon: Users, path: '/subscribers' },
    { label: 'Settings', icon: Settings, path: '/settings' },
  ];

  const pageTitle = navItems.find(item => item.path === location.pathname)?.label || 'Dashboard';

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans text-slate-900 overflow-hidden selection:bg-blue-100">
      {/* Mobile Overlay */}
      {!isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(true)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-white/80 backdrop-blur-2xl border-r border-slate-200 shadow-[4px_0_24px_rgba(0,0,0,0.02)] transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
          !isSidebarOpen && "-translate-x-full md:hidden"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Brand */}
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#4285F4] to-[#34A853] flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/20 ring-1 ring-black/5">
                C
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent tracking-tight">
                  ContentCraft
                </span>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Creator Studio</span>
              </div>
            </div>
            <button 
              onClick={() => setSidebarOpen(false)} 
              className="md:hidden p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
            <div className="px-4 mb-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
              Main Menu
            </div>
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden",
                  isActive 
                    ? "bg-blue-50 text-[#4285F4] shadow-sm font-semibold" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                {({ isActive }) => (
                  <>
                    <div className={cn(
                      "absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full transition-all duration-300",
                      isActive ? "bg-[#4285F4]" : "bg-transparent"
                    )} />
                    <item.icon size={22} className={cn("stroke-[2px] transition-colors", isActive ? "stroke-[#4285F4]" : "group-hover:stroke-slate-700")} />
                    <span>{item.label}</span>
                    {isActive && <ChevronRight size={16} className="ml-auto opacity-50" />}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* User Profile / Footer */}
          <div className="p-4 border-t border-slate-100 bg-white/50 backdrop-blur-sm">
            <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white hover:shadow-md hover:shadow-slate-200/50 transition-all duration-300 cursor-pointer group border border-transparent hover:border-slate-100">
              <div className="h-10 w-10 rounded-full bg-slate-100 border-2 border-white shadow-sm overflow-hidden ring-1 ring-slate-200">
                <img 
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
                  alt="User" 
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-800 truncate group-hover:text-[#4285F4] transition-colors">Alex Creator</p>
                <p className="text-xs text-slate-500 truncate">Pro Plan</p>
              </div>
              <LogOut size={18} className="text-slate-400 hover:text-red-500 transition-colors" />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
        {/* Header */}
        <header className="h-20 px-8 flex items-center justify-between bg-white/60 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-30 transition-all duration-200">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight hidden md:block">
              {pageTitle}
            </h1>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative hidden md:block group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#4285F4] transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Search content..." 
                className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-full w-64 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#4285F4] transition-all duration-300 shadow-sm text-sm"
              />
            </div>
            
            <button className="relative p-2.5 text-slate-500 hover:bg-slate-100 rounded-full transition-colors hover:text-[#4285F4]">
              <Bell size={22} />
              <span className="absolute top-2 right-2.5 h-2 w-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            
            <button className="hidden md:flex items-center justify-center h-10 px-6 rounded-full bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-900/20 transition-all duration-300 active:scale-95">
              New Post
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-slate-50/50 p-6 md:p-10 scroll-smooth">
          <div className="container mx-auto max-w-6xl animate-in fade-in duration-500 slide-in-from-bottom-4">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
