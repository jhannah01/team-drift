import { useState, useEffect } from 'react';
import { Coordinates } from '../types';

interface GeolocationState {
  coordinates: Coordinates | null;
  loading: boolean;
  error: string | null;
}

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    coordinates: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
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
      maximumAge: 300000, // 5 minutes
    });
  }, []);

  return state;
};
