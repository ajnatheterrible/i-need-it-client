import { useEffect, useState } from "react";
import useAuthStore from "../store/authStore";

export default function useFetchSizes() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const token = useAuthStore((s) => s.token);
  const setFetchedData = useAuthStore((s) => s.setFetchedData);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isLoggedIn || !token) return;

    const fetchSizes = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/users/sizes`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch sizes");
        }

        setFetchedData({ sizes: data });
        setError(null);
      } catch (err) {
        console.error("❌ Error fetching sizes:", err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchSizes();
  }, [isLoggedIn, token, setFetchedData]);

  return { loading, error };
}
