"""
Endpoints pour la gestion des hôtels, parkings et emplacements
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from api.deps import get_db_session
from app.services.parking import (
    HotelService, ParkingService, ParkingSpotService,
    StatusService, SpotTypeService
)
from app.schemas.parking import (
    HotelCreate, HotelUpdate, HotelInDB, HotelWithoutParkings,
    ParkingCreate, ParkingUpdate, ParkingInDB, ParkingWithoutSpots,
    ParkingSpotCreate, ParkingSpotUpdate, ParkingSpotInDB,
    StatusCreate, Status, SpotType
)

router = APIRouter()

# Endpoints pour les hôtels
@router.get("/hotels/", response_model=List[HotelWithoutParkings], tags=["hotels"])
def read_hotels(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db_session)
):
    """
    Récupérer tous les hôtels
    """
    return HotelService.get_all_hotels(db, skip, limit)

@router.get("/hotels/{hotel_id}", response_model=HotelInDB, tags=["hotels"])
def read_hotel(
    hotel_id: int,
    db: Session = Depends(get_db_session)
):
    """
    Récupérer les détails d'un hôtel par son ID
    """
    return HotelService.get_hotel_by_id(db, hotel_id)

@router.post("/hotels/", response_model=HotelInDB, status_code=201, tags=["hotels"])
def create_hotel(
    hotel: HotelCreate,
    db: Session = Depends(get_db_session)
):
    """
    Créer un nouvel hôtel
    """
    return HotelService.create_hotel(db, hotel)

@router.put("/hotels/{hotel_id}", response_model=HotelInDB, tags=["hotels"])
def update_hotel(
    hotel_id: int,
    hotel: HotelUpdate,
    db: Session = Depends(get_db_session)
):
    """
    Mettre à jour un hôtel
    """
    return HotelService.update_hotel(db, hotel_id, hotel)

@router.delete("/hotels/{hotel_id}", tags=["hotels"])
def delete_hotel(
    hotel_id: int,
    db: Session = Depends(get_db_session)
):
    """
    Supprimer un hôtel
    """
    return HotelService.delete_hotel(db, hotel_id)

# Endpoints pour les parkings
@router.get("/parkings/", response_model=List[ParkingWithoutSpots], tags=["parkings"])
def read_parkings(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db_session)
):
    """
    Récupérer tous les parkings
    """
    return ParkingService.get_all_parkings(db, None, skip, limit)

@router.get("/hotels/{hotel_id}/parkings/", response_model=List[ParkingWithoutSpots], tags=["parkings"])
def read_hotel_parkings(
    hotel_id: int,
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db_session)
):
    """
    Récupérer tous les parkings d'un hôtel spécifique
    """
    return ParkingService.get_all_parkings(db, hotel_id, skip, limit)

@router.get("/parkings/{parking_id}", response_model=ParkingInDB, tags=["parkings"])
def read_parking(
    parking_id: int,
    db: Session = Depends(get_db_session)
):
    """
    Récupérer les détails d'un parking par son ID
    """
    return ParkingService.get_parking_by_id(db, parking_id)

@router.post("/hotels/{hotel_id}/parkings/", response_model=ParkingInDB, status_code=201, tags=["parkings"])
def create_parking(
    hotel_id: int,
    parking: ParkingCreate,
    db: Session = Depends(get_db_session)
):
    """
    Créer un nouveau parking dans un hôtel
    """
    return ParkingService.create_parking(db, parking, hotel_id)

@router.put("/parkings/{parking_id}", response_model=ParkingInDB, tags=["parkings"])
def update_parking(
    parking_id: int,
    parking: ParkingUpdate,
    db: Session = Depends(get_db_session)
):
    """
    Mettre à jour un parking
    """
    return ParkingService.update_parking(db, parking_id, parking)

@router.delete("/parkings/{parking_id}", tags=["parkings"])
def delete_parking(
    parking_id: int,
    db: Session = Depends(get_db_session)
):
    """
    Supprimer un parking
    """
    return ParkingService.delete_parking(db, parking_id)

# Endpoints pour les emplacements de parking
@router.get("/spots/", response_model=List[ParkingSpotInDB], tags=["spots"])
def read_spots(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db_session)
):
    """
    Récupérer tous les emplacements
    """
    return ParkingSpotService.get_all_spots(db, None, skip, limit)

@router.get("/parkings/{parking_id}/spots/", response_model=List[ParkingSpotInDB], tags=["spots"])
def read_parking_spots(
    parking_id: int,
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db_session)
):
    """
    Récupérer tous les emplacements d'un parking spécifique
    """
    return ParkingSpotService.get_all_spots(db, parking_id, skip, limit)

@router.get("/spots/{spot_id}", response_model=ParkingSpotInDB, tags=["spots"])
def read_spot(
    spot_id: int,
    db: Session = Depends(get_db_session)
):
    """
    Récupérer les détails d'un emplacement par son ID
    """
    return ParkingSpotService.get_spot_by_id(db, spot_id)

@router.post("/parkings/{parking_id}/spots/", response_model=ParkingSpotInDB, status_code=201, tags=["spots"])
def create_spot(
    parking_id: int,
    spot: ParkingSpotCreate,
    db: Session = Depends(get_db_session)
):
    """
    Créer un nouvel emplacement dans un parking
    """
    return ParkingSpotService.create_spot(db, spot, parking_id)

@router.put("/spots/{spot_id}", response_model=ParkingSpotInDB, tags=["spots"])
def update_spot(
    spot_id: int,
    spot: ParkingSpotUpdate,
    db: Session = Depends(get_db_session)
):
    """
    Mettre à jour un emplacement
    """
    return ParkingSpotService.update_spot(db, spot_id, spot)

@router.delete("/spots/{spot_id}", tags=["spots"])
def delete_spot(
    spot_id: int,
    db: Session = Depends(get_db_session)
):
    """
    Supprimer un emplacement
    """
    return ParkingSpotService.delete_spot(db, spot_id)

# Endpoints pour les statuts des emplacements
@router.get("/statuses/", response_model=List[Status], tags=["statuses"])
def get_all_statuses(
    db: Session = Depends(get_db_session)
):
    """
    Récupérer tous les statuts disponibles
    """
    return StatusService.get_all_statuses(db)

@router.post("/spots/{spot_id}/statuses/", response_model=ParkingSpotInDB, tags=["statuses"])
def add_status_to_spot(
    spot_id: int,
    status: StatusCreate,
    db: Session = Depends(get_db_session)
):
    """
    Ajouter un statut à un emplacement
    """
    return ParkingSpotService.add_status_to_spot(db, spot_id, status)

@router.delete("/spots/{spot_id}/statuses/{status_id}", response_model=ParkingSpotInDB, tags=["statuses"])
def remove_status_from_spot(
    spot_id: int,
    status_id: int,
    db: Session = Depends(get_db_session)
):
    """
    Retirer un statut d'un emplacement
    """
    return ParkingSpotService.remove_status_from_spot(db, spot_id, status_id)

# Endpoints pour les types d'emplacement
@router.get("/types/", response_model=List[SpotType], tags=["types"])
def get_all_types(
    db: Session = Depends(get_db_session)
):
    """
    Récupérer tous les types d'emplacement disponibles
    """
    return SpotTypeService.get_all_types(db)