"""
Repository pour les opérations de base de données - Hiérarchie à trois niveaux
"""
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
import json

from app.models.parking import Hotel, Parking, ParkingSpot, Status, SpotType
from app.schemas.parking import (
    HotelCreate, ParkingCreate, ParkingSpotCreate, ParkingUpdate, 
    ParkingSpotUpdate, StatusCreate, SpotTypeCreate
)

class HotelRepository:
    """Repository pour les opérations sur les hôtels"""

    @staticmethod
    def get_all_hotels(db: Session, skip: int = 0, limit: int = 100) -> List[Hotel]:
        """Récupérer tous les hôtels"""
        return db.query(Hotel).offset(skip).limit(limit).all()

    @staticmethod
    def get_hotel_by_id(db: Session, hotel_id: int) -> Optional[Hotel]:
        """Récupérer un hôtel par son ID"""
        return db.query(Hotel).filter(Hotel.id == hotel_id).first()

    @staticmethod
    def get_hotel_by_name(db: Session, name: str) -> Optional[Hotel]:
        """Récupérer un hôtel par son nom"""
        return db.query(Hotel).filter(Hotel.name == name).first()

    @staticmethod
    def create_hotel(db: Session, hotel: HotelCreate) -> Hotel:
        """Créer un nouvel hôtel"""
        db_hotel = Hotel(**hotel.dict())
        db.add(db_hotel)
        db.commit()
        db.refresh(db_hotel)
        return db_hotel

    @staticmethod
    def update_hotel(db: Session, hotel_id: int, hotel_data: Dict[str, Any]) -> Optional[Hotel]:
        """Mettre à jour un hôtel"""
        db_hotel = HotelRepository.get_hotel_by_id(db, hotel_id)
        if db_hotel:
            for key, value in hotel_data.items():
                setattr(db_hotel, key, value)
            db.commit()
            db.refresh(db_hotel)
        return db_hotel

    @staticmethod
    def delete_hotel(db: Session, hotel_id: int) -> bool:
        """Supprimer un hôtel"""
        db_hotel = HotelRepository.get_hotel_by_id(db, hotel_id)
        if db_hotel:
            db.delete(db_hotel)
            db.commit()
            return True
        return False

class ParkingRepository:
    """Repository pour les opérations sur les parkings"""

    @staticmethod
    def get_all_parkings(db: Session, hotel_id: Optional[int] = None, skip: int = 0, limit: int = 100) -> List[Parking]:
        """Récupérer tous les parkings, optionnellement filtrés par hôtel"""
        query = db.query(Parking)
        if hotel_id:
            query = query.filter(Parking.hotel_id == hotel_id)
        return query.offset(skip).limit(limit).all()

    @staticmethod
    def get_parking_by_id(db: Session, parking_id: int) -> Optional[Parking]:
        """Récupérer un parking par son ID"""
        return db.query(Parking).filter(Parking.id == parking_id).first()

    @staticmethod
    def create_parking(db: Session, parking: ParkingCreate, hotel_id: int) -> Parking:
        """Créer un nouveau parking"""
        db_parking = Parking(**parking.dict(), hotel_id=hotel_id)
        db.add(db_parking)
        db.commit()
        db.refresh(db_parking)
        return db_parking

    @staticmethod
    def update_parking(db: Session, parking_id: int, parking_data: Dict[str, Any]) -> Optional[Parking]:
        """Mettre à jour un parking"""
        db_parking = ParkingRepository.get_parking_by_id(db, parking_id)
        if db_parking:
            for key, value in parking_data.items():
                setattr(db_parking, key, value)
            db.commit()
            db.refresh(db_parking)
        return db_parking

    @staticmethod
    def delete_parking(db: Session, parking_id: int) -> bool:
        """Supprimer un parking"""
        db_parking = ParkingRepository.get_parking_by_id(db, parking_id)
        if db_parking:
            db.delete(db_parking)
            db.commit()
            return True
        return False

