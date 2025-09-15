import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Upload, X, Plus, ChevronDown, Check, MapPin, Home, Bus, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const createListingSchema = z.object({
  title: z.string().min(1, "Title is required"),
  price: z.number().min(1, "Price must be greater than 0"),
  location: z.string().min(1, "Location is required"), 
  campus: z.string().optional(),
  bedrooms: z.number().min(1).max(10),
  bathrooms: z.number().min(0.5).max(10),
  description: z.string().optional(),
  leaseTerm: z.string().optional(),
  availableFrom: z.string().optional(),
});

type CreateListingForm = z.infer<typeof createListingSchema>;

const COMMON_FEATURES = [
  "WiFi", "Parking", "Laundry", "Kitchen", "Air Conditioning", "Heating",
  "Furnished", "Pet Friendly", "Gym", "Pool", "Balcony", "Dishwasher"
];

const CAMPUS_OPTIONS = [
  "College Avenue", "Busch", "Livingston", "Cook/Douglass", "Off-Campus"
];

const BUS_LINES = [
  "Route 1", "Route 18", "A", "B", "C", "EE", "F", "H", "LX", "REXB", "REXL"
];

const LEASE_TERMS = [
  "1 month", "3 months", "6 months", "9 months", "12 months", 
  "Academic year", "Summer only", "Flexible"
];

const BEDROOM_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const BATHROOM_OPTIONS = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 6, 7, 8, 9, 10];

