import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  BookOpen, 
  Brain, 
  CheckCircle, 
  AlertCircle,
  Filter,
  TrendingUp,
  Zap,
  Target,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { Skeleton, SkeletonCard } from '@/components/ui/Skeleton';
import { userAPI } from '@/lib/api';
import { formatTime, formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

const LessonCard = ({ lesson, index }) => {
  const isNew = lesson.type === 'new';
  const isOverdue = lesson.days_overdue > 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card className={`
        card-hover overflow-hidden
        ${isOverdue ? 'border-yellow-300 bg-yellow-50/50' : ''}
      `}>
        <div className={`
          h-1 w-full
          ${isNew ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 
            isOverdue ? 'bg-yellow-500' : 'bg-green-500'}
        `} />
        
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start space-x-4">
              <div className={`
                w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0
                ${isNew ? 'bg-blue-100 text-blue-600' : 
                  isOverdue ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'}
              `}>
                {isNew ? <BookOpen className="h-6 w-6" /> : <Brain className="h-6 w-6" />}
              </div>
              
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">
                  {lesson.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  {lesson.module_title}
                </p>
                
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <Badge variant={isNew ? 'primary' : 'success'} size="sm">
                    {isNew ? 'New Lesson' : `Review #${lesson.repetition}`}
                  </Badge>
                  
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-4 w-4 mr-1" />
                    {formatTime(lesson.estimated_time)}
                  </div>
                  
                  {lesson.easiness_factor && (
                    <div className="flex items-center text-gray-600">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      Difficulty: {(5 - lesson.easiness_factor).toFixed(1)}/5
                    </div>
                  )}
                  
                  {isOverdue && (
                    <Badge variant="warning" size="sm">
                      {lesson.days_overdue} day{lesson.days_overdue !== 1 ? 's' : ''} overdue
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            <Link to={`/lesson/${lesson.lesson_id}`}>
              <Button size="sm" variant={isNew ? 'gradient' : 'outline'}>
                {isNew ? 'Start' : 'Review'}
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
          
          {lesson.last_reviewed && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                Last reviewed: {formatDate(lesson.last_reviewed)}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

const EmptyState = ({ type }) => {
  const configs = {
    all: {
      icon: Calendar,
      title: "No lessons scheduled",
      description: "You're all caught up! Create a new course to continue learning.",
      action: { label: "Create Course", link: "/create" }
    },
    today: {
      icon: CheckCircle,
      title: "All done for today!",
      description: "Great job completing today's lessons. Come back tomorrow for more.",
      action: null
    },
    overdue: {
      icon: Zap,
      title: "No overdue lessons",
      description: "You're on top of your reviews. Keep up the great work!",
      action: null
    }
  };
  
  const config = configs[type];
  const Icon = config.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-12"
    >
      <Icon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {config.title}
      </h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        {config.description}
      </p>
      {config.action && (
        <Link to={config.action.link}>
          <Button variant="gradient">
            {config.action.label}
          </Button>
        </Link>
      )}
    </motion.div>
  );
};

function LearningFeed({ user }) {
  const [dailyFeed, setDailyFeed] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [filter, setFilter] = useState('all'); // all, new, review

  useEffect(() => {
    const fetchDailyFeed = async () => {
      try {
        const data = await userAPI.getDailyFeed(user.email);
        setDailyFeed(data);
      } catch (error) {
        toast.error('Failed to load learning feed');
        console.error('Feed error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDailyFeed();
  }, [user.email]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-10 w-64 mb-8" />
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <SkeletonCard key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const allLessons = [
    ...(dailyFeed?.daily_lessons || []),
    ...(dailyFeed?.overdue_lessons || [])
  ].sort((a, b) => {
    if (a.days_overdue > 0 && b.days_overdue === 0) return -1;
    if (a.days_overdue === 0 && b.days_overdue > 0) return 1;
    return 0;
  });

  const todayLessons = dailyFeed?.daily_lessons || [];
  const overdueLessons = dailyFeed?.overdue_lessons || [];

  const filteredLessons = {
    all: allLessons,
    today: todayLessons,
    overdue: overdueLessons
  }[activeTab].filter(lesson => {
    if (filter === 'all') return true;
    if (filter === 'new') return lesson.type === 'new';
    if (filter === 'review') return lesson.type === 'review';
    return true;
  });

  const stats = dailyFeed?.statistics || {};

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Your Learning Feed
            </h1>
            <p className="text-xl text-gray-600">
              {dailyFeed?.greeting || `Ready for today's learning session?`}
            </p>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {todayLessons.length}
                    </p>
                    <p className="text-sm text-gray-600">Today's Lessons</p>
                  </div>
                  <Calendar className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {overdueLessons.length}
                    </p>
                    <p className="text-sm text-gray-600">Overdue</p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.current_streak || 0}
                    </p>
                    <p className="text-sm text-gray-600">Day Streak</p>
                  </div>
                  <Zap className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatTime(dailyFeed?.total_study_time || 0)}
                    </p>
                    <p className="text-sm text-gray-600">Study Time</p>
                  </div>
                  <Clock className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Tabs and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
                <TabsList>
                  <TabsTrigger value="all">
                    All ({allLessons.length})
                  </TabsTrigger>
                  <TabsTrigger value="today">
                    Today ({todayLessons.length})
                  </TabsTrigger>
                  <TabsTrigger value="overdue">
                    Overdue ({overdueLessons.length})
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-600" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="all">All Types</option>
                  <option value="new">New Lessons</option>
                  <option value="review">Reviews</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Lessons List */}
          <AnimatePresence mode="wait">
            {filteredLessons.length > 0 ? (
              <motion.div
                key={`${activeTab}-${filter}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {filteredLessons.map((lesson, index) => (
                  <LessonCard key={lesson.lesson_id} lesson={lesson} index={index} />
                ))}
              </motion.div>
            ) : (
              <EmptyState type={activeTab} />
            )}
          </AnimatePresence>

          {/* Motivational Footer */}
          {stats.current_streak >= 3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8"
            >
              <Card className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                <CardContent className="p-6 text-center">
                  <Zap className="h-12 w-12 mx-auto mb-3" />
                  <h3 className="text-xl font-bold mb-2">
                    {stats.current_streak} Day Streak! 🔥
                  </h3>
                  <p className="text-blue-100">
                    You're on fire! Keep up the amazing work and maintain your learning momentum.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LearningFeed; 