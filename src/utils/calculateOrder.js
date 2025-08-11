export const FL_TAX_RATE = 0.07;
export const FLAT_SHIPPING = 20;

export function calculateTax(price) {
  if (!price || isNaN(price)) return 0;
  return parseFloat((price * FL_TAX_RATE).toFixed(2));
}

export function calculateShipping() {
  return FLAT_SHIPPING;
}

export function calculateTotal(price) {
  const tax = calculateTax(price);
  const shipping = calculateShipping();
  const total = parseFloat((price + tax + shipping).toFixed(2));

  return {
    tax,
    shipping,
    total,
    totalInCents: Math.round(total * 100),
  };
}
