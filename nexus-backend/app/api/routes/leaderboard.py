from fastapi import APIRouter, Depends
from sqlalchemy import func, desc
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.player import Player


router = APIRouter(prefix="/leaderboard", tags=["leaderboard"])


@router.get("")
def get_leaderboard(db: Session = Depends(get_db)):
    # Get all players ordered by total points (descending), then wins
    players = db.query(Player).order_by(
        desc(Player.total_points),
        desc(Player.wins)
    ).limit(50).all()
    
    leaderboard = []
    for rank, player in enumerate(players, start=1):
        leaderboard.append({
            "rank": rank,
            "player": player.player_name,
            "wins": player.wins,
            "losses": player.losses,
            "points": player.total_points,
            "player_id": player.id,
        })
    
    return leaderboard

