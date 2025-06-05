from pydantic import BaseModel

class ShopSummary(BaseModel):
    id: str
    name: str
    busyness: str  # e.g., "10%"
    round_trip: str  # e.g., "15 mins"

class ShopDetail(BaseModel):
    name: str
    address: str
    can_order: bool
