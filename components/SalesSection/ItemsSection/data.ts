export type Item = {
  _id: string;
  desc: string;
  longDesc: string;
  rate: {
    rateValue: number;
    currency: string;
  };
  tax1: number;
  tax2: number;
  unit: string;
  groupName: string;
  createdAt: string;
  createdBy: {
    id: string;
    name: string;
  };
  __v: number | string;
};
