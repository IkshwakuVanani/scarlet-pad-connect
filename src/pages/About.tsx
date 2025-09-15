import Header from "@/components/Header";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MapPin, Users, Shield, Heart, Star, Award, Target, CheckCircle2, Mail, Github, Linkedin } from "lucide-react";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex w-full">
        <AppSidebar onCampusChange={() => {}} />
        
        <div className="flex-1 w-full">
          <main className="container py-8">
            <div className="max-w-6xl mx-auto">
              {/* Hero Section */}
              <div className="text-center mb-16 animate-fade-in">
                <Badge variant="secondary" className="inline-flex items-center space-x-2 mb-6">
                  <Heart className="h-4 w-4" />
                  <span>About RU Housing</span>
                </Badge>
                <h1 className="text-5xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent">
                  Connecting Rutgers Students
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  RU Housing is the premier platform for Rutgers University students to find trusted housing and roommates. 
                  Built by students, for students, we're creating a safer, more connected campus housing experience.
                </p>
                <div className="flex items-center justify-center gap-6 mt-8">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span className="font-medium">Student Verified</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-blue-500" />
                    <span className="font-medium">Safe & Secure</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-purple-500" />
                    <span className="font-medium">Community Driven</span>
                  </div>
                </div>
              </div>

              {/* Mission & Vision */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
                <Card className="hover:shadow-lg transition-shadow animate-fade-in">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                      <Target className="h-6 w-6 text-red-500" />
                      Our Mission
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                      To revolutionize how Rutgers students find housing by creating a trusted, student-only community 
                      that prioritizes safety, transparency, and authentic connections. We believe every student deserves 
                      access to quality housing and genuine roommate relationships.
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow animate-fade-in">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                      <Star className="h-6 w-6 text-yellow-500" />
                      Our Vision
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                      To be the go-to platform for all Rutgers housing needs, fostering a campus community where 
                      students support each other in finding not just places to live, but places to call home. 
                      We envision a future where housing stress is eliminated for every student.
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Core Values */}
              <div className="mb-16">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
                  <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    These principles guide everything we do and shape the RU Housing experience
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="text-center hover:shadow-lg transition-shadow animate-fade-in">
                    <CardHeader className="pb-4">
                      <Shield className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                      <CardTitle className="text-lg">Safety First</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Student verification and community guidelines ensure a safe environment for all users
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="text-center hover:shadow-lg transition-shadow animate-fade-in">
                    <CardHeader className="pb-4">
                      <Users className="h-12 w-12 text-green-500 mx-auto mb-4" />
                      <CardTitle className="text-lg">Community</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Building genuine connections between Rutgers students through shared housing experiences
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="text-center hover:shadow-lg transition-shadow animate-fade-in">
                    <CardHeader className="pb-4">
                      <CheckCircle2 className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                      <CardTitle className="text-lg">Transparency</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Clear, honest information about properties and pricing with no hidden fees or surprises
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="text-center hover:shadow-lg transition-shadow animate-fade-in">
                    <CardHeader className="pb-4">
                      <Heart className="h-12 w-12 text-red-500 mx-auto mb-4" />
                      <CardTitle className="text-lg">Student-Focused</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Every feature and decision is made with student needs, budgets, and lifestyles in mind
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Platform Stats */}
              <Card className="mb-16 bg-gradient-hero text-primary-foreground animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-center text-2xl">Platform Impact</CardTitle>
                  <CardDescription className="text-center text-primary-foreground/80">
                    Making a difference in the Rutgers housing community
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                    <div>
                      <div className="text-4xl font-bold mb-2">2,500+</div>
                      <div className="text-sm opacity-90">Verified Students</div>
                    </div>
                    <div>
                      <div className="text-4xl font-bold mb-2">850+</div>
                      <div className="text-sm opacity-90">Active Listings</div>
                    </div>
                    <div>
                      <div className="text-4xl font-bold mb-2">1,200+</div>
                      <div className="text-sm opacity-90">Successful Matches</div>
                    </div>
                    <div>
                      <div className="text-4xl font-bold mb-2">98%</div>
                      <div className="text-sm opacity-90">User Satisfaction</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* How It Works */}
              <div className="mb-16">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold mb-4">How RU Housing Works</h2>
                  <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Simple, secure, and designed specifically for Rutgers students
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center animate-fade-in">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="h-8 w-8 text-blue-500" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">1. Verify Your Student Status</h3>
                    <p className="text-muted-foreground">
                      Sign up with your Rutgers email address for instant verification and access to our student-only community
                    </p>
                  </div>

                  <div className="text-center animate-fade-in">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <MapPin className="h-8 w-8 text-green-500" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">2. Explore Housing Options</h3>
                    <p className="text-muted-foreground">
                      Browse verified listings, search by campus location, and use our interactive map to find your perfect home
                    </p>
                  </div>

                  <div className="text-center animate-fade-in">
                    <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Users className="h-8 w-8 text-purple-500" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">3. Connect Safely</h3>
                    <p className="text-muted-foreground">
                      Message verified students, meet potential roommates, and follow our safety guidelines for secure interactions
                    </p>
                  </div>
                </div>
              </div>

              {/* Call to Action */}
              <Card className="text-center animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-2xl">Ready to Find Your Perfect Housing?</CardTitle>
                  <CardDescription className="text-lg">
                    Join thousands of Rutgers students who have found their ideal living situations through RU Housing
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg" onClick={() => navigate('/auth?tab=signup')} className="text-lg px-8">
                      Get Started Today
                    </Button>
                    <Button variant="outline" size="lg" onClick={() => navigate('/map')} className="text-lg px-8">
                      Browse Listings
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">
                    Questions? <Button variant="link" onClick={() => navigate('/help')} className="p-0 h-auto">Visit our Help Center</Button> or contact our support team
                  </p>
                </CardContent>
              </Card>

              {/* Contact Info */}
              <div className="mt-12 text-center">
                <div className="flex items-center justify-center gap-6">
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    contact@ruhousing.com
                  </Button>
                  <Separator orientation="vertical" className="h-6" />
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <Github className="h-4 w-4" />
                    Open Source
                  </Button>
                  <Separator orientation="vertical" className="h-6" />
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    Student Built
                  </Button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default About;