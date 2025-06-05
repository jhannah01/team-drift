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
    current: number | 'N/A';
    peak_hours: string[];
    trend?: 'increasing' | 'decreasing';
  };
  coordinates?: Coordinates;
  distance?: number;
  round_trip?: string; // e.g. "12 min" or "N/A"
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
  // Helper to get color for drive time bar
  const getDriveTimeColor = (mins: number) => {
    if (!maxRoundTripMinutes) return 'bg-gray-400';
    const percent = (mins / maxRoundTripMinutes) * 100;
    if (percent < 33) return 'bg-green-500';
    if (percent < 67) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  const [places, setPlaces] = useState<Place[]>([]);

  // Helper to extract minutes from a round_trip string
  const getDriveMinutes = (round_trip?: string) => {
    if (!round_trip || round_trip === 'N/A') return Infinity;
    const match = round_trip.match(/(\d+)\s*hour[s]?\s*(\d+)?\s*min[s]?|((\d+)\s*min[s]?)/i);
    if (!match) return Infinity;
    if (match[1]) {
      // e.g. "1 hour 5 mins"
      const hours = parseInt(match[1], 10);
      const mins = match[2] ? parseInt(match[2], 10) : 0;
      return hours * 60 + mins;
    } else if (match[4]) {
      // e.g. "12 mins"
      return parseInt(match[4], 10);
    }
    return Infinity;
  };

  // Sort places by busyness (least to greatest), N/A at end sorted by drive time
  const sortedPlaces = React.useMemo(() => {
    const withBusyness = places.filter(p => p.busyness && p.busyness.current !== 'N/A');
    const noBusyness = places.filter(p => !p.busyness || p.busyness.current === 'N/A');
    withBusyness.sort((a, b) => (a.busyness!.current as number) - (b.busyness!.current as number));
    noBusyness.sort((a, b) => getDriveMinutes(a.round_trip) - getDriveMinutes(b.round_trip));
    return [...withBusyness, ...noBusyness];
  }, [places]);

  // Compute the max round trip time in minutes for scaling the bar
  const getMaxRoundTripMinutes = () => {
    const times = places
      .map((p) => {
        if (!p.round_trip || p.round_trip === 'N/A') return null;
        // Extract minutes from e.g. "12 min", "1 hour 5 mins"
        const match = p.round_trip.match(/(\d+)\s*hour[s]?\s*(\d+)?\s*min[s]?|((\d+)\s*min[s]?)/i);
        if (!match) return null;
        if (match[1]) {
          // e.g. "1 hour 5 mins"
          const hours = parseInt(match[1], 10);
          const mins = match[2] ? parseInt(match[2], 10) : 0;
          return hours * 60 + mins;
        } else if (match[4]) {
          // e.g. "12 mins"
          return parseInt(match[4], 10);
        }
        return null;
      })
      .filter((v): v is number => v !== null);
    return times.length > 0 ? Math.max(...times) : 0;
  };

  const maxRoundTripMinutes = getMaxRoundTripMinutes();
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Landing Page - Only Search */}
      {!searchQuery && !searchLoading && (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center max-w-2xl mx-auto px-6">
            {/* Hero Section */}
            <div className="mb-12">
              <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
                VibeCheck
              </h1>
              <p className="text-xl text-gray-600 mb-2">
                Discover nearby places and see how busy they are
              </p>
              <p className="text-gray-500">
                Find the perfect time to visit restaurants, cafes, salons, and more
              </p>
            </div>

            {/* Location Status */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border">
                {locationLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                    <span className="text-sm text-gray-600">Getting your location...</span>
                  </>
                ) : locationError ? (
                  <>
                    <span className="text-red-500">⚠️</span>
                    <span className="text-sm text-red-600">Location access needed</span>
                  </>
                ) : coordinates ? (
                  <>
                    <span className="text-green-500">📍</span>
                    <span className="text-sm text-gray-600">Location found</span>
                  </>
                ) : (
                  <>
                    <span className="text-gray-400">📍</span>
                    <span className="text-sm text-gray-500">Location not available</span>
                  </>
                )}
              </div>
            </div>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="space-y-6">
              <div className="relative max-w-lg mx-auto">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Try 'nail salon', 'sushi', 'coffee shops'..."
                  className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all bg-white shadow-sm"
                  disabled={!coordinates}
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <span className="text-2xl">🔍</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={!query.trim() || !coordinates}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-2xl hover:from-blue-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all transform hover:scale-105 disabled:hover:scale-100 shadow-lg"
              >
                Search Places ✨
              </button>
            </form>

            {/* Example searches */}
            <div className="mt-12">
              <p className="text-sm text-gray-500 mb-4">Popular searches:</p>
              <div className="flex flex-wrap justify-center gap-3">
                {['coffee shops', 'restaurants', 'nail salon', 'grocery store', 'gas station', 'pharmacy'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-4 py-2 bg-white text-gray-600 text-sm rounded-full hover:bg-gray-50 border border-gray-200 transition-colors"
                    disabled={!coordinates}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results Page */}
      {(searchQuery || searchLoading) && (
        <div className="container py-8">
          {/* Header with search bar */}
          <header className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setPlaces([]);
                  setQuery('');
                }}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
              >
                <span>←</span>
                <span className="font-medium">Back to search</span>
              </button>
              
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                VibeCheck
              </h1>
            </div>

            {/* Compact search form */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for places..."
                  className="w-full px-6 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all bg-white"
                  disabled={searchLoading}
                />
                <button
                  type="submit"
                  disabled={searchLoading || !query.trim()}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors text-sm"
                >
                  {searchLoading ? '⏳' : '🔍'}
                </button>
              </div>
            </form>
          </header>

          {/* Results Section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {searchLoading ? 'Searching...' : `Results for "${searchQuery}"`}
            </h2>
            
            {searchLoading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-sm p-6 animate-pulse border">
                    <div className="h-4 bg-gray-200 rounded mb-3" />
                    <div className="h-3 bg-gray-200 rounded mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-2/3 mb-4" />
                    <div className="h-20 bg-gray-200 rounded" />
                  </div>
                ))}
              </div>
            ) : places.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <div className="text-xl text-gray-600 mb-2">No places found</div>
                <div className="text-gray-500">Try searching for something else or check your location</div>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {sortedPlaces.map((place) => (
                  <div key={place.id} className="bg-white rounded-xl shadow-sm hover:shadow-md border hover:border-blue-200 p-6 transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex flex-col flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 leading-tight">{place.name}</h3>
                        <div className="mt-1">
                          {place.rating !== undefined && place.rating !== null ? (
                            <span className="inline-flex items-center gap-1 text-sm font-semibold text-yellow-600 mt-1" title="Google Maps rating">
                              <span>⭐</span>
                              <span>{place.rating.toFixed(1)}</span>
                            </span>
                          ) : (
                            <span className="text-sm text-gray-400 mt-1">No rating</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 text-sm text-gray-600 mb-4">
                      <span className="text-gray-400">📍</span>
                      <span>{place.address}</span>
                    </div>

                    {place.distance && (
                      <div className="text-sm text-gray-500 mb-4">
                        {place.distance} km away
                      </div>
                    )}

                    {place.busyness && (
                      <div className="border-t pt-4">
                        <div className="flex items-center mb-3">
                          <span className="flex items-center gap-2">
                            <span className="text-lg">👥</span>
                            <span className="font-medium text-gray-900">Busyness</span>
                          </span>
                        </div>

                        {place.busyness.current === 'N/A' ? (
                          <div className="bg-gray-50 rounded-lg p-3 text-center">
                            <span className="text-gray-500 text-sm">Data unavailable</span>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center justify-between mb-3">
                              <span className={`px-3 py-1.5 rounded-lg text-sm font-medium ${getBusynessColor(place.busyness.current as number)}`}>
                                {getBusynessText(place.busyness.current as number)}
                              </span>
                              <span className="text-2xl font-bold text-gray-900">
                                {place.busyness.current}%
                              </span>
                            </div>

                            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                              <div
                                className={`h-3 rounded-full transition-all ${
                                  (place.busyness.current as number) < 30 ? 'bg-green-500' :
                                  (place.busyness.current as number) < 70 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${place.busyness.current}%` }}
                              />
                            </div>

                            {place.busyness.peak_hours.length > 0 && (
                              <div className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                                <span className="font-medium">Peak hours: </span>
                                <span>{place.busyness.peak_hours.join(', ')}</span>
                              </div>
                            )}
                          </>
                        )}

                        {/* Round Trip Visualization */}
                        <div className="mt-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-700 text-sm flex items-center gap-1">
                              <span>🚗</span>
                              <span>Round trip</span>
                            </span>
                            <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700">
                              {place.round_trip && place.round_trip !== 'N/A' ? place.round_trip : 'N/A'}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={(() => {
                                if (!place.round_trip || place.round_trip === 'N/A' || !maxRoundTripMinutes) return 'h-2 rounded-full transition-all bg-gray-400';
                                const match = place.round_trip.match(/(\d+)\s*hour[s]?\s*(\d+)?\s*min[s]?|((\d+)\s*min[s]?)/i);
                                let mins = 0;
                                if (!match) return 'h-2 rounded-full transition-all bg-gray-400';
                                if (match[1]) {
                                  mins = parseInt(match[1], 10) * 60 + (match[2] ? parseInt(match[2], 10) : 0);
                                } else if (match[4]) {
                                  mins = parseInt(match[4], 10);
                                }
                                return `h-2 rounded-full transition-all ${getDriveTimeColor(mins)}`;
                              })()}
                              style={{
                                width: (() => {
                                  if (!place.round_trip || place.round_trip === 'N/A' || !maxRoundTripMinutes) return '0%';
                                  const match = place.round_trip.match(/(\d+)\s*hour[s]?\s*(\d+)?\s*min[s]?|((\d+)\s*min[s]?)/i);
                                  let mins = 0;
                                  if (!match) return '0%';
                                  if (match[1]) {
                                    mins = parseInt(match[1], 10) * 60 + (match[2] ? parseInt(match[2], 10) : 0);
                                  } else if (match[4]) {
                                    mins = parseInt(match[4], 10);
                                  }
                                  if (mins === maxRoundTripMinutes) return '100%';
                                  const percent = Math.max(5, Math.round((mins / maxRoundTripMinutes) * 100));
                                  return `${percent}%`;
                                })(),
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
