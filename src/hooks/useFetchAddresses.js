import { useEffect, useState } from "react";
import useAuthStore from "../store/authStore";

export default function useFetchAddresses() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const token = useAuthStore((s) => s.token);
  const setFetchedData = useAuthStore((s) => s.setFetchedData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/users/addresses`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch addresses");
        }

        setFetchedData({ addresses: data });

        setError(null);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchAddresses();
    }
  }, [token, setFetchedData]);

  return { loading, error };
}
