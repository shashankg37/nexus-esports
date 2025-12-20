from sqlalchemy import Integer, ForeignKey,String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base


class MatchPlayer(Base):
    __tablename__ = "match_players"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    match_id: Mapped[int] = mapped_column(ForeignKey("matches.id"), nullable=False)
    player_id: Mapped[int] = mapped_column(ForeignKey("players.id"), nullable=False)
    team: Mapped[str] = mapped_column(String(50), nullable=False)  # "team1" or "team2"
    score: Mapped[int] = mapped_column(Integer, nullable=False)

    # Relationships
    match: Mapped["Match"] = relationship("Match", back_populates="player_scores")
    player: Mapped["Player"] = relationship("Player", back_populates="match_scores")



