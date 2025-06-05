"""
Progress tracking models for learning analytics and spaced repetition
"""

from sqlalchemy import Column, Integer, String, DateTime, Boolean, JSON, ForeignKey, Float, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum

from app.core.database import Base


class UserProgress(Base):
    """User progress tracking for courses."""
    
    __tablename__ = "user_progress"
    
    # Primary keys
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False, index=True)
    
    # Progress metrics
    completion_percentage = Column(Float, default=0.0, nullable=False)
    lessons_completed = Column(Integer, default=0, nullable=False)
    total_time_spent_minutes = Column(Integer, default=0, nullable=False)
    
    # Learning path
    current_lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=True)
    next_lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=True)
    
    # Engagement metrics
    streak_days = Column(Integer, default=0, nullable=False)
    last_activity_date = Column(DateTime(timezone=True), nullable=True)
    
    # Course status
    is_enrolled = Column(Boolean, default=True, nullable=False)
    is_completed = Column(Boolean, default=False, nullable=False)
    is_favorited = Column(Boolean, default=False, nullable=False)
    
    # Spaced repetition
    concepts_to_review = Column(JSON, nullable=True)  # Concepts that need review
    next_review_date = Column(DateTime(timezone=True), nullable=True)
    review_frequency_days = Column(Integer, default=1, nullable=False)
    
    # Timestamps
    enrolled_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    
    # Relationships
    user = relationship("User", back_populates="progress")
    course = relationship("Course", back_populates="progress")
    
    def __repr__(self):
        return f"<UserProgress(user_id={self.user_id}, course_id={self.course_id}, completion={self.completion_percentage}%)>"


class LessonProgress(Base):
    """Individual lesson progress tracking."""
    
    __tablename__ = "lesson_progress"
    
    # Primary keys
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=False, index=True)
    
    # Progress status
    is_completed = Column(Boolean, default=False, nullable=False)
    is_bookmarked = Column(Boolean, default=False, nullable=False)
    completion_percentage = Column(Float, default=0.0, nullable=False)
    
    # Time tracking
    time_spent_minutes = Column(Integer, default=0, nullable=False)
    start_time = Column(DateTime(timezone=True), nullable=True)
    completion_time = Column(DateTime(timezone=True), nullable=True)
    
    # Learning analytics
    scroll_percentage = Column(Float, default=0.0, nullable=False)  # How much content was viewed
    interaction_count = Column(Integer, default=0, nullable=False)  # Clicks, highlights, etc.
    
    # Notes and highlights
    user_notes = Column(Text, nullable=True)
    highlighted_text = Column(JSON, nullable=True)  # User highlights in the lesson
    
    # Spaced repetition for this lesson
    mastery_level = Column(Float, default=0.0, nullable=False)  # 0.0 to 1.0
    next_review_date = Column(DateTime(timezone=True), nullable=True)
    review_count = Column(Integer, default=0, nullable=False)
    
    # Timestamps
    first_accessed = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    last_accessed = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    
    # Relationships
    user = relationship("User", back_populates="lesson_progress")
    lesson = relationship("Lesson", back_populates="progress")
    
    def __repr__(self):
        return f"<LessonProgress(user_id={self.user_id}, lesson_id={self.lesson_id}, completed={self.is_completed})>"


class QuizAttempt(Base):
    """Quiz attempt tracking and results."""
    
    __tablename__ = "quiz_attempts"
    
    # Primary key
    id = Column(Integer, primary_key=True, index=True)
    
    # Foreign keys
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    quiz_id = Column(Integer, ForeignKey("quizzes.id"), nullable=False, index=True)
    
    # Attempt information
    attempt_number = Column(Integer, nullable=False)  # 1, 2, 3, etc.
    score = Column(Float, nullable=False)  # 0.0 to 1.0
    points_earned = Column(Integer, nullable=False)
    total_points = Column(Integer, nullable=False)
    
    # Timing
    time_taken_minutes = Column(Integer, nullable=False)
    started_at = Column(DateTime(timezone=True), nullable=False)
    completed_at = Column(DateTime(timezone=True), nullable=False)
    
    # Results
    is_passed = Column(Boolean, nullable=False)
    answers = Column(JSON, nullable=False)  # User's answers for each question
    
    # Analytics
    questions_correct = Column(Integer, nullable=False)
    questions_incorrect = Column(Integer, nullable=False)
    questions_skipped = Column(Integer, default=0, nullable=False)
    
    # Spaced repetition data
    concepts_mastered = Column(JSON, nullable=True)  # Concepts user showed mastery of
    concepts_to_review = Column(JSON, nullable=True)  # Concepts that need more review
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    
    # Relationships
    user = relationship("User", back_populates="quiz_attempts")
    quiz = relationship("Quiz", back_populates="attempts")
    
    def __repr__(self):
        return f"<QuizAttempt(id={self.id}, user_id={self.user_id}, quiz_id={self.quiz_id}, score={self.score})>"
    
    @property
    def percentage_score(self) -> float:
        """Get score as percentage."""
        return self.score * 100 