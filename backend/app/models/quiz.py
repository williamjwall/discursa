"""
Quiz models for assessments and knowledge checking
"""

from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, JSON, ForeignKey, Float
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.core.database import Base


class Quiz(Base):
    """Quiz model for lesson assessments."""
    
    __tablename__ = "quizzes"
    
    # Primary key
    id = Column(Integer, primary_key=True, index=True)
    
    # Foreign key
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=False, unique=True, index=True)
    
    # Quiz information
    title = Column(String(255), nullable=False)
    instructions = Column(Text, nullable=True)
    
    # Quiz configuration
    time_limit_minutes = Column(Integer, nullable=True)  # Optional time limit
    max_attempts = Column(Integer, default=3, nullable=False)
    passing_score = Column(Float, default=0.7, nullable=False)  # 70% to pass
    
    # Quiz settings
    randomize_questions = Column(Boolean, default=False, nullable=False)
    show_correct_answers = Column(Boolean, default=True, nullable=False)
    show_explanations = Column(Boolean, default=True, nullable=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    
    # Relationships
    lesson = relationship("Lesson", back_populates="quiz")
    questions = relationship("QuizQuestion", back_populates="quiz", cascade="all, delete-orphan", order_by="QuizQuestion.order_index")
    attempts = relationship("QuizAttempt", back_populates="quiz", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Quiz(id={self.id}, title={self.title}, lesson_id={self.lesson_id})>"
    
    @property
    def total_questions(self) -> int:
        """Get total number of questions in quiz."""
        return len(self.questions)
    
    @property
    def total_points(self) -> int:
        """Get total points possible for quiz."""
        return sum(question.points for question in self.questions)


class QuizQuestion(Base):
    """Quiz question model."""
    
    __tablename__ = "quiz_questions"
    
    # Primary key
    id = Column(Integer, primary_key=True, index=True)
    
    # Foreign key
    quiz_id = Column(Integer, ForeignKey("quizzes.id"), nullable=False, index=True)
    
    # Question information
    question_text = Column(Text, nullable=False)
    question_type = Column(String(50), nullable=False, default="multiple_choice")  # multiple_choice, true_false, short_answer
    order_index = Column(Integer, nullable=False)
    points = Column(Integer, default=1, nullable=False)
    
    # Question configuration
    explanation = Column(Text, nullable=True)  # Explanation for correct answer
    hint = Column(Text, nullable=True)  # Optional hint
    
    # For spaced repetition
    concept_tags = Column(JSON, nullable=True)  # Tags for concepts tested
    difficulty_level = Column(String(20), default="medium", nullable=False)  # easy, medium, hard
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    
    # Relationships
    quiz = relationship("Quiz", back_populates="questions")
    answers = relationship("QuizAnswer", back_populates="question", cascade="all, delete-orphan", order_by="QuizAnswer.order_index")
    
    def __repr__(self):
        return f"<QuizQuestion(id={self.id}, quiz_id={self.quiz_id}, type={self.question_type})>"
    
    @property
    def correct_answer(self) -> 'QuizAnswer':
        """Get the correct answer for this question."""
        return next((answer for answer in self.answers if answer.is_correct), None)


class QuizAnswer(Base):
    """Quiz answer/option model."""
    
    __tablename__ = "quiz_answers"
    
    # Primary key
    id = Column(Integer, primary_key=True, index=True)
    
    # Foreign key
    question_id = Column(Integer, ForeignKey("quiz_questions.id"), nullable=False, index=True)
    
    # Answer information
    answer_text = Column(Text, nullable=False)
    is_correct = Column(Boolean, default=False, nullable=False)
    order_index = Column(Integer, nullable=False)
    
    # Optional explanation for this specific answer
    explanation = Column(Text, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    
    # Relationships
    question = relationship("QuizQuestion", back_populates="answers")
    
    def __repr__(self):
        return f"<QuizAnswer(id={self.id}, question_id={self.question_id}, is_correct={self.is_correct})>" 