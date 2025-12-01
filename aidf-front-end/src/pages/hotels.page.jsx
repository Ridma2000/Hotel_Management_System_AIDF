import { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetAllHotelsQuery, useGetAllLocationsQuery } from "@/lib/api";
import {
  MapPin,
  Star,
  Grid3X3,
  List,
  SlidersHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
} from "lucide-react";

const ITEMS_PER_PAGE = 6;

const HotelsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  
  const initialLocations = searchParams.get("locations")?.split(",").filter(Boolean) || [];
  const initialSort = searchParams.get("sort") || "featured";
  const initialMinPrice = parseInt(searchParams.get("minPrice")) || 0;
  const initialMaxPrice = parseInt(searchParams.get("maxPrice")) || 1000;
  const initialPage = parseInt(searchParams.get("page")) || 1;

  const [selectedLocations, setSelectedLocations] = useState(initialLocations);
  const [sortBy, setSortBy] = useState(initialSort);
  const [priceRange, setPriceRange] = useState([initialMinPrice, initialMaxPrice]);
  const [currentPage, setCurrentPage] = useState(initialPage);

  const { data: hotels, isLoading: isHotelsLoading, isError: isHotelsError } = useGetAllHotelsQuery();
  const { data: locations, isLoading: isLocationsLoading } = useGetAllLocationsQuery();

  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedLocations.length > 0) params.set("locations", selectedLocations.join(","));
    if (sortBy !== "featured") params.set("sort", sortBy);
    if (priceRange[0] > 0) params.set("minPrice", priceRange[0].toString());
    if (priceRange[1] < 1000) params.set("maxPrice", priceRange[1].toString());
    if (currentPage > 1) params.set("page", currentPage.toString());
    setSearchParams(params, { replace: true });
  }, [selectedLocations, sortBy, priceRange, currentPage, setSearchParams]);

  const priceStats = useMemo(() => {
    if (!hotels || hotels.length === 0) return { min: 0, max: 1000 };
    const prices = hotels.map((h) => h.price);
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }, [hotels]);

  const filteredAndSortedHotels = useMemo(() => {
    if (!hotels) return [];
    
    let result = [...hotels];

    if (selectedLocations.length > 0) {
      result = result.filter((hotel) => {
        const hotelLocation = hotel.location?.toLowerCase() || "";
        return selectedLocations.some((loc) => 
          hotelLocation.includes(loc.toLowerCase())
        );
      });
    }

    result = result.filter(
      (hotel) => hotel.price >= priceRange[0] && hotel.price <= priceRange[1]
    );

    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    return result;
  }, [hotels, selectedLocations, priceRange, sortBy]);

  const totalPages = Math.ceil(filteredAndSortedHotels.length / ITEMS_PER_PAGE);
  const paginatedHotels = filteredAndSortedHotels.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const toggleLocation = (locationName) => {
    setSelectedLocations((prev) =>
      prev.includes(locationName)
        ? prev.filter((l) => l !== locationName)
        : [...prev, locationName]
    );
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSelectedLocations([]);
    setSortBy("featured");
    setPriceRange([priceStats.min, priceStats.max]);
    setCurrentPage(1);
  };

  const hasActiveFilters = selectedLocations.length > 0 || sortBy !== "featured" || priceRange[0] > priceStats.min || priceRange[1] < priceStats.max;

  if (isHotelsLoading || isLocationsLoading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 flex-shrink-0">
            <Skeleton className="h-96 rounded-xl" />
          </aside>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-10 w-48" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i}>
                  <Skeleton className="h-48 w-full rounded-t-lg" />
                  <CardContent className="p-4 space-y-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (isHotelsError) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-destructive mb-2">Failed to Load Hotels</h2>
          <p className="text-muted-foreground">Please try again later.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Discover Hotels</h1>
        <p className="text-muted-foreground">
          Find your perfect stay from our curated collection of {hotels?.length || 0} hotels
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="lg:hidden flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg mb-4"
        >
          <Filter className="h-4 w-4" />
          {showFilters ? "Hide Filters" : "Show Filters"}
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-2">
              {selectedLocations.length + (sortBy !== "featured" ? 1 : 0)}
            </Badge>
          )}
        </button>

        <aside className={`lg:w-64 flex-shrink-0 ${showFilters ? "block" : "hidden lg:block"}`}>
          <Card className="sticky top-4">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                </h3>
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 text-xs">
                    Clear All
                  </Button>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium mb-3">Location</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {locations?.map((location) => (
                      <label
                        key={location._id}
                        className="flex items-center gap-2 cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          checked={selectedLocations.includes(location.name)}
                          onChange={() => toggleLocation(location.name)}
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <span className="text-sm group-hover:text-primary transition-colors">
                          {location.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-3">Price Range</h4>
                  <Slider
                    value={priceRange}
                    onValueChange={(value) => {
                      setPriceRange(value);
                      setCurrentPage(1);
                    }}
                    min={priceStats.min}
                    max={priceStats.max}
                    step={10}
                    className="mb-3"
                  />
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-3">Sort By</h4>
                  <Select value={sortBy} onValueChange={(value) => { setSortBy(value); setCurrentPage(1); }}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Sort by..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Featured</SelectItem>
                      <SelectItem value="price-asc">Price: Low to High</SelectItem>
                      <SelectItem value="price-desc">Price: High to Low</SelectItem>
                      <SelectItem value="rating">Rating: High to Low</SelectItem>
                      <SelectItem value="name">Name: A to Z</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {selectedLocations.length > 0 && (
                <div className="mt-6 pt-4 border-t">
                  <h4 className="text-sm font-medium mb-2">Selected Locations</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedLocations.map((loc) => (
                      <Badge key={loc} variant="secondary" className="pr-1">
                        {loc}
                        <button
                          onClick={() => toggleLocation(loc)}
                          className="ml-1 hover:bg-muted rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </aside>

        <div className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <p className="text-muted-foreground">
              Showing <span className="font-medium text-foreground">{paginatedHotels.length}</span> of{" "}
              <span className="font-medium text-foreground">{filteredAndSortedHotels.length}</span> hotels
            </p>
            <div className="flex items-center gap-2">
              <div className="flex rounded-lg border overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 transition-colors ${
                    viewMode === "grid" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                  }`}
                  title="Grid view"
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 transition-colors ${
                    viewMode === "list" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                  }`}
                  title="List view"
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {paginatedHotels.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Hotels Found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters to find more options.
                </p>
                <Button onClick={clearFilters}>Clear All Filters</Button>
              </CardContent>
            </Card>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {paginatedHotels.map((hotel) => (
                <Link to={`/hotels/${hotel._id}`} key={hotel._id}>
                  <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group h-full">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={hotel.image}
                        alt={hotel.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Badge className="absolute top-3 right-3 bg-white/90 text-black hover:bg-white">
                        ${hotel.price}/night
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                        {hotel.name}
                      </h3>
                      <div className="flex items-center text-sm text-muted-foreground mb-2">
                        <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                        <span className="truncate">{hotel.location}</span>
                      </div>
                      <div className="flex items-center gap-1 mb-2">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{hotel.rating || "N/A"}</span>
                        <span className="text-muted-foreground text-sm">
                          ({hotel.reviews?.length || 0} reviews)
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {hotel.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {paginatedHotels.map((hotel) => (
                <Link to={`/hotels/${hotel._id}`} key={hotel._id}>
                  <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
                    <div className="flex flex-col sm:flex-row">
                      <div className="relative sm:w-64 h-48 sm:h-auto flex-shrink-0 overflow-hidden">
                        <img
                          src={hotel.image}
                          alt={hotel.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <CardContent className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <h3 className="font-semibold text-xl group-hover:text-primary transition-colors">
                              {hotel.name}
                            </h3>
                            <Badge className="bg-primary flex-shrink-0">
                              ${hotel.price}/night
                            </Badge>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground mb-3">
                            <MapPin className="h-4 w-4 mr-1" />
                            {hotel.location}
                          </div>
                          <p className="text-muted-foreground line-clamp-2 mb-3">
                            {hotel.description}
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{hotel.rating || "N/A"}</span>
                            <span className="text-muted-foreground text-sm">
                              ({hotel.reviews?.length || 0} reviews)
                            </span>
                          </div>
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="icon"
                    onClick={() => setCurrentPage(page)}
                    className="w-10 h-10"
                  >
                    {page}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default HotelsPage;
