import { Link } from "react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAllHotelsQuery } from "@/lib/api";
import { MapPin, Star } from "lucide-react";

const HotelsPage = () => {
  const { data: hotels, isLoading, isError } = useGetAllHotelsQuery();

  if (isLoading) {
    return (
      <main className="px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Hotels</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4].map((i) => (
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
      </main>
    );
  }

  if (isError) {
    return (
      <main className="px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Hotels</h1>
        <div className="text-center py-8">
          <p className="text-destructive">Failed to load hotels. Please try again later.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Hotels</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hotels?.map((hotel) => (
          <Link to={`/hotels/${hotel._id}`} key={hotel._id}>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
              <div className="relative h-48">
                <img
                  src={hotel.image}
                  alt={hotel.name}
                  className="w-full h-full object-cover"
                />
                <Badge className="absolute top-2 right-2" variant="secondary">
                  ${hotel.price}/night
                </Badge>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-1">{hotel.name}</h3>
                <div className="flex items-center text-sm text-muted-foreground mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  {hotel.location}
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
    </main>
  );
};

export default HotelsPage;
