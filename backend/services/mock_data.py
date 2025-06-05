from typing import List
from backend.models.shop import ShopSummary

# Simulated in-memory state
_last_ordered = {"shop_id": None}

def get_nearby_shops(lat: float, lon: float) -> List[ShopSummary]:
    return [
        ShopSummary(
            id="verve",
            name="Verve Coffee Roasters",
            address="250 S California Ave, Palo Alto, CA",
            busyness="10%",
            round_trip="8 mins",
            can_order=True
        ),
        ShopSummary(
            id="philz",
            name="Philz Coffee",
            address="125 S Frances St, Sunnyvale, CA",
            busyness="30%",
            round_trip="10 mins",
            can_order=True
        ),
        ShopSummary(
            id="peets",
            name="Peet’s Coffee",
            address="609 S Mathilda Ave, Sunnyvale, CA",
            busyness="50%",
            round_trip="12 mins",
            can_order=False
        ),
    ]

def place_order(shop_id: str) -> dict:
    _last_ordered["shop_id"] = shop_id
    return {"message": f"Order placed successfully at {shop_id}"}

def get_last_order() -> dict:
    return {"last_ordered_shop_id": _last_ordered["shop_id"]}
