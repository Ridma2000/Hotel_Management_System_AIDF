import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, XCircle, Home, CalendarDays } from "lucide-react";

const BookingCompletePage = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState("loading");
  const [bookingData, setBookingData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      setError("No session ID provided");
      return;
    }

    if (sessionId === "already_paid") {
      setStatus("success");
      return;
    }

    const fetchStatus = async () => {
      try {
        const response = await fetch(`/api/payments/session-status?session_id=${sessionId}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch session status");
        }

        const data = await response.json();
        setBookingData(data);

        if (data.paymentStatus === "paid" || data.status === "complete") {
          setStatus("success");
        } else if (data.status === "open") {
          setStatus("pending");
        } else {
          setStatus("error");
          setError("Payment was not completed");
        }
      } catch (err) {
        console.error("Error fetching session status:", err);
        setStatus("error");
        setError(err.message);
      }
    };

    fetchStatus();
  }, [sessionId]);

  if (status === "loading") {
    return (
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardContent className="p-8 text-center space-y-4">
            <Skeleton className="h-16 w-16 rounded-full mx-auto" />
            <Skeleton className="h-8 w-48 mx-auto" />
            <Skeleton className="h-4 w-64 mx-auto" />
          </CardContent>
        </Card>
      </main>
    );
  }

  if (status === "error") {
    return (
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardContent className="p-8 text-center">
            <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Payment Failed</h1>
            <p className="text-muted-foreground mb-6">
              {error || "There was an issue processing your payment."}
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild variant="outline">
                <Link to="/">
                  <Home className="w-4 h-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  const booking = bookingData?.booking;
  const hotel = booking?.hotelId;

  return (
    <main className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardContent className="p-8 text-center">
          <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Booking Confirmed!</h1>
          <p className="text-muted-foreground mb-6">
            Thank you for your booking. A confirmation email will be sent to{" "}
            {bookingData?.customerEmail || "your email"}.
          </p>

          {booking && hotel && (
            <div className="bg-muted p-6 rounded-lg text-left mb-6">
              <h3 className="font-semibold text-lg mb-3">{hotel.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{hotel.location}</p>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Check-in</p>
                  <p className="font-medium">{new Date(booking.checkIn).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Check-out</p>
                  <p className="font-medium">{new Date(booking.checkOut).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Room Number</p>
                  <p className="font-medium">#{booking.roomNumber}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <p className="font-medium text-green-600">Confirmed</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-center gap-4">
            <Button asChild variant="outline">
              <Link to="/">
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
            <Button asChild>
              <Link to="/bookings">
                <CalendarDays className="w-4 h-4 mr-2" />
                View My Bookings
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default BookingCompletePage;
