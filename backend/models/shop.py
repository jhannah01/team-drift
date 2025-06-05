from pydantic import BaseModel

class ShopSummary(BaseModel):
    id: str
    name: str
    address: str
    busyness: str
    round_trip: str
    can_order: bool

class ShopDetail(BaseModel):
    name: str
    address: str