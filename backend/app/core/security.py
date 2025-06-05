"""
Security utilities for authentication and authorization
"""

from datetime import datetime, timedelta
from typing import Optional, Any
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import structlog

from .config import settings

logger = structlog.get_logger()

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT token scheme
security = HTTPBearer()


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash."""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Generate password hash."""
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create JWT access token."""
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    
    logger.info("Access token created", user_id=data.get("sub"), expires=expire)
    return encoded_jwt


def verify_token(token: str) -> Optional[dict]:
    """Verify JWT token and return payload."""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        
        if user_id is None:
            logger.warning("Token verification failed: no user ID in payload")
            return None
            
        return payload
        
    except JWTError as e:
        logger.warning("Token verification failed", error=str(e))
        return None


async def get_current_user_id(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    """Extract and verify current user ID from JWT token."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = verify_token(credentials.credentials)
        if payload is None:
            raise credentials_exception
            
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
            
        return user_id
        
    except Exception as e:
        logger.error("Authentication error", error=str(e))
        raise credentials_exception


def create_refresh_token(data: dict) -> str:
    """Create JWT refresh token with longer expiration."""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=7)  # 7 days for refresh token
    to_encode.update({"exp": expire, "type": "refresh"})
    
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    logger.info("Refresh token created", user_id=data.get("sub"), expires=expire)
    return encoded_jwt


def verify_refresh_token(token: str) -> Optional[dict]:
    """Verify refresh token and return payload."""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        
        # Check if it's a refresh token
        if payload.get("type") != "refresh":
            logger.warning("Invalid token type for refresh")
            return None
            
        user_id: str = payload.get("sub")
        if user_id is None:
            logger.warning("Refresh token verification failed: no user ID")
            return None
            
        return payload
        
    except JWTError as e:
        logger.warning("Refresh token verification failed", error=str(e))
        return None


class RoleChecker:
    """Dependency to check user roles/permissions."""
    
    def __init__(self, required_roles: list = None, required_permissions: list = None):
        self.required_roles = required_roles or []
        self.required_permissions = required_permissions or []
    
    def __call__(self, current_user_id: str = Depends(get_current_user_id)):
        # This would typically fetch user from database and check roles/permissions
        # For now, we'll implement basic role checking structure
        
        # TODO: Implement actual role/permission checking with database
        # user = get_user_from_db(current_user_id)
        # if not has_required_roles(user, self.required_roles):
        #     raise HTTPException(status_code=403, detail="Insufficient permissions")
        
        return current_user_id


# Common role checkers
require_admin = RoleChecker(required_roles=["admin"])
require_instructor = RoleChecker(required_roles=["instructor", "admin"])
require_student = RoleChecker(required_roles=["student", "instructor", "admin"]) 