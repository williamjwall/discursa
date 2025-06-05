"""
User-related Pydantic schemas
"""

from typing import Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr, validator
from app.models.user import UserRole


class UserBase(BaseModel):
    """Base user schema with common fields."""
    email: EmailStr
    full_name: str
    role: UserRole = UserRole.STUDENT
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    preferred_lesson_duration: int = 3
    daily_learning_goal: int = 15


class UserCreate(UserBase):
    """Schema for creating a new user."""
    password: str
    
    @validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        return v
    
    @validator('preferred_lesson_duration')
    def validate_lesson_duration(cls, v):
        if v < 1 or v > 30:
            raise ValueError('Preferred lesson duration must be between 1 and 30 minutes')
        return v
    
    @validator('daily_learning_goal')
    def validate_daily_goal(cls, v):
        if v < 5 or v > 300:
            raise ValueError('Daily learning goal must be between 5 and 300 minutes')
        return v


class UserUpdate(BaseModel):
    """Schema for updating user information."""
    full_name: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    preferred_lesson_duration: Optional[int] = None
    daily_learning_goal: Optional[int] = None
    
    @validator('preferred_lesson_duration')
    def validate_lesson_duration(cls, v):
        if v is not None and (v < 1 or v > 30):
            raise ValueError('Preferred lesson duration must be between 1 and 30 minutes')
        return v
    
    @validator('daily_learning_goal')
    def validate_daily_goal(cls, v):
        if v is not None and (v < 5 or v > 300):
            raise ValueError('Daily learning goal must be between 5 and 300 minutes')
        return v


class UserResponse(UserBase):
    """Schema for user response data."""
    id: int
    is_active: bool
    is_verified: bool
    created_at: datetime
    updated_at: datetime
    last_login: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class UserProfile(BaseModel):
    """Public user profile schema."""
    id: int
    full_name: str
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    role: UserRole
    created_at: datetime
    
    class Config:
        from_attributes = True


class UserLogin(BaseModel):
    """Schema for user login."""
    email: EmailStr
    password: str


class Token(BaseModel):
    """JWT token response schema."""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int


class TokenData(BaseModel):
    """Token payload data schema."""
    user_id: Optional[str] = None


class PasswordReset(BaseModel):
    """Schema for password reset request."""
    email: EmailStr


class PasswordResetConfirm(BaseModel):
    """Schema for password reset confirmation."""
    token: str
    new_password: str
    
    @validator('new_password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        return v


class EmailVerification(BaseModel):
    """Schema for email verification."""
    token: str


class UserStats(BaseModel):
    """User learning statistics schema."""
    total_courses_enrolled: int
    total_courses_completed: int
    total_lessons_completed: int
    total_time_spent_minutes: int
    current_streak_days: int
    achievements_earned: int
    
    class Config:
        from_attributes = True 