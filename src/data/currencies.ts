export interface CurrencyOption {
  code: string;
  symbol: string;
  label: string;
}

export const CURRENCIES: CurrencyOption[] = [
  { code: "USD", symbol: "$", label: "US Dollar" },
  { code: "EUR", symbol: "€", label: "Euro" },
  { code: "GBP", symbol: "£", label: "British Pound" },
  { code: "INR", symbol: "₹", label: "Indian Rupee" },
  { code: "JPY", symbol: "¥", label: "Japanese Yen" },
  { code: "AUD", symbol: "$", label: "Australian Dollar" },
  { code: "CAD", symbol: "$", label: "Canadian Dollar" },
  { code: "CHF", symbol: "Fr", label: "Swiss Franc" },
  { code: "CNY", symbol: "¥", label: "Chinese Yuan" },
  { code: "SGD", symbol: "$", label: "Singapore Dollar" },
];

export const DEFAULT_CURRENCY: CurrencyOption = CURRENCIES[0];
