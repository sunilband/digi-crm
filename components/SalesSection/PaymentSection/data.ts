interface Customer {
  id: string;
  name: string;
}

interface CreatedBy {
  name: string;
  id: string;
}

export interface Payment {
  _id: string;
  invoiceID: string;
  paymentMode:
    | "Cash"
    | "Cheque"
    | "Credit Card"
    | "Debit Card"
    | "Net Banking"
    | "UPI"
    | "Other";
  transactionID: string;
  customer: Customer;
  amount: number;
  date: Date;
  createdBy: CreatedBy;
}
