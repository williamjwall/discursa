"""
Pydantic schemas for request/response models
"""

from .user import (
    UserCreate,
    UserUpdate, 
    UserResponse,
    UserProfile,
    UserLogin,
    Token,
    TokenData,
)

from .course import (
    CourseCreate,
    CourseUpdate,
    CourseResponse,
    CourseList,
    CourseSyllabus,
)

from .lesson import (
    LessonCreate,
    LessonUpdate,
    LessonResponse,
    LessonList,
    LessonContent,
)

from .quiz import (
    QuizCreate,
    QuizUpdate,
    QuizResponse,
    QuestionCreate,
    QuestionResponse,
    AnswerCreate,
    AnswerResponse,
    QuizAttemptCreate,
    QuizAttemptResponse,
)

from .progress import (
    UserProgressResponse,
    LessonProgressResponse,
    LearningAnalytics,
    SpacedRepetitionSchedule,
)

__all__ = [
    # User schemas
    "UserCreate",
    "UserUpdate", 
    "UserResponse",
    "UserProfile",
    "UserLogin",
    "Token",
    "TokenData",
    
    # Course schemas
    "CourseCreate",
    "CourseUpdate",
    "CourseResponse",
    "CourseList",
    "CourseSyllabus",
    
    # Lesson schemas
    "LessonCreate",
    "LessonUpdate",
    "LessonResponse",
    "LessonList",
    "LessonContent",
    
    # Quiz schemas
    "QuizCreate",
    "QuizUpdate",
    "QuizResponse",
    "QuestionCreate",
    "QuestionResponse",
    "AnswerCreate",
    "AnswerResponse",
    "QuizAttemptCreate",
    "QuizAttemptResponse",
    
    # Progress schemas
    "UserProgressResponse",
    "LessonProgressResponse",
    "LearningAnalytics",
    "SpacedRepetitionSchedule",
] 