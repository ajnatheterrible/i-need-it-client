import { useEffect } from "react";

export default function useFetchListings(
  searchParams,
  query,
  setListings,
  setCount,
  setIsLoading
) {
  useEffect(() => {
    const fetchListings = async () => {
      setIsLoading(true);

      try {
        const url = query
          ? `${
              import.meta.env.VITE_API_BASE_URL
            }/api/listings/feed?${searchParams.toString()}`
          : `/api/listings/random`;

        const res = await fetch(url);
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Failed to fetch listings");
        }

        const data = await res.json();

        if (Array.isArray(data)) {
          setListings(data);
          setCount(data.length);
        } else {
          setListings([]);
          setCount(0);
        }
      } catch (err) {
        console.error("Failed to fetch listings:", err);
        setListings([]);
        setCount(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchListings();
  }, [searchParams, query, setListings, setCount]);
}
