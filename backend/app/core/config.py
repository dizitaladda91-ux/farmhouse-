import os
from typing import List, Union
from pydantic import field_validator, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "Farmhouse & Luxury Real Estate Marketplace"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # Environment
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    
    # Security
    SECRET_KEY: str = ""
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    ALGORITHM: str = "HS256"
    
    # Database
    DATABASE_URL: str = "sqlite+aiosqlite:///./farmhouse.db"
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
    ]
    
    # Media Storage
    UPLOAD_DIR: str = "uploads"
    MAX_UPLOAD_SIZE_MB: int = 50
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )

    @field_validator("DEBUG", mode="before")
    @classmethod
    def normalize_debug(cls, value):
        # Some hosts export DEBUG=release; treat it as the safe, disabled state.
        if isinstance(value, str) and value.lower() in {"release", "production"}:
            return False
        return value

    @model_validator(mode="after")
    def validate_production_settings(self):
        if self.ENVIRONMENT.lower() == "production":
            if self.DEBUG:
                raise ValueError("DEBUG must be False in production")
            if len(self.SECRET_KEY) < 32:
                raise ValueError("SECRET_KEY must be set to a unique value of at least 32 characters in production")
            if self.DATABASE_URL.startswith("sqlite"):
                raise ValueError("A PostgreSQL DATABASE_URL is required in production")
            if not self.BACKEND_CORS_ORIGINS or any("localhost" in origin or "127.0.0.1" in origin for origin in self.BACKEND_CORS_ORIGINS):
                raise ValueError("BACKEND_CORS_ORIGINS must contain only deployed frontend origins in production")
        return self


settings = Settings()
