import Header from "@/components/Header";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { User, Home, Settings, Trash2, Shield, Clock, Moon, Sun, Laptop, Bell, Lock, Eye, Palette, Volume2 } from "lucide-react";
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
  const { theme, setTheme, actualTheme } = useTheme();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userListings, setUserListings] = useState<UserListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fullName, setFullName] = useState("");
  const { toast } = useToast();
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(false);
  const [privacy, setPrivacy] = useState('public');

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
                                <Badge 
                                  variant={listing.isVerified ? "default" : "secondary"}
                                  className={
                                    listing.isVerified 
                                      ? "bg-emerald-500 text-white shadow-lg border-emerald-400" 
                                      : "bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg border-0 animate-pulse"
                                  }
                                >
                                  {listing.isVerified ? (
                                    <>
                                      <Shield className="h-3 w-3 mr-1" />
                                      Verified
                                    </>
                                  ) : (
                                    <>
                                      <Clock className="h-3 w-3 mr-1" />
                                      Pending
                                    </>
                                  )}
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
                  <div className="space-y-6">
                    {/* Theme Settings */}
                    <Card className="overflow-hidden bg-gradient-to-br from-card to-secondary/20 border-0 shadow-lg animate-fade-in">
                      <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
                        <CardTitle className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <Palette className="h-5 w-5 text-primary" />
                          </div>
                          Appearance & Theme
                        </CardTitle>
                        <CardDescription>
                          Customize how the app looks and feels
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-6 space-y-6">
                        <div className="space-y-3">
                          <Label className="text-sm font-medium">Theme Preference</Label>
                          <Select value={theme} onValueChange={setTheme}>
                            <SelectTrigger className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="light" className="flex items-center gap-2">
                                <Sun className="h-4 w-4" />
                                Light Mode
                              </SelectItem>
                              <SelectItem value="dark" className="flex items-center gap-2">
                                <Moon className="h-4 w-4" />
                                Dark Mode
                              </SelectItem>
                              <SelectItem value="system" className="flex items-center gap-2">
                                <Laptop className="h-4 w-4" />
                                System Default
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-muted-foreground">
                            Currently using: <span className="font-medium capitalize">{actualTheme}</span> theme
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Notification Settings */}
                    <Card className="overflow-hidden bg-gradient-to-br from-card to-secondary/20 border-0 shadow-lg animate-fade-in">
                      <CardHeader className="bg-gradient-to-r from-blue-500/5 to-blue-500/10 border-b">
                        <CardTitle className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-blue-500/10">
                            <Bell className="h-5 w-5 text-blue-500" />
                          </div>
                          Notifications
                        </CardTitle>
                        <CardDescription>
                          Manage your notification preferences
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-6 space-y-6">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <Label className="text-sm font-medium">Push Notifications</Label>
                            <p className="text-xs text-muted-foreground">Get notified about new matches and messages</p>
                          </div>
                          <Switch 
                            checked={notifications} 
                            onCheckedChange={setNotifications}
                            className="data-[state=checked]:bg-primary"
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <Label className="text-sm font-medium">Email Updates</Label>
                            <p className="text-xs text-muted-foreground">Receive weekly digest of new listings</p>
                          </div>
                          <Switch 
                            checked={emailUpdates} 
                            onCheckedChange={setEmailUpdates}
                            className="data-[state=checked]:bg-primary"
                          />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Privacy Settings */}
                    <Card className="overflow-hidden bg-gradient-to-br from-card to-secondary/20 border-0 shadow-lg animate-fade-in">
                      <CardHeader className="bg-gradient-to-r from-green-500/5 to-green-500/10 border-b">
                        <CardTitle className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-green-500/10">
                            <Lock className="h-5 w-5 text-green-500" />
                          </div>
                          Privacy & Security
                        </CardTitle>
                        <CardDescription>
                          Control who can see your profile and listings
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-6 space-y-6">
                        <div className="space-y-3">
                          <Label className="text-sm font-medium">Profile Visibility</Label>
                          <Select value={privacy} onValueChange={setPrivacy}>
                            <SelectTrigger className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="public">
                                <div className="flex items-center gap-2">
                                  <Eye className="h-4 w-4" />
                                  <span>Public - Visible to everyone</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="students">
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4" />
                                  <span>Students Only - Rutgers students only</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="private">
                                <div className="flex items-center gap-2">
                                  <Lock className="h-4 w-4" />
                                  <span>Private - Hidden from search</span>
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Account Status */}
                    <Card className="overflow-hidden bg-gradient-to-br from-card to-secondary/20 border-0 shadow-lg animate-fade-in">
                      <CardHeader className="bg-gradient-to-r from-orange-500/5 to-orange-500/10 border-b">
                        <CardTitle className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-orange-500/10">
                            <Settings className="h-5 w-5 text-orange-500" />
                          </div>
                          Account Status
                        </CardTitle>
                        <CardDescription>
                          Your account information and verification status
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-6 space-y-4">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-success/5 border border-success/20">
                          <div className="flex items-center gap-3">
                            <div className="p-1.5 rounded-full bg-success/20">
                              <Shield className="h-4 w-4 text-success" />
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Account Status</Label>
                              <p className="text-xs text-muted-foreground">Your account is active and verified</p>
                            </div>
                          </div>
                          <Badge variant="default" className="bg-success text-success-foreground">
                            Active
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
                          <div className="flex items-center gap-3">
                            <div className="p-1.5 rounded-full bg-blue-500/20">
                              <User className="h-4 w-4 text-blue-500" />
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Email Verification</Label>
                              <p className="text-xs text-muted-foreground">Your email has been verified</p>
                            </div>
                          </div>
                          <Badge variant="default" className="bg-blue-500 text-white">
                            Verified
                          </Badge>
                        </div>
                        
                        <div className="pt-4 border-t">
                          <Button 
                            variant="destructive" 
                            onClick={signOut}
                            className="w-full group hover-scale transition-all duration-300"
                          >
                            <div className="flex items-center gap-2">
                              <Lock className="h-4 w-4 group-hover:rotate-12 transition-transform" />
                              Sign Out
                            </div>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
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