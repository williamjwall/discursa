import React, { useState, useEffect } from 'react';
import Dashboard from './pages/Dashboard';
import CourseContent from './components/CourseContent';
import HubLayout from './components/HubLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, TrendingUp, Clock, Compass, Settings as SettingsIcon, ChevronRight } from 'lucide-react';

function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [topics, setTopics] = useState([
    {
      id: 1,
      name: 'Presocratic Philosophy',
      progress: 12,
      lastAccessed: '2 hours ago',
      totalSections: '∞',
      completedSections: 12,
      exploredDepth: 'Level 3',
      difficulty: 'Advanced',
      estimatedTime: 'Infinite',
      retentionScore: 82,
      nextReview: 'Tomorrow',
      cognitiveLoad: 'High',
      learningPath: 'Historical Context → Milesian School → Eleatics → Pluralists → Atomists',
      keyInsight: 'The transition from mythos to logos in ancient Greek thought',
      academicSources: { primary: 42, secondary: 156, tertiary: 89 },
      databases: ['JSTOR', 'PhilPapers', 'Perseus Digital Library'],
      verificationStatus: 'Fully Verified'
    },
    {
      id: 2,
      name: 'Neurolinguistics',
      progress: 8,
      lastAccessed: '1 day ago',
      totalSections: '∞',
      completedSections: 10,
      exploredDepth: 'Level 2',
      difficulty: 'Expert',
      estimatedTime: 'Infinite',
      retentionScore: 75,
      nextReview: 'In 3 days',
      cognitiveLoad: 'Very High',
      learningPath: 'Neuroanatomy → Language Networks → Processing Models → Clinical Applications',
      keyInsight: 'How neural networks encode and process linguistic information',
      academicSources: { primary: 89, secondary: 234, tertiary: 45 },
      databases: ['PubMed', 'ScienceDirect', 'Nature Neuroscience'],
      verificationStatus: 'Peer Reviewed'
    },
    {
      id: 3,
      name: "1930's Mexican Economy",
      progress: 15,
      lastAccessed: '3 days ago',
      totalSections: '∞',
      completedSections: 13,
      exploredDepth: 'Level 4',
      difficulty: 'Intermediate',
      estimatedTime: 'Infinite',
      retentionScore: 90,
      nextReview: 'Next week',
      cognitiveLoad: 'Medium',
      learningPath: 'Post-Revolution → Cárdenas Era → Oil Nationalization → Economic Transformation',
      keyInsight: 'The transformation from hacienda system to state-led industrialization',
      academicSources: { primary: 67, secondary: 123, tertiary: 34 },
      databases: ['JSTOR', 'Project MUSE', 'Hispanic American Historical Review'],
      verificationStatus: 'Cross-Referenced'
    },
    {
      id: 4,
      name: 'History of Cricket',
      progress: 5,
      lastAccessed: '1 week ago',
      totalSections: '∞',
      completedSections: 5,
      exploredDepth: 'Level 1',
      difficulty: 'Beginner',
      estimatedTime: 'Infinite',
      retentionScore: 68,
      nextReview: 'Overdue',
      cognitiveLoad: 'Low',
      learningPath: 'Origins → Codification → Imperial Spread → Modern Evolution',
      keyInsight: 'Cricket as a lens for understanding British colonialism and cultural exchange',
      academicSources: { primary: 34, secondary: 89, tertiary: 56 },
      databases: ['Oxford Academic', 'Cambridge Core', 'Sport History Review'],
      verificationStatus: 'Verified'
    }
  ]);

  // Auto-login for development
  useEffect(() => {
    setUser({ id: 1, name: 'Learner', email: 'learner@example.com' });
  }, []);

  const handleLogout = () => {
    setUser(null);
    setCurrentView('dashboard');
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
    if (view !== 'thread') {
      setSelectedTopic(null);
    }
  };

  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
    setCurrentView('thread');
  };

  const handleNewTopic = () => {
    setCurrentView('dashboard');
    // This would trigger the new topic creation in Dashboard
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard 
            user={user} 
            onLogout={handleLogout}
            onTopicSelect={handleTopicSelect}
            topics={topics}
            setTopics={setTopics}
          />
        );
      
      case 'explore':
        return <ExploreView topics={topics} onTopicSelect={handleTopicSelect} />;
      
      case 'active':
        return <ActiveThreadsView topics={topics} onTopicSelect={handleTopicSelect} />;
      
      case 'review':
        return <ReviewView topics={topics} onTopicSelect={handleTopicSelect} />;
      
      case 'analytics':
        return <AnalyticsView topics={topics} />;
      
      case 'thread':
        return selectedTopic ? (
          <CourseContent 
            topic={selectedTopic} 
            onBack={() => handleViewChange('dashboard')}
          />
        ) : (
          <div className="container">
            <p>No topic selected</p>
          </div>
        );
      
      case 'settings':
        return <SettingsView user={user} onLogout={handleLogout} />;
      
      default:
        return <Dashboard user={user} onLogout={handleLogout} onTopicSelect={handleTopicSelect} />;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <div className="text-center">
          <h1 className="title mb-4">Academic Learning Hub</h1>
          <p className="body">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <HubLayout 
      currentView={currentView} 
      onViewChange={handleViewChange}
      topics={topics}
      onNewTopic={handleNewTopic}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentView}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderView()}
        </motion.div>
      </AnimatePresence>
    </HubLayout>
  );
}

