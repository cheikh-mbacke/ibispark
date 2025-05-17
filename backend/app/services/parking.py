"""
Services pour la logique métier - Hiérarchie à trois niveaux
"""
from typing import List, Optional, Dict, Any
from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.repositories.parking import (
    HotelRepository, ParkingRepository, ParkingSpotRepository,
    StatusRepository, SpotTypeRepository
)
from app.schemas.parking import (
    HotelCreate, HotelUpdate, HotelInDB, HotelWithoutParkings,
    ParkingCreate, ParkingUpdate, ParkingInDB, ParkingWithoutSpots,
    ParkingSpotCreate, ParkingSpotUpdate, ParkingSpotInDB,
    StatusCreate, Status, SpotType
)

class HotelService:
    """Service pour la gestion des hôtels"""

    @staticmethod
    def get_all_hotels(db: Session, skip: int = 0, limit: int = 100) -> List[HotelWithoutParkings]:
        """Récupérer tous les hôtels"""
        return HotelRepository.get_all_hotels(db, skip, limit)

    @staticmethod
    def get_hotel_by_id(db: Session, hotel_id: int) -> HotelInDB:
        """Récupérer un hôtel par son ID"""
        db_hotel = HotelRepository.get_hotel_by_id(db, hotel_id)
        if db_hotel is None:
            raise HTTPException(status_code=404, detail=f"Hôtel avec l'ID {hotel_id} non trouvé")
        return db_hotel

    @staticmethod
    def create_hotel(db: Session, hotel: HotelCreate) -> HotelInDB:
        """Créer un nouvel hôtel"""
        db_hotel = HotelRepository.get_hotel_by_name(db, hotel.name)
        if db_hotel:
            raise HTTPException(status_code=400, detail=f"Un hôtel avec le nom '{hotel.name}' existe déjà")
        return HotelRepository.create_hotel(db, hotel)

    @staticmethod
    def update_hotel(db: Session, hotel_id: int, hotel: HotelUpdate) -> HotelInDB:
        """Mettre à jour un hôtel"""
        db_hotel = HotelRepository.get_hotel_by_id(db, hotel_id)
        if db_hotel is None:
            raise HTTPException(status_code=404, detail=f"Hôtel avec l'ID {hotel_id} non trouvé")
            
        # Vérifier si le nouveau nom est déjà utilisé
        if hotel.name and hotel.name != db_hotel.name:
            existing_hotel = HotelRepository.get_hotel_by_name(db, hotel.name)
            if existing_hotel:
                raise HTTPException(status_code=400, detail=f"Un hôtel avec le nom '{hotel.name}' existe déjà")
                
        updated_hotel = HotelRepository.update_hotel(db, hotel_id, hotel.dict(exclude_unset=True))
        return updated_hotel

    @staticmethod
    def delete_hotel(db: Session, hotel_id: int) -> Dict[str, bool]:
        """Supprimer un hôtel"""
        db_hotel = HotelRepository.get_hotel_by_id(db, hotel_id)
        if db_hotel is None:
            raise HTTPException(status_code=404, detail=f"Hôtel avec l'ID {hotel_id} non trouvé")
            
        success = HotelRepository.delete_hotel(db, hotel_id)
        return {"success": success}

