from pydantic import BaseModel


class PlayerBase(BaseModel):
    player_name: str


class PlayerCreate(PlayerBase):
    user_id: int


class PlayerOut(PlayerBase):
    id: int
    user_id: int
    wins: int
    losses: int
    total_points: int

    class Config:
        from_attributes = True


class PlayerScoreInput(BaseModel):
    player_id: int
    score: int


class MatchResultWithScores(BaseModel):
    score_team1: int
    score_team2: int
    team1_players: list[PlayerScoreInput]  # List of player scores for team 1
    team2_players: list[PlayerScoreInput]  # List of player scores for team 2


