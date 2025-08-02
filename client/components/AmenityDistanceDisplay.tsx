import React, { memo, useCallback, useMemo } from 'react';
import { 
  MapPin, 
  Navigation, 
  Star, 
  Clock, 
  Phone, 
  Globe, 
  Users,
  School,
  Heart,
  ShoppingBag,
  Utensils,
  Building,
  Car,
  TreePine,
  Dumbbell,
  Train
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { AmenityListProps, AmenityCardProps, NearbyAmenity, AmenityType } from '@shared/api';

// Icon mapping for amenity types
const amenityIcons: Record<AmenityType, React.ComponentType<any>> = {
  school: School,
  hospital: Heart,
  restaurant: Utensils,
  bank: Building,
  gym: Dumbbell,
  shopping_mall: ShoppingBag,
  park: TreePine,
  metro_station: Train,
  gas_station: Car,
  pharmacy: Heart
};

// Color mapping for amenity types
const amenityColors: Record<AmenityType, string> = {
  school: 'bg-blue-500',
  hospital: 'bg-red-500',
  restaurant: 'bg-orange-500',
  bank: 'bg-green-500',
  gym: 'bg-purple-500',
  shopping_mall: 'bg-pink-500',
  park: 'bg-emerald-500',
  metro_station: 'bg-indigo-500',
  gas_station: 'bg-yellow-500',
  pharmacy: 'bg-cyan-500'
};

// Memoized amenity card component
const AmenityCard = memo(({ amenity, onDirections }: AmenityCardProps) => {
  const IconComponent = amenityIcons[amenity.type] || MapPin;
  const colorClass = amenityColors[amenity.type] || 'bg-gray-500';

  const formatDistance = useCallback((distance: number) => {
    if (distance < 1000) {
      return `${Math.round(distance)} m`;
    }
    return `${(distance / 1000).toFixed(1)} km`;
  }, []);

  const formatDuration = useCallback((duration: string | number) => {
    if (typeof duration === 'string') return duration;
    if (duration < 60) return `${duration} min walk`;
    return `${Math.round(duration / 60)} hr walk`;
  }, []);

  const getRatingColor = useCallback((rating: number) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 4.0) return 'text-blue-600';
    if (rating >= 3.5) return 'text-yellow-600';
    return 'text-gray-600';
  }, []);

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          {/* Icon */}
          <div className={`${colorClass} p-2 rounded-lg flex-shrink-0`}>
            <IconComponent className="h-4 w-4 text-white" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
                {amenity.name}
              </h4>
              
              {/* Rating */}
              {amenity.rating && (
                <div className="flex items-center space-x-1 flex-shrink-0 ml-2">
                  <Star className={`h-3 w-3 ${getRatingColor(amenity.rating)} fill-current`} />
                  <span className={`text-xs font-medium ${getRatingColor(amenity.rating)}`}>
                    {amenity.rating.toFixed(1)}
                  </span>
                </div>
              )}
            </div>

            {/* Address */}
            <div className="flex items-center text-gray-500 text-xs mb-2">
              <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
              <span className="line-clamp-1">{amenity.address}</span>
            </div>

            {/* Distance and Duration */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3 text-xs">
                <div className="flex items-center text-blue-600">
                  <Navigation className="h-3 w-3 mr-1" />
                  <span className="font-medium">{formatDistance(amenity.distance)}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{formatDuration(amenity.duration)}</span>
                </div>
              </div>

              {/* Reviews count */}
              {amenity.userRatingsTotal && (
                <div className="flex items-center text-xs text-gray-500">
                  <Users className="h-3 w-3 mr-1" />
                  <span>{amenity.userRatingsTotal.toLocaleString()} reviews</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={onDirections}
                className="flex-1 text-xs h-7"
              >
                <Navigation className="h-3 w-3 mr-1" />
                Directions
              </Button>
              
              {/* Additional actions */}
              <Button
                size="sm"
                variant="ghost"
                className="h-7 px-2"
                onClick={() => {
                  // Open place details in Google Maps
                  const url = `https://www.google.com/maps/place/?q=place_id:${amenity.placeId}`;
                  window.open(url, '_blank');
                }}
              >
                <Globe className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

AmenityCard.displayName = 'AmenityCard';

export function AmenityDistanceDisplay({ 
  amenities, 
  loading, 
  propertyLocation 
}: AmenityListProps) {
  
  // Group amenities by type and sort by distance
  const groupedAmenities = useMemo(() => {
    const grouped: { [key in AmenityType]?: NearbyAmenity[] } = {};
    
    amenities.forEach(amenity => {
      if (!grouped[amenity.type]) {
        grouped[amenity.type] = [];
      }
      grouped[amenity.type]!.push(amenity);
    });

    // Sort each group by distance
    Object.keys(grouped).forEach(type => {
      grouped[type as AmenityType]!.sort((a, b) => a.distance - b.distance);
    });

    return grouped;
  }, [amenities]);

  // Calculate statistics
  const stats = useMemo(() => {
    if (amenities.length === 0) return null;

    const totalAmenities = amenities.length;
    const averageDistance = amenities.reduce((sum, a) => sum + a.distance, 0) / totalAmenities;
    const closestAmenity = amenities.reduce((closest, current) => 
      current.distance < closest.distance ? current : closest
    );
    const typeCount = Object.keys(groupedAmenities).length;

    return {
      totalAmenities,
      averageDistance,
      closestAmenity,
      typeCount
    };
  }, [amenities, groupedAmenities]);

  const handleDirections = useCallback((amenity: NearbyAmenity) => {
    const url = `https://www.google.com/maps/dir/${propertyLocation.lat},${propertyLocation.lng}/${amenity.coordinates.lat},${amenity.coordinates.lng}`;
    window.open(url, '_blank');
  }, [propertyLocation]);

  const getAmenityTypeLabel = useCallback((type: AmenityType) => {
    return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded animate-pulse w-48" />
          </CardHeader>
          <CardContent className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-gray-200 rounded-lg animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (amenities.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Nearby Amenities Found
          </h3>
          <p className="text-gray-600">
            Try expanding the search radius or selecting different amenity types.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Card */}
      {stats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Nearby Amenities Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.totalAmenities}</div>
                <div className="text-sm text-gray-600">Total Amenities</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.typeCount}</div>
                <div className="text-sm text-gray-600">Categories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {stats.averageDistance < 1000 
                    ? `${Math.round(stats.averageDistance)}m`
                    : `${(stats.averageDistance / 1000).toFixed(1)}km`
                  }
                </div>
                <div className="text-sm text-gray-600">Avg Distance</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {stats.closestAmenity.distance < 1000 
                    ? `${Math.round(stats.closestAmenity.distance)}m`
                    : `${(stats.closestAmenity.distance / 1000).toFixed(1)}km`
                  }
                </div>
                <div className="text-sm text-gray-600">Closest</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Grouped Amenities */}
      {Object.entries(groupedAmenities).map(([type, typeAmenities], index) => {
        const IconComponent = amenityIcons[type as AmenityType] || MapPin;
        const colorClass = amenityColors[type as AmenityType] || 'bg-gray-500';
        
        return (
          <Card key={type}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`${colorClass} p-2 rounded-lg`}>
                    <IconComponent className="h-5 w-5 text-white" />
                  </div>
                  <span>{getAmenityTypeLabel(type as AmenityType)}</span>
                  <Badge variant="secondary" className="ml-auto">
                    {typeAmenities!.length}
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {typeAmenities!.map((amenity, amenityIndex) => (
                  <React.Fragment key={amenity.placeId}>
                    <AmenityCard
                      amenity={amenity}
                      onDirections={() => handleDirections(amenity)}
                    />
                    {amenityIndex < typeAmenities!.length - 1 && (
                      <Separator className="my-3" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
