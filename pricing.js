// Mirrors server/src/constants.js. The server is the source of truth when an order is placed.
export const TAX_RATE = 0.08;
export const FREE_SHIPPING_THRESHOLD = 50;
export const FLAT_SHIPPING = 6.99;

export function getTotals(subtotal) {
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING;
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
  const total = Math.round((subtotal + shipping + tax) * 100) / 100;
  return { subtotal, shipping, tax, total };
}
