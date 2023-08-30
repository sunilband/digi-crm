type Address = {
  street: string;
  city: string;
  state: string;
  zip: number;
  country: string;
};

type BillingAddress = {
  street?: string;
  city?: string;
  state?: string;
  zip?: number;
  country?: string;
};

type ShippingAddress = {
  street?: string;
  city?: string;
  state?: string;
  zip?: number;
  country?: string;
};

export type Customer = {
  _id: string;
  company: string;
  vat: string;
  phone: number;
  website?: string;
  currency: "USD" | "INR";
  language?:
    | "English"
    | "Hindi"
    | "Vietnamese"
    | "Turkish"
    | "Swedish"
    | "Polish"
    | "Ukrainian"
    | "Russian"
    | "Romanian"
    | "Portuguese"
    | "Norwegian"
    | "Korean"
    | "Japanese"
    | "Italian"
    | "Indonesian"
    | "Hungarian"
    | "French"
    | "Finnish"
    | "Dutch"
    | "Danish"
    | "Czech"
    | "Chinese"
    | "Bulgarian"
    | "Bengali"
    | "Arabic"
    | "Spanish"
    | "German"
    | "Greek";
  status: "Active" | "Inactive";
  email: string;
  groups: string[];
  address: Address;

  billingAddress?: BillingAddress;

  shippingAddress?: ShippingAddress;
};

export const languages = [
  "English",
  "Hindi",
  "Turkish",
  "Russian",
  "Romanian",
  "Korean",
  "Japanese",
  "Italian",
  "French",
  "Czech",
  "Chinese",
  "Arabic",
  "Spanish",
  "German",
];

export const currencies = ["USD", "INR"];
