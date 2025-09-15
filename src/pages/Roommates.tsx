import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Heart, MapPin, Users, Home } from "lucide-react";
import Header from "@/components/Header";
import { AppSidebar } from "@/components/AppSidebar";
import { useToast } from "@/hooks/use-toast";

interface ListingInterest {
  id: string;
  user_id: string;
  listing_id: string;
  created_at: string;
  profiles: {
    full_name: string | null;
    email: string;
  } | null;
}

interface GroupedInterests {
  [listingId: string]: {
    listing: any;
    interestedUsers: ListingInterest[];
  };
}

const Roommates = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedCampus, setSelectedCampus] = useState<string>("");
  const [groupedInterests, setGroupedInterests] = useState<GroupedInterests>({});
  const [userInterests, setUserInterests] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState<any[]>([]);

  const fetchListings = async () => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select(`
          *,
          profiles(full_name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform to match expected format
      const transformedListings = (data || []).map(listing => ({
        id: listing.id,
        title: listing.title,
        price: listing.price,
        location: listing.location,
        campus: listing.campus || '',
        bedrooms: listing.bedrooms,
        bathrooms: listing.bathrooms,
        images: [], // Will implement image fetching later
        features: listing.features || [],
        leaseTerm: listing.lease_term || '',
        postedBy: listing.profiles?.full_name || listing.profiles?.email || 'Student',
        isVerified: listing.is_verified,
        availableFrom: listing.available_from || '',
        busLines: listing.bus_lines || [],
      }));

      setListings(transformedListings);
    } catch (error) {
      console.error('Error fetching listings:', error);
      
      // Fallback: fetch listings and profiles separately
      try {
        const { data: listingsData } = await supabase
          .from('listings')
          .select('*')
          .order('created_at', { ascending: false });

        const { data: profilesData } = await supabase
          .from('profiles')
          .select('user_id, full_name, email');

        const profileMap = new Map();
        profilesData?.forEach(profile => {
          profileMap.set(profile.user_id, profile);
        });

        const transformedListings = (listingsData || []).map(listing => ({
          id: listing.id,
          title: listing.title,
          price: listing.price,
          location: listing.location,
          campus: listing.campus || '',
          bedrooms: listing.bedrooms,
          bathrooms: listing.bathrooms,
          images: [],
          features: listing.features || [],
          leaseTerm: listing.lease_term || '',
          postedBy: profileMap.get(listing.user_id)?.full_name || 
                   profileMap.get(listing.user_id)?.email || 'Student',
          isVerified: listing.is_verified,
          availableFrom: listing.available_from || '',
          busLines: listing.bus_lines || [],
        }));

        setListings(transformedListings);
      } catch (fallbackError) {
        console.error('Fallback error:', fallbackError);
        setListings([]);
      }
    }
  };

  const fetchRoommateData = async () => {
    if (!user) return;

    try {
      // Fetch all listing interests
      const { data: interests, error: interestsError } = await supabase
        .from('listing_interests')
        .select('id, user_id, listing_id, created_at');

      if (interestsError) throw interestsError;

      // Fetch all profiles for users who have interests
      const userIds = Array.from(new Set(interests?.map(i => i.user_id) || []));
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, full_name, email')
        .in('user_id', userIds);

      if (profilesError) throw profilesError;

      // Create a map of user profiles
      const profileMap = new Map();
      profiles?.forEach(profile => {
        profileMap.set(profile.user_id, profile);
      });

      // Combine interests with profile data
      const interestsWithProfiles = interests?.map(interest => ({
        ...interest,
        profiles: profileMap.get(interest.user_id) || null
      })) || [];

      // Group interests by listing
      const grouped: GroupedInterests = {};
      const currentUserInterests = new Set<string>();

      interestsWithProfiles.forEach((interest) => {
        if (interest.user_id === user.id) {
          currentUserInterests.add(interest.listing_id);
        }

        if (!grouped[interest.listing_id]) {
          const listing = listings.find(l => l.id === interest.listing_id);
          if (listing) {
            grouped[interest.listing_id] = {
              listing,
              interestedUsers: []
            };
          }
        }

        if (grouped[interest.listing_id]) {
          grouped[interest.listing_id].interestedUsers.push(interest);
        }
      });

      // Only show listings where current user is interested
      const userGroupedInterests: GroupedInterests = {};
      Object.keys(grouped).forEach(listingId => {
        if (currentUserInterests.has(listingId)) {
          userGroupedInterests[listingId] = grouped[listingId];
        }
      });

      setGroupedInterests(userGroupedInterests);
      setUserInterests(currentUserInterests);
    } catch (error) {
      console.error('Error fetching roommate data:', error);
      toast({
        title: "Error",
        description: "Failed to load roommate data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleInterest = async (listingId: string) => {
    if (!user) return;

    const wasInterested = userInterests.has(listingId);
    
    // Optimistic update - update UI state immediately
    const newUserInterests = new Set(userInterests);
    if (wasInterested) {
      newUserInterests.delete(listingId);
    } else {
      newUserInterests.add(listingId);
    }
    setUserInterests(newUserInterests);

    try {
      if (wasInterested) {
        // Remove interest
        const { error } = await supabase
          .from('listing_interests')
          .delete()
          .eq('user_id', user.id)
          .eq('listing_id', listingId);

        if (error) throw error;

        toast({
          title: "Interest removed",
          description: "You're no longer interested in this listing",
        });
      } else {
        // Add interest - use upsert to handle duplicates gracefully
        const { error } = await supabase
          .from('listing_interests')
          .upsert([{ user_id: user.id, listing_id: listingId }], {
            onConflict: 'user_id,listing_id'
          });

        if (error) throw error;

        toast({
          title: "Interest added",
          description: "You'll now see others interested in this listing",
        });
      }

      // Refresh data to sync with server
      await fetchRoommateData();
    } catch (error) {
      console.error('Error toggling interest:', error);
      
      // Revert optimistic update on error
      setUserInterests(userInterests);
      
      toast({
        title: "Error",
        description: "Failed to update interest",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchListings();
    if (user) {
      fetchRoommateData();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex w-full">
          <AppSidebar onCampusChange={setSelectedCampus} />
          <div className="flex-1 w-full">
            <main className="container mx-auto px-4 py-8">
              <div className="text-center">
                <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h1 className="text-3xl font-bold mb-2">Find Your Roommates</h1>
                <p className="text-muted-foreground mb-6">
                  Sign in to connect with other students interested in the same housing
                </p>
                <Button onClick={() => window.location.href = '/auth'}>
                  Sign In to Get Started
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
        <AppSidebar onCampusChange={setSelectedCampus} />
        
        <div className="flex-1 w-full">
          <main className="container mx-auto px-4 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                <Users className="h-8 w-8" />
                Find Roommates
              </h1>
              <p className="text-muted-foreground">
                Connect with other students interested in the same housing options
              </p>
            </div>

            {/* Available Listings to Join */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Available Listings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings
                  .filter(listing => !selectedCampus || listing.campus === selectedCampus)
                  .map((listing) => (
                  <Card key={listing.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{listing.title}</CardTitle>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {listing.location}
                          </p>
                        </div>
                        <Badge variant="secondary">{listing.campus}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-2xl font-bold text-primary">
                          ${listing.price}/month
                        </span>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Home className="h-4 w-4" />
                          {listing.bedrooms}BR/{listing.bathrooms}BA
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          By {listing.postedBy}
                        </span>
                        <Button
                          variant={userInterests.has(listing.id) ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleInterest(listing.id)}
                          className="flex items-center gap-1"
                        >
                          <Heart className={`h-4 w-4 ${userInterests.has(listing.id) ? 'fill-current' : ''}`} />
                          {userInterests.has(listing.id) ? 'Interested' : 'Show Interest'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Your Roommate Connections */}
            {Object.keys(groupedInterests).length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Your Potential Roommates</h2>
                <div className="space-y-6">
                  {Object.entries(groupedInterests).map(([listingId, data]) => (
                    <Card key={listingId}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{data.listing.title}</CardTitle>
                            <p className="text-sm text-muted-foreground">
                              {data.interestedUsers.length} student(s) interested
                            </p>
                          </div>
                          <Badge variant="outline">${data.listing.price}/month</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {data.interestedUsers.map((interest) => (
                            <div
                              key={interest.id}
                              className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                            >
                              <Avatar className="h-10 w-10">
                                <AvatarFallback>
                                  {interest.profiles?.full_name?.charAt(0) || 
                                   interest.profiles?.email?.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium truncate">
                                  {interest.profiles?.full_name || 'Student'}
                                </p>
                                <p className="text-sm text-muted-foreground truncate">
                                  {interest.profiles?.email}
                                </p>
                                {interest.user_id === user?.id && (
                                  <Badge variant="secondary" className="text-xs mt-1">You</Badge>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {loading && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-muted-foreground">Loading roommate data...</p>
              </div>
            )}

            {!loading && Object.keys(groupedInterests).length === 0 && userInterests.size === 0 && (
              <div className="text-center py-8">
                <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No roommate connections yet</h3>
                <p className="text-muted-foreground">
                  Show interest in listings above to connect with potential roommates
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Roommates;