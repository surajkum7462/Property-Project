import React, { memo, useCallback } from 'react';
import { Eye, Navigation, MapPin, Bed, Bath, Square, Star, Calendar, Heart } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { PropertyGridProps, Property } from '@shared/api';

// Memoized property card component for performance
const PropertyCard = memo(({ property, onClick, onShowAmenities }: {
  property: Property;
  onClick: (id: string) => void;
  onShowAmenities: (id: string) => void;
}) => {
  const formatPrice = useCallback((price: number) => {
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)} Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(1)} L`;
    return `₹${price.toLocaleString()}`;
  }, []);

  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  }, []);

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'sold': return 'bg-red-100 text-red-800';
      case 'rented': return 'bg-blue-100 text-blue-800';
      case 'under_review': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }, []);

  const getPropertyTypeColor = useCallback((type: string) => {
    switch (type) {
      case 'apartment': return 'bg-blue-500';
      case 'villa': return 'bg-purple-500';
      case 'house': return 'bg-green-500';
      case 'studio': return 'bg-orange-500';
      case 'penthouse': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  }, []);

  return (
    <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden border-0 shadow-lg">
      {/* Image Section */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={property.images[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop'}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop';
          }}
        />
        
        {/* Status Badge */}
        <Badge className={`absolute top-3 left-3 ${getStatusColor(property.status)} border-0`}>
          {property.status.replace('_', ' ').toUpperCase()}
        </Badge>
        
        {/* Property Type Badge */}
        <Badge className={`absolute top-3 right-3 ${getPropertyTypeColor(property.propertyType)} text-white border-0`}>
          {property.propertyType.charAt(0).toUpperCase() + property.propertyType.slice(1)}
        </Badge>
        
        {/* Heart Icon */}
        <button className="absolute top-14 right-3 p-2 bg-white/90 rounded-full hover:bg-white transition-colors">
          <Heart className="h-4 w-4 text-gray-600 hover:text-red-500" />
        </button>
        
        {/* Price Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <div className="text-white">
            <div className="text-2xl font-bold">{formatPrice(property.price)}</div>
            <div className="text-sm opacity-90">
              {property.location.city}, {property.location.state}
            </div>
          </div>
        </div>
      </div>

      <CardContent className="p-6 space-y-4">
        {/* Title and Description */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {property.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
            {property.description}
          </p>
        </div>

        {/* Location */}
        <div className="flex items-center text-gray-500 text-sm">
          <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
          <span className="line-clamp-1">{property.location.address}</span>
        </div>

        {/* Property Details */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Bed className="h-4 w-4 mr-1" />
              <span>{property.bedrooms}</span>
            </div>
            <div className="flex items-center">
              <Bath className="h-4 w-4 mr-1" />
              <span>{property.bathrooms}</span>
            </div>
            <div className="flex items-center">
              <Square className="h-4 w-4 mr-1" />
              <span>{property.area.toLocaleString()} sq ft</span>
            </div>
          </div>
        </div>

        {/* Amenities Preview */}
        {property.amenities && property.amenities.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-900">Amenities:</div>
            <div className="flex flex-wrap gap-1">
              {property.amenities.slice(0, 3).map((amenity, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {amenity}
                </Badge>
              ))}
              {property.amenities.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{property.amenities.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Listed Date */}
        <div className="flex items-center text-xs text-gray-500">
          <Calendar className="h-3 w-3 mr-1" />
          <span>Listed on {formatDate(property.listedDate)}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button 
            onClick={() => onClick(property._id)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            size="sm"
          >
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
          
          <Button 
            onClick={() => onShowAmenities(property._id)}
            variant="outline"
            className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50"
            size="sm"
          >
            <Navigation className="h-4 w-4 mr-2" />
            Show Nearby
          </Button>
        </div>

        {/* Property Rating (if available) */}
        {/* <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 mr-1" />
            <span className="text-sm font-medium">4.5</span>
            <span className="text-xs text-gray-500 ml-1">(24 reviews)</span>
          </div>
        </div> */}
      </CardContent>
    </Card>
  );
});

PropertyCard.displayName = 'PropertyCard';

export function EnhancedPropertyGrid({ 
  properties, 
  loading, 
  error, 
  onPropertyClick, 
  onShowAmenities 
}: PropertyGridProps) {
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <div className="text-red-600 text-lg font-medium mb-2">Error Loading Properties</div>
          <div className="text-red-500 text-sm">{error}</div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <div className="h-64 bg-gray-200 animate-pulse" />
            <CardContent className="p-6 space-y-4">
              <div className="h-6 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
              <div className="flex space-x-4">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-16" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-16" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-16" />
              </div>
              <div className="flex gap-2">
                <div className="h-8 bg-gray-200 rounded animate-pulse flex-1" />
                <div className="h-8 bg-gray-200 rounded animate-pulse flex-1" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-md mx-auto">
          <div className="text-gray-600 text-lg font-medium mb-2">No Properties Found</div>
          <div className="text-gray-500 text-sm">
            Try adjusting your search criteria or explore different locations.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="text-lg font-semibold text-gray-900">
          {properties.length} {properties.length === 1 ? 'Property' : 'Properties'} Found
        </div>
        <div className="text-sm text-gray-500">
          Showing premium properties in your area
        </div>
      </div>

      {/* Property Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {properties.map((property) => (
          <PropertyCard
            key={property._id}
            property={property}
            onClick={onPropertyClick}
            onShowAmenities={onShowAmenities}
          />
        ))}
      </div>
    </div>
  );
}
