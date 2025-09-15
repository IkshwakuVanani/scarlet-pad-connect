import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MapPin, Bed, Bath, Car, Wifi, Shield, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
interface ListingCardProps {
  listing: {
    id: string;
    title: string;
    price: number;
    location: string;
    campus: string;
    bedrooms: number;
    bathrooms: number;
    images: string[];
    features: string[];
    leaseTerm: string;
    postedBy: string;
    isVerified: boolean;
    availableFrom: string;
    busLines?: string[];
  };
}

const ListingCard = ({ listing }: ListingCardProps) => {
  const [isInterested, setIsInterested] = useState(false);
  const navigate = useNavigate();
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      const { data: files, error } = await supabase.storage
        .from('listing-images')
        .list(`${listing.id}/`, { limit: 1 });
      if (!error && files && files.length > 0) {
        const { data } = supabase.storage
          .from('listing-images')
          .getPublicUrl(`${listing.id}/${files[0].name}`);
        if (isMounted) setCoverUrl(data.publicUrl);
      } else {
        if (isMounted) setCoverUrl(null);
      }
    };
    load();
    return () => { isMounted = false; };
  }, [listing.id]);

  // Check if user is interested in this listing
  useEffect(() => {
    const checkInterest = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('listing_interests')
          .select('id')
          .eq('user_id', user.id)
          .eq('listing_id', listing.id)
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
          console.error('Error checking interest:', error);
          return;
        }

        setIsInterested(!!data);
      } catch (error) {
        console.error('Error checking interest:', error);
      }
    };

    checkInterest();
  }, [user, listing.id]);

  const toggleInterest = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to show interest in listings",
        variant: "destructive",
      });
      return;
    }

    const wasInterested = isInterested;
    
    // Optimistic update
    setIsInterested(!wasInterested);

    try {
      if (wasInterested) {
        // Remove interest
        const { error } = await supabase
          .from('listing_interests')
          .delete()
          .eq('user_id', user.id)
          .eq('listing_id', listing.id);

        if (error) throw error;

        toast({
          title: "Interest removed",
          description: "You're no longer interested in this listing",
        });
      } else {
        // Add interest
        const { error } = await supabase
          .from('listing_interests')
          .upsert([{ user_id: user.id, listing_id: listing.id }], {
            onConflict: 'user_id,listing_id'
          });

        if (error) throw error;

        toast({
          title: "Interest added",
          description: "You'll now see others interested in this listing in the Roommates tab",
        });
      }
    } catch (error) {
      console.error('Error toggling interest:', error);
      
      // Revert optimistic update on error
      setIsInterested(wasInterested);
      
      toast({
        title: "Error",
        description: "Failed to update interest",
        variant: "destructive",
      });
    }
  };

  const getFeatureIcon = (feature: string) => {
    switch (feature.toLowerCase()) {
      case 'parking': return <Car className="h-3 w-3" />;
      case 'wifi': return <Wifi className="h-3 w-3" />;
      default: return null;
    }
  };

  return (
    <Card className="group overflow-hidden bg-gradient-card border-0 shadow-card hover:shadow-hero transition-all duration-300 transform hover:-translate-y-2">
      <div className="relative">
        {/* Image */}
        <div className="aspect-video bg-muted overflow-hidden">
          <img 
            src={coverUrl || listing.images[0] || "/placeholder.svg"}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            decoding="async"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg";
            }}
          />
        </div>
        
        {/* Favorite Button */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm hover:bg-background/90"
          onClick={(e) => {
            e.preventDefault();
            toggleInterest();
          }}
        >
          <Heart className={`h-4 w-4 ${isInterested ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
        </Button>

        {/* Badges */}
        <div className="absolute top-2 left-2 space-y-1">
          {listing.isVerified && (
            <Badge variant="secondary" className="bg-success text-success-foreground shadow-trust">
              <Shield className="h-3 w-3 mr-1" />
              Verified
            </Badge>
          )}
          <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
            {listing.campus}
          </Badge>
        </div>

        {/* Available From */}
        <div className="absolute bottom-2 right-2">
          <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm text-xs">
            <Clock className="h-3 w-3 mr-1" />
            {listing.availableFrom}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
              {listing.title}
            </h3>
            <div className="text-right">
              <div className="text-xl font-bold text-primary">${listing.price}</div>
              <div className="text-xs text-muted-foreground">per month</div>
            </div>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1" />
            {listing.location}
          </div>
        </div>

        {/* Property Details */}
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Bed className="h-4 w-4 mr-1" />
            {listing.bedrooms} bed
          </div>
          <div className="flex items-center">
            <Bath className="h-4 w-4 mr-1" />
            {listing.bathrooms} bath
          </div>
        </div>

        {/* Features */}
        {listing.features && listing.features.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {listing.features.slice(0, 3).map((feature, index) => (
              <Badge key={index} variant="outline" className="text-xs py-1 px-2">
                {getFeatureIcon(feature)}
                <span className="ml-1">{feature}</span>
              </Badge>
            ))}
            {listing.features.length > 3 && (
              <Badge variant="outline" className="text-xs py-1 px-2">
                +{listing.features.length - 3} more
              </Badge>
            )}
          </div>
        )}

        {/* Bus Lines */}
        {listing.busLines && listing.busLines.length > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-xs text-muted-foreground">Bus Lines:</span>
            <div className="flex space-x-1">
              {listing.busLines.slice(0, 2).map((line) => (
                <Badge key={line} variant="secondary" className="text-xs">
                  {line}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Lease Term & Posted By */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
          <span>{listing.leaseTerm}</span>
          <span>Posted by {listing.postedBy}</span>
        </div>

        {/* CTA Button */}
        <Button 
          className="w-full bg-gradient-hero hover:shadow-hero transition-all duration-300" 
          size="sm"
          onClick={() => navigate(`/listing/${listing.id}`)}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default ListingCard;