import { useEffect, useRef } from "react";
import useAuthStore from "../store/authStore";

export const hasFetchedForSaleRef = { current: false };

export default function useFetchForSale() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const token = useAuthStore((s) => s.token);
  const setFetchedData = useAuthStore((s) => s.setFetchedData);

  useEffect(() => {
    if (!isLoggedIn || !token || hasFetchedForSaleRef.current) return;

    const fetchForSale = async () => {
      try {
        const res = await fetch(`/api/users/for-sale`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(
            errorData.message ||
              "Failed to fetch listings for sale from this seller"
          );
        }

        const listings = await res.json();

        setFetchedData({ forSale: listings });
      } catch (err) {
        console.error("❌ Error fetching listings for sale:", err);
      } finally {
        hasFetchedForSaleRef.current = true;
      }
    };

    fetchForSale();
  }, []);
}
