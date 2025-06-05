import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Home, 
  Plus, 
  BookOpen, 
  User, 
  LogOut, 
  Menu, 
  X,
  Clock,
  TrendingUp,
  Settings,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn, getInitials } from '@/lib/utils';

function Navbar({ user, onLogout, backendStatus }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Learn New', href: '/create', icon: Plus },
    { name: 'Review', href: '/feed', icon: Clock },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  ];

  const isActive = (href) => location.pathname === href;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="flow-container">
        <div className="flex items-center justify-between h-16">
          {/* Brand Identity */}
          <Link to="/dashboard" className="flex items-center space-x-3 cognitive-card px-3 py-2 rounded-lg">
            <Brain className="h-6 w-6 text-primary" />
            <span className="neural-subheading">CognitioFlux</span>
          </Link>

          {/* Primary Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center px-4 py-2 rounded-lg neural-detail font-medium transition-all duration-200",
                    isActive(item.href)
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Learning Status & User Controls */}
          <div className="flex items-center space-x-4">
            {/* Learning Status Indicator */}
            <div className="hidden sm:flex items-center">
              {backendStatus === 'connected' ? (
                <div className="flex items-center neural-caption">
                  <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                  Learning Active
                </div>
              ) : backendStatus === 'disconnected' ? (
                <div className="flex items-center neural-caption text-muted-foreground">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse mr-2"></div>
                  Offline Mode
                </div>
              ) : (
                <div className="flex items-center neural-caption">
                  <div className="w-2 h-2 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2"></div>
                  Connecting
                </div>
              )}
            </div>

            {/* User Profile Control */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-accent transition-colors cognitive-card"
              >
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-lg flex items-center justify-center neural-caption font-semibold">
                  {getInitials(user.name)}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="neural-detail font-medium text-foreground">{user.name}</div>
                  <div className="neural-caption text-muted-foreground">Learning Profile</div>
                </div>
              </button>

              {/* User Menu */}
              {isUserMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute right-0 mt-2 w-56 cognitive-card py-1"
                >
                  <div className="px-4 py-3 border-b border-border">
                    <div className="neural-detail font-medium text-foreground">{user.name}</div>
                    <div className="neural-caption text-muted-foreground">{user.email}</div>
                  </div>
                  
                  <Link
                    to="/settings"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="w-full flex items-center px-4 py-3 neural-detail text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                  >
                    <Settings className="h-4 w-4 mr-3" />
                    Learning Preferences
                  </Link>
                  
                  <button
                    onClick={() => {
                      onLogout();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full flex items-center px-4 py-3 neural-detail text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    Sign Out
                  </button>
                </motion.div>
              )}
            </div>

            {/* Mobile Navigation Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors cognitive-card"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Panel */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border py-4"
          >
            <div className="memory-list">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      "flex items-center px-4 py-3 rounded-lg neural-detail font-medium transition-colors",
                      isActive(item.href)
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    )}
                  >
                    <Icon className="h-4 w-4 mr-3" />
                    {item.name}
                  </Link>
                );
              })}
              
              {/* Mobile Settings Access */}
              <Link
                to="/settings"
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  "flex items-center px-4 py-3 rounded-lg neural-detail font-medium transition-colors",
                  isActive('/settings')
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                <Settings className="h-4 w-4 mr-3" />
                Learning Preferences
              </Link>
            </div>
          </motion.div>
        )}
      </div>

      {/* Overlay for Menu Closure */}
      {(isMenuOpen || isUserMenuOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsMenuOpen(false);
            setIsUserMenuOpen(false);
          }}
        />
      )}
    </nav>
  );
}

export default Navbar; 