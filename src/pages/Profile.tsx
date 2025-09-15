import Header from "@/components/Header";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { User, Home, Settings, Trash2 } from "lucide-react";
import ListingCard from "@/components/ListingCard";

interface Profile {
  id: string;
  full_name: string | null;
  email: string;
  created_at: string;
}

interface UserListing {
  id: string;
  title: string;
  price: number;
  location: string;
  campus?: string;
  bedrooms: number;
  bathrooms: number;
  features?: string[];
  lease_term?: string;
  available_from?: string;
  bus_lines?: string[];
  created_at: string;
  is_verified: boolean;
}

const Profile = () => {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userListings, setUserListings] = useState<UserListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fullName, setFullName] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchUserListings();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      
      setProfile(data);
      setFullName(data.full_name || "");
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchUserListings = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setUserListings(data || []);
    } catch (error) {
      console.error('Error fetching user listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    if (!user || !profile) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: fullName })
        .eq('user_id', user.id);

      if (error) throw error;

      setProfile({ ...profile, full_name: fullName });
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error updating profile",
        description: "Unable to update your profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const deleteListing = async (listingId: string) => {
    try {
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', listingId);

      if (error) throw error;

      setUserListings(userListings.filter(listing => listing.id !== listingId));
      toast({
        title: "Listing deleted",
        description: "Your listing has been successfully deleted.",
      });
    } catch (error) {
      console.error('Error deleting listing:', error);
      toast({
        title: "Error deleting listing",
        description: "Unable to delete the listing. Please try again.",
        variant: "destructive"
      });
    }
  };

  const transformedListings = userListings.map(listing => ({
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
    postedBy: 'You',
    isVerified: listing.is_verified,
    availableFrom: listing.available_from || '',
    busLines: listing.bus_lines || [],
  }));

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Sign In Required</h1>
          <p className="text-muted-foreground mb-6">Please sign in to view your profile.</p>
          <Button onClick={() => window.location.href = '/auth'}>
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-16 text-center">
          <p className="text-muted-foreground">Loading profile...</p>
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
          <main className="container py-8">
            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                <h1 className="text-3xl font-bold">Your Profile</h1>
                <p className="text-muted-foreground mt-2">
                  Manage your account and listings
                </p>
              </div>

              <Tabs defaultValue="profile" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="listings">My Listings</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="profile">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Profile Information
                      </CardTitle>
                      <CardDescription>
                        Update your personal information and preferences.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Enter your full name"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          value={profile?.email || user.email || ""}
                          disabled
                          className="bg-muted"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Member Since</Label>
                        <div className="text-sm text-muted-foreground">
                          {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : "Unknown"}
                        </div>
                      </div>

                      <Button onClick={updateProfile} disabled={saving}>
                        {saving ? "Saving..." : "Save Changes"}
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="listings">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Home className="h-5 w-5" />
                        Your Listings ({userListings.length})
                      </CardTitle>
                      <CardDescription>
                        Manage your property listings and track their performance.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {userListings.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {transformedListings.map((listing) => (
                            <div key={listing.id} className="relative">
                              <ListingCard listing={listing} />
                              <div className="absolute top-2 right-2 flex gap-2">
                                <Badge variant="secondary">
                                  {listing.isVerified ? "Verified" : "Pending"}
                                </Badge>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => deleteListing(listing.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <Home className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground mb-4">You haven't posted any listings yet.</p>
                          <Button variant="hero" onClick={() => window.location.href = '/create-listing'}>
                            Post Your First Listing
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="settings">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        Account Settings
                      </CardTitle>
                      <CardDescription>
                        Manage your account preferences and security.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label>Account Status</Label>
                        <Badge variant="default">Active</Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Email Verification</Label>
                        <Badge variant="default">Verified</Badge>
                      </div>

                      <div className="pt-6 border-t">
                        <Button variant="destructive" onClick={signOut}>
                          Sign Out
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Profile;