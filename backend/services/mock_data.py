# Simulated data logic – replace later with real APIs

def get_nearby_shops(lat: float, lon: float):
    # Simulated response (mocked occupancy + travel time)
    return [
        {"id": "shop1", "name": "Brew Point", "busyness": "10%", "round_trip": "15 mins"},
        {"id": "shop2", "name": "Café Nova", "busyness": "2%", "round_trip": "10 mins"},
        {"id": "shop3", "name": "Bean Scene", "busyness": "3%", "round_trip": "5 mins"},
    ]

def get_shop_details(shop_id: str):
    # Simulated details for individual shop
    details = {
        "shop1": {"name": "Brew Point", "address": "123 Bean St", "can_order": True},
        "shop2": {"name": "Café Nova", "address": "456 Roast Rd", "can_order": False},
        "shop3": {"name": "Bean Scene", "address": "789 Java Ave", "can_order": True},
    }
    return details.get(shop_id, {"error": "Shop not found"})
