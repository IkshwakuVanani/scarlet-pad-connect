import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Search, Filter, MapPin, DollarSign, Calendar, Bus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";

interface AppSidebarProps {
  onFiltersChange?: (filters: any) => void;
  onCampusChange?: (campus: string) => void;
}

export function AppSidebar({ onFiltersChange, onCampusChange }: AppSidebarProps) {
  const [searchText, setSearchText] = useState('');
  const [selectedCampus, setSelectedCampus] = useState('');
  const [leaseTerm, setLeaseTerm] = useState('');
  const [busLine, setBusLine] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [priceRange, setPriceRange] = useState([400, 1200]);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const navigate = useNavigate();

  // Emit filters whenever any filter changes
  const emitFilters = () => {
    const filters = {
      search: searchText,
      campus: selectedCampus === 'all-campuses' ? '' : selectedCampus,
      leaseTerm: leaseTerm,
      busLine: busLine,
      propertyType: propertyType,
      priceRange: priceRange,
      features: selectedFilters,
    };
    onFiltersChange?.(filters);
    // Also call legacy onCampusChange for backward compatibility
    if (onCampusChange && selectedCampus) {
      onCampusChange(selectedCampus);
    }
  };

  // Call emitFilters whenever any filter changes
  React.useEffect(() => {
    emitFilters();
  }, [searchText, selectedCampus, leaseTerm, busLine, propertyType, priceRange, selectedFilters]);

  const handleQuickFilterToggle = (filter: string) => {
    setSelectedFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };
  
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
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          {/* Campus Filter */}
          <div className="space-y-3">
            <Label className="flex items-center text-sm font-semibold">
              <MapPin className="h-4 w-4 mr-1 text-primary" />
              Campus Location
            </Label>
            <Select value={selectedCampus} onValueChange={setSelectedCampus}>
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
            <Select value={leaseTerm} onValueChange={setLeaseTerm}>
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
            <Select value={busLine} onValueChange={setBusLine}>
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
            <Select value={propertyType} onValueChange={setPropertyType}>
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
                max={4000}
                min={200}
                step={50}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>${priceRange[0]}/month</span>
                <span>${priceRange[1] >= 4000 ? '4000+' : priceRange[1]}/month</span>
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
                  variant={selectedFilters.includes(filter) ? "default" : "secondary"}
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors text-xs"
                  onClick={() => handleQuickFilterToggle(filter)}
                >
                  {filter}
                </Badge>
              ))}
            </div>
          </div>

          {/* Search Button */}
          <Button 
            size="lg" 
            className="w-full bg-gradient-hero hover:shadow-hero transition-all duration-300"
            onClick={() => {
              emitFilters();
              navigate('/');
            }}
          >
            <Search className="h-5 w-5 mr-2" />
            Search Properties
          </Button>
        </div>
      </div>
    </div>
  );
}