import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Clock, 
  CheckCircle, 
  XCircle,
  ChevronRight,
  Brain,
  FileText,
  Award,
  ArrowLeft,
  Lightbulb
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { Modal } from '@/components/ui/Modal';
import { Skeleton, SkeletonText } from '@/components/ui/Skeleton';
import { lessonAPI } from '@/lib/api';
import { formatTime } from '@/lib/utils';
import toast from 'react-hot-toast';

const QuizSection = ({ quiz, onSubmit }) => {
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSubmit = () => {
    if (!selectedAnswer) {
      toast.error('Please select an answer');
      return;
    }

    const correct = selectedAnswer === quiz.correct_answer;
    setIsCorrect(correct);
    setShowResult(true);
    
    // Auto-proceed after showing result
    setTimeout(() => {
      onSubmit(correct);
    }, 2000);
  };

  if (quiz.question_type === 'mcq') {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {quiz.question}
        </h3>
        
        <div className="space-y-3">
          {quiz.options.map((option, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => !showResult && setSelectedAnswer(option)}
              disabled={showResult}
              className={`
                w-full p-4 text-left rounded-lg border-2 transition-all
                ${selectedAnswer === option 
                  ? showResult
                    ? isCorrect && option === quiz.correct_answer
                      ? 'border-green-500 bg-green-50'
                      : !isCorrect && option === quiz.correct_answer
                      ? 'border-green-500 bg-green-50'
                      : 'border-red-500 bg-red-50'
                    : 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
                }
                ${showResult && 'cursor-not-allowed'}
              `}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{option}</span>
                {showResult && option === quiz.correct_answer && (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                )}
                {showResult && selectedAnswer === option && !isCorrect && (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
              </div>
            </motion.button>
          ))}
        </div>

        {showResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-lg ${
              isCorrect ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            <p className="font-medium mb-1">
              {isCorrect ? '✅ Correct!' : '❌ Not quite right'}
            </p>
            <p className="text-sm">{quiz.explanation}</p>
          </motion.div>
        )}

        {!showResult && (
          <Button 
            onClick={handleSubmit} 
            variant="gradient" 
            className="w-full"
            disabled={!selectedAnswer}
          >
            Submit Answer
          </Button>
        )}
      </div>
    );
  }

  // Cloze question type
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Fill in the blank:
      </h3>
      <p className="text-gray-700 text-lg">
        {quiz.question}
      </p>
      <input
        type="text"
        value={selectedAnswer}
        onChange={(e) => setSelectedAnswer(e.target.value)}
        placeholder="Type your answer..."
        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        disabled={showResult}
      />
      
      {showResult && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg ${
            isCorrect ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          <p className="font-medium mb-1">
            {isCorrect ? '✅ Correct!' : `❌ The correct answer is: ${quiz.correct_answer}`}
          </p>
          <p className="text-sm">{quiz.explanation}</p>
        </motion.div>
      )}

      {!showResult && (
        <Button 
          onClick={handleSubmit} 
          variant="gradient" 
          className="w-full"
          disabled={!selectedAnswer.trim()}
        >
          Submit Answer
        </Button>
      )}
    </div>
  );
};

