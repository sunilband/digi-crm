export type Lead = {
  _id: string;
  name: string;
  email: string;
  company: string;
  phone: string | number;
  value: string | number;
  tags?: string[];

  status?: "Done" | "Customer";

  assignedBy: {
    name: string;
    id: string;
  };

  assignedTo: {
    name: string;
    id: string;
  };
  lastContacted: string | Date;
  __v: number | string;
};
