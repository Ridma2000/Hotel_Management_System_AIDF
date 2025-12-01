import { useSearchParams, Navigate } from "react-router";
import CheckoutForm from "@/components/CheckoutForm";
import { Card, CardContent } from "@/components/ui/card";
import { useGetBookingByIdQuery } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

const PaymentPage = () => {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get("bookingId");

  const { data: booking, isLoading, isError } = useGetBookingByIdQuery(bookingId, {
    skip: !bookingId,
  });

  if (!bookingId) {
    return <Navigate to="/" replace />;
  }

  if (isLoading) {
    return (
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-[400px] w-full" />
          </CardContent>
        </Card>
      </main>
    );
  }

  if (isError || !booking) {
    return (
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-bold text-destructive mb-2">Booking Not Found</h2>
            <p className="text-muted-foreground">
              The booking you're trying to pay for doesn't exist or you don't have access to it.
            </p>
          </CardContent>
        </Card>
      </main>
    );
  }

  if (booking.paymentStatus === "PAID") {
    return <Navigate to={`/booking/complete?session_id=already_paid&bookingId=${bookingId}`} replace />;
  }

  const hotel = booking.hotelId;

  return (
    <main className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold mb-4">Complete Your Payment</h1>
          
          {hotel && (
            <div className="mb-6 p-4 bg-muted rounded-lg">
              <h3 className="font-semibold">{hotel.name}</h3>
              <p className="text-sm text-muted-foreground">{hotel.location}</p>
              <div className="mt-2 text-sm">
                <p>Check-in: {new Date(booking.checkIn).toLocaleDateString()}</p>
                <p>Check-out: {new Date(booking.checkOut).toLocaleDateString()}</p>
                <p>Room: #{booking.roomNumber}</p>
              </div>
            </div>
          )}

          <CheckoutForm bookingId={bookingId} />
        </CardContent>
      </Card>
    </main>
  );
};

export default PaymentPage;
