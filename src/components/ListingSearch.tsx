import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Search, Filter, X } from "lucide-react";

interface SearchFilters {
  search: string;
  priceRange: [number, number];
  campus: string;
  bedrooms: string;
  bathrooms: string;
  features: string[];
  busLines: string[];
}

interface ListingSearchProps {
  onFiltersChange: (filters: SearchFilters) => void;
  onClear: () => void;
}

const CAMPUS_OPTIONS = [
  "College Avenue",
  "Busch",
  "Livingston", 
  "Cook/Douglass"
];

const COMMON_FEATURES = [
  "Air Conditioning",
  "Parking",
  "Laundry",
  "Furnished",
  "Pet Friendly",
  "Utilities Included",
  "Gym Access",
  "Pool"
];

const BUS_LINES = [
  "Route 1",
  "Route 2", 
  "Route 3",
  "LX",
  "A",
  "B",
  "C",
  "EE",
  "F",
  "H"
];

const ListingSearch = ({ onFiltersChange, onClear }: ListingSearchProps) => {
  const [filters, setFilters] = useState<SearchFilters>({
    search: "",
    priceRange: [500, 3000],
    campus: "",
    bedrooms: "",
    bathrooms: "",
    features: [],
    busLines: []
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const toggleFeature = (feature: string) => {
    const newFeatures = filters.features.includes(feature)
      ? filters.features.filter(f => f !== feature)
      : [...filters.features, feature];
    handleFilterChange('features', newFeatures);
  };

  const toggleBusLine = (busLine: string) => {
    const newBusLines = filters.busLines.includes(busLine)
      ? filters.busLines.filter(b => b !== busLine)
      : [...filters.busLines, busLine];
    handleFilterChange('busLines', newBusLines);
  };

  const clearFilters = () => {
    const clearedFilters = {
      search: "",
      priceRange: [500, 3000] as [number, number],
      campus: "",
      bedrooms: "",
      bathrooms: "",
      features: [],
      busLines: []
    };
    setFilters(clearedFilters);
    onClear();
  };

  const hasActiveFilters = 
    filters.search || 
    filters.campus || 
    filters.bedrooms || 
    filters.bathrooms || 
    filters.features.length > 0 || 
    filters.busLines.length > 0 ||
    filters.priceRange[0] > 500 || 
    filters.priceRange[1] < 3000;

  return (
    <Card className="mb-8">
      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Basic Search */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by location, title, or description..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={clearFilters}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Clear
              </Button>
            )}
          </div>

          {/* Advanced Filters */}
          {showAdvanced && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t">
              {/* Price Range */}
              <div className="space-y-2">
                <Label>Price Range</Label>
                <div className="px-2">
                  <Slider
                    value={filters.priceRange}
                    onValueChange={(value) => handleFilterChange('priceRange', value)}
                    max={4000}
                    min={200}
                    step={50}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>${filters.priceRange[0]}</span>
                    <span>${filters.priceRange[1] >= 4000 ? '4000+' : filters.priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Campus */}
              <div className="space-y-2">
                <Label>Campus</Label>
                <Select value={filters.campus} onValueChange={(value) => handleFilterChange('campus', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any Campus" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any Campus</SelectItem>
                    {CAMPUS_OPTIONS.map(campus => (
                      <SelectItem key={campus} value={campus}>
                        {campus}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Bedrooms */}
              <div className="space-y-2">
                <Label>Bedrooms</Label>
                <Select value={filters.bedrooms} onValueChange={(value) => handleFilterChange('bedrooms', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any</SelectItem>
                    <SelectItem value="1">1 Bedroom</SelectItem>
                    <SelectItem value="2">2 Bedrooms</SelectItem>
                    <SelectItem value="3">3 Bedrooms</SelectItem>
                    <SelectItem value="4">4+ Bedrooms</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Bathrooms */}
              <div className="space-y-2">
                <Label>Bathrooms</Label>
                <Select value={filters.bathrooms} onValueChange={(value) => handleFilterChange('bathrooms', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any</SelectItem>
                    <SelectItem value="1">1 Bathroom</SelectItem>
                    <SelectItem value="1.5">1.5 Bathrooms</SelectItem>
                    <SelectItem value="2">2 Bathrooms</SelectItem>
                    <SelectItem value="2.5">2.5+ Bathrooms</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Features */}
              <div className="space-y-2 md:col-span-2">
                <Label>Features</Label>
                <div className="flex flex-wrap gap-2">
                  {COMMON_FEATURES.map(feature => (
                    <Badge
                      key={feature}
                      variant={filters.features.includes(feature) ? "default" : "outline"}
                      className="cursor-pointer hover:bg-primary/80"
                      onClick={() => toggleFeature(feature)}
                    >
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Bus Lines */}
              <div className="space-y-2 md:col-span-2">
                <Label>Bus Lines</Label>
                <div className="flex flex-wrap gap-2">
                  {BUS_LINES.map(busLine => (
                    <Badge
                      key={busLine}
                      variant={filters.busLines.includes(busLine) ? "default" : "outline"}
                      className="cursor-pointer hover:bg-primary/80"
                      onClick={() => toggleBusLine(busLine)}
                    >
                      Route {busLine}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ListingSearch;