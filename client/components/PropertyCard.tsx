import React from 'react';
import { MapPin, Bed, Bath, Square, Calendar, ExternalLink, Navigation } from 'lucide-react';
import { Card, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Property } from '@shared/api';

interface PropertyCardProps {
  property: Property;
  onClick: (id: string) => void;
  onShowAmenities: (id: string) => void;
}

export function PropertyCard({ property, onClick, onShowAmenities }: PropertyCardProps) {
  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)} L`;
    } else {
      return `₹${price.toLocaleString()}`;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const getPropertyTypeLabel = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'sold':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'rented':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  return (
    <Card className="group cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1">
      <div className="relative">
        {/* Property Image */}
        <div className="aspect-[16/10] bg-gray-100 rounded-t-lg overflow-hidden">
          {property.images.length > 0 ? (
            <img
              src={property.images[0]}
              alt={property.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder.svg';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
              <div className="text-center">
                <Square className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No Image</p>
              </div>
            </div>
          )}
        </div>

        {/* Status Badge */}
        <Badge className={`absolute top-3 left-3 ${getStatusColor(property.status)}`}>
          {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
        </Badge>

        {/* Property Type Badge */}
        <Badge variant="secondary" className="absolute top-3 right-3 bg-white/90 text-gray-800">
          {getPropertyTypeLabel(property.propertyType)}
        </Badge>
      </div>

      <CardContent className="p-4" onClick={() => onClick(property._id)}>
        {/* Price */}
        <div className="mb-2">
          <h3 className="text-2xl font-bold text-primary">
            {formatPrice(property.price)}
          </h3>
        </div>

        {/* Title */}
        <h4 className="font-semibold text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors">
          {property.title}
        </h4>

        {/* Location */}
        <div className="flex items-center text-muted-foreground mb-3">
          <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
          <span className="text-sm line-clamp-1">
            {property.location.address}, {property.location.city}
          </span>
        </div>

        {/* Property Details */}
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
          <div className="flex items-center">
            <Bed className="h-4 w-4 mr-1" />
            <span>{property.bedrooms} Bed</span>
          </div>
          <div className="flex items-center">
            <Bath className="h-4 w-4 mr-1" />
            <span>{property.bathrooms} Bath</span>
          </div>
          <div className="flex items-center">
            <Square className="h-4 w-4 mr-1" />
            <span>{property.area.toLocaleString()} sq ft</span>
          </div>
        </div>

        {/* Listed Date */}
        <div className="flex items-center text-xs text-muted-foreground">
          <Calendar className="h-3 w-3 mr-1" />
          <span>Listed {formatDate(property.listedDate)}</span>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1"
          onClick={(e) => {
            e.stopPropagation();
            onClick(property._id);
          }}
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          View Details
        </Button>
        
        <Button 
          variant="secondary" 
          size="sm" 
          className="flex-1"
          onClick={(e) => {
            e.stopPropagation();
            onShowAmenities(property._id);
          }}
        >
          <Navigation className="h-4 w-4 mr-2" />
          Show Nearby
        </Button>
      </CardFooter>
    </Card>
  );
}
