from datetime import datetime
from pydantic import BaseModel


class TournamentBase(BaseModel):
    name: str
    start_date: datetime | None = None
    number_of_teams: int | None = None
    format: str | None = None


class TournamentCreate(TournamentBase):
    pass


class TournamentUpdate(BaseModel):
    name: str | None = None
    start_date: datetime | None = None
    number_of_teams: int | None = None
    status: str | None = None
    format: str | None = None


class TournamentOut(TournamentBase):
    id: int
    status: str

    class Config:
        from_attributes = True


class GenerateFixtures(BaseModel):
    tournament_id: int
    format: str = "Single Elimination"  # Single Elimination, Double Elimination, Round Robin, Swiss System


