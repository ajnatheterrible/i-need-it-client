export async function toggleFavorite(listingId, token, isAlreadyFavorited) {
  const method = isAlreadyFavorited ? "DELETE" : "POST";

  const res = await fetch(`/api/users/favorites/${listingId}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to toggle favorite");
  }

  return await res.json();
}
