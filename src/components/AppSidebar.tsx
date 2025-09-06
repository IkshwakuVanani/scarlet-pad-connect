import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Search, Filter, MapPin, DollarSign, Calendar, Bus } from "lucide-react";
import { useState } from "react";

interface AppSidebarProps {
  onCampusChange?: (campus: string) => void;
}

export function AppSidebar({ onCampusChange }: AppSidebarProps) {
  const [priceRange, setPriceRange] = useState([400, 1200]);
  
  const campuses = [
    "College Avenue",
    "Busch Campus", 
    "Livingston Campus",
    "Cook/Douglass Campus"
  ];

  const leaseTerms = [
    "Summer Sublet",
    "Fall Semester", 
    "Spring Semester",
    "Full Academic Year",
    "12-Month Lease"
  ];

  const busLines = [
    "LX Line",
    "EE Line", 
    "REX Line",
    "H Line",
    "F Line",
    "A Line"
  ];

  return (
    <div className="w-80 border-r bg-background shadow-xl h-screen sticky top-0 flex flex-col">
      <div className="p-6 border-b bg-background">
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold">Find Your Perfect Place</h2>
          <p className="text-sm text-muted-foreground">Filter by location, price, and preferences</p>
        </div>
      </div>
      
      <div className="p-6 overflow-y-auto flex-1">
        <div className="space-y-6">
          {/* Main Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="Search by address, neighborhood..."
              className="pl-10 h-12 text-base"
            />
          </div>

          {/* Campus Filter */}
          <div className="space-y-3">
            <Label className="flex items-center text-sm font-semibold">
              <MapPin className="h-4 w-4 mr-1 text-primary" />
              Campus Location
            </Label>
            <Select onValueChange={onCampusChange}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select campus" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-campuses">All Campuses</SelectItem>
                {campuses.map((campus) => (
                  <SelectItem key={campus} value={campus}>
                    {campus}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Lease Term Filter */}
          <div className="space-y-3">
            <Label className="flex items-center text-sm font-semibold">
              <Calendar className="h-4 w-4 mr-1 text-primary" />
              Lease Term
            </Label>
            <Select>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select term" />
              </SelectTrigger>
              <SelectContent>
                {leaseTerms.map((term) => (
                  <SelectItem key={term} value={term.toLowerCase()}>
                    {term}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Bus Line Filter */}
          <div className="space-y-3">
            <Label className="flex items-center text-sm font-semibold">
              <Bus className="h-4 w-4 mr-1 text-primary" />
              Bus Line Access
            </Label>
            <Select>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select bus line" />
              </SelectTrigger>
              <SelectContent>
                {busLines.map((line) => (
                  <SelectItem key={line} value={line.toLowerCase()}>
                    {line}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Property Type */}
          <div className="space-y-3">
            <Label className="flex items-center text-sm font-semibold">
              <Filter className="h-4 w-4 mr-1 text-primary" />
              Property Type
            </Label>
            <Select>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apartment">Entire Apartment</SelectItem>
                <SelectItem value="room">Single Room</SelectItem>
                <SelectItem value="sublet">Sublet</SelectItem>
                <SelectItem value="roommate">Need Roommate</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Price Range */}
          <div className="space-y-4">
            <Label className="flex items-center text-sm font-semibold">
              <DollarSign className="h-4 w-4 mr-1 text-primary" />
              Price Range
            </Label>
            <div className="space-y-3">
              <Slider
                value={priceRange}
                onValueChange={setPriceRange}
                max={2000}
                min={200}
                step={50}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>${priceRange[0]}/month</span>
                <span>${priceRange[1]}/month</span>
              </div>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Quick Filters</Label>
            <div className="flex flex-wrap gap-2">
              {[
                "Pet Friendly", 
                "Parking Included", 
                "Utilities Included", 
                "Furnished", 
                "Laundry In-Unit",
                "Near Campus",
                "Available Now"
              ].map((filter) => (
                <Badge 
                  key={filter}
                  variant="secondary" 
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors text-xs"
                >
                  {filter}
                </Badge>
              ))}
            </div>
          </div>

          {/* Search Button */}
          <Button size="lg" className="w-full bg-gradient-hero hover:shadow-hero transition-all duration-300">
            <Search className="h-5 w-5 mr-2" />
            Search Properties
          </Button>
        </div>
      </div>
    </div>
  );
}