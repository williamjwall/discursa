"""
Custom exceptions and exception handlers
"""

from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
import structlog
from typing import Any, Dict

logger = structlog.get_logger()


class CognitioFluxException(Exception):
    """Base exception for CognitioFlux application."""
    
    def __init__(self, message: str, error_code: str = None, details: Dict[str, Any] = None):
        self.message = message
        self.error_code = error_code
        self.details = details or {}
        super().__init__(self.message)


class DatabaseException(CognitioFluxException):
    """Database operation exception."""
    pass


class AuthenticationException(CognitioFluxException):
    """Authentication failure exception."""
    pass


class AuthorizationException(CognitioFluxException):
    """Authorization failure exception."""
    pass


class ValidationException(CognitioFluxException):
    """Data validation exception."""
    pass


class AIServiceException(CognitioFluxException):
    """AI service operation exception."""
    pass


class CourseNotFoundException(CognitioFluxException):
    """Course not found exception."""
    pass


class LessonNotFoundException(CognitioFluxException):
    """Lesson not found exception."""
    pass


class UserNotFoundException(CognitioFluxException):
    """User not found exception."""
    pass


async def cognitioflux_exception_handler(request: Request, exc: CognitioFluxException):
    """Handle CognitioFlux custom exceptions."""
    logger.error(
        "CognitioFlux exception occurred",
        error_type=type(exc).__name__,
        message=exc.message,
        error_code=exc.error_code,
        details=exc.details,
        path=request.url.path,
    )
    
    status_code = 500
    if isinstance(exc, (AuthenticationException, AuthorizationException)):
        status_code = 401
    elif isinstance(exc, ValidationException):
        status_code = 400
    elif isinstance(exc, (CourseNotFoundException, LessonNotFoundException, UserNotFoundException)):
        status_code = 404
    
    return JSONResponse(
        status_code=status_code,
        content={
            "error": {
                "type": type(exc).__name__,
                "message": exc.message,
                "code": exc.error_code,
                "details": exc.details,
            }
        },
    )


async def http_exception_handler(request: Request, exc: HTTPException):
    """Handle HTTP exceptions."""
    logger.warning(
        "HTTP exception occurred",
        status_code=exc.status_code,
        detail=exc.detail,
        path=request.url.path,
    )
    
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "type": "HTTPException",
                "message": exc.detail,
                "status_code": exc.status_code,
            }
        },
    )


async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handle request validation exceptions."""
    logger.warning(
        "Validation exception occurred",
        errors=exc.errors(),
        path=request.url.path,
    )
    
    return JSONResponse(
        status_code=422,
        content={
            "error": {
                "type": "ValidationError",
                "message": "Request validation failed",
                "details": exc.errors(),
            }
        },
    )


async def general_exception_handler(request: Request, exc: Exception):
    """Handle general exceptions."""
    logger.error(
        "Unexpected exception occurred",
        error_type=type(exc).__name__,
        message=str(exc),
        path=request.url.path,
        exc_info=True,
    )
    
    return JSONResponse(
        status_code=500,
        content={
            "error": {
                "type": "InternalServerError",
                "message": "An unexpected error occurred",
            }
        },
    )


def setup_exception_handlers(app: FastAPI):
    """Setup exception handlers for the FastAPI app."""
    app.add_exception_handler(CognitioFluxException, cognitioflux_exception_handler)
    app.add_exception_handler(StarletteHTTPException, http_exception_handler)
    app.add_exception_handler(RequestValidationError, validation_exception_handler)
    app.add_exception_handler(Exception, general_exception_handler) 