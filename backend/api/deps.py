"""
Dépendances pour les endpoints FastAPI
"""
from fastapi import Depends
from sqlalchemy.orm import Session

from database import get_db

# Export la fonction get_db pour qu'elle soit utilisable dans les endpoints
def get_db_session():
    return next(get_db())