class ParkingSpotRepository:
    """Repository pour les opérations sur les emplacements de parking"""

    @staticmethod
    def get_all_spots(db: Session, parking_id: Optional[int] = None, skip: int = 0, limit: int = 100) -> List[ParkingSpot]:
        """Récupérer tous les emplacements, optionnellement filtrés par parking"""
        query = db.query(ParkingSpot)
        if parking_id:
            query = query.filter(ParkingSpot.parking_id == parking_id)
        return query.offset(skip).limit(limit).all()

    @staticmethod
    def get_spot_by_id(db: Session, spot_id: int) -> Optional[ParkingSpot]:
        """Récupérer un emplacement par son ID"""
        return db.query(ParkingSpot).filter(ParkingSpot.id == spot_id).first()

    @staticmethod
    def get_or_create_status(db: Session, status_data: StatusCreate) -> Status:
        """Récupérer ou créer un statut"""
        db_status = db.query(Status).filter(Status.value == status_data.value).first()
        if not db_status:
            db_status = Status(**status_data.dict())
            db.add(db_status)
            db.commit()
            db.refresh(db_status)
        return db_status

    @staticmethod
    def get_or_create_spot_type(db: Session, type_value: str) -> SpotType:
        """Récupérer ou créer un type d'emplacement"""
        db_type = db.query(SpotType).filter(SpotType.value == type_value).first()
        if not db_type:
            db_type = SpotType(value=type_value)
            db.add(db_type)
            db.commit()
            db.refresh(db_type)
        return db_type

    @staticmethod
    def create_spot(db: Session, spot: ParkingSpotCreate, parking_id: int) -> ParkingSpot:
        """Créer un nouvel emplacement de parking"""
        # Création de l'emplacement avec les données de base
        spot_data = spot.dict(exclude={"types"})
        db_spot = ParkingSpot(
            **spot_data,
            parking_id=parking_id,
            pictures=json.dumps(spot.pictures if hasattr(spot, "pictures") else [])
        )
        
        # Ajout des types d'emplacement
        for type_value in spot.types:
            type_obj = ParkingSpotRepository.get_or_create_spot_type(db, type_value)
            db_spot.types.append(type_obj)
        
        db.add(db_spot)
        db.commit()
        db.refresh(db_spot)
        
        # Mettre à jour la capacité totale du parking
        db_parking = ParkingRepository.get_parking_by_id(db, parking_id)
        if db_parking:
            db_parking.total_capacity += 1
            db.commit()
            
        return db_spot

    @staticmethod
    def update_spot(db: Session, spot_id: int, spot_data: ParkingSpotUpdate) -> Optional[ParkingSpot]:
        """Mettre à jour un emplacement de parking"""
        db_spot = ParkingSpotRepository.get_spot_by_id(db, spot_id)
        
        if not db_spot:
            return None
            
        update_data = spot_data.dict(exclude_unset=True)
        
        # Gestion des types d'emplacement
        if "types" in update_data:
            types = update_data.pop("types")
            # Nettoyer les types existants
            db_spot.types = []
            # Ajouter les nouveaux types
            for type_value in types:
                type_obj = ParkingSpotRepository.get_or_create_spot_type(db, type_value)
                db_spot.types.append(type_obj)
        
        # Gestion des statuts
        if "statuses" in update_data:
            statuses = update_data.pop("statuses")
            # Nettoyer les statuts existants
            db_spot.statuses = []
            # Ajouter les nouveaux statuts
            for status_value in statuses:
                status_obj = db.query(Status).filter(Status.value == status_value).first()
                if status_obj:
                    db_spot.statuses.append(status_obj)
        
        # Gestion des images
        if "pictures" in update_data:
            update_data["pictures"] = json.dumps(update_data["pictures"])
            
        # Mettre à jour les autres champs
        for key, value in update_data.items():
            setattr(db_spot, key, value)
            
        db.commit()
        db.refresh(db_spot)
        return db_spot

    @staticmethod
    def delete_spot(db: Session, spot_id: int) -> bool:
        """Supprimer un emplacement de parking"""
        db_spot = ParkingSpotRepository.get_spot_by_id(db, spot_id)
        if db_spot:
            parking_id = db_spot.parking_id
            db.delete(db_spot)
            db.commit()
            
            # Mettre à jour la capacité totale du parking
            db_parking = ParkingRepository.get_parking_by_id(db, parking_id)
            if db_parking and db_parking.total_capacity > 0:
                db_parking.total_capacity -= 1
                db.commit()
            
            return True
        return False

    @staticmethod
    def add_status_to_spot(db: Session, spot_id: int, status_data: StatusCreate) -> Optional[ParkingSpot]:
        """Ajouter un statut à un emplacement"""
        db_spot = ParkingSpotRepository.get_spot_by_id(db, spot_id)
        if not db_spot:
            return None
            
        status = ParkingSpotRepository.get_or_create_status(db, status_data)
        db_spot.statuses.append(status)
        db.commit()
        db.refresh(db_spot)
        return db_spot

    @staticmethod
    def remove_status_from_spot(db: Session, spot_id: int, status_id: int) -> Optional[ParkingSpot]:
        """Retirer un statut d'un emplacement"""
        db_spot = ParkingSpotRepository.get_spot_by_id(db, spot_id)
        if not db_spot:
            return None
            
        db_status = db.query(Status).filter(Status.id == status_id).first()
        if db_status and db_status in db_spot.statuses:
            db_spot.statuses.remove(db_status)
            db.commit()
            db.refresh(db_spot)
        return db_spot

class StatusRepository:
    """Repository pour les opérations sur les statuts"""
    
    @staticmethod
    def get_all_statuses(db: Session, skip: int = 0, limit: int = 100) -> List[Status]:
        """Récupérer tous les statuts"""
        return db.query(Status).offset(skip).limit(limit).all()
        
    @staticmethod
    def get_status_by_id(db: Session, status_id: int) -> Optional[Status]:
        """Récupérer un statut par son ID"""
        return db.query(Status).filter(Status.id == status_id).first()

class SpotTypeRepository:
    """Repository pour les opérations sur les types d'emplacement"""
    
    @staticmethod
    def get_all_types(db: Session, skip: int = 0, limit: int = 100) -> List[SpotType]:
        """Récupérer tous les types d'emplacement"""
        return db.query(SpotType).offset(skip).limit(limit).all()
        
    @staticmethod
    def get_type_by_id(db: Session, type_id: int) -> Optional[SpotType]:
        """Récupérer un type d'emplacement par son ID"""
        return db.query(SpotType).filter(SpotType.id == type_id).first()