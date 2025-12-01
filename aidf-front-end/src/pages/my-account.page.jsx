import { useState } from "react";
import { Link } from "react-router";
import { useUser, useClerk } from "@clerk/clerk-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetUserBookingsQuery } from "@/lib/api";
import {
  User,
  Mail,
  Calendar,
  MapPin,
  CreditCard,
  Home,
  Clock,
  Filter,
  ChevronRight,
  LogOut,
  Settings,
  CalendarDays,
  Building2,
  DollarSign,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const MyAccountPage = () => {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [activeTab, setActiveTab] = useState("bookings");

  const {
    data: bookings,
    isLoading,
    isError,
    refetch,
  } = useGetUserBookingsQuery(undefined, {
    skip: !isLoaded || !user,
  });

  const filteredBookings = bookings?.filter((booking) => {
    if (statusFilter === "ALL") return true;
    return booking.paymentStatus?.toUpperCase() === statusFilter;
  });

  const sortedBookings = filteredBookings?.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const stats = {
    total: bookings?.length || 0,
    paid: bookings?.filter((b) => b.paymentStatus === "PAID").length || 0,
    pending: bookings?.filter((b) => b.paymentStatus === "PENDING").length || 0,
  };

  if (!isLoaded) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <Skeleton className="h-48 w-full rounded-2xl mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="h-64 rounded-xl" />
            <Skeleton className="h-96 lg:col-span-2 rounded-xl" />
          </div>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Sign in Required</h2>
            <p className="text-muted-foreground mb-4">
              Please sign in to access your account.
            </p>
            <Button asChild className="w-full">
              <Link to="/sign-in">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-2xl p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="relative">
              <img
                src={user.imageUrl}
                alt={user.fullName || "User"}
                className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-white shadow-lg"
              />
              <div className="absolute -bottom-1 -right-1 bg-green-500 w-5 h-5 rounded-full border-2 border-white"></div>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold mb-1">
                {user.fullName || "Welcome!"}
              </h1>
              <p className="text-muted-foreground flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {user.primaryEmailAddress?.emailAddress}
              </p>
              <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Member since {new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => signOut()}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-medium">Total Bookings</p>
                  <p className="text-2xl md:text-3xl font-bold text-blue-700">{stats.total}</p>
                </div>
                <Building2 className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-50 to-green-100/50 border-green-200">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-medium">Confirmed</p>
                  <p className="text-2xl md:text-3xl font-bold text-green-700">{stats.paid}</p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-amber-50 to-amber-100/50 border-amber-200">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-amber-600 font-medium">Pending</p>
                  <p className="text-2xl md:text-3xl font-bold text-amber-700">{stats.pending}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-64 flex-shrink-0">
            <Card>
              <CardContent className="p-4">
                <nav className="space-y-1">
                  <button
                    onClick={() => setActiveTab("bookings")}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === "bookings"
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }`}
                  >
                    <CalendarDays className="h-4 w-4" />
                    <span className="font-medium">My Bookings</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("profile")}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === "profile"
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }`}
                  >
                    <User className="h-4 w-4" />
                    <span className="font-medium">Profile</span>
                  </button>
                </nav>
              </CardContent>
            </Card>
          </div>

          <div className="flex-1">
            {activeTab === "bookings" && (
              <Card>
                <CardHeader className="border-b">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <CardTitle className="text-xl">Booking History</CardTitle>
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-muted-foreground" />
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="text-sm border rounded-lg px-3 py-1.5 bg-background"
                      >
                        <option value="ALL">All Bookings</option>
                        <option value="PAID">Confirmed</option>
                        <option value="PENDING">Pending Payment</option>
                      </select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {isLoading ? (
                    <div className="p-6 space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex gap-4">
                          <Skeleton className="w-24 h-20 rounded-lg" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-5 w-48" />
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-4 w-64" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : isError ? (
                    <div className="p-8 text-center">
                      <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                      <p className="text-destructive font-medium">
                        Failed to load bookings
                      </p>
                      <p className="text-sm text-muted-foreground mt-1 mb-4">
                        Please try again later.
                      </p>
                      <Button variant="outline" onClick={() => refetch()}>
                        Try Again
                      </Button>
                    </div>
                  ) : !sortedBookings || sortedBookings.length === 0 ? (
                    <div className="p-8 text-center">
                      <CalendarDays className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-semibold mb-2">
                        {statusFilter === "ALL"
                          ? "No Bookings Yet"
                          : `No ${statusFilter === "PAID" ? "Confirmed" : "Pending"} Bookings`}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4">
                        {statusFilter === "ALL"
                          ? "Start exploring hotels and make your first booking!"
                          : "Try changing your filter to see other bookings."}
                      </p>
                      {statusFilter === "ALL" && (
                        <Button asChild>
                          <Link to="/hotels">
                            <Home className="h-4 w-4 mr-2" />
                            Browse Hotels
                          </Link>
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="divide-y">
                      {sortedBookings.map((booking) => {
                        const hotel = booking.hotelId;
                        const isPending = booking.paymentStatus === "PENDING";
                        const nights = Math.ceil(
                          (new Date(booking.checkOut) - new Date(booking.checkIn)) /
                            (1000 * 60 * 60 * 24)
                        );
                        const totalAmount = (hotel?.price || 0) * nights;

                        return (
                          <div
                            key={booking._id}
                            className="p-4 md:p-6 hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex flex-col md:flex-row gap-4">
                              {hotel?.image && (
                                <Link to={`/hotels/${hotel._id}`} className="flex-shrink-0">
                                  <img
                                    src={hotel.image}
                                    alt={hotel.name}
                                    className="w-full md:w-32 h-24 object-cover rounded-lg hover:opacity-90 transition-opacity"
                                  />
                                </Link>
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                                  <div>
                                    <Link
                                      to={`/hotels/${hotel?._id}`}
                                      className="font-semibold text-lg hover:text-primary transition-colors"
                                    >
                                      {hotel?.name || "Unknown Hotel"}
                                    </Link>
                                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                                      <MapPin className="h-3.5 w-3.5" />
                                      {hotel?.location || "Unknown Location"}
                                    </p>
                                  </div>
                                  <Badge
                                    variant={isPending ? "destructive" : "default"}
                                    className="flex items-center gap-1"
                                  >
                                    {isPending ? (
                                      <AlertCircle className="h-3 w-3" />
                                    ) : (
                                      <CheckCircle2 className="h-3 w-3" />
                                    )}
                                    {isPending ? "Payment Pending" : "Confirmed"}
                                  </Badge>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm mt-3">
                                  <div className="bg-muted/50 rounded-lg p-2">
                                    <p className="text-xs text-muted-foreground">Check-in</p>
                                    <p className="font-medium">
                                      {new Date(booking.checkIn).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                      })}
                                    </p>
                                  </div>
                                  <div className="bg-muted/50 rounded-lg p-2">
                                    <p className="text-xs text-muted-foreground">Check-out</p>
                                    <p className="font-medium">
                                      {new Date(booking.checkOut).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                      })}
                                    </p>
                                  </div>
                                  <div className="bg-muted/50 rounded-lg p-2">
                                    <p className="text-xs text-muted-foreground">Room</p>
                                    <p className="font-medium">#{booking.roomNumber}</p>
                                  </div>
                                  <div className="bg-muted/50 rounded-lg p-2">
                                    <p className="text-xs text-muted-foreground">Total</p>
                                    <p className="font-medium text-primary">
                                      ${totalAmount.toFixed(2)}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center justify-between mt-4">
                                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    Booked on{" "}
                                    {new Date(booking.createdAt).toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                      hour: "numeric",
                                      minute: "2-digit",
                                    })}
                                  </p>
                                  {isPending && (
                                    <Button asChild size="sm">
                                      <Link to={`/booking/payment?bookingId=${booking._id}`}>
                                        <CreditCard className="h-4 w-4 mr-2" />
                                        Complete Payment
                                      </Link>
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {activeTab === "profile" && (
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4">
                    <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Full Name</p>
                        <p className="font-medium">{user.fullName || "Not set"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Email Address</p>
                        <p className="font-medium">
                          {user.primaryEmailAddress?.emailAddress}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Member Since</p>
                        <p className="font-medium">
                          {new Date(user.createdAt).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground mb-3">
                      To update your profile information, please use Clerk's user settings.
                    </p>
                    <Button variant="outline" onClick={() => user.reload()}>
                      <Settings className="h-4 w-4 mr-2" />
                      Refresh Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default MyAccountPage;
