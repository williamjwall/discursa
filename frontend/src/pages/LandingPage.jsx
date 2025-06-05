import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  BookOpen, 
  Zap, 
  Target, 
  Clock, 
  TrendingUp, 
  ArrowRight, 
  Check,
  Newspaper,
  Users,
  Award,
  Play
} from 'lucide-react';
import { validateEmail } from '@/lib/utils';
import toast from 'react-hot-toast';

// Modern learning platform features
const platformFeatures = [
  {
    icon: Brain,
    title: 'AI-Powered Course Creation',
    description: 'Generate comprehensive courses from any topic using advanced AI that understands learning science.',
  },
  {
    icon: Clock,
    title: 'Smart Spaced Repetition',
    description: 'Automatically schedule reviews based on your forgetting curve to maximize retention.',
  },
  {
    icon: Target,
    title: 'Adaptive Learning Paths',
    description: 'Personalized content difficulty that adapts to your progress and learning style.',
  },
  {
    icon: Newspaper,
    title: 'Live Learning Feed',
    description: 'Stay updated with latest developments in your field through curated news and research.',
  },
  {
    icon: Zap,
    title: 'Instant Knowledge Testing',
    description: 'Quick quizzes and assessments to reinforce learning and identify knowledge gaps.',
  },
  {
    icon: TrendingUp,
    title: 'Progress Analytics',
    description: 'Detailed insights into your learning patterns, strengths, and areas for improvement.',
  },
];

const learningMetrics = [
  { label: 'Learning Efficiency', value: '300%', description: 'faster than traditional methods' },
  { label: 'Knowledge Retention', value: '95%', description: 'long-term retention rate' },
  { label: 'Active Learners', value: '50K+', description: 'across 150+ countries' },
  { label: 'Courses Created', value: '1M+', description: 'by our AI system' },
];

function LandingPage({ onUserUpdate }) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleStartLearning = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error('Email required to create your learning profile');
      return;
    }

    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      onUserUpdate({
        email: email.trim(),
        name: email.split('@')[0],
        joinedAt: new Date().toISOString(),
      });
      toast.success('Welcome to CognitioFlux! Your learning journey begins now.');
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Brand */}
            <div className="flex items-center justify-center mb-8">
              <Brain className="h-16 w-16 text-primary mr-4" />
              <div className="text-left">
                <h1 className="hub-title">CognitioFlux</h1>
                <p className="hub-caption text-muted-foreground">AI-Powered Learning Hub</p>
              </div>
            </div>
            
            {/* Main Headline */}
            <h2 className="text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
              Transform Any Topic Into a 
              <span className="block text-primary">Complete Learning Experience</span>
            </h2>
            
            <p className="hub-body text-muted-foreground max-w-3xl mx-auto mb-12 text-lg">
              Create comprehensive courses, track your progress, and stay updated with the latest 
              developments in your field. All powered by advanced AI and learning science.
            </p>

            {/* CTA Form */}
            <div className="max-w-md mx-auto mb-12">
              <form onSubmit={handleStartLearning} className="space-y-4">
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Enter your email to get started"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="hub-input w-full text-center"
                  />
                </div>
                <button 
                  type="submit" 
                  className="btn-primary w-full h-12 text-lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <div className="loading-spinner mr-2" />
                      Creating your learning profile...
                    </span>
                  ) : (
                    <>
                      Start Learning for Free <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </button>
              </form>
              
              <p className="hub-small text-muted-foreground mt-4">
                No credit card required • 14-day free trial • Cancel anytime
              </p>
            </div>

            {/* Social Proof */}
            <div className="flex items-center justify-center space-x-8 text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span className="hub-small">50,000+ learners</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="h-4 w-4" />
                <span className="hub-small">4.9/5 rating</span>
              </div>
              <div className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4" />
                <span className="hub-small">1M+ courses created</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="bg-muted/30 border-y border-border">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="content-grid-4">
            {learningMetrics.map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="hub-title text-primary mb-2">
                  {metric.value}
                </div>
                <div className="hub-subheading mb-1">{metric.label}</div>
                <div className="hub-small text-muted-foreground">{metric.description}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="hub-title mb-6">
              Everything You Need to Learn Effectively
            </h2>
            <p className="hub-body text-muted-foreground max-w-3xl mx-auto">
              Our platform combines the latest in AI technology with proven learning science 
              to create the most effective learning experience possible.
            </p>
          </motion.div>

          <div className="content-grid-3">
            {platformFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="hub-card h-full">
                  <div className="hub-card-content text-center">
                    <feature.icon className="h-12 w-12 text-primary mx-auto mb-6" />
                    <h3 className="hub-subheading mb-4">{feature.title}</h3>
                    <p className="hub-body text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-muted/30 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="hub-title mb-6">
              From Idea to Mastery in Minutes
            </h2>
            <p className="hub-body text-muted-foreground max-w-3xl mx-auto">
              Our AI-powered system transforms any topic into a structured, 
              engaging learning experience tailored to your pace and style.
            </p>
          </motion.div>

          <div className="content-grid-4">
            {[
              {
                step: '01',
                title: 'Choose Your Topic',
                description: 'Enter any subject you want to learn, from programming to philosophy',
                color: 'bg-blue-500',
              },
              {
                step: '02',
                title: 'AI Creates Your Course',
                description: 'Our AI generates a comprehensive curriculum with lessons and quizzes',
                color: 'bg-primary',
              },
              {
                step: '03',
                title: 'Learn at Your Pace',
                description: 'Go through interactive lessons designed for optimal retention',
                color: 'bg-purple-500',
              },
              {
                step: '04',
                title: 'Track Your Progress',
                description: 'Monitor your learning with detailed analytics and achievement tracking',
                color: 'bg-green-500',
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="text-center"
              >
                <div className={`w-16 h-16 ${item.color} text-white rounded-2xl flex items-center justify-center hub-subheading mx-auto mb-6`}>
                  {item.step}
                </div>
                <h3 className="hub-subheading mb-4">
                  {item.title}
                </h3>
                <p className="hub-body text-muted-foreground">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="hub-title mb-6">
              Join Thousands of Learners Accelerating Their Growth
            </h2>
            <p className="hub-body mb-8 text-primary-foreground/90">
              Start your learning journey today with personalized AI-powered courses, 
              spaced repetition, and progress tracking all in one platform.
            </p>
            
            <div className="content-grid-3 mb-8 max-w-2xl mx-auto">
              {[
                'Unlimited course creation',
                'Advanced progress analytics',
                'Community learning features',
              ].map((benefit) => (
                <div key={benefit} className="flex items-center justify-center text-primary-foreground">
                  <Check className="h-5 w-5 mr-2 flex-shrink-0" />
                  <span className="hub-body font-medium">{benefit}</span>
                </div>
              ))}
            </div>

            <button 
              className="btn-secondary px-8 py-4 hub-body font-semibold"
              onClick={() => document.querySelector('input[type="email"]')?.focus()}
            >
              Get Started Free Today
            </button>
            
            <p className="hub-small mt-4 text-primary-foreground/70">
              Join 50,000+ learners • No setup fees • Cancel anytime
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;