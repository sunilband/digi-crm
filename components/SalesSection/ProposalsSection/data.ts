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

export interface Proposal {
  _id?: string;
  subject: string;
  related: "Lead" | "Customer";
  lead?: Lead;
  customer?: Customer;
  date: Date;
  openTill: Date;
  currency: "INR" | "USD";
  tags?: string[];
  discountType?: "None" | "Before Tax" | "After Tax";
  status?: "Draft" | "Sent" | "Open" | "Revisited" | "Accepted" | "Declined";
  assignedTo: AssignedTo;
  to: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  email: string; // validated with regex
  phone: number; // validated with regex
  createdAt?: Date; // default value is Date.now()
  assignedBy: AssignedBy; // required
  // items
  items?: ItemReference[];
  // Pricing
  discount?: Discount; // default value is {totalDiscountType:"Percentage",value=0,adjustment=0}
  subTotal: number; // required
}
