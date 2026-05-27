import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Currency } from "@/lib/format";

type Ctx = { currency: Currency; setCurrency: (c: Currency) => void; toggle: () => void };

const CurrencyContext = createContext<Ctx | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>("PHP");

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("bloxmart-currency") : null;
    if (stored === "PHP" || stored === "USD") setCurrency(stored);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") localStorage.setItem("bloxmart-currency", currency);
  }, [currency]);

  const toggle = () => setCurrency((c) => (c === "PHP" ? "USD" : "PHP"));

  return <CurrencyContext.Provider value={{ currency, setCurrency, toggle }}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used inside CurrencyProvider");
  return ctx;
}
