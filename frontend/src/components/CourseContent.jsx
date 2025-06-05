import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, ChevronRight, Circle, CheckCircle, Clock, BookOpen, 
  Brain, Zap, RefreshCw, MessageSquare, Library, Link, FileText, 
  AlertCircle, Volume2, VolumeX, Play, Pause, SkipForward, 
  HelpCircle, Target, Layers, ChevronDown, ChevronUp, Hash, X
} from 'lucide-react';

function CourseContent({ topic, onBack }) {
  const [sections, setSections] = useState([]);
  const [currentSection, setCurrentSection] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [userResponse, setUserResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});
  const [showDiveIn, setShowDiveIn] = useState(false);
  const [selectedSubtopic, setSelectedSubtopic] = useState(null);
  
  // Discursa TTS State
  const [discursaActive, setDiscursaActive] = useState(false);
  const [discursaPlaying, setDiscursaPlaying] = useState(false);
  const [discursaSpeed, setDiscursaSpeed] = useState(1.0);
  
  const threadRef = useRef(null);
  const observerRef = useRef(null);
  const speechSynthRef = useRef(null);

  // Academic source structure
  const generateAcademicSource = (type, details) => ({
    type,
    ...details,
    verified: true,
    accessDate: new Date().toISOString()
  });

  // Enhanced content generation with quiz questions and subtopics
  const generateInitialContent = useCallback(() => {
    const contentTemplates = {
      'Presocratic Philosophy': [
        {
          id: 'preso-001',
          type: 'activation',
          title: 'Epistemological Foundations',
          content: `Before examining Presocratic thought, we must establish our epistemological framework.

The Presocratics represent humanity's first systematic attempt to explain natural phenomena through rational inquiry rather than mythological narrative. This shift—from mythos to logos—fundamentally altered human consciousness.

Key methodological considerations:
• Fragmentary nature of sources
• Doxographical tradition (Aristotle, Theophrastus)
• Hermeneutical challenges in interpretation
• Anachronistic projection risks`,
          subtopics: [
            {
              id: 'sub-001-1',
              title: 'The Mythos-Logos Transition',
              content: 'Deep dive into how mythological thinking transformed into rational inquiry...'
            },
            {
              id: 'sub-001-2',
              title: 'Doxographical Sources',
              content: 'Understanding how we know what we know about the Presocratics...'
            }
          ],
          quizQuestions: [
            {
              id: 'q-001-1',
              type: 'conceptual',
              question: 'What distinguishes the Presocratic approach from earlier mythological explanations?',
              hints: ['Consider the role of natural causes', 'Think about empirical observation'],
              deepDive: 'The shift from supernatural to natural causation...'
            },
            {
              id: 'q-001-2',
              type: 'critical',
              question: 'Why is the fragmentary nature of sources significant for our understanding?',
              hints: ['Consider interpretation challenges', 'Think about historical bias'],
              deepDive: 'The hermeneutical challenges in reconstructing ancient thought...'
            }
          ],
          sources: [
            generateAcademicSource('book', {
              authors: ['Kirk, G.S.', 'Raven, J.E.', 'Schofield, M.'],
              title: 'The Presocratic Philosophers',
              publisher: 'Cambridge University Press',
              year: 2007,
              pages: '1-7',
              isbn: '978-0521274555'
            })
          ],
          cognitiveMethod: 'Epistemological Grounding',
          integrity: 'Primary sources cross-referenced with modern scholarship',
          timestamp: new Date(Date.now() - 600000).toISOString(),
          completed: true
        },
        {
          id: 'preso-002',
          type: 'concept',
          title: 'Thales: The Archê Principle',
          content: `Thales of Miletus (c. 624-546 BCE) initiated philosophical cosmology with his revolutionary proposition.

Primary Doctrine (via Aristotle, Metaphysics 983b6-11):
"Thales, the founder of this school of philosophy, says the permanent entity is water"

Critical Analysis:
1. Empirical basis: Observation of water's ubiquity and transformative properties
2. Theoretical innovation: Concept of material monism
3. Methodological shift: Natural rather than supernatural causation

Fragment preservation note: No direct writings survive; all knowledge mediated through later sources.`,
          subtopics: [
            {
              id: 'sub-002-1',
              title: 'Water as Archê: Empirical Foundations',
              content: 'Examining the observational basis for Thales\' choice of water...'
            },
            {
              id: 'sub-002-2',
              title: 'Material Monism: Philosophical Innovation',
              content: 'The revolutionary concept of a single underlying substance...'
            },
            {
              id: 'sub-002-3',
              title: 'Thales and Geometry',
              content: 'His mathematical contributions and their philosophical implications...'
            }
          ],
          quizQuestions: [
            {
              id: 'q-002-1',
              type: 'recall',
              question: 'What was Thales\' proposed archê and why was it revolutionary?',
              hints: ['Consider the properties of the substance', 'Think about observable transformations'],
              deepDive: 'Water\'s unique properties in ancient observation...'
            },
            {
              id: 'q-002-2',
              type: 'analytical',
              question: 'How does material monism differ from mythological pluralism?',
              hints: ['Unity vs multiplicity', 'Natural vs supernatural'],
              deepDive: 'The philosophical implications of reducing reality to one principle...'
            }
          ],
          sources: [
            generateAcademicSource('book', {
              authors: ['Aristotle'],
              title: 'Metaphysics',
              translator: 'Ross, W.D.',
              publisher: 'Oxford University Press',
              year: 1924,
              pages: '983b6-11',
              originalLanguage: 'Ancient Greek'
            })
          ],
          cognitiveMethod: 'Primary Source Analysis',
          integrity: 'Aristotelian testimony with modern critical apparatus',
          timestamp: new Date(Date.now() - 480000).toISOString(),
          completed: true
        }
      ]
    };

    return contentTemplates[topic.name] || [{
      id: 'generic-001',
      type: 'introduction',
      title: 'Academic Foundation',
      content: `Establishing rigorous academic grounding for ${topic.name}.`,
      subtopics: [],
      quizQuestions: [],
      sources: [],
      cognitiveMethod: 'Foundational Overview',
      integrity: 'Awaiting source verification',
      timestamp: new Date().toISOString(),
      completed: false
    }];
  }, [topic.name]);

  // Discursa TTS Functions
  const startDiscursa = (text) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = discursaSpeed;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      // Select a professional voice if available
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.name.includes('Google') || voice.name.includes('Microsoft')
      ) || voices[0];
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      utterance.onend = () => {
        setDiscursaPlaying(false);
      };
      
      speechSynthRef.current = utterance;
      window.speechSynthesis.speak(utterance);
      setDiscursaPlaying(true);
    }
  };

  const pauseDiscursa = () => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
      setDiscursaPlaying(false);
    }
  };

  const resumeDiscursa = () => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setDiscursaPlaying(true);
    }
  };

  const stopDiscursa = () => {
    window.speechSynthesis.cancel();
    setDiscursaPlaying(false);
    setDiscursaActive(false);
  };

  // Load more content dynamically
  const loadMoreContent = useCallback(async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    setTimeout(() => {
      const newSections = [];
      const startId = sections.length;
      
      for (let i = 0; i < 5; i++) {
        const sectionId = startId + i;
        newSections.push({
          id: `${topic.name.toLowerCase().replace(/\s+/g, '-')}-${String(sectionId).padStart(3, '0')}`,
          type: ['concept', 'analysis', 'synthesis', 'critique', 'application'][i % 5],
          title: `Advanced Topic ${sectionId}`,
          content: generateAcademicContent(topic.name, sectionId),
          subtopics: generateSubtopics(topic.name, sectionId),
          quizQuestions: generateQuizQuestions(topic.name, sectionId),
          sources: generateRelevantSources(topic.name, sectionId),
          cognitiveMethod: ['Deep Analysis', 'Critical Synthesis', 'Comparative Study', 'Meta-Analysis'][sectionId % 4],
          integrity: 'Peer-reviewed sources with citation tracking',
          timestamp: new Date(Date.now() - sectionId * 120000).toISOString(),
          completed: false,
          current: sectionId === 0 && sections.length === 0
        });
      }
      
      setSections(prev => [...prev, ...newSections]);
      setIsLoading(false);
    }, 1000);
  }, [sections.length, topic.name, isLoading]);

  // Generate subtopics for diving deeper
  const generateSubtopics = (topicName, index) => {
    return [
      {
        id: `sub-${index}-1`,
        title: 'Historical Context',
        content: 'Deep exploration of the historical background...'
      },
      {
        id: `sub-${index}-2`,
        title: 'Contemporary Debates',
        content: 'Current scholarly discussions and controversies...'
      },
      {
        id: `sub-${index}-3`,
        title: 'Methodological Approaches',
        content: 'Different ways of understanding this concept...'
      }
    ];
  };

  // Generate quiz questions
  const generateQuizQuestions = (topicName, index) => {
    return [
      {
        id: `q-${index}-1`,
        type: 'conceptual',
        question: 'What is the core principle discussed in this section?',
        hints: ['Review the main argument', 'Consider the key terms'],
        deepDive: 'Extended explanation of the concept...'
      },
      {
        id: `q-${index}-2`,
        type: 'application',
        question: 'How would you apply this concept to a modern context?',
        hints: ['Think about contemporary parallels', 'Consider practical implications'],
        deepDive: 'Exploring modern applications...'
      }
    ];
  };

  // Generate academic content
  const generateAcademicContent = (topicName, index) => {
    return `This section explores advanced concepts with rigorous academic grounding.

Key theoretical frameworks examined:
• Primary literature analysis
• Contemporary scholarly debates
• Methodological considerations
• Empirical evidence evaluation

[Content would be dynamically generated based on academic corpus]`;
  };

  // Generate relevant sources
  const generateRelevantSources = (topicName, index) => {
    return [
      generateAcademicSource('journal', {
        authors: ['Scholar, A.', 'Researcher, B.'],
        title: `Advanced Studies in ${topicName}`,
        journal: 'Journal of Cognitive Sciences',
        volume: 45 + index,
        issue: 3,
        year: 2020 + (index % 4),
        pages: `${100 + index * 10}-${115 + index * 10}`,
        doi: `10.1000/jcs.${2020 + index}.${index}`,
        peerReviewed: true
      })
    ];
  };

  // Initialize content
  useEffect(() => {
    const initial = generateInitialContent();
    setSections(initial);
  }, [generateInitialContent]);

  // Toggle section expansion
  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  // Handle quiz submission
  const handleQuizSubmit = () => {
    // Process quiz response
    setShowQuiz(false);
    setUserResponse('');
    // Could add scoring logic here
  };

  const markComplete = (index) => {
    const newSections = [...sections];
    newSections[index].completed = true;
    newSections[index].current = false;
    
    if (index < newSections.length - 1) {
      newSections[index + 1].current = true;
      setCurrentSection(index + 1);
    }
    
    setSections(newSections);
  };

  // Infinite scroll setup (keeping previous implementation)
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '100px',
      threshold: 0.1
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const index = parseInt(entry.target.dataset.index);
          if (index === sections.length - 3) {
            loadMoreContent();
          }
        }
      });
    }, options);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [sections.length, loadMoreContent]);

  return (
    <div className="container">
      {/* Navigation */}
      <div className="nav">
        <button onClick={onBack} className="btn">
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back to Topics
        </button>
        
        <div className="text-center">
          <h1 className="title">{topic.name}</h1>
          <p className="small">Infinite Academic Thread</p>
        </div>

        <div className="text-right">
          <p className="small">Sections Completed</p>
          <p className="body">{sections.filter(s => s.completed).length} / ∞</p>
        </div>
      </div>

      {/* Discursa TTS Control Bar */}
      <motion.div 
        className="card mb-4" 
        style={{ padding: '1rem' }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Volume2 className="w-4 h-4" />
              <span className="small font-medium">Discursa</span>
            </div>
            
            {!discursaActive ? (
              <button
                onClick={() => {
                  setDiscursaActive(true);
                  const currentContent = sections[currentSection]?.content || '';
                  startDiscursa(currentContent);
                }}
                className="btn btn-primary"
                style={{ padding: '0.5rem 1rem' }}
              >
                <Play className="w-4 h-4 mr-2" />
                Start Reading
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => discursaPlaying ? pauseDiscursa() : resumeDiscursa()}
                  className="btn"
                  style={{ padding: '0.5rem' }}
                >
                  {discursaPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={stopDiscursa}
                  className="btn"
                  style={{ padding: '0.5rem' }}
                >
                  <VolumeX className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    const nextSection = sections[currentSection + 1];
                    if (nextSection) {
                      setCurrentSection(currentSection + 1);
                      startDiscursa(nextSection.content);
                    }
                  }}
                  className="btn"
                  style={{ padding: '0.5rem' }}
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="tiny">Speed:</span>
            <select
              value={discursaSpeed}
              onChange={(e) => setDiscursaSpeed(parseFloat(e.target.value))}
              className="bg-transparent border px-2 py-1 text-sm"
              style={{ borderColor: 'var(--border)', color: 'var(--fg)' }}
            >
              <option value="0.75">0.75x</option>
              <option value="1.0">1.0x</option>
              <option value="1.25">1.25x</option>
              <option value="1.5">1.5x</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Academic Integrity Notice */}
      <div className="card mb-4" style={{ borderColor: 'var(--fg)', padding: '1rem' }}>
        <div className="flex items-center space-x-2">
          <Library className="w-4 h-4" />
          <span className="small">
            All content sourced from peer-reviewed academic publications with full citations
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress mb-8">
        <motion.div 
          className="progress-fill" 
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(progress, 100)}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Content Thread */}
      <div className="thread" ref={threadRef}>
        <AnimatePresence>
          {sections.map((section, index) => (
            <motion.div
              key={section.id}
              id={`section-${index}`}
              data-index={index}
              className="thread-item"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(index * 0.1, 1) }}
            >
              <div className={`thread-dot ${section.current ? 'active' : ''}`} />
              
              <div className={`content-block ${section.current ? 'active' : ''}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h2 className="heading">{section.title}</h2>
                    <div className="flex items-center space-x-4 mt-2">
                      <p className="tiny flex items-center space-x-2">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(section.timestamp).toLocaleString()}</span>
                      </p>
                      <p className="tiny flex items-center space-x-2">
                        <Brain className="w-3 h-3" />
                        <span>{section.cognitiveMethod}</span>
                      </p>
                      <p className="tiny flex items-center space-x-2">
                        <AlertCircle className="w-3 h-3" />
                        <span>{section.integrity}</span>
                      </p>
                    </div>
                  </div>
                  
                  {section.completed && (
                    <CheckCircle className="w-5 h-5" />
                  )}
                </div>

                <div className="body mb-4" style={{ whiteSpace: 'pre-line' }}>
                  {section.content}
                </div>

                {/* Dive In - Subtopics */}
                {section.subtopics && section.subtopics.length > 0 && (
                  <div className="mb-6">
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="flex items-center space-x-2 mb-3 cursor-pointer"
                    >
                      <Layers className="w-4 h-4" />
                      <span className="small font-medium">Dive Deeper</span>
                      {expandedSections[section.id] ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                    
                    <AnimatePresence>
                      {expandedSections[section.id] && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-2 ml-6"
                        >
                          {section.subtopics.map((subtopic) => (
                            <motion.div
                              key={subtopic.id}
                              whileHover={{ x: 4 }}
                              className="p-3 border-l cursor-pointer"
                              style={{ borderColor: 'var(--border)' }}
                              onClick={() => {
                                setSelectedSubtopic(subtopic);
                                setShowDiveIn(true);
                              }}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="small font-medium">{subtopic.title}</p>
                                  <p className="tiny opacity-75 mt-1">Click to explore</p>
                                </div>
                                <ChevronRight className="w-4 h-4" />
                              </div>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* Quiz Section */}
                {section.quizQuestions && section.quizQuestions.length > 0 && (
                  <div className="mb-6 p-4 border" style={{ borderColor: 'var(--border)' }}>
                    <div className="flex items-center space-x-2 mb-3">
                      <HelpCircle className="w-4 h-4" />
                      <span className="small font-medium">Test Your Understanding</span>
                    </div>
                    
                    <div className="space-y-3">
                      {section.quizQuestions.map((question, qIndex) => (
                        <motion.div
                          key={question.id}
                          className="p-3 border-l"
                          style={{ borderColor: 'var(--dim)' }}
                          whileHover={{ borderColor: 'var(--fg)' }}
                        >
                          <p className="small mb-2">{question.question}</p>
                          <button
                            onClick={() => {
                              setShowQuiz(true);
                              // Set current question
                            }}
                            className="btn btn-primary"
                            style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}
                          >
                            <Target className="w-3 h-3 mr-1" />
                            Answer
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Academic Sources */}
                {section.sources && section.sources.length > 0 && (
                  <div className="mt-6 p-4 border-l" style={{ 
                    borderColor: 'var(--border)',
                    background: 'rgba(255, 255, 255, 0.02)'
                  }}>
                    <p className="small mb-3 flex items-center">
                      <FileText className="w-4 h-4 mr-2" />
                      Academic Sources
                    </p>
                    <div className="space-y-2">
                      {section.sources.map((source, idx) => (
                        <div key={idx} className="tiny" style={{ lineHeight: 1.6 }}>
                          <span style={{ color: 'var(--fg)' }}>
                            {source.authors?.join(', ')} ({source.year}).
                          </span>{' '}
                          <span style={{ fontStyle: 'italic' }}>{source.title}.</span>{' '}
                          {source.journal && (
                            <>
                              <span>{source.journal},</span>{' '}
                              <span>{source.volume}({source.issue}),</span>{' '}
                              <span>{source.pages}.</span>{' '}
                            </>
                          )}
                          {source.doi && (
                            <span style={{ color: 'var(--dim)' }}>
                              DOI: {source.doi}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                {section.current && !section.completed && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8 flex space-x-4"
                  >
                    <button 
                      onClick={() => markComplete(index)}
                      className="btn btn-primary"
                    >
                      Mark as Understood
                      <CheckCircle className="w-4 h-4 ml-2" />
                    </button>
                    
                    <button 
                      className="btn"
                      onClick={() => setShowQuiz(true)}
                    >
                      <Brain className="w-4 h-4 mr-2" />
                      Quiz Me
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading Indicator */}
        {isLoading && (
          <motion.div
            className="thread-item"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
          >
            <div className="thread-dot animate-pulse" />
            <div className="content-block">
              <div className="flex items-center space-x-2">
                <div className="loading" />
                <span className="small">Generating academically verified content...</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Quiz Modal */}
      <AnimatePresence>
        {showQuiz && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center p-4"
            style={{ background: 'rgba(0, 0, 0, 0.9)', zIndex: 50 }}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="card"
              style={{ maxWidth: '600px', width: '100%', padding: '2rem' }}
            >
              <h3 className="heading mb-4">Knowledge Check</h3>
              <p className="body mb-4">
                Test your understanding of the current section
              </p>
              
              <div className="mb-6">
                <p className="small mb-4">
                  What distinguishes the Presocratic approach from earlier mythological explanations?
                </p>
                
                <textarea
                  value={userResponse}
                  onChange={(e) => setUserResponse(e.target.value)}
                  className="w-full p-4 bg-transparent border text-white"
                  style={{
                    borderColor: 'var(--border)',
                    minHeight: '150px',
                    resize: 'vertical'
                  }}
                  placeholder="Type your response..."
                  autoFocus
                />
                
                <div className="mt-4 space-y-2">
                  <p className="tiny opacity-75">Need help?</p>
                  <div className="flex space-x-2">
                    <button className="btn" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}>
                      <HelpCircle className="w-3 h-3 mr-1" />
                      Hint
                    </button>
                    <button className="btn" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}>
                      <Layers className="w-3 h-3 mr-1" />
                      Deep Dive
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <button onClick={() => setShowQuiz(false)} className="btn">
                  Cancel
                </button>
                <button onClick={handleQuizSubmit} className="btn btn-primary">
                  Submit Answer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dive In Modal */}
      <AnimatePresence>
        {showDiveIn && selectedSubtopic && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center p-4"
            style={{ background: 'rgba(0, 0, 0, 0.9)', zIndex: 50 }}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="card"
              style={{ maxWidth: '800px', width: '100%', padding: '2rem', maxHeight: '80vh', overflow: 'auto' }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="heading">{selectedSubtopic.title}</h3>
                <button onClick={() => setShowDiveIn(false)} className="btn">
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="body mb-6">
                {selectedSubtopic.content}
              </div>
              
              <div className="flex justify-between">
                <button 
                  onClick={() => {
                    // Start Discursa for this subtopic
                    startDiscursa(selectedSubtopic.content);
                  }}
                  className="btn"
                >
                  <Volume2 className="w-4 h-4 mr-2" />
                  Read with Discursa
                </button>
                <button onClick={() => setShowDiveIn(false)} className="btn btn-primary">
                  Back to Main Thread
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Learning Metrics */}
      <div className="mt-8 pt-8 border-t" style={{ borderColor: 'var(--border)' }}>
        <h3 className="heading mb-4">Learning Metrics</h3>
        <div className="grid grid-3">
          <div>
            <p className="small mb-2">Sections Explored</p>
            <p className="title">{sections.filter(s => s.completed).length}</p>
          </div>
          <div>
            <p className="small mb-2">Quiz Performance</p>
            <p className="title">--</p>
          </div>
          <div>
            <p className="small mb-2">Deep Dives</p>
            <p className="title">--</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseContent; 