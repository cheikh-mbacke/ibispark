"""
Point d'entrée principal de l'application FastAPI avec initialisation des données par défaut
"""
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
import json
from sqlalchemy.orm import Session

from api.endpoints import parking
from database import engine, Base, SessionLocal
from app.models.parking import Status, SpotType, Hotel, Parking

# Créer les tables en base de données
Base.metadata.create_all(bind=engine)

# Créer et configurer l'application FastAPI
app = FastAPI(
    title="Parking Management API",
    description="API pour la gestion des hôtels, parkings et emplacements de stationnement",
    version="1.0.0"
)

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Autoriser toutes les origines en développement
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Gestion des exceptions
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": f"Une erreur interne est survenue: {str(exc)}"}
    )

# Ajouter les endpoints
app.include_router(parking.router, prefix="/api")

# Initialisation des données par défaut
def init_default_data():
    db = SessionLocal()
    try:
        # Vérifier si des statuts existent déjà
        if db.query(Status).count() == 0:
            # Ajouter les statuts par défaut
            default_statuses = [
                {"value": "personnel", "color": "#F4CCCC"},
                {"value": "late_checkout", "color": "#FF9900"},
                {"value": "arrival_today", "color": "#00FF00"},
                {"value": "already_in", "color": "#D9A384"},
                {"value": "contact_hotel", "color": "#FF00FF"},
                {"value": "external_company", "color": "#FFFF00"},
                {"value": "unknown_occupation", "color": "#FF0000"}
            ]
            for status_data in default_statuses:
                db.add(Status(**status_data))
            
            # Ajouter les types d'emplacement par défaut
            default_types = ["PMR", "STANDARD"]
            for type_value in default_types:
                db.add(SpotType(value=type_value))
            
            # Créer un hôtel et un parking par défaut s'ils n'existent pas
            if db.query(Hotel).count() == 0:
                hotel = Hotel(name="Hôtel Example", address="123 Rue de l'Example, 75000 Paris")
                db.add(hotel)
                db.flush()  # Pour obtenir l'ID de l'hôtel
                
                # Créer un parking par défaut
                parking = Parking(
                    name="Parking Principal",
                    description="Parking principal de l'hôtel",
                    location="Sous-sol",
                    hotel_id=hotel.id
                )
                db.add(parking)
            
            db.commit()
            print("Données par défaut initialisées avec succès.")
        else:
            print("Les données par défaut existent déjà.")
    except Exception as e:
        print(f"Erreur lors de l'initialisation des données: {e}")
        db.rollback()
        raise
    finally:
        db.close()

# Initialisation des données au démarrage
@app.on_event("startup")
async def startup_event():
    init_default_data()

# Route racine pour vérifier que l'API fonctionne
@app.get("/")
def read_root():
    return {"message": "Bienvenue sur l'API de gestion des parkings d'hôtels", "status": "OK"}

# Si le script est exécuté directement, lancer l'application
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)