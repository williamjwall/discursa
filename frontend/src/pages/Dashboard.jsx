import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, X, ChevronRight, Circle, Brain, Clock, Layers, TrendingUp, Library, Database, Shield, Infinity, ArrowRight } from 'lucide-react';
import CourseContent from '../components/CourseContent';

function Dashboard({ user, onLogout, onTopicSelect, topics, setTopics }) {
  const [view, setView] = useState('topics'); // 'topics' or 'content'
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newTopicName, setNewTopicName] = useState('');

  const createNewTopic = () => {
    if (newTopicName.trim()) {
      const newTopic = {
        id: Date.now(),
        name: newTopicName,
        progress: 0,
        lastAccessed: 'Just now',
        totalSections: '∞',
        completedSections: 0,
        exploredDepth: 'Surface',
        difficulty: 'Assessing...',
        estimatedTime: 'Infinite',
        retentionScore: 0,
        nextReview: 'After first session',
        cognitiveLoad: 'Unknown',
        learningPath: 'Generating optimal path...',
        keyInsight: 'To be discovered',
        academicSources: {
          primary: 0,
          secondary: 0,
          tertiary: 0
        },
        databases: ['Searching...'],
        verificationStatus: 'Pending Verification'
      };
      setTopics([newTopic, ...topics]);
      setNewTopicName('');
      setIsCreating(false);
      // Immediately open the new topic
      onTopicSelect(newTopic);
    }
  };

  const openTopic = (topic) => {
    setSelectedTopic(topic);
    setView('content');
  };

  const filteredTopics = topics.filter(topic => 
    topic.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get recent and recommended topics
  const recentTopics = [...topics].sort((a, b) => {
    const timeA = new Date(a.lastAccessed).getTime();
    const timeB = new Date(b.lastAccessed).getTime();
    return timeB - timeA;
  }).slice(0, 3);

  const needsReview = topics.filter(t => t.nextReview === 'Overdue' || t.nextReview === 'Tomorrow');

  // Cognitive load indicator
  const getCognitiveLoadColor = (load) => {
    switch(load) {
      case 'Low': return '#4ade80';
      case 'Medium': return '#fbbf24';
      case 'High': return '#fb923c';
      case 'Very High': return '#f87171';
      default: return 'var(--dim)';
    }
  };

  // Verification status color
  const getVerificationColor = (status) => {
    switch(status) {
      case 'Fully Verified': return '#4ade80';
      case 'Peer Reviewed': return '#60a5fa';
      case 'Cross-Referenced': return '#fbbf24';
      case 'Verified': return '#a78bfa';
      default: return 'var(--dim)';
    }
  };

  if (view === 'content' && selectedTopic) {
    return (
      <CourseContent 
        topic={selectedTopic} 
        onBack={() => setView('topics')}
      />
    );
  }

  return (
    <div className="container">
      {/* Header */}
      <div className="mb-8">
        <h1 className="title mb-2">Welcome back to your Learning Hub</h1>
        <p className="body">Continue your infinite journey through knowledge</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-3 mb-8">
        <motion.div 
          className="card cursor-pointer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center space-x-2 mb-2">
            <Brain className="w-4 h-4" />
            <span className="small">Active Threads</span>
          </div>
          <p className="heading">{topics.filter(t => t.completedSections > 0).length}</p>
          <p className="tiny mt-2">
            {topics.reduce((acc, t) => acc + t.completedSections, 0)} total sections
          </p>
        </motion.div>

        <motion.div 
          className="card cursor-pointer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center space-x-2 mb-2">
            <Database className="w-4 h-4" />
            <span className="small">Knowledge Base</span>
          </div>
          <p className="heading">
            {topics.reduce((acc, t) => 
              acc + t.academicSources.primary + t.academicSources.secondary + t.academicSources.tertiary, 0
            )}
          </p>
          <p className="tiny mt-2">verified sources</p>
        </motion.div>

        <motion.div 
          className="card cursor-pointer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="w-4 h-4" />
            <span className="small">Avg Retention</span>
          </div>
          <p className="heading">
            {Math.round(topics.reduce((acc, t) => acc + t.retentionScore, 0) / topics.length)}%
          </p>
          <p className="tiny mt-2">across all threads</p>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-2 mb-8" style={{ gap: '1rem' }}>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsCreating(true)}
          className="card cursor-pointer"
          style={{ padding: '2rem' }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="heading mb-2">Start New Thread</h3>
              <p className="small">Begin exploring a new domain of knowledge</p>
            </div>
            <Plus className="w-8 h-8" />
          </div>
        </motion.button>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="card cursor-pointer"
          style={{ 
            padding: '2rem',
            borderColor: needsReview.length > 0 ? '#fbbf24' : 'var(--border)'
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="heading mb-2">Review Queue</h3>
              <p className="small">{needsReview.length} threads need review</p>
            </div>
            <Clock className="w-8 h-8" style={{ 
              color: needsReview.length > 0 ? '#fbbf24' : 'var(--fg)' 
            }} />
          </div>
        </motion.div>
      </div>

      {/* Create New Topic Inline */}
      <AnimatePresence>
        {isCreating && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8"
          >
            <div className="card" style={{ padding: '2rem' }}>
              <h3 className="heading mb-4">Create New Learning Thread</h3>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="What would you like to explore? (e.g., 'Quantum Mechanics', 'Renaissance Art')"
                  value={newTopicName}
                  onChange={(e) => setNewTopicName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && createNewTopic()}
                  className="flex-1 px-4 py-3 bg-transparent border text-white placeholder-gray-500 focus:outline-none focus:border-white"
                  style={{
                    background: 'var(--bg)',
                    borderColor: 'var(--border)',
                    color: 'var(--fg)'
                  }}
                  autoFocus
                />
                <button onClick={createNewTopic} className="btn btn-primary">
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button onClick={() => setIsCreating(false)} className="btn">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="tiny mt-4">
                The system will generate an infinite learning thread with academically verified content
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recent Threads */}
      {recentTopics.length > 0 && (
        <div className="mb-8">
          <h2 className="heading mb-4">Continue Learning</h2>
          <div className="grid grid-3" style={{ gap: '1rem' }}>
            {recentTopics.map((topic) => (
              <motion.div
                key={topic.id}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onTopicSelect(topic)}
                className="card cursor-pointer"
              >
                <h3 className="body mb-2">{topic.name}</h3>
                <p className="tiny mb-4" style={{ 
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical'
                }}>
                  {topic.keyInsight}
                </p>
                
                <div className="flex items-center justify-between mb-3">
                  <span className="tiny">{topic.exploredDepth}</span>
                  <span className="tiny">{topic.completedSections} sections</span>
                </div>
                
                <div className="progress mb-3">
                  <motion.div 
                    className="progress-fill" 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(topic.progress * 5, 100)}%` }}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="tiny opacity-50">{topic.lastAccessed}</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* All Threads */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="heading">All Learning Threads</h2>
          <div className="relative" style={{ width: '300px' }}>
            <input
              type="text"
              placeholder="Search threads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 bg-transparent border text-sm"
              style={{
                borderColor: 'var(--border)',
                color: 'var(--fg)'
              }}
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 opacity-50" />
          </div>
        </div>

        <div className="space-y-4">
          <AnimatePresence>
            {filteredTopics.map((topic, index) => (
              <motion.div
                key={topic.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ x: 4 }}
                onClick={() => onTopicSelect(topic)}
                className="card cursor-pointer"
                style={{ padding: '1.5rem' }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-2">
                      <h3 className="body">{topic.name}</h3>
                      <span className="tiny" style={{ 
                        padding: '0.25rem 0.5rem',
                        border: '1px solid',
                        borderColor: topic.verificationStatus === 'Fully Verified' ? '#4ade80' : 'var(--border)'
                      }}>
                        {topic.verificationStatus}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-6 mt-2">
                      <span className="tiny">
                        <Infinity className="w-3 h-3 inline mr-1" />
                        {topic.completedSections} explored
                      </span>
                      <span className="tiny">
                        <Brain className="w-3 h-3 inline mr-1" />
                        {topic.retentionScore}% retention
                      </span>
                      <span className="tiny">
                        <Clock className="w-3 h-3 inline mr-1" />
                        {topic.nextReview}
                      </span>
                      <span className="tiny">
                        <Layers className="w-3 h-3 inline mr-1" />
                        {topic.cognitiveLoad}
                      </span>
                    </div>
                  </div>
                  
                  <ChevronRight className="w-5 h-5 ml-4" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredTopics.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-8"
          >
            <Circle className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="body mb-4">No threads found</p>
            <p className="small">Try a different search or create a new thread</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default Dashboard; 