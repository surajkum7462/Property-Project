import React, { useRef, useEffect, useState, useCallback, memo } from 'react';
import { 
  MapPin, 
  Navigation, 
  Search, 
  Filter,
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Home,
  School,
  Heart,
  Utensils,
  Building,
  Dumbbell,
  ShoppingBag,
  TreePine,
  Train
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { PropertyMapProps, Property, NearbyAmenity, AmenityType } from '@shared/api';
import { useGoogleMaps, useMapInstance, useMapMarkers, useGeocoder } from '../hooks/useGoogleMaps';
import { useNearbyAmenities, useAmenityTypeFilters } from '../hooks/useNearbyAmenities';

// Amenity type icons
const amenityIcons: Record<AmenityType, React.ComponentType<any>> = {
  school: School,
  hospital: Heart,
  restaurant: Utensils,
  bank: Building,
  gym: Dumbbell,
  shopping_mall: ShoppingBag,
  park: TreePine,
  metro_station: Train,
  gas_station: Building,
  pharmacy: Heart
};

// Amenity colors
const amenityColors: Record<AmenityType, string> = {
  school: '#3b82f6',
  hospital: '#ef4444',
  restaurant: '#f97316',
  bank: '#10b981',
  gym: '#8b5cf6',
  shopping_mall: '#ec4899',
  park: '#059669',
  metro_station: '#6366f1',
  gas_station: '#eab308',
  pharmacy: '#06b6d4'
};

interface MapControlsProps {
  map: google.maps.Map | null;
  onSearchLocation: (address: string) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  showAmenities: boolean;
  onToggleAmenities: (show: boolean) => void;
  activeAmenityTypes: AmenityType[];
  onAmenityTypeToggle: (type: AmenityType) => void;
  showRadius: boolean;
  onToggleRadius: (show: boolean) => void;
  searchRadius: number;
  onRadiusChange: (radius: number) => void;
}

const MapControls = memo(({
  map,
  onSearchLocation,
  searchValue,
  onSearchChange,
  showAmenities,
  onToggleAmenities,
  activeAmenityTypes,
  onAmenityTypeToggle,
  showRadius,
  onToggleRadius,
  searchRadius,
  onRadiusChange
}: MapControlsProps) => {
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = () => {
    if (searchValue.trim()) {
      onSearchLocation(searchValue);
    }
  };

  const handleZoomIn = () => {
    if (map) {
      map.setZoom((map.getZoom() || 10) + 1);
    }
  };

  const handleZoomOut = () => {
    if (map) {
      map.setZoom((map.getZoom() || 10) - 1);
    }
  };

  const handleResetView = () => {
    if (map) {
      map.setZoom(12);
      map.setCenter({ lat: 12.9716, lng: 77.5946 }); // Bangalore center
    }
  };

  return (
    <>
      {/* Search Controls */}
      <div className="absolute top-4 left-4 right-4 z-10">
        <Card className="shadow-lg">
          <CardContent className="p-4">
            <div className="flex gap-2">
              <div className="flex-1 flex gap-2">
                <Input
                  placeholder="Search location on map..."
                  value={searchValue}
                  onChange={(e) => onSearchChange(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="flex-1"
                />
                <Button onClick={handleSearch} size="sm">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>
            
            {showFilters && (
              <div className="mt-4 space-y-4 border-t pt-4">
                {/* Amenities Toggle */}
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-amenities" className="text-sm font-medium">
                    Show Amenities
                  </Label>
                  <Switch
                    id="show-amenities"
                    checked={showAmenities}
                    onCheckedChange={onToggleAmenities}
                  />
                </div>

                {/* Radius Toggle */}
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-radius" className="text-sm font-medium">
                    Show Search Radius
                  </Label>
                  <Switch
                    id="show-radius"
                    checked={showRadius}
                    onCheckedChange={onToggleRadius}
                  />
                </div>

                {/* Radius Slider */}
                {showRadius && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Search Radius: {(searchRadius / 1000).toFixed(1)} km
                    </Label>
                    <input
                      type="range"
                      min="500"
                      max="10000"
                      step="500"
                      value={searchRadius}
                      onChange={(e) => onRadiusChange(parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                )}

                {/* Amenity Type Filters */}
                {showAmenities && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Amenity Types</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(amenityIcons).map(([type, IconComponent]) => (
                        <Button
                          key={type}
                          variant={activeAmenityTypes.includes(type as AmenityType) ? "default" : "outline"}
                          size="sm"
                          onClick={() => onAmenityTypeToggle(type as AmenityType)}
                          className="justify-start"
                        >
                          <IconComponent className="h-4 w-4 mr-2" />
                          {type.replace('_', ' ')}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <Button size="sm" onClick={handleZoomIn} className="p-2">
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button size="sm" onClick={handleZoomOut} className="p-2">
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button size="sm" onClick={handleResetView} className="p-2">
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    </>
  );
});

MapControls.displayName = 'MapControls';

export function InteractivePropertyMap({
  properties,
  selectedProperty,
  nearbyAmenities = [],
  onPropertySelect,
  onAmenityTypeToggle,
  activeAmenityTypes = []
}: PropertyMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [searchValue, setSearchValue] = useState('');
  const [showAmenities, setShowAmenities] = useState(true);
  const [showRadius, setShowRadius] = useState(false);
  const [searchRadius, setSearchRadius] = useState(5000);
  const [radiusCircle, setRadiusCircle] = useState<google.maps.Circle | null>(null);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

  // Hooks
  const { isLoaded, loadError, googleMaps } = useGoogleMaps({
    apiKey: import.meta.env?.VITE_GOOGLE_MAPS_API_KEY || 'demo',
    libraries: ['places', 'geometry']
  });

  const mapOptions: google.maps.MapOptions = {
    zoom: properties.length > 1 ? 11 : 15,
    center: properties.length > 0 
      ? properties[0].location.coordinates 
      : { lat: 12.9716, lng: 77.5946 },
    mapTypeControl: true,
    streetViewControl: true,
    fullscreenControl: true,
    zoomControl: false, // We'll use custom controls
    styles: [
      {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
      }
    ]
  };

  const { map, mapError } = useMapInstance(mapContainerRef, mapOptions, isLoaded);
  const { markers, addMarker, clearMarkers } = useMapMarkers(map);
  const { geocodeAddress } = useGeocoder(isLoaded);
  
  const {
    activeTypes: amenityTypeFilters,
    toggleType: toggleAmenityType
  } = useAmenityTypeFilters(activeAmenityTypes);

  // Create property markers
  useEffect(() => {
    if (!map || !isLoaded) return;

    clearMarkers();

    properties.forEach((property) => {
      const isSelected = selectedProperty?._id === property._id;
      
      const marker = addMarker({
        position: property.location.coordinates,
        title: property.title,
        icon: {
          url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
            <svg width="${isSelected ? 40 : 32}" height="${isSelected ? 40 : 32}" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="14" fill="${isSelected ? '#ef4444' : '#3b82f6'}" stroke="#fff" stroke-width="3"/>
              <circle cx="16" cy="16" r="6" fill="#fff"/>
            </svg>
          `)}`,
          scaledSize: new google.maps.Size(isSelected ? 40 : 32, isSelected ? 40 : 32),
          anchor: new google.maps.Point(isSelected ? 20 : 16, isSelected ? 20 : 16)
        },
        animation: isSelected ? google.maps.Animation.BOUNCE : undefined
      });

      if (marker) {
        // Create info window content
        const formatPrice = (price: number) => {
          if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)} Cr`;
          if (price >= 100000) return `₹${(price / 100000).toFixed(1)} L`;
          return `₹${price.toLocaleString()}`;
        };

        const infoContent = `
          <div style="padding: 16px; max-width: 320px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
            <img src="${property.images[0] || '/placeholder.svg'}" 
                 style="width: 100%; height: 160px; object-fit: cover; border-radius: 8px; margin-bottom: 12px;" 
                 onerror="this.src='/placeholder.svg'"/>
            <h3 style="margin: 0 0 8px 0; font-size: 18px; font-weight: 600; color: #1f2937;">${property.title}</h3>
            <p style="margin: 0 0 8px 0; font-size: 20px; color: #3b82f6; font-weight: 700;">${formatPrice(property.price)}</p>
            <p style="margin: 0 0 8px 0; font-size: 14px; color: #6b7280; display: flex; align-items: center;">
              📍 ${property.location.address}
            </p>
            <p style="margin: 0 0 12px 0; font-size: 14px; color: #6b7280;">
              🛏️ ${property.bedrooms} Bed • 🛁 ${property.bathrooms} Bath • 📐 ${property.area.toLocaleString()} sq ft
            </p>
            <div style="display: flex; gap: 8px;">
              <button onclick="window.selectProperty('${property._id}')" 
                      style="flex: 1; padding: 10px; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 600;">
                View Details
              </button>
              <button onclick="window.showDirections('${property.location.coordinates.lat}', '${property.location.coordinates.lng}')" 
                      style="flex: 1; padding: 10px; background: #f59e0b; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 600;">
                Directions
              </button>
            </div>
          </div>
        `;

        marker.addListener('click', () => {
          if (infoWindowRef.current) {
            infoWindowRef.current.close();
          }
          
          infoWindowRef.current = new google.maps.InfoWindow({
            content: infoContent
          });
          
          infoWindowRef.current.open(map, marker);
          
          if (onPropertySelect) {
            onPropertySelect(property);
          }
        });
      }
    });

    // Fit bounds if multiple properties
    if (properties.length > 1) {
      const bounds = new google.maps.LatLngBounds();
      properties.forEach(property => {
        bounds.extend(property.location.coordinates);
      });
      map.fitBounds(bounds);
    }

  }, [map, isLoaded, properties, selectedProperty, addMarker, clearMarkers, onPropertySelect]);

  // Create amenity markers
  useEffect(() => {
    if (!map || !isLoaded || !showAmenities) return;

    nearbyAmenities.forEach((amenity) => {
      if (!amenityTypeFilters.includes(amenity.type)) return;

      const IconComponent = amenityIcons[amenity.type];
      const color = amenityColors[amenity.type];

      const marker = addMarker({
        position: amenity.coordinates,
        title: amenity.name,
        icon: {
          url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
            <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" fill="${color}" stroke="#fff" stroke-width="2"/>
              <circle cx="12" cy="12" r="4" fill="#fff"/>
            </svg>
          `)}`,
          scaledSize: new google.maps.Size(24, 24),
          anchor: new google.maps.Point(12, 12)
        }
      });

      if (marker) {
        const infoContent = `
          <div style="padding: 12px; max-width: 280px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
            <h4 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #1f2937;">${amenity.name}</h4>
            <p style="margin: 0 0 6px 0; font-size: 14px; color: #6b7280;">📍 ${amenity.address}</p>
            <p style="margin: 0 0 6px 0; font-size: 14px; color: #6b7280;">🚶 ${amenity.distance < 1000 ? Math.round(amenity.distance) + 'm' : (amenity.distance / 1000).toFixed(1) + 'km'}</p>
            ${amenity.rating ? `<p style="margin: 0 0 10px 0; font-size: 14px; color: #f59e0b;">⭐ ${amenity.rating.toFixed(1)} (${amenity.userRatingsTotal || 0} reviews)</p>` : ''}
            <button onclick="window.showDirections('${amenity.coordinates.lat}', '${amenity.coordinates.lng}')" 
                    style="width: 100%; padding: 8px; background: ${color}; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; font-weight: 600;">
              Get Directions
            </button>
          </div>
        `;

        marker.addListener('click', () => {
          if (infoWindowRef.current) {
            infoWindowRef.current.close();
          }
          
          infoWindowRef.current = new google.maps.InfoWindow({
            content: infoContent
          });
          
          infoWindowRef.current.open(map, marker);
        });
      }
    });

  }, [map, isLoaded, nearbyAmenities, showAmenities, amenityTypeFilters, addMarker]);

  // Create radius circle
  useEffect(() => {
    if (!map || !selectedProperty || !showRadius) {
      if (radiusCircle) {
        radiusCircle.setMap(null);
        setRadiusCircle(null);
      }
      return;
    }

    const circle = new google.maps.Circle({
      map,
      center: selectedProperty.location.coordinates,
      radius: searchRadius,
      fillColor: '#3b82f6',
      fillOpacity: 0.1,
      strokeColor: '#3b82f6',
      strokeOpacity: 0.8,
      strokeWeight: 2
    });

    setRadiusCircle(circle);

    return () => {
      circle.setMap(null);
    };
  }, [map, selectedProperty, showRadius, searchRadius]);

  // Global functions for info windows
  useEffect(() => {
    window.selectProperty = (propertyId: string) => {
      const property = properties.find(p => p._id === propertyId);
      if (property && onPropertySelect) {
        onPropertySelect(property);
      }
    };

    window.showDirections = (lat: number, lng: number) => {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
      window.open(url, '_blank');
    };

    return () => {
      delete window.selectProperty;
      delete window.showDirections;
    };
  }, [properties, onPropertySelect]);

  // Handle search location
  const handleSearchLocation = useCallback(async (address: string) => {
    if (!map || !geocodeAddress) return;

    try {
      const results = await geocodeAddress(address);
      if (results.length > 0) {
        const location = results[0].geometry.location;
        map.setCenter(location);
        map.setZoom(15);
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      alert('Location not found. Please try a different search term.');
    }
  }, [map, geocodeAddress]);

  if (loadError || mapError) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg">
        <div className="text-center p-8">
          <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Map Unavailable
          </h3>
          <p className="text-gray-600 mb-4">
            {loadError?.message || mapError?.message || 'Unable to load map'}
          </p>
          <div className="space-y-2">
            <Badge variant="secondary" className="mr-2">🏠 {properties.length} Properties</Badge>
            <Badge variant="secondary">📍 Interactive Markers</Badge>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full rounded-lg overflow-hidden">
      <div ref={mapContainerRef} className="w-full h-full" />
      
      {/* Loading Overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading interactive map...</p>
          </div>
        </div>
      )}

      {/* Map Controls */}
      {isLoaded && map && (
        <MapControls
          map={map}
          onSearchLocation={handleSearchLocation}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          showAmenities={showAmenities}
          onToggleAmenities={setShowAmenities}
          activeAmenityTypes={amenityTypeFilters}
          onAmenityTypeToggle={toggleAmenityType}
          showRadius={showRadius}
          onToggleRadius={setShowRadius}
          searchRadius={searchRadius}
          onRadiusChange={setSearchRadius}
        />
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-10">
        <Card className="shadow-lg">
          <CardContent className="p-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                <span className="text-sm">Properties</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-red-500"></div>
                <span className="text-sm">Selected</span>
              </div>
              {showAmenities && amenityTypeFilters.length > 0 && (
                <div className="border-t pt-2">
                  {amenityTypeFilters.slice(0, 3).map((type) => (
                    <div key={type} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: amenityColors[type] }}
                      ></div>
                      <span className="text-xs">{type.replace('_', ' ')}</span>
                    </div>
                  ))}
                  {amenityTypeFilters.length > 3 && (
                    <span className="text-xs text-gray-500">+{amenityTypeFilters.length - 3} more</span>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
