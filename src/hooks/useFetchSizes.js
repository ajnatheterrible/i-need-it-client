import { useEffect, useRef } from "react";
import useAuthStore from "../store/authStore";

export default function useFetchSizes() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const token = useAuthStore((s) => s.token);
  const setFetchedData = useAuthStore((s) => s.setFetchedData);
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (!isLoggedIn || !token || hasFetchedRef.current) return;

    const fetchSizes = async () => {
      try {
        const res = await fetch(`/api/users/sizes`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(
            errorData.message || "Failed to fetch sizes for this user"
          );
        }

        const sizes = await res.json();

        setFetchedData({ sizes });

        hasFetchedRef.current = true;
      } catch (err) {
        console.error("❌ Error fetching user sizes:", err);
      }
    };

    fetchSizes();
  }, []);
}
