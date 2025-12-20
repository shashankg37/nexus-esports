from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_active_user
from app.db.session import get_db
from app.models.player import Player
from app.models.user import User
from app.schemas.player import PlayerOut, PlayerCreate


router = APIRouter(prefix="/players", tags=["players"])


@router.get("", response_model=list[PlayerOut])
def list_players(db: Session = Depends(get_db)):
    """Get all players"""
    return db.query(Player).all()


@router.get("/me", response_model=PlayerOut | None)
def get_my_player(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """Get current user's player profile"""
    if current_user.role != "player":
        return None
    return db.query(Player).filter(Player.user_id == current_user.id).first()


@router.post("", response_model=PlayerOut)
def create_player(
    player_in: PlayerCreate,
    db: Session = Depends(get_db),
):
    """Create a player profile (usually called when user registers as player)"""
    # Check if player already exists for this user
    existing = db.query(Player).filter(Player.user_id == player_in.user_id).first()
    if existing:
        return existing
    
    player = Player(**player_in.model_dump())
    db.add(player)
    db.commit()
    db.refresh(player)
    return player


@router.get("/{player_id}", response_model=PlayerOut)
def get_player(player_id: int, db: Session = Depends(get_db)):
    """Get a specific player"""
    player = db.query(Player).filter(Player.id == player_id).first()
    if not player:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Player not found")
    return player


