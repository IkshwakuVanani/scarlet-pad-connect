import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Bed, Bath, DollarSign } from 'lucide-react';

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Rutgers Campus coordinates
const RUTGERS_CAMPUSES = {
  'College Avenue': { lat: 40.5008, lng: -74.4474 },
  'Busch Campus': { lat: 40.5237, lng: -74.4384 },
  'Livingston Campus': { lat: 40.5255, lng: -74.4378 },
  'Cook/Douglass Campus': { lat: 40.4832, lng: -74.4357 },
};

// Create custom icon for listings
const createListingIcon = (price: number) => {
  const color = price > 1000 ? '#dc2626' : price > 800 ? '#ea580c' : '#059669';
  
  return L.divIcon({
    html: `
      <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 50%; background: white; border: 2px solid ${color}; box-shadow: 0 2px 8px rgba(0,0,0,0.2);">
        <div style="width: 12px; height: 12px; border-radius: 50%; background-color: ${color};"></div>
        <div style="position: absolute; top: -32px; left: 50%; transform: translateX(-50%); background: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600; box-shadow: 0 2px 4px rgba(0,0,0,0.2); color: ${color}; white-space: nowrap;">
          $${price}
        </div>
      </div>
    `,
    className: 'custom-listing-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

interface ListingWithCoordinates {
  id: string;
  title: string;
  price: number;
  location: string;
  campus: string;
  bedrooms: number;
  bathrooms: number;
  features: string[];
  leaseTerm: string;
  coordinates: { lat: number; lng: number };
}

interface MapComponentProps {
  listings: any[];
  selectedCampus?: string;
  onListingSelect?: (listingId: string) => void;
}

const MapComponent = ({ listings, selectedCampus, onListingSelect }: MapComponentProps) => {
  const [listingsWithCoords, setListingsWithCoords] = useState<ListingWithCoordinates[]>([]);
  const [map, setMap] = useState<L.Map | null>(null);

  // Generate coordinates for listings based on campus
  useEffect(() => {
    const listingsWithCoordinates = listings.map((listing) => {
      const baseCampus = RUTGERS_CAMPUSES[listing.campus as keyof typeof RUTGERS_CAMPUSES] || RUTGERS_CAMPUSES['College Avenue'];
      
      // Add some random offset to create variety while staying near campus
      const latOffset = (Math.random() - 0.5) * 0.01; // ~0.5 mile radius
      const lngOffset = (Math.random() - 0.5) * 0.01;
      
      return {
        ...listing,
        coordinates: {
          lat: baseCampus.lat + latOffset,
          lng: baseCampus.lng + lngOffset,
        },
      };
    });

    setListingsWithCoords(listingsWithCoordinates);
  }, [listings]);

  // Handle map view changes when campus selection changes
  useEffect(() => {
    if (map && selectedCampus && RUTGERS_CAMPUSES[selectedCampus as keyof typeof RUTGERS_CAMPUSES]) {
      const campus = RUTGERS_CAMPUSES[selectedCampus as keyof typeof RUTGERS_CAMPUSES];
      map.setView([campus.lat, campus.lng], 15);
    }
  }, [selectedCampus, map]);

  // Filter listings based on selected campus
  const filteredListings = selectedCampus 
    ? listingsWithCoords.filter(listing => listing.campus === selectedCampus)
    : listingsWithCoords;

  // Calculate center point
  const center = selectedCampus && RUTGERS_CAMPUSES[selectedCampus as keyof typeof RUTGERS_CAMPUSES]
    ? RUTGERS_CAMPUSES[selectedCampus as keyof typeof RUTGERS_CAMPUSES]
    : { lat: 40.5008, lng: -74.4474 }; // Default to College Avenue

  return (
    <div className="w-full h-[600px] rounded-lg overflow-hidden shadow-card border border-border">
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={selectedCampus ? 15 : 13}
        className="h-full w-full"
        scrollWheelZoom={true}
        ref={setMap}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Campus markers */}
        {!selectedCampus && Object.entries(RUTGERS_CAMPUSES).map(([campusName, coords]) => (
          <Marker
            key={campusName}
            position={[coords.lat, coords.lng]}
            icon={L.divIcon({
              html: `
                <div style="display: flex; align-items: center; justify-content: center; width: 24px; height: 24px; border-radius: 50%; background: hsl(0 100% 35%); color: white; font-size: 12px; font-weight: bold;">
                  R
                </div>
              `,
              className: 'campus-marker',
              iconSize: [24, 24],
              iconAnchor: [12, 12],
            })}
          >
            <Popup>
              <div className="text-center">
                <h3 className="font-semibold text-foreground">{campusName}</h3>
                <p className="text-sm text-muted-foreground">Rutgers University</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Listing markers */}
        {filteredListings.map((listing) => (
          <Marker
            key={listing.id}
            position={[listing.coordinates.lat, listing.coordinates.lng]}
            icon={createListingIcon(listing.price)}
          >
            <Popup>
              <Card className="w-64 border-0 shadow-none">
                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-sm text-foreground line-clamp-2">
                      {listing.title}
                    </h3>
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {listing.campus}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <DollarSign className="h-3 w-3" />
                      <span className="font-semibold">{listing.price}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Bed className="h-3 w-3" />
                      <span>{listing.bedrooms}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Bath className="h-3 w-3" />
                      <span>{listing.bathrooms}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>{listing.location}</span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {listing.features.slice(0, 3).map((feature) => (
                      <Badge key={feature} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>

                  <Button 
                    size="sm" 
                    className="w-full"
                    onClick={() => onListingSelect?.(listing.id)}
                  >
                    View Details
                  </Button>
                </div>
              </Card>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;