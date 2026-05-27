export const PHP_PER_USD = 56;

export type Currency = "PHP" | "USD";

export function formatPrice(php: number, currency: Currency): string {
  if (currency === "PHP") {
    return `₱${php.toLocaleString("en-PH", { maximumFractionDigits: 0 })}`;
  }
  const usd = php / PHP_PER_USD;
  return `$${usd.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatPriceBoth(php: number, primary: Currency): { primary: string; secondary: string } {
  return primary === "PHP"
    ? { primary: formatPrice(php, "PHP"), secondary: formatPrice(php, "USD") }
    : { primary: formatPrice(php, "USD"), secondary: formatPrice(php, "PHP") };
}
