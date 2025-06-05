import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Newspaper, 
  Clock, 
  TrendingUp, 
  BookOpen, 
  ExternalLink,
  Filter,
  Search,
  Star,
  Bookmark,
  Share2,
  Eye
} from 'lucide-react';
import HubLayout from '@/components/HubLayout';

function NewsPage({ user, onLogout }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', name: 'All News', count: 127 },
    { id: 'ai-ml', name: 'AI & Machine Learning', count: 34 },
    { id: 'programming', name: 'Programming', count: 28 },
    { id: 'research', name: 'Learning Research', count: 19 },
    { id: 'technology', name: 'Technology', count: 31 },
    { id: 'science', name: 'Science', count: 15 },
  ];

  const newsItems = [
    {
      id: 1,
      title: 'OpenAI Releases GPT-5: Revolutionary Advances in Reasoning and Learning',
      description: 'The latest model shows unprecedented capabilities in complex problem-solving and educational applications, with specific improvements for personalized learning.',
      content: 'GPT-5 introduces breakthrough reasoning capabilities that could transform how we approach personalized education...',
      category: 'ai-ml',
      source: 'OpenAI Blog',
      author: 'Sam Altman',
      publishedAt: '2024-01-15T10:30:00Z',
      readTime: 8,
      views: 15420,
      trending: true,
      featured: true,
      tags: ['GPT-5', 'AI Education', 'Machine Learning'],
      imageUrl: '/api/placeholder/600/300',
    },
    {
      id: 2,
      title: 'Meta-Learning: How to Learn How to Learn More Effectively',
      description: 'New research reveals optimal strategies for developing better learning skills and improving knowledge acquisition across domains.',
      content: 'Researchers at Stanford have identified key principles that enable individuals to become more effective learners...',
      category: 'research',
      source: 'Nature Education',
      author: 'Dr. Sarah Chen',
      publishedAt: '2024-01-14T14:20:00Z',
      readTime: 12,
      views: 8732,
      trending: false,
      featured: false,
      tags: ['Meta-learning', 'Cognitive Science', 'Study Techniques'],
    },
    {
      id: 3,
      title: 'React 19 Beta: Concurrent Features and New APIs for Better UX',
      description: 'The React team unveils exciting new features including improved server components and enhanced performance optimizations.',
      content: 'React 19 introduces significant improvements to the developer experience with new concurrent features...',
      category: 'programming',
      source: 'React Blog',
      author: 'React Team',
      publishedAt: '2024-01-14T09:15:00Z',
      readTime: 6,
      views: 12456,
      trending: true,
      featured: false,
      tags: ['React', 'JavaScript', 'Web Development'],
    },
    {
      id: 4,
      title: 'Breakthrough in Quantum Computing: IBM Achieves 1000-Qubit Milestone',
      description: 'IBM announces major breakthrough with their 1000+ qubit quantum processor, opening new possibilities for complex problem solving.',
      content: 'IBM has successfully demonstrated a quantum processor with over 1000 qubits...',
      category: 'technology',
      source: 'IBM Research',
      author: 'Dr. Jay Gambetta',
      publishedAt: '2024-01-13T16:45:00Z',
      readTime: 10,
      views: 23789,
      trending: true,
      featured: true,
      tags: ['Quantum Computing', 'IBM', 'Technology'],
    },
    {
      id: 5,
      title: 'Spaced Repetition Algorithm Improvements Show 40% Better Retention',
      description: 'New adaptive algorithms for spaced repetition systems demonstrate significant improvements in long-term knowledge retention.',
      content: 'Researchers have developed new algorithms that adapt spacing intervals based on individual learning patterns...',
      category: 'research',
      source: 'Cognitive Science Today',
      author: 'Dr. Michael Torres',
      publishedAt: '2024-01-13T11:30:00Z',
      readTime: 7,
      views: 5643,
      trending: false,
      featured: false,
      tags: ['Spaced Repetition', 'Memory', 'Learning Science'],
    },
  ];

  const filteredNews = newsItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <HubLayout user={user} onLogout={onLogout} currentPage="news">
      <div className="content-section">
        {/* Header */}
        <div className="mb-8">
          <h1 className="hub-title mb-2">Learning News Feed</h1>
          <p className="hub-body text-muted-foreground">
            Stay updated with the latest developments in learning, technology, and research
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search news, topics, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="hub-input pl-10"
              />
            </div>
            <button className="btn-ghost">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </button>
          </div>

          {/* Category Tabs */}
          <div className="flex space-x-1 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent text-muted-foreground'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>

        {/* News Grid */}
        <div className="content-grid-3">
          {/* Featured Articles */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {filteredNews.map((article, index) => (
                <motion.article
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`hub-card hover:shadow-lg transition-all duration-200 ${
                    article.featured ? 'ring-2 ring-primary/20' : ''
                  }`}
                >
                  <div className="hub-card-content">
                    {/* Article Meta */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">
                            {categories.find(c => c.id === article.category)?.name || 'General'}
                          </span>
                          {article.trending && (
                            <span className="px-2 py-1 bg-orange-100 text-orange-600 rounded text-xs font-medium flex items-center">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              Trending
                            </span>
                          )}
                          {article.featured && (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-600 rounded text-xs font-medium flex items-center">
                              <Star className="h-3 w-3 mr-1" />
                              Featured
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="btn-icon" title="Bookmark">
                          <Bookmark className="h-4 w-4" />
                        </button>
                        <button className="btn-icon" title="Share">
                          <Share2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Article Content */}
                    <div className="space-y-4">
                      <h2 className="hub-heading hover:text-primary cursor-pointer transition-colors">
                        {article.title}
                      </h2>
                      
                      <p className="hub-body text-muted-foreground">
                        {article.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        {article.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-muted text-muted-foreground rounded text-xs hover:bg-accent transition-colors cursor-pointer"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {/* Article Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div className="flex items-center space-x-4 hub-small text-muted-foreground">
                          <span>{article.source}</span>
                          <span>•</span>
                          <span>{article.author}</span>
                          <span>•</span>
                          <span>{formatTimeAgo(article.publishedAt)}</span>
                        </div>
                        
                        <div className="flex items-center space-x-4 hub-small text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{article.readTime} min read</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye className="h-3 w-3" />
                            <span>{article.views.toLocaleString()}</span>
                          </div>
                          <button className="btn-primary btn-sm">
                            Read More <ExternalLink className="h-3 w-3 ml-1" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-8">
              <button className="btn-secondary">
                Load More Articles
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trending Topics */}
            <div className="hub-card">
              <div className="hub-card-header">
                <h3 className="hub-subheading flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                  Trending Topics
                </h3>
              </div>
              <div className="hub-card-content">
                <div className="space-y-3">
                  {['GPT-5', 'Quantum Computing', 'React 19', 'Meta-Learning', 'Spaced Repetition'].map((topic, index) => (
                    <div key={topic} className="flex items-center justify-between p-2 hover:bg-accent rounded-lg transition-colors cursor-pointer">
                      <span className="hub-caption font-medium">{topic}</span>
                      <span className="hub-small text-muted-foreground">#{index + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Learning Tip */}
            <div className="hub-card bg-primary/5 border-primary/20">
              <div className="hub-card-header">
                <h3 className="hub-subheading text-primary">💡 Learning Tip</h3>
              </div>
              <div className="hub-card-content">
                <p className="hub-body text-primary/80">
                  <strong>Active Reading:</strong> When reading news articles, try to summarize 
                  key points in your own words. This engages active processing and improves retention.
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="hub-card">
              <div className="hub-card-header">
                <h3 className="hub-subheading">Your Reading Stats</h3>
              </div>
              <div className="hub-card-content">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="hub-caption">Articles Read Today</span>
                    <span className="hub-caption font-medium">12</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="hub-caption">Reading Streak</span>
                    <span className="hub-caption font-medium">7 days</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="hub-caption">Favorite Topic</span>
                    <span className="hub-caption font-medium">AI & ML</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="hub-caption">Bookmarks</span>
                    <span className="hub-caption font-medium">23</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </HubLayout>
  );
}

export default NewsPage; 