function LessonView({ user }) {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [startTime] = useState(Date.now());
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [difficultyRating, setDifficultyRating] = useState(3);

  useEffect(() => {
    // Fetch lesson data
    const fetchLesson = async () => {
      try {
        // This would normally fetch from an API
        // For now, using mock data
        const mockLesson = {
          id: lessonId,
          title: "Introduction to Machine Learning",
          module_title: "Fundamentals of AI",
          content: `
            <h2>What is Machine Learning?</h2>
            <p>Machine learning is a subset of artificial intelligence that enables systems to learn and improve from experience without being explicitly programmed (Samuel, 1959). It focuses on developing computer programs that can access data and use it to learn for themselves.</p>
            
            <h3>Key Concepts</h3>
            <p>The process of learning begins with observations or data, such as examples, direct experience, or instruction. The goal is to allow computers to learn automatically without human intervention and adjust actions accordingly (Mitchell, 1997).</p>
            
            <h3>Types of Machine Learning</h3>
            <p>There are three main types of machine learning:</p>
            <ul>
              <li><strong>Supervised Learning:</strong> The algorithm learns from labeled training data (Kotsiantis, 2007)</li>
              <li><strong>Unsupervised Learning:</strong> The algorithm finds patterns in unlabeled data (Ghahramani, 2003)</li>
              <li><strong>Reinforcement Learning:</strong> The algorithm learns through interaction with an environment (Sutton & Barto, 2018)</li>
            </ul>
            
            <h3>Applications</h3>
            <p>Machine learning has numerous real-world applications including image recognition, speech recognition, medical diagnosis, and predictive analytics (Jordan & Mitchell, 2015).</p>
          `,
          summary: "This lesson introduced the fundamental concepts of machine learning, including its definition, types, and applications.",
          estimated_reading_time: 3,
          word_count: 250,
          quiz: {
            question: "Which of the following is NOT a main type of machine learning?",
            question_type: "mcq",
            options: [
              "Supervised Learning",
              "Unsupervised Learning",
              "Reinforcement Learning",
              "Procedural Learning"
            ],
            correct_answer: "Procedural Learning",
            explanation: "The three main types of machine learning are Supervised, Unsupervised, and Reinforcement Learning. Procedural Learning is not a standard category in machine learning."
          },
          sources: [
            {
              citation_key: "Samuel1959",
              full_citation: "Samuel, A. L. (1959). Some studies in machine learning using the game of checkers. IBM Journal of Research and Development, 3(3), 210-229."
            },
            {
              citation_key: "Mitchell1997",
              full_citation: "Mitchell, T. M. (1997). Machine Learning. McGraw-Hill."
            }
          ]
        };
        
        setLesson(mockLesson);
        setLoading(false);
      } catch (error) {
        toast.error('Failed to load lesson');
        navigate('/feed');
      }
    };

    fetchLesson();
  }, [lessonId, navigate]);

  useEffect(() => {
    // Track reading progress
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min((scrolled / total) * 100, 100);
      setReadingProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleQuizComplete = async (correct) => {
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    
    try {
      await lessonAPI.complete({
        user_email: user.email,
        lesson_id: parseInt(lessonId),
        quiz_correct: correct,
        difficulty_rating: difficultyRating
      });
      
      setShowCompletionModal(true);
    } catch (error) {
      toast.error('Failed to record completion');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Skeleton className="h-8 w-32 mb-8" />
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <SkeletonText lines={10} />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-40 h-1 bg-gray-200">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
          style={{ width: `${readingProgress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/feed')}
            className="flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Feed
          </Button>
        </motion.div>

        <AnimatePresence mode="wait">
          {!showQuiz ? (
            <motion.div
              key="lesson-content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="shadow-xl">
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <Badge variant="primary" className="mb-2">
                        {lesson.module_title}
                      </Badge>
                      <CardTitle className="text-3xl mb-2">
                        {lesson.title}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-4">
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {lesson.estimated_reading_time} min read
                        </span>
                        <span className="flex items-center">
                          <FileText className="h-4 w-4 mr-1" />
                          {lesson.word_count} words
                        </span>
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 mb-1">Reading Progress</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {Math.round(readingProgress)}%
                      </p>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div 
                    className="lesson-content prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: lesson.content }}
                  />
                  
                  {/* Summary */}
                  <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start">
                      <Lightbulb className="h-6 w-6 text-blue-600 mr-3 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-blue-900 mb-2">
                          Key Takeaway
                        </h3>
                        <p className="text-blue-800">
                          {lesson.summary}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Sources */}
                  {lesson.sources && lesson.sources.length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        References
                      </h3>
                      <div className="space-y-2">
                        {lesson.sources.map((source, index) => (
                          <p key={index} className="text-sm text-gray-600">
                            {source.full_citation}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Continue to Quiz */}
                  <div className="mt-12 text-center">
                    <Button
                      size="lg"
                      variant="gradient"
                      onClick={() => setShowQuiz(true)}
                      className="min-w-[200px]"
                    >
                      Test Your Knowledge
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="quiz-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="h-6 w-6 mr-2 text-purple-600" />
                    Knowledge Check
                  </CardTitle>
                  <CardDescription>
                    Test your understanding of the lesson
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <QuizSection
                    quiz={lesson.quiz}
                    onSubmit={handleQuizComplete}
                  />
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Completion Modal */}
      <Modal
        open={showCompletionModal}
        onOpenChange={setShowCompletionModal}
        title="Lesson Complete! 🎉"
        description="Great job finishing this lesson"
      >
        <div className="space-y-6">
          <div className="text-center">
            <Award className="h-20 w-20 text-yellow-500 mx-auto mb-4" />
            <p className="text-lg text-gray-700">
              You've successfully completed this lesson and it will be scheduled for review based on your performance.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                How difficult was this lesson?
              </p>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setDifficultyRating(rating)}
                    className={`
                      px-4 py-2 rounded-lg border-2 transition-all
                      ${difficultyRating === rating
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                  >
                    {rating}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 text-center mt-2">
                1 = Very Easy, 5 = Very Hard
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => navigate('/feed')}
              className="flex-1"
            >
              Back to Feed
            </Button>
            <Button
              variant="gradient"
              onClick={() => navigate('/feed')}
              className="flex-1"
            >
              Continue Learning
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default LessonView; 