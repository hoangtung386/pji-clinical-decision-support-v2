from datetime import datetime

from pydantic import BaseModel, EmailStr


class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
    full_name: str
    role: str
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class UserUpdate(BaseModel):
    full_name: str | None = None
    email: EmailStr | None = None
    is_active: bool | None = None
    role: str | None = None
