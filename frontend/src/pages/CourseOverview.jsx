import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Play, 
  Clock, 
  BookOpen, 
  Trophy, 
  Star, 
  Users, 
  Calendar,
  CheckCircle,
  Circle,
  Lock,
  Download,
  Share2,
  Heart,
  MessageCircle,
  BarChart3,
  Target,
  Zap,
  Award,
  TrendingUp,
  ChevronRight,
  Filter,
  Search
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Progress } from '../components/ui/Progress';
import { Tabs } from '../components/ui/Tabs';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Tooltip } from '../components/ui/Tooltip';

const CourseOverview = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  // Mock course data
  const [course, setCourse] = useState({
    id: courseId,
    title: 'Advanced Machine Learning Fundamentals',
    description: 'Master the core concepts of machine learning with hands-on projects and real-world applications. This comprehensive course covers supervised learning, unsupervised learning, neural networks, and deep learning techniques.',
    instructor: 'Dr. Sarah Chen',
    instructorAvatar: '/api/placeholder/40/40',
    instructorBio: 'PhD in Computer Science, 10+ years in ML research',
    rating: 4.8,
    reviewCount: 1247,
    studentCount: 15420,
    duration: '8 weeks',
    level: 'Advanced',
    language: 'English',
    lastUpdated: '2024-01-15',
    price: 149,
    originalPrice: 199,
    tags: ['Machine Learning', 'Python', 'Data Science', 'AI'],
    thumbnail: '/api/placeholder/800/400',
    progress: 35,
    completedLessons: 12,
    totalLessons: 34,
    estimatedTime: '45 hours',
    certificate: true,
    downloadable: true,
    lifetime: true,
    mobile: true
  });

  const [lessons, setLessons] = useState([
    {
      id: 1,
      title: 'Introduction to Machine Learning',
      description: 'Overview of ML concepts and applications',
      duration: '15 min',
      type: 'video',
      status: 'completed',
      locked: false,
      quiz: true,
      resources: 3
    },
    {
      id: 2,
      title: 'Setting Up Your Environment',
      description: 'Installing Python, Jupyter, and ML libraries',
      duration: '20 min',
      type: 'video',
      status: 'completed',
      locked: false,
      quiz: false,
      resources: 5
    },
    {
      id: 3,
      title: 'Data Preprocessing Techniques',
      description: 'Cleaning and preparing data for ML models',
      duration: '25 min',
      type: 'video',
      status: 'current',
      locked: false,
      quiz: true,
      resources: 4
    },
    {
      id: 4,
      title: 'Linear Regression Deep Dive',
      description: 'Understanding and implementing linear regression',
      duration: '30 min',
      type: 'video',
      status: 'locked',
      locked: true,
      quiz: true,
      resources: 6
    },
    {
      id: 5,
      title: 'Classification Algorithms',
      description: 'Logistic regression, SVM, and decision trees',
      duration: '35 min',
      type: 'video',
      status: 'locked',
      locked: true,
      quiz: true,
      resources: 8
    }
  ]);

  const [stats, setStats] = useState({
    timeSpent: '12h 30m',
    streak: 7,
    quizScore: 85,
    rank: 156,
    certificates: 2,
    achievements: 8
  });

  const [reviews, setReviews] = useState([
    {
      id: 1,
      user: 'Alex Johnson',
      avatar: '/api/placeholder/32/32',
      rating: 5,
      date: '2024-01-10',
      comment: 'Excellent course! The explanations are clear and the projects are very practical.'
    },
    {
      id: 2,
      user: 'Maria Garcia',
      avatar: '/api/placeholder/32/32',
      rating: 4,
      date: '2024-01-08',
      comment: 'Great content, but could use more advanced examples in some sections.'
    }
  ]);

  const handleEnroll = () => {
    setIsEnrolled(true);
    // Simulate API call
  };

  const handleStartLesson = (lessonId) => {
    navigate(`/lesson/${lessonId}`);
  };

  const handleToggleFavorite = () => {
    setIsFavorited(!isFavorited);
  };

  const filteredLessons = lessons.filter(lesson => {
    const matchesSearch = lesson.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || lesson.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const filterOptions = [
    { value: 'all', label: 'All Lessons' },
    { value: 'completed', label: 'Completed' },
    { value: 'current', label: 'In Progress' },
    { value: 'locked', label: 'Locked' }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'current':
        return <Play className="h-5 w-5 text-blue-500" />;
      case 'locked':
        return <Lock className="h-5 w-5 text-gray-400" />;
      default:
        return <Circle className="h-5 w-5 text-gray-300" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'current':
        return 'primary';
      case 'locked':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center space-x-2 mb-4">
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    {course.level}
                  </Badge>
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    {course.language}
                  </Badge>
                </div>
                
                <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
                <p className="text-xl text-blue-100 mb-6">{course.description}</p>
                
                <div className="flex items-center space-x-6 text-sm">
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span>{course.rating}</span>
                    <span className="text-blue-200">({course.reviewCount} reviews)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span>{course.studentCount.toLocaleString()} students</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>{course.estimatedTime}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4 mt-6">
                  <img
                    src={course.instructorAvatar}
                    alt={course.instructor}
                    className="w-12 h-12 rounded-full border-2 border-white/20"
                  />
                  <div>
                    <p className="font-medium">{course.instructor}</p>
                    <p className="text-sm text-blue-200">{course.instructorBio}</p>
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20">
                {isEnrolled ? (
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white mb-2">
                        {course.progress}%
                      </div>
                      <p className="text-blue-200 mb-4">Course Progress</p>
                      <Progress value={course.progress} className="mb-4" />
                      <p className="text-sm text-blue-200">
                        {course.completedLessons} of {course.totalLessons} lessons completed
                      </p>
                    </div>
                    
                    <Button 
                      className="w-full bg-white text-blue-600 hover:bg-blue-50"
                      onClick={() => handleStartLesson(3)}
                    >
                      Continue Learning
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white mb-2">
                        ${course.price}
                      </div>
                      {course.originalPrice > course.price && (
                        <p className="text-blue-200 line-through">
                          ${course.originalPrice}
                        </p>
                      )}
                    </div>
                    
                    <Button 
                      className="w-full bg-white text-blue-600 hover:bg-blue-50"
                      onClick={handleEnroll}
                    >
                      Enroll Now
                    </Button>
                    
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 border-white/20 text-white hover:bg-white/10"
                        onClick={handleToggleFavorite}
                      >
                        <Heart className={`h-4 w-4 ${isFavorited ? 'fill-current' : ''}`} />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 border-white/20 text-white hover:bg-white/10"
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                <div className="mt-6 pt-6 border-t border-white/20">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Trophy className="h-4 w-4" />
                      <span>Certificate</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Download className="h-4 w-4" />
                      <span>Downloadable</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>Lifetime Access</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <BookOpen className="h-4 w-4" />
                      <span>Mobile Friendly</span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs
              tabs={[
                { id: 'overview', label: 'Overview' },
                { id: 'curriculum', label: 'Curriculum' },
                { id: 'reviews', label: 'Reviews' },
                { id: 'instructor', label: 'Instructor' }
              ]}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />

            <div className="mt-6">
              {activeTab === 'overview' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <Card className="p-6">
                    <h3 className="text-xl font-semibold mb-4">What you'll learn</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        'Master supervised and unsupervised learning algorithms',
                        'Build and deploy machine learning models',
                        'Understand neural networks and deep learning',
                        'Work with real-world datasets and projects',
                        'Implement feature engineering techniques',
                        'Evaluate and optimize model performance'
                      ].map((item, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Card className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Course Requirements</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Basic Python programming knowledge</li>
                      <li>• Understanding of statistics and linear algebra</li>
                      <li>• Computer with internet connection</li>
                      <li>• Willingness to learn and practice</li>
                    </ul>
                  </Card>

                  <Card className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Course Description</h3>
                    <div className="prose text-gray-700">
                      <p>
                        This comprehensive machine learning course is designed to take you from beginner to advanced level. 
                        You'll learn the fundamental concepts, algorithms, and practical applications of machine learning.
                      </p>
                      <p>
                        The course includes hands-on projects, real-world case studies, and practical exercises that will 
                        help you build a strong foundation in machine learning and data science.
                      </p>
                    </div>
                  </Card>
                </motion.div>
              )}

              {activeTab === 'curriculum' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold">Course Curriculum</h3>
                      <div className="flex items-center space-x-4">
                        <Input
                          placeholder="Search lessons..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          leftIcon={<Search className="h-4 w-4" />}
                          className="w-64"
                        />
                        <Select
                          options={filterOptions}
                          value={filterStatus}
                          onChange={setFilterStatus}
                          placeholder="Filter by status"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      {filteredLessons.map((lesson, index) => (
                        <motion.div
                          key={lesson.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`p-4 border rounded-lg transition-all hover:shadow-md ${
                            lesson.status === 'current' ? 'border-blue-200 bg-blue-50' : 'border-gray-200'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              {getStatusIcon(lesson.status)}
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900">{lesson.title}</h4>
                                <p className="text-sm text-gray-600">{lesson.description}</p>
                                <div className="flex items-center space-x-4 mt-2">
                                  <Badge variant={getStatusColor(lesson.status)} size="sm">
                                    {lesson.status}
                                  </Badge>
                                  <span className="text-xs text-gray-500 flex items-center">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {lesson.duration}
                                  </span>
                                  {lesson.quiz && (
                                    <span className="text-xs text-gray-500 flex items-center">
                                      <Target className="h-3 w-3 mr-1" />
                                      Quiz
                                    </span>
                                  )}
                                  <span className="text-xs text-gray-500 flex items-center">
                                    <BookOpen className="h-3 w-3 mr-1" />
                                    {lesson.resources} resources
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {!lesson.locked && (
                                <Tooltip content="Start lesson">
                                  <Button
                                    size="sm"
                                    onClick={() => handleStartLesson(lesson.id)}
                                    className="flex items-center space-x-1"
                                  >
                                    <Play className="h-4 w-4" />
                                    <span>Start</span>
                                  </Button>
                                </Tooltip>
                              )}
                              <ChevronRight className="h-5 w-5 text-gray-400" />
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              )}

              {activeTab === 'reviews' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold">Student Reviews</h3>
                      <div className="flex items-center space-x-2">
                        <Star className="h-5 w-5 text-yellow-400 fill-current" />
                        <span className="font-medium">{course.rating}</span>
                        <span className="text-gray-500">({course.reviewCount} reviews)</span>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {reviews.map((review) => (
                        <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                          <div className="flex items-start space-x-4">
                            <img
                              src={review.avatar}
                              alt={review.user}
                              className="w-10 h-10 rounded-full"
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium text-gray-900">{review.user}</h4>
                                <span className="text-sm text-gray-500">{review.date}</span>
                              </div>
                              <div className="flex items-center space-x-1 mb-2">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < review.rating
                                        ? 'text-yellow-400 fill-current'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <p className="text-gray-700">{review.comment}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              )}

              {activeTab === 'instructor' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <Card className="p-6">
                    <div className="flex items-start space-x-6">
                      <img
                        src={course.instructorAvatar}
                        alt={course.instructor}
                        className="w-24 h-24 rounded-full"
                      />
                      <div className="flex-1">
                        <h3 className="text-2xl font-semibold mb-2">{course.instructor}</h3>
                        <p className="text-gray-600 mb-4">{course.instructorBio}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">4.9</div>
                            <div className="text-sm text-gray-500">Rating</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">50K+</div>
                            <div className="text-sm text-gray-500">Students</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">25</div>
                            <div className="text-sm text-gray-500">Courses</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">5</div>
                            <div className="text-sm text-gray-500">Years</div>
                          </div>
                        </div>

                        <p className="text-gray-700">
                          Dr. Sarah Chen is a renowned expert in machine learning and artificial intelligence 
                          with over 10 years of experience in both academia and industry. She has published 
                          numerous research papers and has been teaching online courses for the past 5 years.
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {isEnrolled && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Your Progress</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Overall Progress</span>
                      <span className="font-medium">{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} />
                    
                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-xl font-bold text-blue-600">{stats.timeSpent}</div>
                        <div className="text-xs text-gray-500">Time Spent</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-xl font-bold text-green-600">{stats.streak}</div>
                        <div className="text-xs text-gray-500">Day Streak</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-xl font-bold text-purple-600">{stats.quizScore}%</div>
                        <div className="text-xs text-gray-500">Quiz Score</div>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <div className="text-xl font-bold text-orange-600">#{stats.rank}</div>
                        <div className="text-xs text-gray-500">Rank</div>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Achievements</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Award className="h-6 w-6 text-yellow-500" />
                      <div>
                        <div className="font-medium">First Lesson Complete</div>
                        <div className="text-sm text-gray-500">Completed your first lesson</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Zap className="h-6 w-6 text-blue-500" />
                      <div>
                        <div className="font-medium">Quick Learner</div>
                        <div className="text-sm text-gray-500">Completed 5 lessons in a day</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <TrendingUp className="h-6 w-6 text-green-500" />
                      <div>
                        <div className="font-medium">Consistent Learner</div>
                        <div className="text-sm text-gray-500">7-day learning streak</div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Course Tags</h3>
              <div className="flex flex-wrap gap-2">
                {course.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Related Courses</h3>
              <div className="space-y-4">
                {[
                  { title: 'Deep Learning Fundamentals', rating: 4.7, students: '8.2K' },
                  { title: 'Data Science with Python', rating: 4.6, students: '12.5K' },
                  { title: 'Neural Networks Mastery', rating: 4.8, students: '6.8K' }
                ].map((relatedCourse, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <BookOpen className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{relatedCourse.title}</h4>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span>{relatedCourse.rating}</span>
                        <span>•</span>
                        <span>{relatedCourse.students} students</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseOverview; 