import React from 'react';
import { MapPin, Star, Users, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Place } from '../types';

interface PlaceCardProps {
  place: Place;
}

const PlaceCard: React.FC<PlaceCardProps> = ({ place }) => {
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

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp size={16} className="text-red-500" />;
      case 'decreasing':
        return <TrendingDown size={16} className="text-green-500" />;
      default:
        return <Minus size={16} className="text-gray-500" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900 flex-1">{place.name}</h3>
        {place.rating && (
          <div className="flex items-center gap-1 text-sm">
            <Star size={16} className="text-yellow-500 fill-current" />
            <span className="text-gray-700">{place.rating}</span>
          </div>
        )}
      </div>

      <div className="flex items-start gap-2 text-sm text-gray-600 mb-4">
        <MapPin size={16} className="mt-0.5 flex-shrink-0" />
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
              <Users size={18} className="text-gray-500" />
              <span className="font-medium text-gray-900">Current Busyness</span>
            </div>
            <div className="flex items-center gap-2">
              {getTrendIcon(place.busyness.trend)}
              <span className="text-sm text-gray-600 capitalize">
                {place.busyness.trend}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between mb-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getBusynessColor(place.busyness.current)}`}>
              {getBusynessText(place.busyness.current)}
            </span>
            <span className="text-lg font-bold text-gray-900">
              {place.busyness.current}%
            </span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                place.busyness.current < 30 ? 'bg-green-500' :
                place.busyness.current < 70 ? 'bg-yellow-500' : 'bg-red-500'
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
        </div>
      )}
    </div>
  );
};

export default PlaceCard;
