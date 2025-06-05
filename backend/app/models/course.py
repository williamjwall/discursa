"""
Course model for organizing lessons
"""

from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, JSON, Float
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.core.database import Base


class Course(Base):
    """Course model for organizing lessons into structured learning paths."""
    
    __tablename__ = "courses"
    
    # Primary key
    id = Column(Integer, primary_key=True, index=True)
    
    # Course information
    title = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=False)
    topic = Column(String(255), nullable=False, index=True)
    difficulty_level = Column(String(50), nullable=False, default="beginner")  # beginner, intermediate, advanced
    
    # Content metadata
    total_lessons = Column(Integer, default=0, nullable=False)
    estimated_duration_minutes = Column(Integer, nullable=False)  # Total course duration
    
    # AI-generated syllabus
    syllabus = Column(JSON, nullable=True)  # Structured syllabus from AI agent
    learning_objectives = Column(JSON, nullable=True)  # List of learning objectives
    prerequisites = Column(JSON, nullable=True)  # List of prerequisites
    
    # Academic information
    sources = Column(JSON, nullable=True)  # List of academic sources used
    citations = Column(JSON, nullable=True)  # Academic citations
    
    # Course status
    is_published = Column(Boolean, default=False, nullable=False)
    is_featured = Column(Boolean, default=False, nullable=False)
    
    # SEO and discovery
    slug = Column(String(255), unique=True, index=True, nullable=False)
    tags = Column(JSON, nullable=True)  # List of tags for discovery
    thumbnail_url = Column(String(500), nullable=True)
    
    # Analytics
    view_count = Column(Integer, default=0, nullable=False)
    completion_rate = Column(Float, default=0.0, nullable=False)  # Percentage of users who complete
    average_rating = Column(Float, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    published_at = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    lessons = relationship("Lesson", back_populates="course", cascade="all, delete-orphan", order_by="Lesson.order_index")
    progress = relationship("UserProgress", back_populates="course", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Course(id={self.id}, title={self.title}, topic={self.topic})>"
    
    @property
    def is_complete(self) -> bool:
        """Check if course has all required content."""
        return (
            self.syllabus is not None and
            self.learning_objectives is not None and
            self.total_lessons > 0 and
            len(self.lessons) >= self.total_lessons
        )
    
    @property
    def completion_percentage(self) -> float:
        """Get course completion percentage based on published lessons."""
        if self.total_lessons == 0:
            return 0.0
        published_lessons = sum(1 for lesson in self.lessons if lesson.is_published)
        return (published_lessons / self.total_lessons) * 100 