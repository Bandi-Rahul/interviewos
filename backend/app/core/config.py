from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # App
    APP_NAME: str = "InterviewOS API"
    DEBUG: bool = False

    # Database
    DATABASE_URL: str

    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"

    # Auth (JWT)
    AUTH_SECRET: str
    AUTH_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours

    # CORS
    CORS_ALLOWED_ORIGINS: list[str] = [
        "http://localhost:5173",
        "https://bandi-rahul.github.io",
    ]

    # Storage (optional)
    CLOUD_STORAGE_URL: str = ""

    # AI (future)
    AI_PROVIDER_API_KEY: str = ""

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()  # type: ignore[call-arg]
