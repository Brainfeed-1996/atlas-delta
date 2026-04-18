import { NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Database,
  GitBranch,
  Workflow,
  Network,
  AlertTriangle,
  Settings,
  Moon,
  Sun,
  Bell,
  Search
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/datasets', label: 'Datasets', icon: Database },
  { path: '/transformations', label: 'Transformations', icon: GitBranch },
  { path: '/pipelines', label: 'Pipelines', icon: Workflow },
  { path: '/lineage', label: 'Lineage', icon: Network },
  { path: '/alerts', label: 'Alerts', icon: AlertTriangle },
];

export default function Layout() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex min-h-screen bg-dark-900">
      {/* Sidebar */}
      <aside className="w-64 bg-dark-800 border-r border-dark-700 flex flex-col fixed h-screen">
        {/* Logo */}
        <div className="flex items-center gap-3 p-6 border-b border-dark-700">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg">
            <Workflow className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-primary">Atlas Delta</h1>
            <p className="text-xs text-secondary">Data Platform</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-500/10 text-primary border-r-2 border-primary-500'
                    : 'text-secondary hover:text-primary hover:bg-dark-700/50'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-dark-700 space-y-2">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-4 py-3 text-secondary hover:text-primary hover:bg-dark-700/50 rounded-lg transition-all"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            <span className="text-sm font-medium">
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-40 bg-dark-800/80 backdrop-blur-xl border-b border-dark-700">
          <div className="flex items-center justify-between px-8 py-4">
            {/* Search */}
            <div className="flex items-center gap-4 flex-1 max-w-xl">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
                <input
                  type="text"
                  placeholder="Search datasets, pipelines..."
                  className="w-full pl-10 pr-4 py-2 bg-dark-900 border border-dark-600 rounded-lg text-sm text-primary placeholder-secondary focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20 transition-all"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button className="relative p-2 text-secondary hover:text-primary hover:bg-dark-700 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 text-secondary hover:text-primary hover:bg-dark-700 rounded-lg transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
