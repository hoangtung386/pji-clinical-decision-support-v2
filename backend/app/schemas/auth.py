from pydantic import BaseModel, EmailStr


class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: int
    username: str
    role: str


class RegisterRequest(BaseModel):
    username: str
    email: EmailStr
    full_name: str
    password: str
    role: str = "clinician"
