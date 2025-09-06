import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ListingCard from "./ListingCard";
import { mockListings } from "@/data/mockListings";
import { ArrowRight, Star } from "lucide-react";

const FeaturedListings = () => {
  const featuredListings = mockListings.slice(0, 6);

  return (
    <section className="py-16 bg-background">
      <div className="container">
        <div className="text-center space-y-4 mb-12">
          <Badge variant="secondary" className="inline-flex items-center space-x-2">
            <Star className="h-4 w-4 text-primary" />
            <span>Featured Properties</span>
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold">
            Popular Listings This Week
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Hand-picked properties from verified Rutgers students. Find your perfect home today.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>

        <div className="text-center">
          <Button variant="hero" size="lg" className="group">
            View All Listings
            <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedListings;