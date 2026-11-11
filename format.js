export function formatPrice(value) {
  return Number(value).toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export function formatDate(value) {
  return new Date(value).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}
