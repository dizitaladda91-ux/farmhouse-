import uuid
import json
from sqlalchemy import String, Float, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base


class Location(Base):
    __tablename__ = "locations"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    state: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    city: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    locality: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    address: Mapped[str] = mapped_column(Text, nullable=True)
    pincode: Mapped[str] = mapped_column(String(20), nullable=True)
    latitude: Mapped[float] = mapped_column(Float, nullable=True)
    longitude: Mapped[float] = mapped_column(Float, nullable=True)
    nearby_places_json: Mapped[str] = mapped_column(Text, nullable=True, default="[]")

    properties = relationship("Property", back_populates="location")

    @property
    def nearby_places(self):
        if self.nearby_places_json:
            try:
                return json.loads(self.nearby_places_json)
            except Exception:
                return []
        return []

    @nearby_places.setter
    def nearby_places(self, value):
        self.nearby_places_json = json.dumps(value if value else [])
