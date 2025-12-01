import HotelCard from "@/components/HotelCard";
import { useGetAllHotelsQuery, useGetAllLocationsQuery } from "@/lib/api";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import LocationTab from "./LocationTab";
import { Skeleton } from "./ui/skeleton";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { X, Sparkles, ArrowLeft, Hotel } from "lucide-react";

function HotelListings({ searchMode, searchResults, searchQuery, onClearSearch, isSearching }) {
  const [selectedLocation, setSelectedLocation] = useState(0);

  const {
    data: hotels,
    isLoading: isHotelsLoading,
    isError: isHotelsError,
    error: hotelsError,
  } = useGetAllHotelsQuery();

  const {
    data: locations,
    isLoading: isLocationsLoading,
    isError: isLocationsError,
    error: locationsError,
  } = useGetAllLocationsQuery();

  const allLocations = locations
    ? [{ _id: 0, name: "All" }, ...locations]
    : [{ _id: 0, name: "All" }];

  const handleLocationSelect = (selectedLocation) => {
    setSelectedLocation(selectedLocation._id);
  };

  const selectedLocationName = allLocations.find(
    (el) => selectedLocation === el._id
  )?.name || "All";

  const filteredHotels =
    selectedLocation === 0
      ? hotels
      : hotels?.filter((hotel) => {
          return hotel.location.includes(selectedLocationName);
        });

  const isLoading = isHotelsLoading || isLocationsLoading;
  const isError = isHotelsError || isLocationsError;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && searchMode) {
        onClearSearch?.();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [searchMode, onClearSearch]);

  if (isLoading) {
    return (
      <section className="px-8 py-8 lg:py-8">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Top trending hotels worldwide
          </h2>
          <p className="text-lg text-muted-foreground">
            Discover the most trending hotels worldwide for an unforgettable
            experience.
          </p>
        </div>

        <Skeleton className="h-10 w-full max-w-xl mb-6" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-48 w-full rounded-xl" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="px-8 py-8 lg:py-8">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Top trending hotels worldwide
          </h2>
          <p className="text-lg text-muted-foreground">
            Discover the most trending hotels worldwide for an unforgettable
            experience.
          </p>
        </div>
        <p className="text-red-500">Error loading data</p>
      </section>
    );
  }

  if (searchMode) {
    return (
      <section className="px-8 py-8 lg:py-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className="h-6 w-6 text-primary" />
                <h2 className="text-2xl md:text-3xl font-bold">
                  AI Search Results
                </h2>
              </div>
              <p className="text-muted-foreground">
                Showing results for: "<span className="font-medium text-foreground">{searchQuery}</span>"
              </p>
            </div>
            <Button 
              onClick={onClearSearch}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Show All Hotels
              <Badge variant="secondary" className="ml-1">ESC</Badge>
            </Button>
          </div>
        </div>

        {isSearching ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-3 animate-pulse">
                <Skeleton className="h-48 w-full rounded-xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : searchResults && searchResults.length > 0 ? (
          <>
            <p className="text-sm text-muted-foreground mb-6">
              Found {searchResults.length} hotel{searchResults.length !== 1 ? "s" : ""} matching your criteria
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {searchResults.map((hotel) => (
                <HotelCard key={hotel._id} hotel={hotel} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16 bg-muted/30 rounded-2xl">
            <Hotel className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No matches found</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              We couldn't find any hotels matching your search. Try different keywords or browse all hotels.
            </p>
            <Button onClick={onClearSearch}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Browse All Hotels
            </Button>
          </div>
        )}
      </section>
    );
  }

  return (
    <section className="px-8 py-8 lg:py-8">
      <div className="mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Top trending hotels worldwide
        </h2>
        <p className="text-lg text-muted-foreground">
          Discover the most trending hotels worldwide for an unforgettable
          experience.
        </p>
      </div>

      <div className="flex items-center flex-wrap gap-3 mb-6">
        {allLocations.map((location) => {
          return (
            <LocationTab
              onClick={handleLocationSelect}
              location={location}
              selectedLocation={selectedLocation}
              key={location._id}
            />
          );
        })}
      </div>

      {filteredHotels && filteredHotels.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredHotels.map((hotel) => {
            return <HotelCard key={hotel._id} hotel={hotel} />;
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-muted/30 rounded-xl">
          <Hotel className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">
            No hotels found for this location.
          </p>
          <Button 
            variant="link" 
            onClick={() => setSelectedLocation(0)}
            className="mt-2"
          >
            View all hotels
          </Button>
        </div>
      )}
    </section>
  );
}

export default HotelListings;
