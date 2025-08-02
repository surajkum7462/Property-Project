import React, { useState, useEffect } from 'react';
import { X, MapPin, Clock, Star, Phone, ExternalLink, Navigation } from 'lucide-react';

interface NearbyAmenity {
  type: string;
  name: string;
  address: string;
  distance: number;
  duration: number;
  placeId: string;
  rating?: number;
  userRatingsTotal?: number;
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface Property {
  _id: string;
  title: string;
  location: {
    coordinates: {
      lat: number;
      lng: number;
    };
  };
}

interface NearbyAmenitiesModalProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
}

const amenityTypeNames: { [key: string]: string } = {
  school: '🏫 Schools',
  hospital: '🏥 Hospitals',
  restaurant: '🍽️ Restaurants',
  bank: '🏦 Banks',
  gym: '💪 Gyms',
  shopping_mall: '🛍�� Shopping Malls',
  park: '🌳 Parks',
  metro_station: '🚇 Metro Stations'
};

export function NearbyAmenitiesModal({ property, isOpen, onClose }: NearbyAmenitiesModalProps) {
  const [amenities, setAmenities] = useState<{ [key: string]: NearbyAmenity[] }>({});
  const [loading, setLoading] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['school', 'hospital', 'restaurant', 'bank']);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && property) {
      fetchNearbyAmenities();
    }
  }, [isOpen, property, selectedTypes]);

  const fetchNearbyAmenities = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      selectedTypes.forEach(type => params.append('types', type));
      params.append('radius', '5000');
      params.append('limit', '5');

      const response = await fetch(`/api/properties/${property._id}/nearby-amenities?${params}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Amenities data:', data);
        setAmenities(data.amenities || {});
      } else {
        throw new Error('Failed to fetch amenities');
      }
    } catch (error) {
      console.error('Error fetching amenities:', error);
      setError('Failed to load nearby amenities. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDistance = (distance: number) => {
    if (distance >= 1000) {
      return `${(distance / 1000).toFixed(1)} km`;
    }
    return `${Math.round(distance)} m`;
  };

  const formatDuration = (duration: number) => {
    if (duration >= 60) {
      return `${Math.floor(duration / 60)}h ${duration % 60}m`;
    }
    return `${duration} min`;
  };

  const toggleAmenityType = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        maxWidth: '1000px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{
          position: 'sticky',
          top: 0,
          backgroundColor: 'white',
          padding: '1.5rem',
          borderBottom: '1px solid #e5e5e5',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderRadius: '12px 12px 0 0'
        }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
              Nearby Amenities
            </h2>
            <p style={{ margin: '0.5rem 0 0 0', color: '#666', fontSize: '0.9rem' }}>
              {property.title}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '1.5rem' }}>
          {/* Amenity Type Filters */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>
              Select Amenity Types
            </h3>
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: '0.5rem' 
            }}>
              {Object.entries(amenityTypeNames).map(([type, name]) => (
                <button
                  key={type}
                  onClick={() => toggleAmenityType(type)}
                  style={{
                    padding: '0.5rem 1rem',
                    border: `2px solid ${selectedTypes.includes(type) ? '#0080ff' : '#e5e5e5'}`,
                    backgroundColor: selectedTypes.includes(type) ? '#0080ff' : 'white',
                    color: selectedTypes.includes(type) ? 'white' : '#666',
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔄</div>
              <p>Loading nearby amenities...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div style={{
              backgroundColor: '#fee',
              border: '1px solid #fcc',
              borderRadius: '6px',
              padding: '1rem',
              marginBottom: '1rem',
              color: '#c33'
            }}>
              {error}
            </div>
          )}

          {/* Amenities Results */}
          {!loading && !error && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '1.5rem' }}>
              {selectedTypes.map(type => {
                const typeAmenities = amenities[type] || [];
                return (
                  <div key={type} style={{
                    border: '1px solid #e5e5e5',
                    borderRadius: '8px',
                    padding: '1.5rem',
                    backgroundColor: '#fafafa'
                  }}>
                    <h4 style={{ 
                      fontSize: '1.2rem', 
                      fontWeight: '600', 
                      marginBottom: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      {amenityTypeNames[type]}
                      <span style={{ 
                        fontSize: '0.8rem', 
                        color: '#666',
                        fontWeight: 'normal' 
                      }}>
                        ({typeAmenities.length} found)
                      </span>
                    </h4>

                    {typeAmenities.length === 0 ? (
                      <p style={{ color: '#666', fontStyle: 'italic' }}>
                        No {type.replace('_', ' ')} found nearby
                      </p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {typeAmenities.map((amenity, index) => (
                          <div key={index} style={{
                            backgroundColor: 'white',
                            border: '1px solid #e5e5e5',
                            borderRadius: '6px',
                            padding: '1rem'
                          }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                              <h5 style={{ fontSize: '1rem', fontWeight: '600', margin: 0 }}>
                                {amenity.name}
                              </h5>
                              {amenity.rating && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                  <Star className="h-4 w-4" style={{ color: '#fbbf24' }} />
                                  <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>
                                    {amenity.rating.toFixed(1)}
                                  </span>
                                  {amenity.userRatingsTotal && (
                                    <span style={{ fontSize: '0.8rem', color: '#666' }}>
                                      ({amenity.userRatingsTotal})
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                            
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                              <MapPin className="h-4 w-4" style={{ color: '#666' }} />
                              <span style={{ fontSize: '0.9rem', color: '#666' }}>
                                {amenity.address}
                              </span>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.75rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <Navigation className="h-4 w-4" style={{ color: '#0080ff' }} />
                                <span style={{ fontSize: '0.9rem', fontWeight: '500', color: '#0080ff' }}>
                                  {formatDistance(amenity.distance)}
                                </span>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <Clock className="h-4 w-4" style={{ color: '#666' }} />
                                <span style={{ fontSize: '0.9rem', color: '#666' }}>
                                  {formatDuration(amenity.duration)} walk
                                </span>
                              </div>
                            </div>

                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <button style={{
                                backgroundColor: '#0080ff',
                                color: 'white',
                                border: 'none',
                                padding: '0.4rem 0.8rem',
                                borderRadius: '4px',
                                fontSize: '0.8rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem'
                              }}>
                                <ExternalLink className="h-3 w-3" />
                                Get Directions
                              </button>
                              <button style={{
                                backgroundColor: 'white',
                                color: '#666',
                                border: '1px solid #e5e5e5',
                                padding: '0.4rem 0.8rem',
                                borderRadius: '4px',
                                fontSize: '0.8rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem'
                              }}>
                                <Phone className="h-3 w-3" />
                                Contact
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Map Integration Note */}
          <div style={{
            marginTop: '2rem',
            padding: '1rem',
            backgroundColor: '#e8f4fd',
            borderRadius: '6px',
            textAlign: 'center'
          }}>
            <p style={{ margin: 0, color: '#0066cc', fontSize: '0.9rem' }}>
              🗺️ Interactive map view with all amenities will be available soon!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
