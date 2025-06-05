from typing import List, Union
from backend.models.shop import ShopSummary, ShopDetail

def get_nearby_shops(lat: float, lon: float) -> List[ShopSummary]:
    return [
        ShopSummary(id="verve", name="Verve Coffee Roasters", busyness="10%", round_trip="8 mins"),
        ShopSummary(id="philz", name="Philz Coffee", busyness="30%", round_trip="10 mins"),
        ShopSummary(id="peets", name="Peet’s Coffee", busyness="50%", round_trip="12 mins"),
    ]

def get_shop_details(shop_id: str) -> Union[ShopDetail, dict]:
    details = {
        "verve": ShopDetail(name="Verve Coffee Roasters", address="250 S California Ave, Palo Alto, CA", can_order=True),
        "philz": ShopDetail(name="Philz Coffee", address="125 S Frances St, Sunnyvale, CA", can_order=True),
        "peets": ShopDetail(name="Peet’s Coffee", address="609 S Mathilda Ave, Sunnyvale, CA", can_order=False),
    }
    return details.get(shop_id, {"error": "Shop not found"})
