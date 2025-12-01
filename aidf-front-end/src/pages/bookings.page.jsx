import { Link } from "react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetUserBookingsQuery } from "@/lib/api";
import { CalendarDays, MapPin, CreditCard, Home } from "lucide-react";
import { useUser } from "@clerk/clerk-react";

const BookingsPage = () => {
  const { user, isLoaded } = useUser();
  const { data: bookings, isLoading, isError } = useGetUserBookingsQuery(undefined, {
    skip: !isLoaded || !user,
  });

  if (!isLoaded || isLoading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">My Bookings</h1>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <Skeleton className="w-32 h-24 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-64" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-bold mb-2">Sign in Required</h2>
            <p className="text-muted-foreground mb-4">
              Please sign in to view your bookings.
            </p>
            <Button asChild>
              <Link to="/sign-in">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-bold text-destructive mb-2">Error Loading Bookings</h2>
            <p className="text-muted-foreground">
              There was a problem loading your bookings. Please try again later.
            </p>
          </CardContent>
        </Card>
      </main>
    );
  }

  if (!bookings || bookings.length === 0) {
    return (
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">My Bookings</h1>
        <Card>
          <CardContent className="p-8 text-center">
            <CalendarDays className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">No Bookings Yet</h2>
            <p className="text-muted-foreground mb-4">
              You haven't made any bookings yet. Start exploring our hotels!
            </p>
            <Button asChild>
              <Link to="/hotels">
                <Home className="w-4 h-4 mr-2" />
                Browse Hotels
              </Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Bookings</h1>
      <div className="space-y-4">
        {bookings.map((booking) => {
          const hotel = booking.hotelId;
          const isPending = booking.paymentStatus === "PENDING";

          return (
            <Card key={booking._id}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  {hotel?.image && (
                    <img
                      src={hotel.image}
                      alt={hotel.name}
                      className="w-full md:w-32 h-24 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">{hotel?.name || "Unknown Hotel"}</h3>
                        <p className="text-sm text-muted-foreground flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {hotel?.location || "Unknown Location"}
                        </p>
                      </div>
                      <Badge variant={isPending ? "destructive" : "default"}>
                        {booking.paymentStatus}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm mt-3">
                      <div>
                        <p className="text-muted-foreground">Check-in</p>
                        <p className="font-medium">{new Date(booking.checkIn).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Check-out</p>
                        <p className="font-medium">{new Date(booking.checkOut).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Room</p>
                        <p className="font-medium">#{booking.roomNumber}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Price/Night</p>
                        <p className="font-medium">${hotel?.price || "N/A"}</p>
                      </div>
                    </div>

                    {isPending && (
                      <div className="mt-4">
                        <Button asChild size="sm">
                          <Link to={`/booking/payment?bookingId=${booking._id}`}>
                            <CreditCard className="w-4 h-4 mr-2" />
                            Complete Payment
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </main>
  );
};

export default BookingsPage;
