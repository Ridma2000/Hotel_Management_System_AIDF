import { useState } from "react";
import { format, addDays, differenceInDays } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, CalendarDays, CreditCard } from "lucide-react";

const BookingDialog = ({ hotelName, hotelPrice, hotelId, onSubmit, isLoading }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [error, setError] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const handleCheckInChange = (e) => {
    const newCheckIn = e.target.value;
    setCheckIn(newCheckIn);
    setError("");
    
    if (checkOut && newCheckIn >= checkOut) {
      setCheckOut(addDays(new Date(newCheckIn), 1).toISOString().split("T")[0]);
    }
  };

  const handleCheckOutChange = (e) => {
    const newCheckOut = e.target.value;
    setCheckOut(newCheckOut);
    setError("");
  };

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    return differenceInDays(new Date(checkOut), new Date(checkIn));
  };

  const calculateTotal = () => {
    const nights = calculateNights();
    return nights * hotelPrice;
  };

  const handleSubmit = async () => {
    if (!checkIn || !checkOut) {
      setError("Please select both check-in and check-out dates");
      return;
    }

    if (new Date(checkIn) >= new Date(checkOut)) {
      setError("Check-out must be after check-in");
      return;
    }

    if (new Date(checkIn) < new Date(today)) {
      setError("Check-in date cannot be in the past");
      return;
    }

    try {
      await onSubmit({ hotelId, checkIn, checkOut });
      setIsOpen(false);
      setCheckIn("");
      setCheckOut("");
    } catch (err) {
      setError(err.message || "Failed to create booking");
    }
  };

  const nights = calculateNights();
  const total = calculateTotal();

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)} size="lg">
        <CalendarDays className="w-4 h-4 mr-2" /> Book Now
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Book {hotelName}</h2>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
              &times;
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                <Calendar className="w-4 h-4 inline mr-1" />
                Check-in Date
              </label>
              <input
                type="date"
                value={checkIn}
                onChange={handleCheckInChange}
                min={today}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                <Calendar className="w-4 h-4 inline mr-1" />
                Check-out Date
              </label>
              <input
                type="date"
                value={checkOut}
                onChange={handleCheckOutChange}
                min={checkIn || today}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {error && (
              <p className="text-destructive text-sm">{error}</p>
            )}

            {nights > 0 && (
              <div className="bg-muted p-4 rounded-md space-y-2">
                <div className="flex justify-between text-sm">
                  <span>${hotelPrice} x {nights} night{nights > 1 ? "s" : ""}</span>
                  <span>${total}</span>
                </div>
                <div className="flex justify-between font-bold border-t pt-2">
                  <span>Total</span>
                  <span>${total}</span>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={handleSubmit}
                disabled={isLoading || !checkIn || !checkOut}
              >
                {isLoading ? (
                  <span className="animate-spin">...</span>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Continue to Payment
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingDialog;
