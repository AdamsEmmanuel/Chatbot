from pydantic_settings import BaseSettings
from typing import List
import os
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    # Database
    database_url: str = os.getenv("DATABASE_URL", "mysql+pymysql://chatbot_user:chatbot_password@localhost:3306/chatbot_db")
    
    # JWT
    secret_key: str = os.getenv("SECRET_KEY", "your-super-secret-jwt-key-change-this-in-production")
    algorithm: str = os.getenv("ALGORITHM", "HS256")
    access_token_expire_minutes: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
    
    # Environment
    environment: str = os.getenv("ENVIRONMENT", "development")
    debug: bool = os.getenv("DEBUG", "True").lower() == "true"
    
    # CORS
    cors_origins: List[str] = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
    
    class Config:
        env_file = ".env"

settings = Settings()
