from datetime import datetime
from pydantic import BaseModel


class MatchBase(BaseModel):
    tournament_id: int
    team1_name: str
    team2_name: str
    scheduled_at: datetime | None = None
    status: str = "Scheduled"


class MatchCreate(MatchBase):
    pass


class MatchUpdate(BaseModel):
    scheduled_at: datetime | None = None
    status: str | None = None
    room_code: str | None = None
    score_team1: int | None = None
    score_team2: int | None = None


class MatchOut(MatchBase):
    id: int
    room_code: str | None = None
    score_team1: int | None = None
    score_team2: int | None = None

    class Config:
        from_attributes = True


class MatchResult(BaseModel):
    score_team1: int
    score_team2: int


class RoomCodeValidate(BaseModel):
    code: str


