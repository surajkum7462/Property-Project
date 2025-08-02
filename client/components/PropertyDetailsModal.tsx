import React from 'react';
import { X, MapPin, Bed, Bath, Square, Calendar, Star, Car, Wifi, Dumbbell, Shield } from 'lucide-react';

interface Property {
  _id: string;
  title: string;
  description: string;
  price: number;
  location: {
    city: string;
    state: string;
    pincode: string;
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
  amenities: string[];
  images: string[];
  listedDate: string;
  status: string;
}

interface PropertyDetailsModalProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
}

export function PropertyDetailsModal({ property, isOpen, onClose }: PropertyDetailsModalProps) {
  if (!isOpen) return null;

  const formatPrice = (price: number) => {
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)} Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(1)} L`;
    return `₹${price.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const getAmenityIcon = (amenity: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      'Swimming Pool': '🏊‍♂️',
      'Gym': <Dumbbell className="h-4 w-4" />,
      'Club House': '🏛️',
      "Children's Play Area": '🎪',
      'Power Backup': '⚡',
      'Car Parking': <Car className="h-4 w-4" />,
      'Private Garden': '🌳',
      'Security': <Shield className="h-4 w-4" />,
      'Modular Kitchen': '🍳',
      'Metro Connectivity': '🚇',
      'Restaurants Nearby': '🍽️',
      'Private Terrace': '🏔️',
      'Concierge Service': '🛎️',
      'Valet Parking': '🚗',
      '24/7 Security': <Shield className="h-4 w-4" />,
      'Schools Nearby': '🏫',
      'Shopping Mall': '🛍️',
      'Metro Access': '🚊',
      'Sea View': '🌊',
      'Heritage Building': '🏛️',
      'Prime Location': '⭐',
      'IT Park Proximity': '💻',
      'Metro Planned': '🚧'
    };
    return iconMap[amenity] || '✨';
  };

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
        maxWidth: '900px',
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
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
            Property Details
          </h2>
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
          {/* Image Gallery */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: property.images.length > 1 ? '2fr 1fr' : '1fr',
            gap: '0.5rem',
            marginBottom: '2rem',
            borderRadius: '8px',
            overflow: 'hidden'
          }}>
            {property.images.length > 0 ? (
              <>
                <div style={{ 
                  height: '300px',
                  backgroundImage: `url(${property.images[0]})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundColor: '#f5f5f5'
                }} />
                {property.images.length > 1 && (
                  <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: '0.5rem' }}>
                    {property.images.slice(1, 3).map((image, index) => (
                      <div
                        key={index}
                        style={{
                          height: '147px',
                          backgroundImage: `url(${image})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          backgroundColor: '#f5f5f5'
                        }}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div style={{
                height: '300px',
                backgroundColor: '#f5f5f5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '4rem'
              }}>
                🏠
              </div>
            )}
          </div>

          {/* Property Info */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            {/* Left Column */}
            <div>
              <div style={{ marginBottom: '1.5rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0080ff', marginBottom: '0.5rem' }}>
                  {formatPrice(property.price)}
                </h1>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>
                  {property.title}
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', color: '#666', marginBottom: '1rem' }}>
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>{property.location.address}, {property.location.city}, {property.location.state} - {property.location.pincode}</span>
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '1rem' }}>Description</h3>
                <p style={{ color: '#666', lineHeight: '1.6' }}>
                  {property.description}
                </p>
              </div>

              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '1rem' }}>Amenities</h3>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                  gap: '0.5rem' 
                }}>
                  {property.amenities.map((amenity, index) => (
                    <div key={index} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.5rem',
                      padding: '0.5rem',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '6px'
                    }}>
                      <span style={{ fontSize: '1rem' }}>{getAmenityIcon(amenity)}</span>
                      <span style={{ fontSize: '0.9rem' }}>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div>
              <div style={{
                backgroundColor: '#f8f9fa',
                padding: '1.5rem',
                borderRadius: '8px',
                marginBottom: '1.5rem'
              }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '1rem' }}>Property Features</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Bed className="h-5 w-5 text-gray-600" />
                    <span>{property.bedrooms} Bedrooms</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Bath className="h-5 w-5 text-gray-600" />
                    <span>{property.bathrooms} Bathrooms</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Square className="h-5 w-5 text-gray-600" />
                    <span>{property.area.toLocaleString()} sq ft</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Calendar className="h-5 w-5 text-gray-600" />
                    <span>{formatDate(property.listedDate)}</span>
                  </div>
                </div>
              </div>

              <div style={{
                backgroundColor: '#e8f4fd',
                padding: '1.5rem',
                borderRadius: '8px',
                marginBottom: '1.5rem'
              }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '1rem' }}>Property Type</h3>
                <p style={{ 
                  fontSize: '1.1rem',
                  fontWeight: '500',
                  color: '#0080ff',
                  textTransform: 'capitalize'
                }}>
                  {property.propertyType}
                </p>
              </div>

              <div style={{
                backgroundColor: '#fff3cd',
                padding: '1.5rem',
                borderRadius: '8px'
              }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '1rem' }}>Status</h3>
                <div style={{
                  display: 'inline-block',
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  backgroundColor: property.status === 'available' ? '#d4edda' : '#f8d7da',
                  color: property.status === 'available' ? '#155724' : '#721c24',
                  fontWeight: '500',
                  textTransform: 'capitalize'
                }}>
                  {property.status}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ 
            marginTop: '2rem',
            padding: '1.5rem',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center'
          }}>
            <button style={{
              backgroundColor: '#0080ff',
              color: 'white',
              padding: '0.75rem 2rem',
              border: 'none',
              borderRadius: '6px',
              fontSize: '1rem',
              fontWeight: 'medium',
              cursor: 'pointer'
            }}>
              Contact Agent
            </button>
            <button style={{
              backgroundColor: '#ff8000',
              color: 'white',
              padding: '0.75rem 2rem',
              border: 'none',
              borderRadius: '6px',
              fontSize: '1rem',
              fontWeight: 'medium',
              cursor: 'pointer'
            }}>
              Schedule Visit
            </button>
            <button style={{
              backgroundColor: 'white',
              color: '#0080ff',
              padding: '0.75rem 2rem',
              border: '2px solid #0080ff',
              borderRadius: '6px',
              fontSize: '1rem',
              fontWeight: 'medium',
              cursor: 'pointer'
            }}>
              Save Property
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
