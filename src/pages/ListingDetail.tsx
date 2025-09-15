import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, MapPin, Bed, Bath, Car, Wifi, Shield, Clock, Calendar, Bus, Heart } from "lucide-react";
import Header from "@/components/Header";
import { AppSidebar } from "@/components/AppSidebar";
import { useToast } from "@/hooks/use-toast";

interface Listing {
  id: string;
  title: string;
  price: number;
  location: string;
  campus: string;
  bedrooms: number;
  bathrooms: number;
  description: string;
  features: string[];
  lease_term: string;
  available_from: string;
  bus_lines: string[];
  is_verified: boolean;
  created_at: string;
  user_id: string;
}

interface Profile {
  full_name: string;
  email: string;
  net_id: string;
}

const ListingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [listing, setListing] = useState<Listing | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInterested, setIsInterested] = useState(false);

  useEffect(() => {
    if (id) {
      fetchListing();
    }
  }, [id, user]);

  const fetchListing = async () => {
    try {
      // Fetch listing
      const { data: listingData, error: listingError } = await supabase
        .from('listings')
        .select('*')
        .eq('id', id)
        .single();

      if (listingError) throw listingError;

      // Fetch profile of listing owner
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('full_name, email, net_id')
        .eq('user_id', listingData.user_id)
        .single();

      if (profileError) throw profileError;

      setListing(listingData);
      setProfile(profileData);

      // Check if user is interested
      if (user) {
        const { data: interestData } = await supabase
          .from('listing_interests')
          .select('id')
          .eq('user_id', user.id)
          .eq('listing_id', id)
          .single();

        setIsInterested(!!interestData);
      }
    } catch (error) {
      console.error('Error fetching listing:', error);
      toast({
        title: "Error",
        description: "Could not load listing details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleInterest = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to show interest in listings",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isInterested) {
        const { error } = await supabase
          .from('listing_interests')
          .delete()
          .eq('user_id', user.id)
          .eq('listing_id', id);

        if (error) throw error;

        setIsInterested(false);
        toast({
          title: "Interest removed",
          description: "You're no longer interested in this listing",
        });
      } else {
        const { error } = await supabase
          .from('listing_interests')
          .upsert([{ user_id: user.id, listing_id: id }], {
            onConflict: 'user_id,listing_id'
          });

        if (error) throw error;

        setIsInterested(true);
        toast({
          title: "Interest added",
          description: "You'll now see others interested in this listing",
        });
      }
    } catch (error) {
      console.error('Error toggling interest:', error);
      toast({
        title: "Error",
        description: "Failed to update interest",
        variant: "destructive",
      });
    }
  };

  const getFeatureIcon = (feature: string) => {
    switch (feature.toLowerCase()) {
      case 'parking': return <Car className="h-4 w-4" />;
      case 'wifi': return <Wifi className="h-4 w-4" />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex w-full">
          <AppSidebar onCampusChange={() => {}} />
          <div className="flex-1 w-full">
            <main className="container mx-auto px-4 py-8">
              <div className="animate-pulse">
                <div className="h-8 bg-muted rounded w-48 mb-4"></div>
                <div className="h-64 bg-muted rounded mb-6"></div>
                <div className="space-y-4">
                  <div className="h-6 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex w-full">
          <AppSidebar onCampusChange={() => {}} />
          <div className="flex-1 w-full">
            <main className="container mx-auto px-4 py-8">
              <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">Listing not found</h1>
                <Button onClick={() => navigate('/')} variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to listings
                </Button>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex w-full">
        <AppSidebar onCampusChange={() => {}} />
        <div className="flex-1 w-full">
          <main className="container mx-auto px-4 py-8">
            {/* Back button */}
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className="mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Image placeholder */}
                <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                  <img 
                    src="/placeholder.svg"
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Title and basic info */}
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
                      <div className="flex items-center text-muted-foreground mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        {listing.location}
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center">
                          <Bed className="h-4 w-4 mr-1" />
                          {listing.bedrooms} bedrooms
                        </div>
                        <div className="flex items-center">
                          <Bath className="h-4 w-4 mr-1" />
                          {listing.bathrooms} bathrooms
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-primary">${listing.price}</div>
                      <div className="text-sm text-muted-foreground">per month</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="secondary">{listing.campus}</Badge>
                    {listing.is_verified && (
                      <Badge variant="secondary" className="bg-success text-success-foreground">
                        <Shield className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Description */}
                <Card>
                  <CardHeader>
                    <CardTitle>Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {listing.description || 'No description provided.'}
                    </p>
                  </CardContent>
                </Card>

                {/* Features */}
                {listing.features && listing.features.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Features</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {listing.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2">
                            {getFeatureIcon(feature)}
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Transportation */}
                {listing.bus_lines && listing.bus_lines.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Transportation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 mb-2">
                        <Bus className="h-4 w-4" />
                        <span className="text-sm font-medium">Bus Lines:</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {listing.bus_lines.map((line) => (
                          <Badge key={line} variant="outline">
                            {line}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Owner info */}
                <Card>
                  <CardHeader>
                    <CardTitle>Listed by</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {profile?.full_name?.charAt(0) || profile?.email?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">
                          {profile?.full_name || 'Student'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          NetID: {profile?.net_id || profile?.email?.split('@')[0] || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Lease details */}
                <Card>
                  <CardHeader>
                    <CardTitle>Lease Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Lease Term</span>
                      <span className="text-sm font-medium">{listing.lease_term}</span>
                    </div>
                    {listing.available_from && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Available From</span>
                        <div className="flex items-center gap-1 text-sm font-medium">
                          <Calendar className="h-3 w-3" />
                          {new Date(listing.available_from).toLocaleDateString()}
                        </div>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Posted</span>
                      <span className="text-sm font-medium">
                        {new Date(listing.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Action buttons */}
                <div className="space-y-3">
                  <Button 
                    className="w-full"
                    onClick={toggleInterest}
                  >
                    <Heart className={`h-4 w-4 mr-2 ${isInterested ? 'fill-current' : ''}`} />
                    {isInterested ? 'Remove Interest' : 'Show Interest'}
                  </Button>
                  
                  {user && listing.user_id !== user.id && (
                    <Button variant="outline" className="w-full">
                      Contact Owner
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ListingDetail;