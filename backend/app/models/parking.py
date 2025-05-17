"""
Modèle SQLAlchemy restructuré pour la hiérarchie Hôtels → Parkings → Emplacements
"""
from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, JSON, Table
from sqlalchemy.orm import relationship

from database import Base

# Table d'association pour les types d'emplacement
spot_types = Table(
    "spot_types",
    Base.metadata,
    Column("spot_id", Integer, ForeignKey("parking_spots.id"), primary_key=True),
    Column("type_id", Integer, ForeignKey("spot_type.id"), primary_key=True)
)

# Table d'association pour les statuts d'emplacement
spot_statuses = Table(
    "spot_statuses",
    Base.metadata,
    Column("spot_id", Integer, ForeignKey("parking_spots.id"), primary_key=True),
    Column("status_id", Integer, ForeignKey("statuses.id"), primary_key=True)
)

class Hotel(Base):
    """Modèle pour les hôtels"""
    __tablename__ = "hotels"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    address = Column(String)
    
    # Relation avec les parkings
    parkings = relationship("Parking", back_populates="hotel", cascade="all, delete-orphan")

class Parking(Base):
    """Modèle pour les parkings (zones de stationnement)"""
    __tablename__ = "parkings"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    hotel_id = Column(Integer, ForeignKey("hotels.id"))
    description = Column(String, nullable=True)
    location = Column(String, nullable=True)  # Ex: "Souterrain", "Extérieur", etc.
    total_capacity = Column(Integer, default=0)
    
    # Relations
    hotel = relationship("Hotel", back_populates="parkings")
    spots = relationship("ParkingSpot", back_populates="parking", cascade="all, delete-orphan")

class Status(Base):
    """Modèle pour les statuts possibles des emplacements"""
    __tablename__ = "statuses"

    id = Column(Integer, primary_key=True, index=True)
    value = Column(String, unique=True, index=True)
    color = Column(String)
    
    # Relation avec les emplacements
    spots = relationship(
        "ParkingSpot",
        secondary=spot_statuses,
        back_populates="statuses"
    )

class ParkingSpot(Base):
    """Modèle pour les emplacements individuels de stationnement"""
    __tablename__ = "parking_spots"

    id = Column(Integer, primary_key=True, index=True)
    number = Column(Integer, index=True)
    parking_id = Column(Integer, ForeignKey("parkings.id"))
    
    # Dimensions
    length = Column(Float)
    width = Column(Float)
    height = Column(Float)
    surface = Column(Float)
    
    # Localisation
    floor = Column(Integer)
    section = Column(String)
    address = Column(String)
    
    # Équipement
    electric_charging = Column(Boolean, default=False)
    camera = Column(Boolean, default=False)
    sensor = Column(Boolean, default=False)
    
    # Tarification
    hourly_rate = Column(Float)
    daily_rate = Column(Float)
    monthly_rate = Column(Float)
    
    # Photos (stockées en JSON)
    pictures = Column(JSON)
    
    # Relations
    parking = relationship("Parking", back_populates="spots")
    types = relationship(
        "SpotType",
        secondary=spot_types,
        back_populates="spots"
    )
    statuses = relationship(
        "Status",
        secondary=spot_statuses,
        back_populates="spots"
    )

class SpotType(Base):
    """Modèle pour les types d'emplacement"""
    __tablename__ = "spot_type"

    id = Column(Integer, primary_key=True, index=True)
    value = Column(String, unique=True, index=True)
    
    # Relation avec les emplacements
    spots = relationship(
        "ParkingSpot",
        secondary=spot_types,
        back_populates="types"
    )