import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Compass, 
  BookOpen, 
  Brain, 
  BarChart3, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Search,
  Plus,
  Clock,
  Infinity,
  Library
} from 'lucide-react';

function HubLayout({ children, currentView, onViewChange, topics, onNewTopic }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navigationItems = [
    { id: 'dashboard', label: 'Overview', icon: Home },
    { id: 'explore', label: 'Explore', icon: Compass },
    { id: 'active', label: 'Active Threads', icon: BookOpen },
    { id: 'review', label: 'Review', icon: Brain },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  const recentThreads = topics?.slice(0, 5) || [];

  return (
    <div className="flex h-screen" style={{ background: 'var(--bg)' }}>
      {/* Sidebar */}
      <motion.div
        initial={{ width: 280 }}
        animate={{ width: sidebarCollapsed ? 80 : 280 }}
        transition={{ duration: 0.3 }}
        className="border-r"
        style={{ borderColor: 'var(--border)' }}
      >
        <div className="h-full flex flex-col">
          {/* Logo/Header */}
          <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between">
              {!sidebarCollapsed && (
                <h2 className="heading">Learning Hub</h2>
              )}
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="btn"
                style={{ padding: '0.5rem' }}
              >
                {sidebarCollapsed ? (
                  <ChevronRight className="w-4 h-4" />
                ) : (
                  <ChevronLeft className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Quick Search */}
          {!sidebarCollapsed && (
            <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Quick search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 bg-transparent border text-sm"
                  style={{
                    borderColor: 'var(--border)',
                    color: 'var(--fg)'
                  }}
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-3 h-3 opacity-50" />
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <div className="space-y-2">
              {navigationItems.map((item) => (
                <motion.button
                  key={item.id}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onViewChange(item.id)}
                  className={`w-full flex items-center space-x-3 p-3 transition-colors ${
                    currentView === item.id ? 'bg-white bg-opacity-10' : ''
                  }`}
                  style={{
                    borderLeft: currentView === item.id ? '2px solid var(--fg)' : '2px solid transparent'
                  }}
                >
                  <item.icon className="w-4 h-4" />
                  {!sidebarCollapsed && (
                    <span className="small">{item.label}</span>
                  )}
                </motion.button>
              ))}
            </div>

            {/* Quick Actions */}
            {!sidebarCollapsed && (
              <div className="mt-8">
                <p className="tiny mb-3 opacity-50">QUICK ACTIONS</p>
                <button
                  onClick={onNewTopic}
                  className="w-full flex items-center space-x-3 p-3 border"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <Plus className="w-4 h-4" />
                  <span className="small">New Thread</span>
                </button>
              </div>
            )}

            {/* Recent Threads */}
            {!sidebarCollapsed && recentThreads.length > 0 && (
              <div className="mt-8">
                <p className="tiny mb-3 opacity-50">RECENT THREADS</p>
                <div className="space-y-2">
                  {recentThreads.map((thread) => (
                    <motion.div
                      key={thread.id}
                      whileHover={{ x: 4 }}
                      className="flex items-center space-x-3 p-2 cursor-pointer"
                      onClick={() => {
                        onViewChange('thread');
                        // This would be handled by parent component
                      }}
                    >
                      <div className="flex-1">
                        <p className="tiny truncate">{thread.name}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Clock className="w-3 h-3 opacity-50" />
                          <span className="tiny opacity-50">{thread.lastAccessed}</span>
                        </div>
                      </div>
                      <Infinity className="w-3 h-3 opacity-50" />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </nav>

          {/* Bottom Section */}
          <div className="p-4 border-t" style={{ borderColor: 'var(--border)' }}>
            <button
              className="w-full flex items-center space-x-3 p-3"
              onClick={() => onViewChange('settings')}
            >
              <Settings className="w-4 h-4" />
              {!sidebarCollapsed && (
                <span className="small">Settings</span>
              )}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}

export default HubLayout; 