export const CreateListingForm = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [selectedBusLines, setSelectedBusLines] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCampus, setSelectedCampus] = useState<string>("");
  const [selectedBedrooms, setSelectedBedrooms] = useState<number>(1);
  const [selectedBathrooms, setSelectedBathrooms] = useState<number>(1);
  const [selectedLeaseTerm, setSelectedLeaseTerm] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<CreateListingForm>({
    resolver: zodResolver(createListingSchema),
    defaultValues: {
      bedrooms: 1,
      bathrooms: 1,
    }
  });

  const handleImageSelect = (files: FileList | null) => {
    if (!files) return;
    
    const newImages = Array.from(files);
    if (selectedImages.length + newImages.length > 5) {
      toast({
        title: "Too many images",
        description: "You can upload a maximum of 5 images",
        variant: "destructive"
      });
      return;
    }
    
    setSelectedImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const toggleFeature = (feature: string) => {
    setSelectedFeatures(prev => 
      prev.includes(feature) 
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
  };

  const toggleBusLine = (busLine: string) => {
    setSelectedBusLines(prev => 
      prev.includes(busLine) 
        ? prev.filter(b => b !== busLine)
        : [...prev, busLine]
    );
  };

  const uploadImages = async (listingId: string): Promise<string[]> => {
    const imageUrls: string[] = [];
    
    for (let i = 0; i < selectedImages.length; i++) {
      const file = selectedImages[i];
      const fileExt = file.name.split('.').pop();
      const fileName = `${listingId}/${Date.now()}_${i}.${fileExt}`;
      
      const { error } = await supabase.storage
        .from('listing-images')
        .upload(fileName, file);
        
      if (error) {
        console.error('Error uploading image:', error);
        throw error;
      }
      
      const { data } = supabase.storage
        .from('listing-images')
        .getPublicUrl(fileName);
        
      imageUrls.push(data.publicUrl);
    }
    
    return imageUrls;
  };

  const onSubmit = async (data: CreateListingForm) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create a listing",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // First create the listing
      const { data: listing, error: listingError } = await supabase
        .from('listings')
        .insert({
          user_id: user.id,
          title: data.title,
          price: data.price,
          location: data.location,
          campus: selectedCampus || data.campus,
          bedrooms: selectedBedrooms,
          bathrooms: selectedBathrooms,
          description: data.description,
          features: selectedFeatures,
          lease_term: selectedLeaseTerm || data.leaseTerm,
          available_from: data.availableFrom ? new Date(data.availableFrom).toISOString().split('T')[0] : null,
          bus_lines: selectedBusLines,
        })
        .select()
        .single();

      if (listingError) throw listingError;

      // Upload images if any
      if (selectedImages.length > 0) {
        await uploadImages(listing.id);
      }

      toast({
        title: "Listing created successfully!",
        description: "Your property listing has been posted.",
      });

      // Reset form
      reset();
      setSelectedFeatures([]);
      setSelectedBusLines([]);
      setSelectedImages([]);
      setSelectedCampus("");
      setSelectedBedrooms(1);
      setSelectedBathrooms(1);
      setSelectedLeaseTerm("");

    } catch (error) {
      console.error('Error creating listing:', error);
      toast({
        title: "Error creating listing",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            Please sign in to create a listing.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Listing</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Property Title</Label>
              <Input
                id="title"
                {...register("title")}
                placeholder="e.g., Spacious 2BR near campus"
              />
              {errors.title && (
                <p className="text-sm text-destructive mt-1">{errors.title.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="price">Monthly Rent ($)</Label>
              <Input
                id="price"
                type="number"
                {...register("price", { valueAsNumber: true })}
                placeholder="1200"
              />
              {errors.price && (
                <p className="text-sm text-destructive mt-1">{errors.price.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                {...register("location")}
                placeholder="123 Main St, New Brunswick, NJ"
              />
              {errors.location && (
                <p className="text-sm text-destructive mt-1">{errors.location.message}</p>
              )}
            </div>

            <div>
              <Label>Campus</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full justify-between font-normal"
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      {selectedCampus || "Select campus"}
                    </div>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full min-w-[200px]">
                  <DropdownMenuLabel>Choose Campus</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {CAMPUS_OPTIONS.map(campus => (
                    <DropdownMenuItem 
                      key={campus}
                      onClick={() => {
                        setSelectedCampus(campus);
                        setValue("campus", campus);
                      }}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center justify-between w-full">
                        {campus}
                        {selectedCampus === campus && <Check className="h-4 w-4" />}
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Bedrooms</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full justify-between font-normal"
                  >
                    <div className="flex items-center gap-2">
                      <Home className="h-4 w-4 text-muted-foreground" />
                      {selectedBedrooms} {selectedBedrooms === 1 ? 'Bedroom' : 'Bedrooms'}
                    </div>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  <DropdownMenuLabel>Number of Bedrooms</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {BEDROOM_OPTIONS.map(bed => (
                    <DropdownMenuItem 
                      key={bed}
                      onClick={() => {
                        setSelectedBedrooms(bed);
                        setValue("bedrooms", bed);
                      }}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center justify-between w-full">
                        {bed} {bed === 1 ? 'Bedroom' : 'Bedrooms'}
                        {selectedBedrooms === bed && <Check className="h-4 w-4" />}
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              {errors.bedrooms && (
                <p className="text-sm text-destructive mt-1">{errors.bedrooms.message}</p>
              )}
            </div>

            <div>
              <Label>Bathrooms</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full justify-between font-normal"
                  >
                    <div className="flex items-center gap-2">
                      <Home className="h-4 w-4 text-muted-foreground" />
                      {selectedBathrooms} {selectedBathrooms === 1 ? 'Bathroom' : 'Bathrooms'}
                    </div>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  <DropdownMenuLabel>Number of Bathrooms</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {BATHROOM_OPTIONS.map(bath => (
                    <DropdownMenuItem 
                      key={bath}
                      onClick={() => {
                        setSelectedBathrooms(bath);
                        setValue("bathrooms", bath);
                      }}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center justify-between w-full">
                        {bath} {bath === 1 ? 'Bathroom' : 'Bathrooms'}
                        {selectedBathrooms === bath && <Check className="h-4 w-4" />}
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              {errors.bathrooms && (
                <p className="text-sm text-destructive mt-1">{errors.bathrooms.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Describe your property..."
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Lease Term</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full justify-between font-normal"
                  >
                    <div className="flex items-center gap-2">
                      <Home className="h-4 w-4 text-muted-foreground" />
                      {selectedLeaseTerm || "Select lease term"}
                    </div>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  <DropdownMenuLabel>Lease Duration</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {LEASE_TERMS.map(term => (
                    <DropdownMenuItem 
                      key={term}
                      onClick={() => {
                        setSelectedLeaseTerm(term);
                        setValue("leaseTerm", term);
                      }}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center justify-between w-full">
                        {term}
                        {selectedLeaseTerm === term && <Check className="h-4 w-4" />}
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div>
              <Label htmlFor="availableFrom">Available From</Label>
              <Input
                id="availableFrom"
                type="date"
                {...register("availableFrom")}
              />
            </div>
          </div>

          {/* Features */}
          <div>
            <Label>Features & Amenities</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full justify-between font-normal mt-2"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-muted-foreground" />
                    {selectedFeatures.length > 0 
                      ? `${selectedFeatures.length} features selected`
                      : "Select features & amenities"
                    }
                  </div>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full min-w-[300px]">
                <DropdownMenuLabel>Available Features</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {COMMON_FEATURES.map(feature => (
                  <DropdownMenuCheckboxItem 
                    key={feature}
                    checked={selectedFeatures.includes(feature)}
                    onCheckedChange={() => toggleFeature(feature)}
                    className="cursor-pointer"
                  >
                    {feature}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            {selectedFeatures.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedFeatures.map(feature => (
                  <Badge
                    key={feature}
                    variant="default"
                    className="cursor-pointer"
                    onClick={() => toggleFeature(feature)}
                  >
                    {feature}
                    <X className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Bus Lines */}
          <div>
            <Label>Nearby Bus Lines</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full justify-between font-normal mt-2"
                >
                  <div className="flex items-center gap-2">
                    <Bus className="h-4 w-4 text-muted-foreground" />
                    {selectedBusLines.length > 0 
                      ? `${selectedBusLines.length} bus lines selected`
                      : "Select nearby bus lines"
                    }
                  </div>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full min-w-[250px]">
                <DropdownMenuLabel>Bus Routes</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {BUS_LINES.map(busLine => (
                  <DropdownMenuCheckboxItem 
                    key={busLine}
                    checked={selectedBusLines.includes(busLine)}
                    onCheckedChange={() => toggleBusLine(busLine)}
                    className="cursor-pointer"
                  >
                    Route {busLine}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            {selectedBusLines.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedBusLines.map(busLine => (
                  <Badge
                    key={busLine}
                    variant="default"
                    className="cursor-pointer"
                    onClick={() => toggleBusLine(busLine)}
                  >
                    Route {busLine}
                    <X className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <Label>Images (Max 5)</Label>
            <div className="mt-2">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleImageSelect(e.target.files)}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="flex items-center justify-center w-full h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:bg-muted/50"
              >
                <div className="text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Click to upload images
                  </p>
                </div>
              </label>
            </div>

            {selectedImages.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {selectedImages.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Creating Listing..." : "Create Listing"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};