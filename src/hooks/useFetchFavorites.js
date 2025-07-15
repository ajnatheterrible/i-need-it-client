import { useEffect, useRef } from "react";
import useAuthStore from "../store/authStore";

export default function useFetchFavorites(
  hasFetchedFavorites = false,
  setHasFetchedFavorites = () => {}
) {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const token = useAuthStore((s) => s.token);
  const setFetchedData = useAuthStore((s) => s.setFetchedData);

  useEffect(() => {
    if (!isLoggedIn || !token || hasFetchedFavorites === true) return;

    const fetchFavorites = async () => {
      try {
        const res = await fetch(`/api/users/favorites`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Failed to fetch favorites");
        }

        const favorites = await res.json();

        setFetchedData({ favorites });

        setHasFetchedFavorites(true);
      } catch (err) {
        console.error("❌ Error fetching favorites:", err);
      }
    };

    fetchFavorites();
  }, [isLoggedIn, token, hasFetchedFavorites]);
}
