import secrets
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_admin, get_current_active_user
from app.db.session import get_db
from app.models.match import Match
from app.models.tournament import Tournament
from app.models.user import User
from app.schemas.match import MatchCreate, MatchOut, MatchUpdate, MatchResult, RoomCodeValidate
from app.schemas.tournament import GenerateFixtures


router = APIRouter(prefix="/matches", tags=["matches"])


def generate_room_code() -> str:
    """Generate a 6-character alphanumeric room code"""
    return secrets.token_urlsafe(6).upper()[:6]


@router.get("", response_model=list[MatchOut])
def list_matches(
    tournament_id: int | None = None,
    db: Session = Depends(get_db),
):
    query = db.query(Match)
    if tournament_id:
        query = query.filter(Match.tournament_id == tournament_id)
    return query.all()


@router.get("/{match_id}", response_model=MatchOut)
def get_match(match_id: int, db: Session = Depends(get_db)):
    match = db.query(Match).filter(Match.id == match_id).first()
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")
    return match


@router.post("", response_model=MatchOut)
def create_match(
    match_in: MatchCreate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
    # Verify tournament exists
    tournament = db.query(Tournament).filter(Tournament.id == match_in.tournament_id).first()
    if not tournament:
        raise HTTPException(status_code=404, detail="Tournament not found")
    
    match = Match(**match_in.model_dump())
    db.add(match)
    db.commit()
    db.refresh(match)
    return match


@router.post("/generate-fixtures", response_model=list[MatchOut])
def generate_fixtures(
    fixtures_in: GenerateFixtures,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
    tournament = db.query(Tournament).filter(Tournament.id == fixtures_in.tournament_id).first()
    if not tournament:
        raise HTTPException(status_code=404, detail="Tournament not found")
    
    num_teams = tournament.number_of_teams or 16
    
    # Simple single elimination bracket generation
    matches = []
    round_num = 1
    teams_remaining = num_teams
    
    while teams_remaining > 1:
        matches_in_round = teams_remaining // 2
        for i in range(matches_in_round):
            match = Match(
                tournament_id=tournament.id,
                team1_name=f"Team {i * 2 + 1}",
                team2_name=f"Team {i * 2 + 2}",
                status="Scheduled",
            )
            matches.append(match)
        
        teams_remaining = matches_in_round
        round_num += 1
    
    db.add_all(matches)
    db.commit()
    for match in matches:
        db.refresh(match)
    
    return matches


@router.put("/{match_id}/room-code", response_model=MatchOut)
def generate_room_code_for_match(
    match_id: int,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
    match = db.query(Match).filter(Match.id == match_id).first()
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")
    
    # Generate unique room code
    while True:
        code = generate_room_code()
        existing = db.query(Match).filter(Match.room_code == code).first()
        if not existing:
            break
    
    match.room_code = code
    db.commit()
    db.refresh(match)
    return match


@router.put("/{match_id}", response_model=MatchOut)
def update_match(
    match_id: int,
    match_in: MatchUpdate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
    match = db.query(Match).filter(Match.id == match_id).first()
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")
    
    update_data = match_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(match, field, value)
    
    db.commit()
    db.refresh(match)
    return match


@router.get("/player/my-matches", response_model=list[MatchOut])
def get_my_matches(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    # For now, return all matches. Later, filter by player's team
    return db.query(Match).filter(Match.status.in_(["Scheduled", "Live"])).all()


@router.get("/player/fixtures/{tournament_id}", response_model=list[MatchOut])
def get_tournament_fixtures(
    tournament_id: int,
    db: Session = Depends(get_db),
):
    return db.query(Match).filter(Match.tournament_id == tournament_id).all()


