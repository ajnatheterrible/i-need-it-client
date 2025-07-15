import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import useAuthStore from "../store/authStore";

export default function useSyncSearchParams(
  filters,
  query,
  isUsingMySizes,
  setFilters,
  setIsUsingMySizes
) {
  const [, setSearchParams] = useSearchParams();
  const sizes = useAuthStore((s) => s.fetchedData?.sizes);

  useEffect(() => {
    if (query === null || query === undefined) return;

    if (!query) {
      setFilters({
        department: [],
        category: [],
        size: [],
        condition: [],
        priceMin: null,
        priceMax: null,
      });
      setIsUsingMySizes(false);
      setSearchParams({});
      return;
    }

    const newParams = new URLSearchParams();

    if (query) newParams.set("query", query);
    if (filters.department.length)
      newParams.set("department", filters.department.join(","));
    if (filters.category.length)
      newParams.set("category", filters.category.join(","));

    const activeSizes =
      isUsingMySizes && sizes
        ? Object.values(sizes)
            .map((group) => Object.values(group).flat())
            .flat()
        : filters.size?.length
        ? filters.size
        : [];

    if (activeSizes.length) {
      newParams.set("size", activeSizes.join(","));
    }

    if (filters.condition.length)
      newParams.set("condition", filters.condition.join(","));
    if (filters.priceMin) newParams.set("priceMin", filters.priceMin);
    if (filters.priceMax) newParams.set("priceMax", filters.priceMax);

    setSearchParams(newParams);
  }, [filters, query, isUsingMySizes, sizes, setSearchParams]);
}