// Explore View Component
function ExploreView({ topics, onTopicSelect }) {
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <div className="container">
      <div className="mb-8">
        <h1 className="title mb-4">Explore Knowledge</h1>
        <p className="body mb-8">Discover new infinite learning threads across all domains of human knowledge.</p>
        
        <div className="relative mb-8">
          <input
            type="text"
            placeholder="Search all knowledge domains..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 bg-transparent border"
            style={{
              borderColor: 'var(--border)',
              color: 'var(--fg)'
            }}
          />
          <Compass className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 opacity-50" />
        </div>

        <div className="grid grid-3 mb-8">
          <div className="card cursor-pointer" onClick={() => {}}>
            <h3 className="heading mb-2">Philosophy</h3>
            <p className="small">Ancient to Contemporary</p>
            <p className="tiny mt-2">2,341 threads</p>
          </div>
          <div className="card cursor-pointer" onClick={() => {}}>
            <h3 className="heading mb-2">Sciences</h3>
            <p className="small">Natural & Formal</p>
            <p className="tiny mt-2">5,892 threads</p>
          </div>
          <div className="card cursor-pointer" onClick={() => {}}>
            <h3 className="heading mb-2">History</h3>
            <p className="small">Global Perspectives</p>
            <p className="tiny mt-2">3,456 threads</p>
          </div>
        </div>

        <h2 className="heading mb-4">Suggested Threads</h2>
        <div className="space-y-4">
          {topics.map((topic) => (
            <motion.div
              key={topic.id}
              whileHover={{ x: 4 }}
              onClick={() => onTopicSelect(topic)}
              className="card cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="heading">{topic.name}</h3>
                  <p className="small mt-2">{topic.keyInsight}</p>
                </div>
                <ChevronRight className="w-5 h-5" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Active Threads View
function ActiveThreadsView({ topics, onTopicSelect }) {
  const activeTopics = topics.filter(t => t.completedSections > 0);
  
  return (
    <div className="container">
      <h1 className="title mb-8">Active Learning Threads</h1>
      
      <div className="grid grid-2 mb-8">
        <div className="card">
          <div className="flex items-center space-x-2 mb-2">
            <Brain className="w-4 h-4" />
            <span className="small">Active Threads</span>
          </div>
          <p className="heading">{activeTopics.length}</p>
        </div>
        <div className="card">
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="w-4 h-4" />
            <span className="small">Total Sections</span>
          </div>
          <p className="heading">
            {activeTopics.reduce((acc, t) => acc + t.completedSections, 0)}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {activeTopics.map((topic) => (
          <motion.div
            key={topic.id}
            whileHover={{ x: 4 }}
            onClick={() => onTopicSelect(topic)}
            className="card cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="heading">{topic.name}</h3>
              <span className="small">{topic.exploredDepth}</span>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between small mb-2">
                <span>Progress</span>
                <span>{topic.completedSections} sections</span>
              </div>
              <div className="progress">
                <motion.div 
                  className="progress-fill" 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(topic.progress * 5, 100)}%` }}
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="tiny">Last: {topic.lastAccessed}</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Review View
function ReviewView({ topics, onTopicSelect }) {
  const needsReview = topics.filter(t => t.nextReview === 'Overdue' || t.nextReview === 'Tomorrow');
  
  return (
    <div className="container">
      <h1 className="title mb-8">Spaced Review</h1>
      <p className="body mb-8">Strengthen your neural pathways through scientifically-timed review.</p>
      
      <div className="grid grid-3 mb-8">
        <div className="card">
          <p className="small mb-2">Due Today</p>
          <p className="heading">{needsReview.filter(t => t.nextReview === 'Tomorrow').length}</p>
        </div>
        <div className="card">
          <p className="small mb-2">Overdue</p>
          <p className="heading">{needsReview.filter(t => t.nextReview === 'Overdue').length}</p>
        </div>
        <div className="card">
          <p className="small mb-2">Avg Retention</p>
          <p className="heading">
            {Math.round(topics.reduce((acc, t) => acc + t.retentionScore, 0) / topics.length)}%
          </p>
        </div>
      </div>

      <h2 className="heading mb-4">Review Queue</h2>
      <div className="space-y-4">
        {needsReview.map((topic) => (
          <motion.div
            key={topic.id}
            whileHover={{ x: 4 }}
            onClick={() => onTopicSelect(topic)}
            className="card cursor-pointer"
            style={{
              borderColor: topic.nextReview === 'Overdue' ? '#f87171' : 'var(--border)'
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="heading">{topic.name}</h3>
                <p className="small mt-2">Retention: {topic.retentionScore}%</p>
              </div>
              <div className="text-right">
                <p className="small" style={{
                  color: topic.nextReview === 'Overdue' ? '#f87171' : 'var(--fg)'
                }}>
                  {topic.nextReview}
                </p>
                <ChevronRight className="w-4 h-4 mt-2" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Analytics View
function AnalyticsView({ topics }) {
  return (
    <div className="container">
      <h1 className="title mb-8">Learning Analytics</h1>
      
      <div className="grid grid-3 mb-8">
        <div className="card">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="w-4 h-4" />
            <span className="small">Learning Velocity</span>
          </div>
          <p className="heading">+23%</p>
          <p className="tiny mt-2">vs last month</p>
        </div>
        <div className="card">
          <p className="small mb-2">Total Sources</p>
          <p className="heading">
            {topics.reduce((acc, t) => 
              acc + t.academicSources.primary + t.academicSources.secondary + t.academicSources.tertiary, 0
            )}
          </p>
        </div>
        <div className="card">
          <p className="small mb-2">Knowledge Depth</p>
          <p className="heading">Level 3.2</p>
          <p className="tiny mt-2">Average across threads</p>
        </div>
      </div>

      <h2 className="heading mb-4">Thread Performance</h2>
      <div className="space-y-4">
        {topics.map((topic) => (
          <div key={topic.id} className="card">
            <h3 className="body mb-4">{topic.name}</h3>
            <div className="grid grid-3" style={{ gap: '2rem' }}>
              <div>
                <p className="tiny mb-1">RETENTION</p>
                <p className="small">{topic.retentionScore}%</p>
              </div>
              <div>
                <p className="tiny mb-1">DEPTH</p>
                <p className="small">{topic.exploredDepth}</p>
              </div>
              <div>
                <p className="tiny mb-1">SECTIONS</p>
                <p className="small">{topic.completedSections}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Settings View
function SettingsView({ user, onLogout }) {
  return (
    <div className="container">
      <h1 className="title mb-8">Settings</h1>
      
      <div className="space-y-8">
        <div className="card">
          <h2 className="heading mb-4">Profile</h2>
          <div className="space-y-4">
            <div>
              <p className="small mb-2">Name</p>
              <p className="body">{user?.name || 'Learner'}</p>
            </div>
            <div>
              <p className="small mb-2">Email</p>
              <p className="body">{user?.email || 'learner@example.com'}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="heading mb-4">Learning Preferences</h2>
          <div className="space-y-4">
            <div>
              <p className="small mb-2">Default Cognitive Load</p>
              <select className="w-full p-2 bg-transparent border" style={{ borderColor: 'var(--border)', color: 'var(--fg)' }}>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Very High</option>
              </select>
            </div>
            <div>
              <p className="small mb-2">Review Frequency</p>
              <select className="w-full p-2 bg-transparent border" style={{ borderColor: 'var(--border)', color: 'var(--fg)' }}>
                <option>Daily</option>
                <option>Every 3 days</option>
                <option>Weekly</option>
              </select>
            </div>
          </div>
        </div>

        <button onClick={onLogout} className="btn btn-primary">
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default App; 