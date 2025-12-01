import { useState, useCallback } from "react";
import Hero from "../components/Hero";
import HotelListings from "../components/HotelListings";
import { toast } from "sonner";

function HomePage() {
  const [searchMode, setSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = useCallback(async (query) => {
    setIsSearching(true);
    setSearchQuery(query);
    setSearchMode(true);

    try {
      const response = await fetch(`/api/hotels/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error("Search failed");
      }

      const data = await response.json();
      setSearchResults(data.hotels || []);
      
      if (data.hotels?.length === 0) {
        toast.info("No hotels found matching your search. Try different keywords.");
      } else {
        const methodLabel = data.method === "ai" ? "AI-powered" : "keyword";
        toast.success(`Found ${data.hotels.length} hotel${data.hotels.length !== 1 ? "s" : ""} using ${methodLabel} search`);
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Search failed. Please try again.");
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchMode(false);
    setSearchQuery("");
    setSearchResults([]);
  }, []);

  return (
    <main>
      <div className="relative min-h-[85vh]">
        <Hero onSearch={handleSearch} isSearching={isSearching} />
      </div>
      <HotelListings
        searchMode={searchMode}
        searchResults={searchResults}
        searchQuery={searchQuery}
        onClearSearch={handleClearSearch}
        isSearching={isSearching}
      />
    </main>
  );
}

export default HomePage;
