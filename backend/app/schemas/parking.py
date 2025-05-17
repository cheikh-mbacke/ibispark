"""
Schémas Pydantic pour la validation des données - Hiérarchie à trois niveaux
"""
from typing import List, Optional, Dict, Any, Union
from pydantic import BaseModel, Field

class StatusBase(BaseModel):
    """Schéma de base pour le statut"""
    value: str
    color: str

class StatusCreate(StatusBase):
    """Schéma pour la création d'un statut"""
    pass

class Status(StatusBase):
    """Schéma pour un statut complet"""
    id: int

    class Config:
        from_attributes = True  # Remplace orm_mode=True dans Pydantic v2

class SpotTypeBase(BaseModel):
    """Schéma de base pour le type d'emplacement"""
    value: str

class SpotTypeCreate(SpotTypeBase):
    """Schéma pour la création d'un type d'emplacement"""
    pass

class SpotType(SpotTypeBase):
    """Schéma pour un type d'emplacement complet"""
    id: int

    class Config:
        from_attributes = True

class DimensionsBase(BaseModel):
    """Schéma pour les dimensions"""
    length: float
    width: float
    height: float
    surface: float

class LocationBase(BaseModel):
    """Schéma pour la localisation"""
    floor: int
    section: str
    address: Optional[str] = ""

class EquipmentBase(BaseModel):
    """Schéma pour l'équipement"""
    electric_charging: bool = False
    camera: bool = False
    sensor: bool = False

class PricingBase(BaseModel):
    """Schéma pour la tarification"""
    hourly_rate: float
    daily_rate: float
    monthly_rate: float

class ParkingSpotBase(BaseModel):
    """Schéma de base pour un emplacement"""
    number: int
    floor: int
    section: str
    address: Optional[str] = ""
    electric_charging: bool = False
    camera: bool = False
    sensor: bool = False
    length: float
    width: float
    height: float
    surface: float
    hourly_rate: float
    daily_rate: float
    monthly_rate: float
    pictures: List[str] = []

class ParkingSpotCreate(ParkingSpotBase):
    """Schéma pour la création d'un emplacement"""
    types: List[str]

class ParkingSpotUpdate(BaseModel):
    """Schéma pour la mise à jour d'un emplacement"""
    number: Optional[int] = None
    types: Optional[List[str]] = None
    length: Optional[float] = None
    width: Optional[float] = None
    height: Optional[float] = None
    surface: Optional[float] = None
    floor: Optional[int] = None
    section: Optional[str] = None
    address: Optional[str] = None
    electric_charging: Optional[bool] = None
    camera: Optional[bool] = None
    sensor: Optional[bool] = None
    hourly_rate: Optional[float] = None
    daily_rate: Optional[float] = None
    monthly_rate: Optional[float] = None
    pictures: Optional[List[str]] = None
    statuses: Optional[List[str]] = None

class ParkingSpotInDB(ParkingSpotBase):
    """Schéma pour un emplacement en base de données"""
    id: int
    types: List[str]
    statuses: List[StatusBase] = []
    parking_id: int

    class Config:
        from_attributes = True

class ParkingBase(BaseModel):
    """Schéma de base pour un parking"""
    name: str
    description: Optional[str] = None
    location: Optional[str] = None
    total_capacity: int = 0

class ParkingCreate(ParkingBase):
    """Schéma pour la création d'un parking"""
    pass

class ParkingUpdate(BaseModel):
    """Schéma pour la mise à jour d'un parking"""
    name: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None
    total_capacity: Optional[int] = None

class ParkingInDB(ParkingBase):
    """Schéma pour un parking en base de données"""
    id: int
    hotel_id: int
    spots: List[ParkingSpotInDB] = []

    class Config:
        from_attributes = True

class ParkingWithoutSpots(ParkingBase):
    """Schéma pour un parking sans ses emplacements"""
    id: int
    hotel_id: int

    class Config:
        from_attributes = True

class HotelBase(BaseModel):
    """Schéma de base pour un hôtel"""
    name: str
    address: Optional[str] = None

class HotelCreate(HotelBase):
    """Schéma pour la création d'un hôtel"""
    pass

class HotelUpdate(BaseModel):
    """Schéma pour la mise à jour d'un hôtel"""
    name: Optional[str] = None
    address: Optional[str] = None

class HotelInDB(HotelBase):
    """Schéma pour un hôtel en base de données"""
    id: int
    parkings: List[ParkingInDB] = []

    class Config:
        from_attributes = True

class HotelWithoutParkings(HotelBase):
    """Schéma pour un hôtel sans ses parkings"""
    id: int

    class Config:
        from_attributes = True