import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, X } from 'lucide-react';

interface Property {
  _id: string;
  title: string;
  price: number;
  location: {
    city: string;
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  images: string[];
}

interface PropertyMapProps {
  properties: Property[];
  selectedProperty?: Property | null;
  onPropertySelect?: (property: Property) => void;
  height?: string;
  showSearch?: boolean;
}

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

export function PropertyMap({ 
  properties, 
  selectedProperty, 
  onPropertySelect, 
  height = '500px',
  showSearch = true 
}: PropertyMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const infoWindowRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [searchBox, setSearchBox] = useState<string>('');
  const [mapError, setMapError] = useState(false);

  // Initialize Google Maps
  useEffect(() => {
    const initializeMap = () => {
      if (!window.google || !mapRef.current) {
        // If Google Maps is not available, show fallback
        setMapError(true);
        setMapLoaded(true);
        return;
      }

      const defaultCenter = properties.length > 0 
        ? properties[0].location.coordinates 
        : { lat: 12.9716, lng: 77.5946 }; // Bangalore center

      const map = new window.google.maps.Map(mapRef.current, {
        zoom: properties.length > 1 ? 10 : 15,
        center: defaultCenter,
        styles: [
          {
            featureType: 'all',
            elementType: 'geometry.fill',
            stylers: [{ weight: '2.00' }]
          },
          {
            featureType: 'all',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#9c9c9c' }]
          },
          {
            featureType: 'all',
            elementType: 'labels.text',
            stylers: [{ visibility: 'on' }]
          },
          {
            featureType: 'landscape',
            elementType: 'all',
            stylers: [{ color: '#f2f2f2' }]
          },
          {
            featureType: 'landscape',
            elementType: 'geometry.fill',
            stylers: [{ color: '#ffffff' }]
          },
          {
            featureType: 'landscape.man_made',
            elementType: 'geometry.fill',
            stylers: [{ color: '#ffffff' }]
          },
          {
            featureType: 'poi',
            elementType: 'all',
            stylers: [{ visibility: 'off' }]
          },
          {
            featureType: 'road',
            elementType: 'all',
            stylers: [{ saturation: -100 }, { lightness: 45 }]
          },
          {
            featureType: 'road',
            elementType: 'geometry.fill',
            stylers: [{ color: '#eeeeee' }]
          },
          {
            featureType: 'road',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#7b7b7b' }]
          },
          {
            featureType: 'road',
            elementType: 'labels.text.stroke',
            stylers: [{ color: '#ffffff' }]
          },
          {
            featureType: 'road.highway',
            elementType: 'all',
            stylers: [{ visibility: 'simplified' }]
          },
          {
            featureType: 'road.arterial',
            elementType: 'labels.icon',
            stylers: [{ visibility: 'off' }]
          },
          {
            featureType: 'transit',
            elementType: 'all',
            stylers: [{ visibility: 'off' }]
          },
          {
            featureType: 'water',
            elementType: 'all',
            stylers: [{ color: '#46bcec' }, { visibility: 'on' }]
          },
          {
            featureType: 'water',
            elementType: 'geometry.fill',
            stylers: [{ color: '#c8d7d4' }]
          },
          {
            featureType: 'water',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#070707' }]
          },
          {
            featureType: 'water',
            elementType: 'labels.text.stroke',
            stylers: [{ color: '#ffffff' }]
          }
        ],
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        zoomControl: true,
        mapTypeControlOptions: {
          style: window.google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
          position: window.google.maps.ControlPosition.TOP_CENTER,
        },
        zoomControlOptions: {
          position: window.google.maps.ControlPosition.RIGHT_CENTER,
        },
        streetViewControlOptions: {
          position: window.google.maps.ControlPosition.RIGHT_TOP,
        },
      });

      mapInstanceRef.current = map;

      // Create info window
      infoWindowRef.current = new window.google.maps.InfoWindow();

      setMapLoaded(true);
    };

    // Check for valid Google Maps API key
    const apiKey = import.meta.env?.VITE_GOOGLE_MAPS_API_KEY;

    // Only load Google Maps if we have a valid API key
    if (!window.google) {
      if (!apiKey || apiKey === 'demo' || apiKey.length < 20) {
        // No valid API key available, show fallback immediately
        console.info('Google Maps API key not configured, showing map fallback UI');
        setMapError(true);
        setMapLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initMap`;
      script.async = true;
      script.defer = true;

      // Handle script load errors gracefully
      script.onerror = () => {
        console.warn('Google Maps failed to load, showing fallback UI');
        setMapError(true);
        setMapLoaded(true); // Allow component to render even without maps
      };

      window.initMap = initializeMap;
      document.head.appendChild(script);
    } else {
      initializeMap();
    }

    return () => {
      // Cleanup
      if (markersRef.current) {
        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current = [];
      }
    };
  }, []);

  // Update markers when properties change
  useEffect(() => {
    if (!mapLoaded || !mapInstanceRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Add new markers
    properties.forEach((property) => {
      const marker = new window.google.maps.Marker({
        position: property.location.coordinates,
        map: mapInstanceRef.current,
        title: property.title,
        icon: {
          url: selectedProperty?._id === property._id 
            ? 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="18" fill="#ff8000" stroke="#fff" stroke-width="3"/>
                <circle cx="20" cy="20" r="8" fill="#fff"/>
              </svg>
            `)
            : 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="14" fill="#0080ff" stroke="#fff" stroke-width="3"/>
                <circle cx="16" cy="16" r="6" fill="#fff"/>
              </svg>
            `),
          scaledSize: new window.google.maps.Size(
            selectedProperty?._id === property._id ? 40 : 32, 
            selectedProperty?._id === property._id ? 40 : 32
          ),
        },
        animation: selectedProperty?._id === property._id 
          ? window.google.maps.Animation.BOUNCE 
          : null,
      });

      const formatPrice = (price: number) => {
        if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)} Cr`;
        if (price >= 100000) return `₹${(price / 100000).toFixed(1)} L`;
        return `₹${price.toLocaleString()}`;
      };

      const infoContent = `
        <div style="padding: 10px; max-width: 300px;">
          <img src="${property.images[0] || '/placeholder.svg'}" 
               style="width: 100%; height: 150px; object-fit: cover; border-radius: 8px; margin-bottom: 10px;" 
               onerror="this.src='/placeholder.svg'"/>
          <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">${property.title}</h3>
          <p style="margin: 0 0 8px 0; font-size: 18px; color: #0080ff; font-weight: bold;">${formatPrice(property.price)}</p>
          <p style="margin: 0 0 8px 0; font-size: 14px; color: #666;">
            📍 ${property.location.address}
          </p>
          <p style="margin: 0 0 10px 0; font-size: 14px; color: #666;">
            🛏️ ${property.bedrooms} Bed • 🛁 ${property.bathrooms} Bath • 📐 ${property.area.toLocaleString()} sq ft
          </p>
          <div style="display: flex; gap: 8px;">
            <button onclick="window.viewPropertyDetails('${property._id}')" 
                    style="flex: 1; padding: 8px; background: #0080ff; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">
              View Details
            </button>
            <button onclick="window.showDirections('${property.location.coordinates.lat}', '${property.location.coordinates.lng}')" 
                    style="flex: 1; padding: 8px; background: #ff8000; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">
              Directions
            </button>
          </div>
        </div>
      `;

      marker.addListener('click', () => {
        infoWindowRef.current.setContent(infoContent);
        infoWindowRef.current.open(mapInstanceRef.current, marker);
        
        if (onPropertySelect) {
          onPropertySelect(property);
        }
      });

      markersRef.current.push(marker);
    });

    // Adjust map bounds to fit all markers
    if (properties.length > 1) {
      const bounds = new window.google.maps.LatLngBounds();
      properties.forEach(property => {
        bounds.extend(property.location.coordinates);
      });
      mapInstanceRef.current.fitBounds(bounds);
    } else if (properties.length === 1) {
      mapInstanceRef.current.setCenter(properties[0].location.coordinates);
      mapInstanceRef.current.setZoom(15);
    }

  }, [mapLoaded, properties, selectedProperty]);

  // Global functions for info window buttons
  useEffect(() => {
    window.viewPropertyDetails = (propertyId: string) => {
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
      delete window.viewPropertyDetails;
      delete window.showDirections;
    };
  }, [properties, onPropertySelect]);

  const handleSearchLocation = () => {
    if (!searchBox.trim()) {
      alert('Please enter a location to search');
      return;
    }

    // If Google Maps is available, use normal geocoding
    if (mapInstanceRef.current && window.google && !mapError) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: searchBox }, (results: any, status: any) => {
        if (status === 'OK' && results[0]) {
          mapInstanceRef.current.setCenter(results[0].geometry.location);
          mapInstanceRef.current.setZoom(15);
        } else {
          alert('Location not found. Please try a different search term.');
        }
      });
      return;
    }

    // Demo mode: Filter properties based on search term
    const searchTerm = searchBox.toLowerCase();
    const availableCities = ['bangalore', 'mumbai', 'delhi', 'pune'];
    const availableAreas = ['koramangala', 'whitefield', 'indiranagar', 'btm layout', 'bandra', 'andheri', 'powai', 'malad', 'connaught place', 'gurgaon', 'noida', 'vasant kunj', 'hinjewadi', 'baner', 'kothrud', 'viman nagar'];

    // Check if search matches any city or area
    const matchedCity = availableCities.find(city => city.includes(searchTerm) || searchTerm.includes(city));
    const matchedArea = availableAreas.find(area => area.includes(searchTerm) || searchTerm.includes(area));

    if (matchedCity || matchedArea || searchTerm.includes('property') || searchTerm.includes('apartment') || searchTerm.includes('villa')) {
      // Show relevant properties
      const relevantProperties = properties.filter(property => {
        const cityMatch = matchedCity && property.location.city.toLowerCase().includes(matchedCity);
        const addressMatch = property.location.address.toLowerCase().includes(searchTerm);
        const titleMatch = property.title.toLowerCase().includes(searchTerm);
        const typeMatch = property.propertyType.toLowerCase().includes(searchTerm);

        return cityMatch || addressMatch || titleMatch || typeMatch;
      });

      if (relevantProperties.length > 0) {
        // Focus on first relevant property
        if (onPropertySelect) {
          onPropertySelect(relevantProperties[0]);
        }
        alert(`Found ${relevantProperties.length} properties matching "${searchBox}". Check the property listings below.`);
      } else {
        alert(`No properties found for "${searchBox}". Try searching for: Bangalore, Mumbai, Delhi, Pune, or property types like "apartment", "villa".`);
      }
    } else {
      // Provide helpful suggestions
      alert(`Location "${searchBox}" not recognized. Try searching for:\n• Cities: Bangalore, Mumbai, Delhi, Pune\n• Areas: Koramangala, Bandra, Connaught Place, Hinjewadi\n• Property types: Apartment, Villa, Penthouse`);
    }

    // Clear search box after search
    setSearchBox('');
  };

  return (
    <div style={{ position: 'relative', width: '100%', height }}>
      {/* Search Box */}
      {showSearch && (
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          right: '10px',
          zIndex: 1000,
          display: 'flex',
          gap: '8px'
        }}>
          <input
            type="text"
            placeholder={mapError ? "Try: Bangalore, Mumbai, Apartment, Villa..." : "Search location on map..."}
            value={searchBox}
            onChange={(e) => setSearchBox(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearchLocation()}
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: '25px',
              border: mapError ? '2px solid #3b82f6' : '2px solid #ddd',
              backgroundColor: 'white',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
              fontSize: '14px',
              outline: 'none',
              transition: 'all 0.3s ease'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#3b82f6';
              e.target.style.boxShadow = '0 4px 20px rgba(59, 130, 246, 0.3)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = mapError ? '#3b82f6' : '#ddd';
              e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
            }}
          />
          <button
            onClick={handleSearchLocation}
            disabled={!searchBox.trim()}
            style={{
              padding: '12px 16px',
              borderRadius: '25px',
              border: 'none',
              backgroundColor: searchBox.trim() ? '#3b82f6' : '#94a3b8',
              color: 'white',
              cursor: searchBox.trim() ? 'pointer' : 'not-allowed',
              boxShadow: searchBox.trim() ? '0 4px 15px rgba(59, 130, 246, 0.3)' : '0 2px 10px rgba(0,0,0,0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.3s ease',
              minWidth: '48px',
              justifyContent: 'center'
            }}
            onMouseOver={(e) => {
              if (searchBox.trim()) {
                e.currentTarget.style.backgroundColor = '#1d4ed8';
                e.currentTarget.style.transform = 'scale(1.05)';
              }
            }}
            onMouseOut={(e) => {
              if (searchBox.trim()) {
                e.currentTarget.style.backgroundColor = '#3b82f6';
                e.currentTarget.style.transform = 'scale(1)';
              }
            }}
          >
            <Navigation className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Map Container */}
      <div 
        ref={mapRef} 
        style={{ 
          width: '100%', 
          height: '100%',
          borderRadius: '12px',
          overflow: 'hidden'
        }} 
      />

      {/* Loading Overlay */}
      {!mapLoaded && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '12px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #0080ff',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 10px'
            }} />
            <p>Loading interactive map...</p>
          </div>
        </div>
      )}

      {/* Fallback UI when Maps is not available */}
      {mapError && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, #f1f5f9, #e2e8f0)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '12px',
          flexDirection: 'column',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            borderRadius: '50%',
            width: '80px',
            height: '80px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.5rem'
          }}>
            <MapPin style={{ width: '40px', height: '40px', color: 'white' }} />
          </div>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#1e293b',
            marginBottom: '1rem'
          }}>
            Interactive Map Demo
          </h3>
          <p style={{
            color: '#64748b',
            lineHeight: 1.6,
            maxWidth: '400px',
            marginBottom: '1rem'
          }}>
            This demo shows the map interface design. In production, this would display an interactive Google Maps
            with property locations and detailed information.
          </p>
          <p style={{
            color: '#3b82f6',
            fontSize: '0.9rem',
            fontWeight: '600',
            marginBottom: '1.5rem',
            padding: '0.75rem',
            background: 'rgba(59, 130, 246, 0.1)',
            borderRadius: '8px',
            border: '1px solid rgba(59, 130, 246, 0.2)'
          }}>
            💡 Search functionality is active! Try searching for cities like "Bangalore", "Mumbai" or property types like "apartment", "villa".
          </p>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e2e8f0',
            width: '100%',
            maxWidth: '300px'
          }}>
            <div style={{ marginBottom: '1rem' }}>
              <p style={{
                fontSize: '0.875rem',
                color: '#3b82f6',
                fontWeight: '600',
                margin: '0 0 0.5rem 0'
              }}>
                📍 Map Features Preview
              </p>
              <p style={{
                fontSize: '0.8rem',
                color: '#64748b',
                margin: 0
              }}>
                {properties.length} properties would be displayed with interactive markers
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.5rem',
              fontSize: '0.75rem',
              color: '#64748b',
              marginBottom: '1rem'
            }}>
              <div>🏠 Property pins</div>
              <div>🔍 Search locations</div>
              <div>📍 Directions</div>
              <div>📱 Mobile friendly</div>
            </div>

            <div style={{ marginTop: '1rem' }}>
              <p style={{
                fontSize: '0.8rem',
                color: '#3b82f6',
                fontWeight: '600',
                marginBottom: '0.75rem'
              }}>
                Quick Search Options:
              </p>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.5rem'
              }}>
                {['Bangalore', 'Mumbai', 'Apartment', 'Villa'].map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      setSearchBox(term);
                      setTimeout(handleSearchLocation, 100);
                    }}
                    style={{
                      padding: '0.5rem 0.75rem',
                      background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Map Legend */}
      <div style={{
        position: 'absolute',
        bottom: '10px',
        left: '10px',
        backgroundColor: 'white',
        padding: '12px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        fontSize: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#0080ff' }} />
          <span>Available Properties</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: '#ff8000' }} />
          <span>Selected Property</span>
        </div>
      </div>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}
