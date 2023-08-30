interface Rate {
  rateValue: number;
  currency: "INR" | "USD" | "EUR" | "GBP";
}

interface CreatedBy {
  name: string;
  id: string;
}

interface ItemsSchema {
  desc: string;
  longDesc?: string;
  rate: Rate;
  tax1: number;
  tax2: number;
  unit: string;
  groupName?: string;
  createdAt?: Date;
  createdBy: CreatedBy;
}

interface ItemReference {
  data: ItemsSchema;
  quantity?: number;
  rate: number;
  tax: number;
}

interface Lead {
  id?: string;
  name?: string;
}

interface Customer {
  id?: string;
  name?: string;
}

interface AssignedTo {
  id: string;
  name: string;
}

interface AssignedBy {
  name: string;
  id: string;
}

interface Discount {
  totalDiscountType?: "Percentage" | "Amount";
  value?: number;
  adjustment?: number;
}

export interface CreditNote {
  _id?: string;
  customer?: {
    id?: string;
    name?: string;
  };
  billingAddress?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: number;
    country?: string;
  };
  shippingAddress?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: number;
    country?: string;
  };
  creditNoteNumber: string;
  date: Date;
  currency: "INR" | "USD";
  tags?: string[];
  discountType?: "None" | "Before Tax" | "After Tax";
  createdAt?: Date;
  assignedBy: {
    name: string;
    id: string;
  };
  reference?: string;
  adminNote?: string;
  clientNote?: string;
  terms?: string;

  // items
  items: ItemReference[];
  // Pricing
  discount: {
    totalDiscountType?: "Percentage" | "Amount";
    value?: number;
    adjustment?: number;
  };
  subTotal: number;
}
