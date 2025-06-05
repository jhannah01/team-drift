
import os
from typing import List
import httpx
from dotenv import load_dotenv
from backend.models.shop import ShopSummary
from backend.services.busy import get_busyness

# Load environment variables from .env file
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '..', '.env'))

GOOGLE_MAPS_API_KEY = os.environ.get("GOOGLE_MAPS_API_KEY")
if not GOOGLE_MAPS_API_KEY:
    raise RuntimeError("Missing GOOGLE_MAPS_API_KEY environment variable. Please set it in your environment or .env file.")

async def get_travel_time(lat: float, lon: float, dest_lat: float, dest_lon: float) -> str:
    url = "https://maps.googleapis.com/maps/api/distancematrix/json"
    params = {
        "origins": f"{lat},{lon}",
        "destinations": f"{dest_lat},{dest_lon}",
        "key": GOOGLE_MAPS_API_KEY,
        "units": "imperial"
    }

    async with httpx.AsyncClient() as client:
        res = await client.get(url, params=params)
        data = res.json()
        try:
            return data["rows"][0]["elements"][0]["duration"]["text"]
        except Exception:
            return "N/A"

async def get_nearby_shops(lat: float, lon: float) -> List[ShopSummary]:
    url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
    params = {
        "location": f"{lat},{lon}",
        "radius": 8046,  # 5 miles
        "type": "cafe",
        "keyword": "coffee",
        "opennow": "true",
        "key": GOOGLE_MAPS_API_KEY
    }

    async with httpx.AsyncClient() as client:
        res = await client.get(url, params=params)
        data = res.json()

    # Prepare all travel time and busyness tasks in parallel
    places = list(data.get("results", []))

    # Gather travel times in parallel
    import asyncio
    travel_time_tasks = [get_travel_time(lat, lon, place["geometry"]["location"]["lat"], place["geometry"]["location"]["lng"]) for place in places]
    travel_times = await asyncio.gather(*travel_time_tasks)

    # Gather busyness lookups in parallel
    from backend.services.busy import get_busyness
    busyness_tasks = []
    for place in places:
        name = place["name"]
        address = place.get("vicinity", "Unknown address")
        formatted_address = f"({name}) {address}"
        busyness_tasks.append(get_busyness(formatted_address))
    busyness_results = await asyncio.gather(*busyness_tasks, return_exceptions=True)

    results = []
    for i, (place, travel_time, busyness) in enumerate(zip(places, travel_times, busyness_results)):
        name = place["name"]
        address = place.get("vicinity", "Unknown address")
        if isinstance(busyness, Exception) or busyness is None:
            busyness_str = "N/A"
        else:
            busyness_str = f"{busyness}%"
        results.append(ShopSummary(
            id=f"place_{i}",
            name=name,
            address=address,
            busyness=busyness_str,
            round_trip=travel_time,
            can_order=True
        ))
    return results
