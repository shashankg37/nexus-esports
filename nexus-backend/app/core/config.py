from functools import lru_cache
import os

from dotenv import load_dotenv
from pydantic import BaseModel


# Load environment variables from a .env file in the project root (nexus-backend)
load_dotenv()


class Settings(BaseModel):
    api_v1_prefix: str = "/api/v1"
    secret_key: str = os.getenv("SECRET_KEY", "CHANGE_ME_SUPER_SECRET")
    access_token_expire_minutes: int = 60 * 24
    algorithm: str = "HS256"
    database_url: str = os.getenv(
        "DATABASE_URL",
        "postgresql+psycopg2://postgres:postgres@localhost:5432/nexus_arena",
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()



