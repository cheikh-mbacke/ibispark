from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import pymysql

# Configuration pour MySQL avec XAMPP (utilisateur root par défaut)
# Remplacez "votre_mot_de_passe" par le mot de passe que vous avez créé
SQLALCHEMY_DATABASE_URL = "mysql+pymysql://parking_user:ZwXj]/[/[YNN46cw@localhost/parking_db"

# Création du moteur SQLAlchemy (sans l'argument check_same_thread spécifique à SQLite)
engine = create_engine(
    SQLALCHEMY_DATABASE_URL
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Fonction pour obtenir une session de base de données
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()