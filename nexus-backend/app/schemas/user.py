from pydantic import BaseModel, EmailStr, ConfigDict


# =========================
# Base User Schema
# =========================
class UserBase(BaseModel):
    email: EmailStr


# =========================
# User Creation Schema
# =========================
class UserCreate(UserBase):
    password: str
    role: str = "player"


# =========================
# User Response Schema
# =========================
class UserOut(UserBase):
    id: int
    role: str
    is_active: bool

    model_config = ConfigDict(from_attributes=True)


# =========================
# Auth / Token Schemas
# =========================
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    sub: str | None = None
    role: str | None = None