class ParkingService:
    """Service pour la gestion des parkings"""

    @staticmethod
    def get_all_parkings(db: Session, hotel_id: Optional[int] = None, skip: int = 0, limit: int = 100) -> List[ParkingWithoutSpots]:
        """Récupérer tous les parkings, optionnellement filtrés par hôtel"""
        # Vérifier si l'hôtel existe si un hotel_id est fourni
        if hotel_id:
            db_hotel = HotelRepository.get_hotel_by_id(db, hotel_id)
            if db_hotel is None:
                raise HTTPException(status_code=404, detail=f"Hôtel avec l'ID {hotel_id} non trouvé")
                
        return ParkingRepository.get_all_parkings(db, hotel_id, skip, limit)

    @staticmethod
    def get_parking_by_id(db: Session, parking_id: int) -> ParkingInDB:
        """Récupérer un parking par son ID"""
        db_parking = ParkingRepository.get_parking_by_id(db, parking_id)
        if db_parking is None:
            raise HTTPException(status_code=404, detail=f"Parking avec l'ID {parking_id} non trouvé")
        return db_parking

    @staticmethod
    def create_parking(db: Session, parking: ParkingCreate, hotel_id: int) -> ParkingInDB:
        """Créer un nouveau parking"""
        # Vérifier si l'hôtel existe
        db_hotel = HotelRepository.get_hotel_by_id(db, hotel_id)
        if db_hotel is None:
            raise HTTPException(status_code=404, detail=f"Hôtel avec l'ID {hotel_id} non trouvé")
                
        return ParkingRepository.create_parking(db, parking, hotel_id)

    @staticmethod
    def update_parking(db: Session, parking_id: int, parking: ParkingUpdate) -> ParkingInDB:
        """Mettre à jour un parking"""
        db_parking = ParkingRepository.get_parking_by_id(db, parking_id)
        if db_parking is None:
            raise HTTPException(status_code=404, detail=f"Parking avec l'ID {parking_id} non trouvé")
                    
        updated_parking = ParkingRepository.update_parking(db, parking_id, parking.dict(exclude_unset=True))
        return updated_parking

    @staticmethod
    def delete_parking(db: Session, parking_id: int) -> Dict[str, bool]:
        """Supprimer un parking"""
        db_parking = ParkingRepository.get_parking_by_id(db, parking_id)
        if db_parking is None:
            raise HTTPException(status_code=404, detail=f"Parking avec l'ID {parking_id} non trouvé")
            
        success = ParkingRepository.delete_parking(db, parking_id)
        return {"success": success}

