export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatCurrency(amount: number) {
  if (amount === 0) return "—";
  return `₹${amount.toLocaleString("en-IN")}`;
}
