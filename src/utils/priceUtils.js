export const MIN_PRICE = 1;
export const MAX_PRICE = 200000;

export const formatCurrency = (value) => {
  const numeric = value.replace(/[^\d]/g, "").slice(0, 6);
  if (numeric === "") return "";
  return `$${parseInt(numeric, 10).toLocaleString()}`;
};

export const validatePrice = (value) => {
  const numericValue = parseInt(value, 10);

  if (isNaN(numericValue)) return { isValid: true, error: "" };

  if (numericValue < MIN_PRICE)
    return { isValid: false, error: "Price must be at least $1" };
  if (numericValue > MAX_PRICE)
    return { isValid: false, error: "Price cannot exceed $200,000" };

  return { isValid: true, error: "" };
};
