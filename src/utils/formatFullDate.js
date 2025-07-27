export default function formatFullDate(dateStr) {
  if (!dateStr) return "—";

  const date = new Date(dateStr);
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const formatted = date.toLocaleDateString("en-US", options);

  const day = date.getDate();
  const suffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
      ? "nd"
      : day % 10 === 3 && day !== 13
      ? "rd"
      : "th";

  return formatted.replace(/\d+/, `${day}${suffix}`);
}
