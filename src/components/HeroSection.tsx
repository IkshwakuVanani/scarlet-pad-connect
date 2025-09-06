import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Shield, Users, MapPin, CheckCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-secondary/30 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-hero opacity-5"></div>
      <div className="absolute top-20 right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-40 h-40 bg-success/10 rounded-full blur-3xl"></div>
      
      <div className="container relative z-10 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Trust Badge */}
          <Badge variant="secondary" className="inline-flex items-center space-x-2 px-4 py-2 text-sm">
            <Shield className="h-4 w-4 text-success" />
            <span>Verified Rutgers Students Only</span>
            <CheckCircle className="h-4 w-4 text-success" />
          </Badge>

          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Find Your Perfect
              <span className="block text-transparent bg-clip-text bg-gradient-hero">
                Off-Campus Home
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {user 
                ? "Welcome back! Browse verified listings from fellow Rutgers students."
                : "The trusted marketplace for Rutgers students to find apartments, sublets, and roommates. Verified listings, secure connections, no scams."
              }
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {user ? (
              <>
                <Button size="lg" className="bg-gradient-hero hover:shadow-hero transition-all duration-300 transform hover:scale-105">
                  <Search className="h-5 w-5 mr-2" />
                  Browse Listings
                </Button>
                <Button size="lg" variant="outline" className="hover:bg-muted/50 transition-colors">
                  <Users className="h-5 w-5 mr-2" />
                  Find Roommates
                </Button>
              </>
            ) : (
              <>
                <Button 
                  size="lg" 
                  className="bg-gradient-hero hover:shadow-hero transition-all duration-300 transform hover:scale-105"
                  onClick={() => navigate('/auth?tab=signup')}
                >
                  <Shield className="h-5 w-5 mr-2" />
                  Join With .edu Email
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="hover:bg-muted/50 transition-colors"
                  onClick={() => navigate('/auth')}
                >
                  Sign In
                </Button>
              </>
            )}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <Card className="p-6 bg-gradient-card shadow-card border-0 hover:shadow-hero transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-hero rounded-lg flex items-center justify-center">
                  <Shield className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <div className="text-2xl font-bold">100%</div>
                  <div className="text-sm text-muted-foreground">Verified Students</div>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-card shadow-card border-0 hover:shadow-hero transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-trust rounded-lg flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-success-foreground" />
                </div>
                <div>
                  <div className="text-2xl font-bold">500+</div>
                  <div className="text-sm text-muted-foreground">Active Listings</div>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-card shadow-card border-0 hover:shadow-hero transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-hero rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <div className="text-2xl font-bold">2K+</div>
                  <div className="text-sm text-muted-foreground">Students Helped</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;