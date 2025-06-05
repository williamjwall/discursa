"""
User service for business logic and database operations
"""

from typing import Optional
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from sqlalchemy.orm import selectinload
import structlog

from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate
from app.core.security import get_password_hash, verify_password
from app.core.exceptions import UserNotFoundException, DatabaseException

logger = structlog.get_logger()


class UserService:
    """Service class for user-related operations."""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def get_user_by_id(self, user_id: int) -> Optional[User]:
        """Get user by ID."""
        try:
            stmt = select(User).where(User.id == user_id)
            result = await self.db.execute(stmt)
            return result.scalar_one_or_none()
        except Exception as e:
            logger.error("Failed to get user by ID", user_id=user_id, error=str(e))
            raise DatabaseException("Failed to retrieve user", error_code="USER_FETCH_ERROR")
    
    async def get_user_by_email(self, email: str) -> Optional[User]:
        """Get user by email address."""
        try:
            stmt = select(User).where(User.email == email)
            result = await self.db.execute(stmt)
            return result.scalar_one_or_none()
        except Exception as e:
            logger.error("Failed to get user by email", email=email, error=str(e))
            raise DatabaseException("Failed to retrieve user", error_code="USER_FETCH_ERROR")
    
    async def create_user(self, user_data: UserCreate) -> User:
        """Create a new user."""
        try:
            # Hash the password
            hashed_password = get_password_hash(user_data.password)
            
            # Create user instance
            user = User(
                email=user_data.email,
                hashed_password=hashed_password,
                full_name=user_data.full_name,
                role=user_data.role,
                bio=user_data.bio,
                avatar_url=user_data.avatar_url,
                preferred_lesson_duration=user_data.preferred_lesson_duration,
                daily_learning_goal=user_data.daily_learning_goal,
            )
            
            # Add to database
            self.db.add(user)
            await self.db.commit()
            await self.db.refresh(user)
            
            logger.info("User created successfully", user_id=user.id, email=user.email)
            return user
            
        except Exception as e:
            await self.db.rollback()
            logger.error("Failed to create user", email=user_data.email, error=str(e))
            raise DatabaseException("Failed to create user", error_code="USER_CREATE_ERROR")
    
    async def update_user(self, user_id: int, user_data: UserUpdate) -> Optional[User]:
        """Update user information."""
        try:
            # Get existing user
            user = await self.get_user_by_id(user_id)
            if not user:
                raise UserNotFoundException("User not found")
            
            # Update fields that are provided
            update_data = user_data.dict(exclude_unset=True)
            for field, value in update_data.items():
                setattr(user, field, value)
            
            user.updated_at = datetime.utcnow()
            
            await self.db.commit()
            await self.db.refresh(user)
            
            logger.info("User updated successfully", user_id=user_id)
            return user
            
        except Exception as e:
            await self.db.rollback()
            logger.error("Failed to update user", user_id=user_id, error=str(e))
            if isinstance(e, UserNotFoundException):
                raise
            raise DatabaseException("Failed to update user", error_code="USER_UPDATE_ERROR")
    
    async def authenticate_user(self, email: str, password: str) -> Optional[User]:
        """Authenticate user with email and password."""
        try:
            user = await self.get_user_by_email(email)
            if not user:
                return None
            
            if not verify_password(password, user.hashed_password):
                return None
            
            return user
            
        except Exception as e:
            logger.error("Authentication failed", email=email, error=str(e))
            return None
    
    async def update_last_login(self, user_id: int) -> None:
        """Update user's last login timestamp."""
        try:
            stmt = (
                update(User)
                .where(User.id == user_id)
                .values(last_login=datetime.utcnow())
            )
            await self.db.execute(stmt)
            await self.db.commit()
            
        except Exception as e:
            logger.error("Failed to update last login", user_id=user_id, error=str(e))
            # Don't raise exception for this non-critical operation
    
    async def deactivate_user(self, user_id: int) -> Optional[User]:
        """Deactivate a user account."""
        try:
            user = await self.get_user_by_id(user_id)
            if not user:
                raise UserNotFoundException("User not found")
            
            user.is_active = False
            user.updated_at = datetime.utcnow()
            
            await self.db.commit()
            await self.db.refresh(user)
            
            logger.info("User deactivated", user_id=user_id)
            return user
            
        except Exception as e:
            await self.db.rollback()
            logger.error("Failed to deactivate user", user_id=user_id, error=str(e))
            if isinstance(e, UserNotFoundException):
                raise
            raise DatabaseException("Failed to deactivate user", error_code="USER_DEACTIVATE_ERROR")
    
    async def activate_user(self, user_id: int) -> Optional[User]:
        """Activate a user account."""
        try:
            user = await self.get_user_by_id(user_id)
            if not user:
                raise UserNotFoundException("User not found")
            
            user.is_active = True
            user.updated_at = datetime.utcnow()
            
            await self.db.commit()
            await self.db.refresh(user)
            
            logger.info("User activated", user_id=user_id)
            return user
            
        except Exception as e:
            await self.db.rollback()
            logger.error("Failed to activate user", user_id=user_id, error=str(e))
            if isinstance(e, UserNotFoundException):
                raise
            raise DatabaseException("Failed to activate user", error_code="USER_ACTIVATE_ERROR")
    
    async def verify_user_email(self, user_id: int) -> Optional[User]:
        """Mark user email as verified."""
        try:
            user = await self.get_user_by_id(user_id)
            if not user:
                raise UserNotFoundException("User not found")
            
            user.is_verified = True
            user.updated_at = datetime.utcnow()
            
            await self.db.commit()
            await self.db.refresh(user)
            
            logger.info("User email verified", user_id=user_id)
            return user
            
        except Exception as e:
            await self.db.rollback()
            logger.error("Failed to verify user email", user_id=user_id, error=str(e))
            if isinstance(e, UserNotFoundException):
                raise
            raise DatabaseException("Failed to verify email", error_code="USER_VERIFY_ERROR")
    
    async def change_password(self, user_id: int, new_password: str) -> Optional[User]:
        """Change user password."""
        try:
            user = await self.get_user_by_id(user_id)
            if not user:
                raise UserNotFoundException("User not found")
            
            # Hash new password
            hashed_password = get_password_hash(new_password)
            user.hashed_password = hashed_password
            user.updated_at = datetime.utcnow()
            
            await self.db.commit()
            await self.db.refresh(user)
            
            logger.info("User password changed", user_id=user_id)
            return user
            
        except Exception as e:
            await self.db.rollback()
            logger.error("Failed to change password", user_id=user_id, error=str(e))
            if isinstance(e, UserNotFoundException):
                raise
            raise DatabaseException("Failed to change password", error_code="PASSWORD_CHANGE_ERROR") 