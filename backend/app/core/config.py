from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # App
    app_name: str = "OrthoSurg PJI Advisor API"
    app_version: str = "1.0.0"
    debug: bool = False

    # Database
    database_url: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/pji_db"
    database_url_sync: str = "postgresql+psycopg2://postgres:postgres@localhost:5432/pji_db"

    # JWT
    secret_key: str = "change-this-to-a-secure-random-string-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 480  # 8 hours

    # CORS
    cors_origins: list[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "https://hoangtung386.github.io",
    ]

    # Upload
    upload_dir: str = "uploads"
    max_upload_size_mb: int = 10

    # External Chatbot Service (separate repo/server)
    chatbot_service_url: str = ""  # e.g. https://pji-chatbot.onrender.com

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()
