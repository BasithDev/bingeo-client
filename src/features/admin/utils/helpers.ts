/** Format an ISO date string to "12 Jan 2025" */
export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Format a number as ₹ INR currency, returns "—" for zero */
export function formatCurrency(amount: number) {
  if (amount === 0) return "—";
  return `₹${amount.toLocaleString("en-IN")}`;
}
