import { useEffect, useState } from "react";
import useAuthStore from "../store/authStore";

export default function useFetchPaymentMethods() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const token = useAuthStore((s) => s.token);
  const setFetchedData = useAuthStore((s) => s.setFetchedData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchPaymentMethods = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/users/payment-methods`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch payment methods");
        }

        setFetchedData({ paymentMethods: data });

        setError(null);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchPaymentMethods();
    }
  }, [token, setFetchedData]);

  return { loading, error };
}
