import { useEffect, useState } from "react";
import useAuthStore from "../store/authStore";

export default function useFetchPurchases() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const token = useAuthStore((s) => s.token);
  const setFetchedData = useAuthStore((s) => s.setFetchedData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchPurchases = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/users/purchases`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch addresses");
        }

        console.log("Fetched purchases: ", data);

        setFetchedData({ purchases: data });

        setError(null);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchPurchases();
    }
  }, [token, setFetchedData]);

  return { loading, error };
}
