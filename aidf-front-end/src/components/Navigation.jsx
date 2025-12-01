import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/clerk-react";
import { Globe, Menu, X, Hotel, User, CalendarDays, PlusCircle } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router";

function Navigation() {
  const { user } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        isMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    function handleEscKey(event) {
      if (isMenuOpen && event.key === "Escape") {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("keydown", handleEscKey);
    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="z-50 bg-black/90 backdrop-blur-md flex items-center justify-between px-4 sm:px-6 text-white py-3 rounded-full mx-4 my-3 relative">
      <div className="flex items-center space-x-8">
        <Link to="/" className="text-xl font-bold tracking-tight hover:opacity-90 transition-opacity">
          Horizone
        </Link>
        <div className="hidden md:flex items-center space-x-1">
          <Link
            to="/"
            className={`px-3 py-1.5 rounded-full text-sm transition-all ${
              isActive("/") ? "bg-white/20 font-medium" : "hover:bg-white/10"
            }`}
          >
            Home
          </Link>
          <Link
            to="/hotels"
            className={`px-3 py-1.5 rounded-full text-sm transition-all ${
              isActive("/hotels") ? "bg-white/20 font-medium" : "hover:bg-white/10"
            }`}
          >
            Hotels
          </Link>
          {user?.publicMetadata?.role === "admin" && (
            <Link
              to="/admin/create-hotel"
              className={`px-3 py-1.5 rounded-full text-sm transition-all flex items-center gap-1.5 ${
                isActive("/admin/create-hotel") ? "bg-white/20 font-medium" : "hover:bg-white/10"
              }`}
            >
              <PlusCircle className="h-3.5 w-3.5" />
              Add Hotel
            </Link>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <Button variant="ghost" size="sm" className="text-xs hidden md:flex hover:bg-white/10">
          <Globe className="h-4 w-4 mr-1.5" />
          EN
        </Button>
        <SignedOut>
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-xs hidden md:flex hover:bg-white/10"
          >
            <Link to="/sign-in">Log In</Link>
          </Button>
          <Button
            size="sm"
            asChild
            className="bg-white text-black hover:bg-gray-100 text-xs hidden md:flex font-medium"
          >
            <Link to="/sign-up">Sign Up</Link>
          </Button>
        </SignedOut>
        <SignedIn>
          <Link
            to="/my-account"
            className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all ${
              isActive("/my-account") ? "bg-white/20 font-medium" : "hover:bg-white/10"
            }`}
          >
            <User className="h-3.5 w-3.5" />
            My Account
          </Link>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>

        <div className="relative md:hidden">
          <Button
            ref={buttonRef}
            variant="ghost"
            size="icon"
            className="relative z-20 hover:bg-white/10"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
            <span className="sr-only">
              {isMenuOpen ? "Close menu" : "Open menu"}
            </span>
          </Button>

          {isMenuOpen && (
            <div
              ref={menuRef}
              className="absolute right-0 mt-2 w-64 rounded-xl bg-black/95 backdrop-blur-lg border border-white/10 shadow-2xl py-3 px-2 animate-in fade-in slide-in-from-top-5 duration-200 z-50"
              style={{ top: "calc(100% + 8px)" }}
            >
              <div className="flex flex-col space-y-1">
                <Link
                  to="/"
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive("/") ? "bg-white/20" : "hover:bg-white/10"
                  }`}
                >
                  <Hotel className="h-4 w-4" />
                  Home
                </Link>
                <Link
                  to="/hotels"
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive("/hotels") ? "bg-white/20" : "hover:bg-white/10"
                  }`}
                >
                  <Hotel className="h-4 w-4" />
                  Hotels
                </Link>
                {user?.publicMetadata?.role === "admin" && (
                  <Link
                    to="/admin/create-hotel"
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive("/admin/create-hotel") ? "bg-white/20" : "hover:bg-white/10"
                    }`}
                  >
                    <PlusCircle className="h-4 w-4" />
                    Add Hotel
                  </Link>
                )}
                
                <div className="h-px bg-white/10 my-2"></div>
                
                <SignedIn>
                  <Link
                    to="/my-account"
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive("/my-account") ? "bg-white/20" : "hover:bg-white/10"
                    }`}
                  >
                    <User className="h-4 w-4" />
                    My Account
                  </Link>
                  <Link
                    to="/bookings"
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive("/bookings") ? "bg-white/20" : "hover:bg-white/10"
                    }`}
                  >
                    <CalendarDays className="h-4 w-4" />
                    My Bookings
                  </Link>
                </SignedIn>
                
                <SignedOut>
                  <Link
                    to="/sign-in"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/sign-up"
                    className="flex items-center justify-center gap-2 mx-2 mt-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-white text-black hover:bg-gray-100 transition-colors"
                  >
                    Sign Up
                  </Link>
                </SignedOut>
                
                <div className="h-px bg-white/10 my-2"></div>
                
                <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors w-full text-left">
                  <Globe className="h-4 w-4" />
                  English
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
