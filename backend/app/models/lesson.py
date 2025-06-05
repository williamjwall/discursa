"""
Lesson model for micro-lessons
"""

from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, JSON, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.core.database import Base


class Lesson(Base):
    """Lesson model for individual micro-lessons within courses."""
    
    __tablename__ = "lessons"
    
    # Primary key
    id = Column(Integer, primary_key=True, index=True)
    
    # Foreign key
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False, index=True)
    
    # Lesson information
    title = Column(String(255), nullable=False, index=True)
    subtitle = Column(String(500), nullable=True)
    content = Column(Text, nullable=False)  # Main lesson content
    summary = Column(Text, nullable=True)  # Brief summary
    
    # Lesson structure
    order_index = Column(Integer, nullable=False)  # Order within course
    duration_minutes = Column(Integer, default=3, nullable=False)  # Target: 3 minutes
    
    # Learning objectives
    learning_objectives = Column(JSON, nullable=True)  # List of objectives for this lesson
    key_concepts = Column(JSON, nullable=True)  # List of key concepts covered
    
    # Content metadata
    content_type = Column(String(50), default="text", nullable=False)  # text, video, interactive
    media_urls = Column(JSON, nullable=True)  # URLs for images, videos, etc.
    
    # Academic sources
    sources = Column(JSON, nullable=True)  # Academic sources for this lesson
    citations = Column(JSON, nullable=True)  # In-text citations
    
    # Lesson status
    is_published = Column(Boolean, default=False, nullable=False)
    is_preview = Column(Boolean, default=False, nullable=False)  # Can be viewed without enrollment
    
    # SEO
    slug = Column(String(255), index=True, nullable=False)
    
    # Spaced repetition
    next_review_topics = Column(JSON, nullable=True)  # Topics to review in future lessons
    prerequisite_concepts = Column(JSON, nullable=True)  # Concepts needed before this lesson
    
    # Analytics
    view_count = Column(Integer, default=0, nullable=False)
    average_completion_time_minutes = Column(Integer, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    published_at = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    course = relationship("Course", back_populates="lessons")
    quiz = relationship("Quiz", back_populates="lesson", uselist=False, cascade="all, delete-orphan")
    progress = relationship("LessonProgress", back_populates="lesson", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Lesson(id={self.id}, title={self.title}, course_id={self.course_id}, order={self.order_index})>"
    
    @property
    def is_complete(self) -> bool:
        """Check if lesson has all required content."""
        return (
            self.content is not None and
            len(self.content.strip()) > 0 and
            self.learning_objectives is not None and
            len(self.learning_objectives) > 0
        )
    
    @property
    def has_quiz(self) -> bool:
        """Check if lesson has an associated quiz."""
        return self.quiz is not None and len(self.quiz.questions) > 0 