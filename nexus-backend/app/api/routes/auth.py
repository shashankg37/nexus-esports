from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.api.deps import get_current_active_user
from app.core.config import get_settings
from app.core.security import (
    create_access_token,
    get_password_hash,
    verify_password,
)
from app.db.session import get_db
from app.models.user import User
from app.models.player import Player
from app.schemas.user import Token, UserCreate, UserOut


router = APIRouter(prefix="/auth", tags=["auth"])
settings = get_settings()


# =========================
# REGISTER (JSON BODY)
# =========================
@router.post("/register", response_model=UserOut)
def register(user_in: UserCreate, db: Session = Depends(get_db)) -> UserOut:
    existing = db.query(User).filter(User.email == user_in.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    db_user = User(
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        role=user_in.role,
        is_active=True,   # ✅ IMPORTANT (prevents response validation issues)
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Auto-create player profile if role is "player"
    if user_in.role == "player":
        # Extract player name from email (before @) or use email
        player_name = user_in.email.split("@")[0].replace(".", " ").title()
        player = Player(
            user_id=db_user.id,
            player_name=player_name,
            wins=0,
            losses=0,
            total_points=0,
        )
        db.add(player)
        db.commit()
    
    return db_user


# =========================
# LOGIN (FORM DATA ONLY)
# =========================
@router.post("/login", response_model=Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
) -> Token:
    user = db.query(User).filter(User.email == form_data.username).first()

    if not user or not verify_password(
        form_data.password,
        user.hashed_password,
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(
        minutes=settings.access_token_expire_minutes
    )

    access_token = create_access_token(
        data={"sub": user.email, "role": user.role},
        expires_delta=access_token_expires,
    )

    # ✅ Explicit token_type avoids edge 422s
    return Token(
        access_token=access_token,
        token_type="bearer",
    )


# =========================
# CURRENT USER
# =========================
@router.get("/me", response_model=UserOut)
def read_users_me(
    current_user: User = Depends(get_current_active_user),
) -> UserOut:
    return current_user
