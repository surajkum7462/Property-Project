import { useState, useEffect, useRef, useCallback } from 'react';

interface UseGoogleMapsOptions {
  apiKey: string;
  libraries?: string[];
  region?: string;
  language?: string;
}

interface UseGoogleMapsReturn {
  isLoaded: boolean;
  loadError: Error | null;
  googleMaps: typeof google.maps | null;
}

declare global {
  interface Window {
    google: typeof google;
    initMap: () => void;
  }
}

export function useGoogleMaps({
  apiKey,
  libraries = ['places'],
  region = 'IN',
  language = 'en'
}: UseGoogleMapsOptions): UseGoogleMapsReturn {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<Error | null>(null);
  const [googleMaps, setGoogleMaps] = useState<typeof google.maps | null>(null);
  const loadAttemptRef = useRef(false);

  const loadGoogleMaps = useCallback(() => {
    // Avoid multiple load attempts
    if (loadAttemptRef.current) return;
    loadAttemptRef.current = true;

    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      setGoogleMaps(window.google.maps);
      setIsLoaded(true);
      return;
    }

    // Validate API key
    if (!apiKey || apiKey === 'demo' || apiKey.length < 20) {
      setLoadError(new Error('Invalid or missing Google Maps API key'));
      return;
    }

    try {
      // Create script element
      const script = document.createElement('script');
      const librariesParam = libraries.length > 0 ? `&libraries=${libraries.join(',')}` : '';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}${librariesParam}&region=${region}&language=${language}&callback=initMap`;
      script.async = true;
      script.defer = true;

      // Global callback function
      window.initMap = () => {
        if (window.google && window.google.maps) {
          setGoogleMaps(window.google.maps);
          setIsLoaded(true);
          setLoadError(null);
          console.log('Google Maps loaded successfully');
        } else {
          const error = new Error('Google Maps API failed to initialize');
          setLoadError(error);
          console.error('Google Maps initialization failed');
        }
      };

      // Handle script load errors
      script.onerror = () => {
        const error = new Error('Failed to load Google Maps script');
        setLoadError(error);
        console.error('Google Maps script load error');
      };

      // Add script to document
      document.head.appendChild(script);

      // Timeout fallback
      setTimeout(() => {
        if (!isLoaded && !loadError) {
          setLoadError(new Error('Google Maps loading timeout'));
        }
      }, 10000);

    } catch (error) {
      setLoadError(error as Error);
      console.error('Error loading Google Maps:', error);
    }
  }, [apiKey, libraries, region, language, isLoaded, loadError]);

  useEffect(() => {
    loadGoogleMaps();

    // Cleanup function
    return () => {
      if (window.initMap) {
        delete window.initMap;
      }
    };
  }, [loadGoogleMaps]);

  return {
    isLoaded,
    loadError,
    googleMaps
  };
}

// Additional hook for map instance management
export function useMapInstance(
  containerRef: React.RefObject<HTMLDivElement>,
  options: google.maps.MapOptions,
  isLoaded: boolean
) {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [mapError, setMapError] = useState<Error | null>(null);

  useEffect(() => {
    if (!isLoaded || !containerRef.current || !window.google) {
      return;
    }

    try {
      const mapInstance = new window.google.maps.Map(containerRef.current, options);
      setMap(mapInstance);
      setMapError(null);
    } catch (error) {
      setMapError(error as Error);
      console.error('Error creating map instance:', error);
    }
  }, [isLoaded, containerRef, options]);

  return { map, mapError };
}

// Hook for managing markers
export function useMapMarkers(map: google.maps.Map | null) {
  const markersRef = useRef<google.maps.Marker[]>([]);

  const addMarker = useCallback((options: google.maps.MarkerOptions) => {
    if (!map) return null;

    const marker = new google.maps.Marker({
      ...options,
      map
    });

    markersRef.current.push(marker);
    return marker;
  }, [map]);

  const clearMarkers = useCallback(() => {
    markersRef.current.forEach(marker => {
      marker.setMap(null);
    });
    markersRef.current = [];
  }, []);

  const removeMarker = useCallback((markerToRemove: google.maps.Marker) => {
    const index = markersRef.current.indexOf(markerToRemove);
    if (index > -1) {
      markerToRemove.setMap(null);
      markersRef.current.splice(index, 1);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearMarkers();
    };
  }, [clearMarkers]);

  return {
    markers: markersRef.current,
    addMarker,
    clearMarkers,
    removeMarker
  };
}

// Hook for geocoding
export function useGeocoder(isLoaded: boolean) {
  const [geocoder, setGeocoder] = useState<google.maps.Geocoder | null>(null);

  useEffect(() => {
    if (isLoaded && window.google) {
      setGeocoder(new window.google.maps.Geocoder());
    }
  }, [isLoaded]);

  const geocodeAddress = useCallback(async (address: string): Promise<google.maps.GeocoderResult[]> => {
    if (!geocoder) {
      throw new Error('Geocoder not initialized');
    }

    return new Promise((resolve, reject) => {
      geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK' && results) {
          resolve(results);
        } else {
          reject(new Error(`Geocoding failed: ${status}`));
        }
      });
    });
  }, [geocoder]);

  return { geocoder, geocodeAddress };
}
