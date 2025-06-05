// Use the backend endpoint for real data
const API_BASE_URL = '/api';

// Minimal type definitions for compatibility
export interface Coordinates {
  lat: number;
  lng: number;
}

export interface SearchParams {
  query: string;
  location: Coordinates;
}

export interface Place {
  id: string;
  name: string;
  address: string;
  rating?: number;
  busyness?: {
    current: number | 'N/A';
    peak_hours: string[];
    trend?: 'increasing' | 'decreasing';
  };
  coordinates?: Coordinates;
  distance?: number;
  round_trip?: string; // e.g. "12 min" or "N/A"
}

export async function searchPlaces(params: SearchParams): Promise<Place[]> {
  try {
    // Call the backend API for real data, passing shop_type from the query
    const response = await fetch(`${API_BASE_URL}/shops?lat=${params.location.lat}&lon=${params.location.lng}&shop_type=${encodeURIComponent(params.query)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch places from backend');
    }
    const data = await response.json();
    // Adapt backend response to Place[] if needed
    // Assuming backend returns an array of shops with id, name, address, busyness, round_trip, can_order
    return data.map((shop: any) => {
      let busynessCurrent: number | 'N/A';
      if (typeof shop.busyness === 'string') {
        if (shop.busyness.trim().toUpperCase() === 'N/A') {
          busynessCurrent = 'N/A';
        } else {
          const parsed = parseInt(shop.busyness);
          busynessCurrent = isNaN(parsed) ? 'N/A' : parsed;
        }
      } else if (typeof shop.busyness === 'number') {
        busynessCurrent = shop.busyness;
      } else {
        busynessCurrent = 'N/A';
      }
      return {
        id: shop.id,
        name: shop.name,
        address: shop.address,
        rating: undefined, // backend does not provide rating
        busyness: {
          current: busynessCurrent,
          peak_hours: [], // backend does not provide peak hours
          // trend removed: backend does not provide trend
        },
        coordinates: undefined, // backend does not provide coordinates
        distance: undefined, // backend does not provide distance
        round_trip: shop.round_trip, // add round_trip from backend
      };
    });
  } catch (error) {
    console.error('Error searching places:', error);
    throw new Error('Failed to search places. Please try again.');
  }
}

