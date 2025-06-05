import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  BrainCircuit, 
  Sparkles, 
  BookOpen, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  ArrowRight,
  Lightbulb,
  Target,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { courseAPI } from '@/lib/api';
import toast from 'react-hot-toast';

const creationSteps = [
  { id: 'input', label: 'Topic Input', icon: BrainCircuit },
  { id: 'syllabus', label: 'Generating Syllabus', icon: BookOpen },
  { id: 'sources', label: 'Finding Sources', icon: Target },
  { id: 'lessons', label: 'Creating Lessons', icon: Sparkles },
  { id: 'complete', label: 'Complete!', icon: CheckCircle }
];

const topicSuggestions = [
  { topic: 'Machine Learning Fundamentals', icon: BrainCircuit, color: 'blue' },
  { topic: 'Behavioral Economics', icon: Lightbulb, color: 'yellow' },
  { topic: 'Quantum Computing Basics', icon: Zap, color: 'purple' },
  { topic: 'Climate Science', icon: Target, color: 'green' }
];

function CourseCreator({ user }) {
  const navigate = useNavigate();
  const [topic, setTopic] = useState('');
  const [context, setContext] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [currentStep, setCurrentStep] = useState('input');
  const [creationProgress, setCreationProgress] = useState(0);
  const [createdCourse, setCreatedCourse] = useState(null);

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    
    if (!topic.trim()) {
      toast.error('Please enter a topic');
      return;
    }

    setIsCreating(true);
    setCurrentStep('syllabus');
    setCreationProgress(20);

    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setCreationProgress(prev => Math.min(prev + 10, 90));
    }, 2000);

    try {
      // Update steps as we progress
      setTimeout(() => setCurrentStep('sources'), 3000);
      setTimeout(() => setCurrentStep('lessons'), 6000);

      const result = await courseAPI.create({
        topic: topic.trim(),
        user_email: user.email,
        context: context.trim()
      });

      clearInterval(progressInterval);
      setCreationProgress(100);
      setCurrentStep('complete');
      setCreatedCourse(result);
      
      toast.success('Course created successfully! 🎉');
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate(`/course/${result.course_id}`);
      }, 2000);
      
    } catch (error) {
      clearInterval(progressInterval);
      toast.error(error.message || 'Failed to create course');
      setIsCreating(false);
      setCurrentStep('input');
      setCreationProgress(0);
    }
  };

  const selectSuggestion = (suggestion) => {
    setTopic(suggestion.topic);
    toast.success(`Selected: ${suggestion.topic}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Create Your Course
            </h1>
            <p className="text-xl text-gray-600">
              Transform any topic into a structured learning experience
            </p>
          </div>

          {/* Progress Steps */}
          {isCreating && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="flex items-center justify-between mb-4">
                {creationSteps.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = step.id === currentStep;
                  const isComplete = creationSteps.findIndex(s => s.id === currentStep) > index;
                  
                  return (
                    <div key={step.id} className="flex items-center">
                      <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ 
                          scale: isActive ? 1.1 : 1,
                          backgroundColor: isComplete ? '#10b981' : isActive ? '#3b82f6' : '#e5e7eb'
                        }}
                        className={`
                          w-10 h-10 rounded-full flex items-center justify-center
                          ${isComplete ? 'text-white' : isActive ? 'text-white' : 'text-gray-400'}
                        `}
                      >
                        <Icon className="h-5 w-5" />
                      </motion.div>
                      {index < creationSteps.length - 1 && (
                        <div className={`
                          w-full h-1 mx-2
                          ${isComplete ? 'bg-green-500' : 'bg-gray-200'}
                        `} />
                      )}
                    </div>
                  );
                })}
              </div>
              <Progress value={creationProgress} color="gradient" />
            </motion.div>
          )}

          {/* Main Content */}
          <AnimatePresence mode="wait">
            {!isCreating ? (
              <motion.div
                key="input-form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BrainCircuit className="h-6 w-6 mr-2 text-blue-600" />
                      What would you like to learn?
                    </CardTitle>
                    <CardDescription>
                      Enter any topic and our AI will create a comprehensive course with academic sources
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleCreateCourse} className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Topic *
                        </label>
                        <input
                          type="text"
                          value={topic}
                          onChange={(e) => setTopic(e.target.value)}
                          placeholder="e.g., Machine Learning, Behavioral Economics, Quantum Computing"
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-lg"
                          autoFocus
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Additional Context (Optional)
                        </label>
                        <textarea
                          value={context}
                          onChange={(e) => setContext(e.target.value)}
                          placeholder="Any specific areas you'd like to focus on? Prerequisites you have?"
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                          rows={3}
                        />
                      </div>

                      {/* Topic Suggestions */}
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-3">
                          Popular topics to explore:
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                          {topicSuggestions.map((suggestion) => {
                            const Icon = suggestion.icon;
                            return (
                              <motion.button
                                key={suggestion.topic}
                                type="button"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => selectSuggestion(suggestion)}
                                className={`
                                  p-3 rounded-lg border-2 text-left transition-all
                                  ${topic === suggestion.topic 
                                    ? 'border-blue-500 bg-blue-50' 
                                    : 'border-gray-200 hover:border-gray-300'
                                  }
                                `}
                              >
                                <div className="flex items-start">
                                  <Icon className={`h-5 w-5 mr-2 text-${suggestion.color}-600 flex-shrink-0 mt-0.5`} />
                                  <span className="text-sm font-medium text-gray-900">
                                    {suggestion.topic}
                                  </span>
                                </div>
                              </motion.button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>Takes 2-3 minutes to generate</span>
                        </div>
                        <Button 
                          type="submit" 
                          size="lg" 
                          variant="gradient"
                          className="min-w-[200px]"
                        >
                          Create Course
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>

                {/* Info Cards */}
                <div className="grid md:grid-cols-3 gap-4 mt-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Card className="h-full">
                      <CardContent className="p-6">
                        <BookOpen className="h-8 w-8 text-blue-600 mb-3" />
                        <h3 className="font-semibold mb-2">4-6 Modules</h3>
                        <p className="text-sm text-gray-600">
                          Each course is broken down into digestible modules with clear objectives
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Card className="h-full">
                      <CardContent className="p-6">
                        <Target className="h-8 w-8 text-green-600 mb-3" />
                        <h3 className="font-semibold mb-2">Academic Sources</h3>
                        <p className="text-sm text-gray-600">
                          Every lesson backed by peer-reviewed papers and trusted sources
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Card className="h-full">
                      <CardContent className="p-6">
                        <Zap className="h-8 w-8 text-purple-600 mb-3" />
                        <h3 className="font-semibold mb-2">Instant Access</h3>
                        <p className="text-sm text-gray-600">
                          Start learning immediately with your personalized curriculum
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="creation-progress"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="shadow-xl">
                  <CardContent className="p-12 text-center">
                    {currentStep !== 'complete' ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          className="inline-block mb-6"
                        >
                          <Loader2 className="h-16 w-16 text-blue-600" />
                        </motion.div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                          Creating Your Course
                        </h2>
                        <p className="text-lg text-gray-600 mb-6">
                          {creationSteps.find(s => s.id === currentStep)?.label}...
                        </p>
                        <Badge variant="primary" size="lg">
                          {topic}
                        </Badge>
                      </>
                    ) : (
                      <>
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        >
                          <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
                        </motion.div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                          Course Created Successfully!
                        </h2>
                        <p className="text-lg text-gray-600 mb-4">
                          {createdCourse?.course_title}
                        </p>
                        <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
                          <span>{createdCourse?.total_modules} modules</span>
                          <span>•</span>
                          <span>{createdCourse?.total_lessons} lessons</span>
                          <span>•</span>
                          <span>{createdCourse?.estimated_duration} min total</span>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

export default CourseCreator; 