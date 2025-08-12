import { useEffect, useState } from "react";
import useAuthStore from "../store/authStore";

export default function useFetchOrder(orderId) {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const token = useAuthStore((s) => s.token);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isLoggedIn || !token || !orderId) return;

    const fetchOrder = async () => {
      try {
        setLoading(true);

        const res = await fetch(`/api/orders/${orderId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch order");
        }

        setOrder(data);
        setError(null);
      } catch (err) {
        console.log(err.message);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [isLoggedIn, token, orderId]);

  return { order, loading, error };
}
