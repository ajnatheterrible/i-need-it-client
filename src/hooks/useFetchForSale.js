import { useEffect, useState } from "react";
import useAuthStore from "../store/authStore";

export default function useFetchForSale() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const token = useAuthStore((s) => s.token);
  const setFetchedData = useAuthStore((s) => s.setFetchedData);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isLoggedIn || !token) return;

    const fetchForSale = async () => {
      try {
        setLoading(true);

        const res = await fetch(`/api/users/for-sale`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch listings for sale");
        }

        setFetchedData({ forSale: data });
        setError(null);
      } catch (err) {
        console.error("❌ Error fetching listings for sale:", err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchForSale();
  }, [isLoggedIn, token, setFetchedData]);

  return { loading, error };
}
