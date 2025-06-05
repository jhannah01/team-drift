import React, { useState } from 'react';
import './App.css';

// Simple types
interface Coordinates {
  lat: number;
  lng: number;
}

interface Place {
  id: string;
  name: string;
  address: string;
  rating?: number;
  busyness?: {
    current: number;
    peak_hours: string[];
    trend: 'increasing' | 'decreasing' | 'stable';
  };
  coordinates: Coordinates;
  distance?: number;
}

// Simple geolocation hook
const useGeolocation = () => {
  const [state, setState] = useState<{
    coordinates: Coordinates | null;
    loading: boolean;
    error: string | null;
  }>({
    coordinates: null,
    loading: true,
    error: null,
  });

  React.useEffect(() => {
    if (!navigator.geolocation) {
      setState({
        coordinates: null,
        loading: false,
        error: 'Geolocation is not supported by this browser.',
      });
      return;
    }

    const handleSuccess = (position: GeolocationPosition) => {
      setState({
        coordinates: {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        },
        loading: false,
        error: null,
      });
    };

    const handleError = (error: GeolocationPositionError) => {
      setState({
        coordinates: null,
        loading: false,
        error: error.message,
      });
    };

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000,
    });
  }, []);

  return state;
};


// Use the real API function
import { searchPlaces } from './services/api';

function App() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [query, setQuery] = useState('');
  const { coordinates, loading: locationLoading, error: locationError } = useGeolocation();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || !coordinates) return;

    setSearchLoading(true);
    setSearchQuery(query.trim());

    try {
      const results = await searchPlaces({ query: query.trim(), location: coordinates });
      setPlaces(results);
    } catch (error) {
      console.error('Search failed:', error);
      setPlaces([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const getBusynessColor = (level: number) => {
    if (level < 30) return 'text-green-600 bg-green-100';
    if (level < 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getBusynessText = (level: number) => {
    if (level < 30) return 'Not busy';
    if (level < 70) return 'Moderately busy';
    return 'Very busy';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        <header className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            📍 VibeCheck
          </h1>
          <p className="text-gray-600 text-lg">
            Find nearby places and see how busy they are right now
          </p>
        </header>

        <div className="max-w-md mx-auto mb-12">
          <div className="mb-4">
            <div className="text-sm text-gray-600 mb-2">
              📍 {locationLoading ? (
                'Getting your location...'
              ) : locationError ? (
                <span className="text-red-500">Location error: {locationError}</span>
              ) : coordinates ? (
                `Located at ${coordinates.lat.toFixed(4)}, ${coordinates.lng.toFixed(4)}`
              ) : (
                'Location not available'
              )}
            </div>
          </div>

          <form onSubmit={handleSearch} className="space-y-4">
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for coffee, thai food, restaurants..."
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent outline-none"
                disabled={searchLoading || !coordinates}
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔍
              </span>
            </div>

            <button
              type="submit"
              disabled={searchLoading || !query.trim() || !coordinates}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {searchLoading ? '🔄 Searching...' : '🔍 Search Places'}
            </button>
          </form>
        </div>

        {searchQuery && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Results for "{searchQuery}"
            </h2>
            
            {searchLoading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded mb-3" />
                    <div className="h-3 bg-gray-200 rounded mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-2/3 mb-4" />
                    <div className="h-20 bg-gray-200 rounded" />
                  </div>
                ))}
              </div>
            ) : places.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg mb-2">No places found</div>
                <div className="text-gray-400">Try searching for something else</div>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {places.map((place) => (
                  <div key={place.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 flex-1">{place.name}</h3>
                      {place.rating && (
                        <div className="flex items-center gap-1 text-sm">
                          <span>⭐</span>
                          <span className="text-gray-700">{place.rating}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-start gap-2 text-sm text-gray-600 mb-4">
                      <span>📍</span>
                      <span>{place.address}</span>
                    </div>

                    {place.distance && (
                      <div className="text-sm text-gray-500 mb-4">
                        {place.distance} km away
                      </div>
                    )}

                    {place.busyness && (
                      <div className="border-t pt-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span>👥</span>
                            <span className="font-medium text-gray-900">Current Busyness</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span>{place.busyness.trend === 'increasing' ? '📈' : place.busyness.trend === 'decreasing' ? '📉' : '➖'}</span>
                            <span className="text-sm text-gray-600 capitalize">
                              {place.busyness.trend}
                            </span>
                          </div>
                        </div>

                        {place.busyness.current === 'N/A' ? (
                          <span className="text-gray-400 text-sm font-medium">Data unavailable</span>
                        ) : (
                          <>
                            <div className="flex items-center justify-between mb-3">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getBusynessColor(place.busyness.current as number)}`}>
                                {getBusynessText(place.busyness.current as number)}
                              </span>
                              <span className="text-lg font-bold text-gray-900">
                                {place.busyness.current}%
                              </span>
                            </div>

                            <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                              <div
                                className={`h-2 rounded-full transition-all ${
                                  (place.busyness.current as number) < 30 ? 'bg-green-500' :
                                  (place.busyness.current as number) < 70 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${place.busyness.current}%` }}
                              />
                            </div>

                            <div className="text-sm text-gray-600">
                              <span className="font-medium">Peak hours:</span>
                              <div className="mt-1">
                                {place.busyness.peak_hours.join(', ')}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
