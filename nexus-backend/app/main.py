from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import auth as auth_routes
from app.api.routes import tournaments as tournaments_routes
from app.api.routes import matches as matches_routes
from app.api.routes import referee as referee_routes
from app.api.routes import leaderboard as leaderboard_routes
from app.api.routes import players as players_routes
from app.core.config import get_settings
from app.db.session import engine
from app.models import Base


settings = get_settings()

app = FastAPI(title="Nexus Arena API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # you can restrict this to your frontend origin later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    # In production, use Alembic instead of create_all
    Base.metadata.create_all(bind=engine)


app.include_router(auth_routes.router, prefix=settings.api_v1_prefix)
app.include_router(tournaments_routes.router, prefix=settings.api_v1_prefix)
app.include_router(matches_routes.router, prefix=settings.api_v1_prefix)
app.include_router(referee_routes.router, prefix=settings.api_v1_prefix)
app.include_router(leaderboard_routes.router, prefix=settings.api_v1_prefix)
app.include_router(players_routes.router, prefix=settings.api_v1_prefix)




