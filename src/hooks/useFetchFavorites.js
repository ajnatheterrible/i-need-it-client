import { useEffect, useState } from "react";
import useAuthStore from "../store/authStore";

export default function useFetchFavorites() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const token = useAuthStore((s) => s.token);
  const setFetchedData = useAuthStore((s) => s.setFetchedData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isLoggedIn || !token) return;

    const fetchFavorites = async () => {
      try {
        setLoading(true);

        const res = await fetch(`/api/users/favorites`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch favorites");
        }

        setFetchedData({ favorites: data });
        setError(null);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [isLoggedIn, token, setFetchedData]);

  return { loading, error };
}
