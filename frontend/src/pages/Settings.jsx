import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Brain, 
  Clock, 
  Globe,
  Save,
  Eye,
  EyeOff,
  Trash2,
  Download,
  Upload
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Badge } from '../components/ui/Badge';
import { Tabs } from '../components/ui/Tabs';
import { useToast } from '../components/ui/Toast';

const Settings = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [settings, setSettings] = useState({
    // Profile
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: '',
    bio: 'Passionate learner exploring AI and technology',
    
    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    weeklyDigest: true,
    lessonReminders: true,
    
    // Learning Preferences
    dailyGoal: 30,
    difficulty: 'intermediate',
    language: 'en',
    timezone: 'UTC-5',
    studyTime: 'morning',
    
    // Privacy
    profileVisibility: 'public',
    shareProgress: true,
    dataCollection: true,
    
    // Appearance
    theme: 'light',
    fontSize: 'medium',
    animations: true
  });

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    // Simulate API call
    setTimeout(() => {
      toast.success('Settings saved successfully!');
    }, 500);
  };

  const handleExportData = () => {
    toast.info('Preparing your data export...');
    // Simulate export
    setTimeout(() => {
      toast.success('Data export ready for download!');
    }, 2000);
  };

  const handleDeleteAccount = () => {
    toast.error('Account deletion requires email confirmation');
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'learning', label: 'Learning', icon: Brain },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette }
  ];

  const difficultyOptions = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' }
  ];

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' }
  ];

  const timezoneOptions = [
    { value: 'UTC-8', label: 'Pacific Time (UTC-8)' },
    { value: 'UTC-5', label: 'Eastern Time (UTC-5)' },
    { value: 'UTC+0', label: 'GMT (UTC+0)' },
    { value: 'UTC+1', label: 'Central European Time (UTC+1)' }
  ];

  const studyTimeOptions = [
    { value: 'morning', label: 'Morning (6-12 PM)' },
    { value: 'afternoon', label: 'Afternoon (12-6 PM)' },
    { value: 'evening', label: 'Evening (6-10 PM)' },
    { value: 'night', label: 'Night (10 PM-6 AM)' }
  ];

  const themeOptions = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'auto', label: 'Auto' }
  ];

  const fontSizeOptions = [
    { value: 'small', label: 'Small' },
    { value: 'medium', label: 'Medium' },
    { value: 'large', label: 'Large' }
  ];

  const visibilityOptions = [
    { value: 'public', label: 'Public' },
    { value: 'friends', label: 'Friends Only' },
    { value: 'private', label: 'Private' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Customize your learning experience</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <Card className="p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </Card>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3"
          >
            <Card className="p-6">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Full Name"
                      value={settings.name}
                      onChange={(e) => handleSettingChange('name', e.target.value)}
                    />
                    <Input
                      label="Email"
                      type="email"
                      value={settings.email}
                      onChange={(e) => handleSettingChange('email', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                    <textarea
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                      value={settings.bio}
                      onChange={(e) => handleSettingChange('bio', e.target.value)}
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Change Password</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="New password"
                        rightIcon={
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        }
                      />
                      <Input
                        type="password"
                        placeholder="Confirm password"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Notification Preferences</h2>
                  
                  <div className="space-y-4">
                    {[
                      { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive updates via email' },
                      { key: 'pushNotifications', label: 'Push Notifications', desc: 'Browser notifications for important updates' },
                      { key: 'weeklyDigest', label: 'Weekly Digest', desc: 'Summary of your learning progress' },
                      { key: 'lessonReminders', label: 'Lesson Reminders', desc: 'Reminders for scheduled lessons' }
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <h3 className="font-medium text-gray-900">{item.label}</h3>
                          <p className="text-sm text-gray-500">{item.desc}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={settings[item.key]}
                            onChange={(e) => handleSettingChange(item.key, e.target.checked)}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Learning Tab */}
              {activeTab === 'learning' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Learning Preferences</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Daily Learning Goal (minutes)</label>
                      <input
                        type="range"
                        min="10"
                        max="120"
                        value={settings.dailyGoal}
                        onChange={(e) => handleSettingChange('dailyGoal', parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-sm text-gray-500 mt-1">
                        <span>10 min</span>
                        <span className="font-medium text-blue-600">{settings.dailyGoal} min</span>
                        <span>120 min</span>
                      </div>
                    </div>

                    <Select
                      label="Difficulty Level"
                      options={difficultyOptions}
                      value={settings.difficulty}
                      onChange={(value) => handleSettingChange('difficulty', value)}
                    />

                    <Select
                      label="Language"
                      options={languageOptions}
                      value={settings.language}
                      onChange={(value) => handleSettingChange('language', value)}
                    />

                    <Select
                      label="Timezone"
                      options={timezoneOptions}
                      value={settings.timezone}
                      onChange={(value) => handleSettingChange('timezone', value)}
                    />

                    <Select
                      label="Preferred Study Time"
                      options={studyTimeOptions}
                      value={settings.studyTime}
                      onChange={(value) => handleSettingChange('studyTime', value)}
                    />
                  </div>
                </div>
              )}

              {/* Privacy Tab */}
              {activeTab === 'privacy' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Privacy & Data</h2>
                  
                  <div className="space-y-6">
                    <Select
                      label="Profile Visibility"
                      options={visibilityOptions}
                      value={settings.profileVisibility}
                      onChange={(value) => handleSettingChange('profileVisibility', value)}
                    />

                    <div className="space-y-4">
                      {[
                        { key: 'shareProgress', label: 'Share Learning Progress', desc: 'Allow others to see your learning achievements' },
                        { key: 'dataCollection', label: 'Analytics Data Collection', desc: 'Help improve the platform with anonymous usage data' }
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div>
                            <h3 className="font-medium text-gray-900">{item.label}</h3>
                            <p className="text-sm text-gray-500">{item.desc}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={settings[item.key]}
                              onChange={(e) => handleSettingChange(item.key, e.target.checked)}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>

                    <div className="border-t pt-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Data Management</h3>
                      <div className="flex flex-wrap gap-4">
                        <Button
                          variant="outline"
                          onClick={handleExportData}
                          className="flex items-center space-x-2"
                        >
                          <Download className="h-4 w-4" />
                          <span>Export Data</span>
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={handleDeleteAccount}
                          className="flex items-center space-x-2"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Delete Account</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Appearance Tab */}
              {activeTab === 'appearance' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Appearance</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Select
                      label="Theme"
                      options={themeOptions}
                      value={settings.theme}
                      onChange={(value) => handleSettingChange('theme', value)}
                    />

                    <Select
                      label="Font Size"
                      options={fontSizeOptions}
                      value={settings.fontSize}
                      onChange={(value) => handleSettingChange('fontSize', value)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">Animations</h3>
                      <p className="text-sm text-gray-500">Enable smooth animations and transitions</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={settings.animations}
                        onChange={(e) => handleSettingChange('animations', e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="flex justify-end pt-6 border-t">
                <Button onClick={handleSave} className="flex items-center space-x-2">
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 