from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_referee
from app.db.session import get_db
from app.models.match import Match
from app.models.match_player import MatchPlayer
from app.models.player import Player
from app.schemas.match import RoomCodeValidate, MatchOut
from app.schemas.player import MatchResultWithScores


router = APIRouter(prefix="/referee", tags=["referee"])


@router.post("/validate-code", response_model=MatchOut)
def validate_match_code(
    code_data: RoomCodeValidate,
    db: Session = Depends(get_db),
    referee=Depends(get_current_referee),
):
    match = db.query(Match).filter(Match.room_code == code_data.code.upper()).first()
    if not match:
        raise HTTPException(status_code=404, detail="Invalid match code")
    return match


@router.post("/matches/{match_id}/result", response_model=MatchOut)
def submit_match_result(
    match_id: int,
    result: MatchResultWithScores,
    db: Session = Depends(get_db),
    referee=Depends(get_current_referee),
):
    match = db.query(Match).filter(Match.id == match_id).first()
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")
    
    # Validate that player scores sum to match scores
    team1_sum = sum(p.score for p in result.team1_players)
    team2_sum = sum(p.score for p in result.team2_players)
    
    if team1_sum != result.score_team1:
        raise HTTPException(
            status_code=400,
            detail=f"Team 1 player scores ({team1_sum}) do not match match score ({result.score_team1})"
        )
    
    if team2_sum != result.score_team2:
        raise HTTPException(
            status_code=400,
            detail=f"Team 2 player scores ({team2_sum}) do not match match score ({result.score_team2})"
        )
    
    # Validate all players exist
    all_player_ids = [p.player_id for p in result.team1_players] + [p.player_id for p in result.team2_players]
    players = db.query(Player).filter(Player.id.in_(all_player_ids)).all()
    if len(players) != len(all_player_ids):
        raise HTTPException(status_code=404, detail="One or more players not found")
    
    # Update match scores
    match.score_team1 = result.score_team1
    match.score_team2 = result.score_team2
    match.status = "Completed"
    
    # Delete existing player scores for this match (in case of resubmission)
    db.query(MatchPlayer).filter(MatchPlayer.match_id == match_id).delete()
    
    # Create match player scores
    match_players = []
    for player_score in result.team1_players:
        match_players.append(MatchPlayer(
            match_id=match_id,
            player_id=player_score.player_id,
            team="team1",
            score=player_score.score
        ))
    
    for player_score in result.team2_players:
        match_players.append(MatchPlayer(
            match_id=match_id,
            player_id=player_score.player_id,
            team="team2",
            score=player_score.score
        ))
    
    db.add_all(match_players)
    
    # Update player stats
    winner_team = "team1" if result.score_team1 > result.score_team2 else "team2"
    
    for player_score in result.team1_players:
        player = db.query(Player).filter(Player.id == player_score.player_id).first()
        if player:
            player.total_points += player_score.score
            if winner_team == "team1":
                player.wins += 1
            else:
                player.losses += 1
    
    for player_score in result.team2_players:
        player = db.query(Player).filter(Player.id == player_score.player_id).first()
        if player:
            player.total_points += player_score.score
            if winner_team == "team2":
                player.wins += 1
            else:
                player.losses += 1
    
    db.commit()
    db.refresh(match)
    return match


@router.get("/pending-matches", response_model=list[MatchOut])
def get_pending_matches(
    referee=Depends(get_current_referee),
    db: Session = Depends(get_db),
):
    return db.query(Match).filter(
        Match.status.in_(["Scheduled", "Live"]),
        Match.room_code.isnot(None)
    ).all()


@router.get("/completed-matches", response_model=list[MatchOut])
def get_completed_matches(
    referee=Depends(get_current_referee),
    db: Session = Depends(get_db),
):
    return db.query(Match).filter(Match.status == "Completed").order_by(Match.scheduled_at.desc()).limit(10).all()

