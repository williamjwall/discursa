"""
Course-related Pydantic schemas
"""

from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, validator


class CourseBase(BaseModel):
    """Base course schema with common fields."""
    title: str
    description: str
    topic: str
    difficulty_level: str = "beginner"
    estimated_duration_minutes: int
    tags: Optional[List[str]] = None
    thumbnail_url: Optional[str] = None


class CourseCreate(CourseBase):
    """Schema for creating a new course."""
    
    @validator('difficulty_level')
    def validate_difficulty(cls, v):
        allowed_levels = ['beginner', 'intermediate', 'advanced']
        if v not in allowed_levels:
            raise ValueError(f'Difficulty level must be one of: {allowed_levels}')
        return v
    
    @validator('estimated_duration_minutes')
    def validate_duration(cls, v):
        if v < 5 or v > 600:  # 5 minutes to 10 hours
            raise ValueError('Course duration must be between 5 and 600 minutes')
        return v
    
    @validator('title')
    def validate_title(cls, v):
        if len(v) < 5 or len(v) > 255:
            raise ValueError('Course title must be between 5 and 255 characters')
        return v


class CourseUpdate(BaseModel):
    """Schema for updating course information."""
    title: Optional[str] = None
    description: Optional[str] = None
    difficulty_level: Optional[str] = None
    estimated_duration_minutes: Optional[int] = None
    tags: Optional[List[str]] = None
    thumbnail_url: Optional[str] = None
    is_published: Optional[bool] = None
    is_featured: Optional[bool] = None
    
    @validator('difficulty_level')
    def validate_difficulty(cls, v):
        if v is not None:
            allowed_levels = ['beginner', 'intermediate', 'advanced']
            if v not in allowed_levels:
                raise ValueError(f'Difficulty level must be one of: {allowed_levels}')
        return v


class CourseResponse(CourseBase):
    """Schema for course response data."""
    id: int
    slug: str
    total_lessons: int
    is_published: bool
    is_featured: bool
    view_count: int
    completion_rate: float
    average_rating: Optional[float] = None
    created_at: datetime
    updated_at: datetime
    published_at: Optional[datetime] = None
    
    # AI-generated content
    syllabus: Optional[Dict[str, Any]] = None
    learning_objectives: Optional[List[str]] = None
    prerequisites: Optional[List[str]] = None
    
    # Academic sources
    sources: Optional[List[Dict[str, Any]]] = None
    citations: Optional[List[Dict[str, Any]]] = None
    
    class Config:
        from_attributes = True


class CourseList(BaseModel):
    """Schema for course list items (summary view)."""
    id: int
    title: str
    description: str
    topic: str
    difficulty_level: str
    estimated_duration_minutes: int
    total_lessons: int
    thumbnail_url: Optional[str] = None
    is_published: bool
    is_featured: bool
    view_count: int
    completion_rate: float
    average_rating: Optional[float] = None
    tags: Optional[List[str]] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


class CourseSyllabus(BaseModel):
    """Schema for AI-generated course syllabus."""
    course_overview: str
    learning_objectives: List[str]
    prerequisites: List[str]
    modules: List[Dict[str, Any]]
    estimated_completion_time: int
    difficulty_progression: str
    assessment_strategy: str
    
    @validator('learning_objectives')
    def validate_objectives(cls, v):
        if len(v) < 3:
            raise ValueError('Course must have at least 3 learning objectives')
        return v


class CourseStats(BaseModel):
    """Course statistics schema."""
    total_enrollments: int
    active_learners: int
    completion_rate: float
    average_rating: float
    total_reviews: int
    lesson_completion_rates: List[Dict[str, Any]]
    engagement_metrics: Dict[str, Any]
    
    class Config:
        from_attributes = True


class CourseEnrollment(BaseModel):
    """Schema for course enrollment."""
    course_id: int
    user_id: int
    enrolled_at: datetime
    
    class Config:
        from_attributes = True


class CourseSearchFilters(BaseModel):
    """Schema for course search filters."""
    topic: Optional[str] = None
    difficulty_level: Optional[str] = None
    duration_min: Optional[int] = None
    duration_max: Optional[int] = None
    tags: Optional[List[str]] = None
    is_featured: Optional[bool] = None
    min_rating: Optional[float] = None
    
    
class CourseSearchResults(BaseModel):
    """Schema for course search results."""
    courses: List[CourseList]
    total_count: int
    page: int
    page_size: int
    total_pages: int
    filters_applied: CourseSearchFilters 