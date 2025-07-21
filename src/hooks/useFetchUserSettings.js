import { useEffect, useState } from "react";
import useAuthStore from "../store/authStore";

const useFetchUserSettings = () => {
  const token = useAuthStore((s) => s.token);
  const setFetchedData = useAuthStore((s) => s.setFetchedData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/users/settings", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok)
          throw new Error(data.message || "Failed to fetch settings");

        const { location, settings } = data;

        setFetchedData({
          userSettings: {
            location,
            ...settings,
          },
        });

        setError(null);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchSettings();
    }
  }, [token, setFetchedData]);

  return { loading, error };
};

export default useFetchUserSettings;
