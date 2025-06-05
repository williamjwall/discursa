import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Target, 
  Award, 
  Calendar,
  BookOpen,
  Brain,
  Zap,
  Users,
  Star,
  ChevronDown,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Progress } from '../components/ui/Progress';
import { Select } from '../components/ui/Select';
import { Tooltip } from '../components/ui/Tooltip';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('learning_time');
  const [isLoading, setIsLoading] = useState(false);

  // Mock analytics data
  const [analytics, setAnalytics] = useState({
    overview: {
      totalLearningTime: '45h 30m',
      coursesCompleted: 3,
      currentStreak: 12,
      averageScore: 87,
      totalLessons: 156,
      certificatesEarned: 5
    },
    weeklyProgress: [
      { day: 'Mon', minutes: 45, lessons: 3, score: 85 },
      { day: 'Tue', minutes: 60, lessons: 4, score: 92 },
      { day: 'Wed', minutes: 30, lessons: 2, score: 78 },
      { day: 'Thu', minutes: 75, lessons: 5, score: 95 },
      { day: 'Fri', minutes: 90, lessons: 6, score: 88 },
      { day: 'Sat', minutes: 120, lessons: 8, score: 91 },
      { day: 'Sun', minutes: 45, lessons: 3, score: 86 }
    ],
    courseProgress: [
      { 
        name: 'Machine Learning Fundamentals', 
        progress: 85, 
        timeSpent: '12h 30m', 
        lastAccessed: '2 hours ago',
        score: 92
      },
      { 
        name: 'Data Science with Python', 
        progress: 60, 
        timeSpent: '8h 15m', 
        lastAccessed: '1 day ago',
        score: 88
      },
      { 
        name: 'Neural Networks Deep Dive', 
        progress: 35, 
        timeSpent: '5h 45m', 
        lastAccessed: '3 days ago',
        score: 85
      }
    ],
    achievements: [
      { 
        title: 'Learning Streak Master', 
        description: '12-day learning streak', 
        icon: Zap, 
        color: 'text-yellow-500',
        earned: '2 days ago'
      },
      { 
        title: 'Quiz Champion', 
        description: 'Scored 95% on 5 consecutive quizzes', 
        icon: Target, 
        color: 'text-green-500',
        earned: '1 week ago'
      },
      { 
        title: 'Course Completionist', 
        description: 'Completed 3 courses this month', 
        icon: Award, 
        color: 'text-purple-500',
        earned: '2 weeks ago'
      }
    ],
    learningPatterns: {
      bestTimeOfDay: 'Morning (9-11 AM)',
      averageSessionLength: '25 minutes',
      preferredDifficulty: 'Intermediate',
      strongestSubjects: ['Machine Learning', 'Data Analysis'],
      improvementAreas: ['Statistics', 'Deep Learning']
    }
  });

  const timeRangeOptions = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 3 months' },
    { value: '1y', label: 'Last year' }
  ];

  const metricOptions = [
    { value: 'learning_time', label: 'Learning Time' },
    { value: 'lessons_completed', label: 'Lessons Completed' },
    { value: 'quiz_scores', label: 'Quiz Scores' },
    { value: 'course_progress', label: 'Course Progress' }
  ];

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleExport = () => {
    // Simulate export functionality
    console.log('Exporting analytics data...');
  };

  const getMetricData = () => {
    switch (selectedMetric) {
      case 'learning_time':
        return analytics.weeklyProgress.map(day => ({ ...day, value: day.minutes }));
      case 'lessons_completed':
        return analytics.weeklyProgress.map(day => ({ ...day, value: day.lessons }));
      case 'quiz_scores':
        return analytics.weeklyProgress.map(day => ({ ...day, value: day.score }));
      default:
        return analytics.weeklyProgress.map(day => ({ ...day, value: day.minutes }));
    }
  };

  const maxValue = Math.max(...getMetricData().map(d => d.value));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Learning Analytics</h1>
              <p className="text-gray-600">Track your progress and insights</p>
            </div>
            <div className="flex items-center space-x-4">
              <Select
                options={timeRangeOptions}
                value={timeRange}
                onChange={setTimeRange}
                className="w-40"
              />
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={isLoading}
                className="flex items-center space-x-2"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </Button>
              <Button
                variant="outline"
                onClick={handleExport}
                className="flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Export</span>
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Overview Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8"
        >
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Learning Time</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.overview.totalLearningTime}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Courses Completed</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.overview.coursesCompleted}</p>
              </div>
              <BookOpen className="h-8 w-8 text-green-500" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Current Streak</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.overview.currentStreak} days</p>
              </div>
              <Zap className="h-8 w-8 text-yellow-500" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Average Score</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.overview.averageScore}%</p>
              </div>
              <Target className="h-8 w-8 text-purple-500" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Lessons</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.overview.totalLessons}</p>
              </div>
              <Brain className="h-8 w-8 text-indigo-500" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Certificates</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.overview.certificatesEarned}</p>
              </div>
              <Award className="h-8 w-8 text-orange-500" />
            </div>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Weekly Progress</h3>
                <Select
                  options={metricOptions}
                  value={selectedMetric}
                  onChange={setSelectedMetric}
                  className="w-48"
                />
              </div>

              {/* Simple Bar Chart */}
              <div className="space-y-4">
                {getMetricData().map((day, index) => (
                  <div key={day.day} className="flex items-center space-x-4">
                    <div className="w-12 text-sm text-gray-600">{day.day}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div className="h-6 bg-gray-200 rounded-full flex-1 mr-4">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(day.value / maxValue) * 100}%` }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900 w-16 text-right">
                          {selectedMetric === 'learning_time' ? `${day.value}m` : 
                           selectedMetric === 'quiz_scores' ? `${day.value}%` : day.value}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Recent Achievements */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Achievements</h3>
              <div className="space-y-4">
                {analytics.achievements.map((achievement, index) => {
                  const Icon = achievement.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start space-x-3"
                    >
                      <div className={`p-2 rounded-lg bg-gray-100 ${achievement.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{achievement.title}</h4>
                        <p className="text-sm text-gray-600">{achievement.description}</p>
                        <p className="text-xs text-gray-500 mt-1">{achievement.earned}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </Card>

            {/* Learning Patterns */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Learning Insights</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Best Time of Day</h4>
                  <p className="text-sm text-gray-600">{analytics.learningPatterns.bestTimeOfDay}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Average Session</h4>
                  <p className="text-sm text-gray-600">{analytics.learningPatterns.averageSessionLength}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Preferred Difficulty</h4>
                  <p className="text-sm text-gray-600">{analytics.learningPatterns.preferredDifficulty}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Strongest Subjects</h4>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {analytics.learningPatterns.strongestSubjects.map((subject, index) => (
                      <Badge key={index} variant="success" size="sm">
                        {subject}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Areas for Improvement</h4>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {analytics.learningPatterns.improvementAreas.map((area, index) => (
                      <Badge key={index} variant="warning" size="sm">
                        {area}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Course Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8"
        >
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-6">Course Progress</h3>
            <div className="space-y-6">
              {analytics.courseProgress.map((course, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{course.name}</h4>
                      <div className="flex items-center space-x-4">
                        <Badge variant="primary" size="sm">
                          {course.score}% avg
                        </Badge>
                        <span className="text-sm text-gray-500">{course.timeSpent}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <Progress value={course.progress} className="h-2" />
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-12">
                        {course.progress}%
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Last accessed: {course.lastAccessed}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics; 