class ParkingSpotService:
    """Service pour la gestion des emplacements de parking"""

    @staticmethod
    def get_all_spots(db: Session, parking_id: Optional[int] = None, skip: int = 0, limit: int = 100) -> List[ParkingSpotInDB]:
        """Récupérer tous les emplacements, optionnellement filtrés par parking"""
        # Vérifier si le parking existe si un parking_id est fourni
        if parking_id:
            db_parking = ParkingRepository.get_parking_by_id(db, parking_id)
            if db_parking is None:
                raise HTTPException(status_code=404, detail=f"Parking avec l'ID {parking_id} non trouvé")
                
        return ParkingSpotRepository.get_all_spots(db, parking_id, skip, limit)

    @staticmethod
    def get_spot_by_id(db: Session, spot_id: int) -> ParkingSpotInDB:
        """Récupérer un emplacement par son ID"""
        db_spot = ParkingSpotRepository.get_spot_by_id(db, spot_id)
        if db_spot is None:
            raise HTTPException(status_code=404, detail=f"Emplacement avec l'ID {spot_id} non trouvé")
        return db_spot

    @staticmethod
    def create_spot(db: Session, spot: ParkingSpotCreate, parking_id: int) -> ParkingSpotInDB:
        """Créer un nouvel emplacement de parking"""
        # Vérifier si le parking existe
        db_parking = ParkingRepository.get_parking_by_id(db, parking_id)
        if db_parking is None:
            raise HTTPException(status_code=404, detail=f"Parking avec l'ID {parking_id} non trouvé")
            
        # Vérifier si le numéro d'emplacement n'est pas déjà utilisé dans ce parking
        existing_spots = ParkingSpotRepository.get_all_spots(db, parking_id)
        for existing_spot in existing_spots:
            if existing_spot.number == spot.number:
                raise HTTPException(
                    status_code=400, 
                    detail=f"Un emplacement avec le numéro {spot.number} existe déjà dans ce parking"
                )
                
        return ParkingSpotRepository.create_spot(db, spot, parking_id)

    @staticmethod
    def update_spot(db: Session, spot_id: int, spot: ParkingSpotUpdate) -> ParkingSpotInDB:
        """Mettre à jour un emplacement de parking"""
        db_spot = ParkingSpotRepository.get_spot_by_id(db, spot_id)
        if db_spot is None:
            raise HTTPException(status_code=404, detail=f"Emplacement avec l'ID {spot_id} non trouvé")
            
        # Vérifier si le numéro est déjà utilisé (seulement si le numéro est modifié)
        if spot.number is not None and spot.number != db_spot.number:
            existing_spots = ParkingSpotRepository.get_all_spots(db, db_spot.parking_id)
            for existing_spot in existing_spots:
                if existing_spot.number == spot.number and existing_spot.id != spot_id:
                    raise HTTPException(
                        status_code=400, 
                        detail=f"Un emplacement avec le numéro {spot.number} existe déjà dans ce parking"
                    )
                    
        updated_spot = ParkingSpotRepository.update_spot(db, spot_id, spot)
        return updated_spot

    @staticmethod
    def delete_spot(db: Session, spot_id: int) -> Dict[str, bool]:
        """Supprimer un emplacement de parking"""
        db_spot = ParkingSpotRepository.get_spot_by_id(db, spot_id)
        if db_spot is None:
            raise HTTPException(status_code=404, detail=f"Emplacement avec l'ID {spot_id} non trouvé")
            
        success = ParkingSpotRepository.delete_spot(db, spot_id)
        return {"success": success}

    @staticmethod
    def add_status_to_spot(db: Session, spot_id: int, status: StatusCreate) -> ParkingSpotInDB:
        """Ajouter un statut à un emplacement"""
        db_spot = ParkingSpotRepository.get_spot_by_id(db, spot_id)
        if db_spot is None:
            raise HTTPException(status_code=404, detail=f"Emplacement avec l'ID {spot_id} non trouvé")
            
        updated_spot = ParkingSpotRepository.add_status_to_spot(db, spot_id, status)
        return updated_spot

    @staticmethod
    def remove_status_from_spot(db: Session, spot_id: int, status_id: int) -> ParkingSpotInDB:
        """Retirer un statut d'un emplacement"""
        db_spot = ParkingSpotRepository.get_spot_by_id(db, spot_id)
        if db_spot is None:
            raise HTTPException(status_code=404, detail=f"Emplacement avec l'ID {spot_id} non trouvé")
            
        updated_spot = ParkingSpotRepository.remove_status_from_spot(db, spot_id, status_id)
        return updated_spot

class StatusService:
    """Service pour la gestion des statuts"""
    
    @staticmethod
    def get_all_statuses(db: Session, skip: int = 0, limit: int = 100) -> List[Status]:
        """Récupérer tous les statuts disponibles"""
        return StatusRepository.get_all_statuses(db, skip, limit)
    
    @staticmethod
    def get_status_by_id(db: Session, status_id: int) -> Status:
        """Récupérer un statut par son ID"""
        db_status = StatusRepository.get_status_by_id(db, status_id)
        if db_status is None:
            raise HTTPException(status_code=404, detail=f"Statut avec l'ID {status_id} non trouvé")
        return db_status

class SpotTypeService:
    """Service pour la gestion des types d'emplacement"""
    
    @staticmethod
    def get_all_types(db: Session, skip: int = 0, limit: int = 100) -> List[SpotType]:
        """Récupérer tous les types d'emplacement disponibles"""
        return SpotTypeRepository.get_all_types(db, skip, limit)
    
    @staticmethod
    def get_type_by_id(db: Session, type_id: int) -> SpotType:
        """Récupérer un type d'emplacement par son ID"""
        db_type = SpotTypeRepository.get_type_by_id(db, type_id)
        if db_type is None:
            raise HTTPException(status_code=404, detail=f"Type avec l'ID {type_id} non trouvé")
        return db_type