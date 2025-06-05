import React from 'react';
import { Brain, BookOpen, Target, TrendingUp, Clock, Eye } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground border-t border-border">
      <div className="flow-container py-12">
        <div className="memory-grid-4">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <Brain className="h-8 w-8" />
              <div>
                <span className="neural-subheading">CognitioFlux</span>
                <p className="neural-caption">Neuroscience-Powered Learning</p>
              </div>
            </div>
            <p className="neural-body text-primary-foreground/80 max-w-md leading-relaxed">
              Transform how you learn through scientifically-validated cognitive techniques. 
              Our platform applies research from neuroscience, psychology, and learning science 
              to optimize knowledge acquisition and retention.
            </p>
          </div>
          
          <div>
            <h3 className="neural-detail font-semibold mb-4 text-primary-foreground">Learning Science</h3>
            <ul className="memory-list text-primary-foreground/70">
              <li>
                <a href="#" className="flex items-center neural-detail hover:text-primary-foreground transition-colors">
                  <Brain className="h-3 w-3 mr-2" />
                  Cognitive Load Theory
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center neural-detail hover:text-primary-foreground transition-colors">
                  <Clock className="h-3 w-3 mr-2" />
                  Spaced Repetition
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center neural-detail hover:text-primary-foreground transition-colors">
                  <Target className="h-3 w-3 mr-2" />
                  Retrieval Practice
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center neural-detail hover:text-primary-foreground transition-colors">
                  <Eye className="h-3 w-3 mr-2" />
                  Dual Coding Theory
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="neural-detail font-semibold mb-4 text-primary-foreground">Resources</h3>
            <ul className="memory-list text-primary-foreground/70">
              <li>
                <a href="#" className="flex items-center neural-detail hover:text-primary-foreground transition-colors">
                  <BookOpen className="h-3 w-3 mr-2" />
                  Learning Research
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center neural-detail hover:text-primary-foreground transition-colors">
                  <TrendingUp className="h-3 w-3 mr-2" />
                  Study Techniques
                </a>
              </li>
              <li>
                <a href="#" className="neural-detail hover:text-primary-foreground transition-colors">
                  Memory Science
                </a>
              </li>
              <li>
                <a href="#" className="neural-detail hover:text-primary-foreground transition-colors">
                  Cognitive Psychology
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center">
          <p className="neural-caption text-primary-foreground/60">
            &copy; 2024 CognitioFlux. Evidence-based learning through cognitive science.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer; 