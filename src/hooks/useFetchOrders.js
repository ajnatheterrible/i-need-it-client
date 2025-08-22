import { useEffect, useState } from "react";
import useAuthStore from "../store/authStore";

export default function useFetchOrders() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const token = useAuthStore((s) => s.token);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isLoggedIn || !token) return;

    const fetchOrders = async () => {
      try {
        setLoading(true);

        const res = await fetch("/api/users/orders", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch orders");
        }

        setOrders(data);
        setError(null);
      } catch (err) {
        console.error("Fetch orders error:", err.message);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isLoggedIn, token]);

  return { orders, loading, error };
}
