from pydantic import BaseModel, EmailStr
from app.models.user import UserRole
from app.schemas.user import UserResponse


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: UserRole
    user_id: str
    full_name: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str
