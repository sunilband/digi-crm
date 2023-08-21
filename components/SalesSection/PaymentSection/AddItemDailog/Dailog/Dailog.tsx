import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getAllUsers } from "@/utils/apiRequests/adminFunctions";
import { getCustomers } from "@/utils/apiRequests/customerFunctions";
import { Customer } from "../../../../CustomerSection/data";
import { getInvoices } from "@/utils/apiRequests/sales functions/InvoiceFunctions";
import { Invoice } from "../../../InvoicesSection/data";
import { UserInterface } from "@/context/userContext";
import userContext from "@/context/userContext";
import { useContext } from "react";
import { useToast } from "@/components/ui/use-toast";
import { create } from "domain";
import { createPayment } from "@/utils/apiRequests/sales functions/PaymentFunctions";
import { useFormik } from "formik";
import * as Yup from "yup";

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const DailogBox = ({ open, setOpen }: Props) => {
  const initialValues = {
    paymentNo: "",
    customerID: "",
    invoiceID: "",
    date: "",
    transactionID: "",
    paymentMode: "",
    amount: "",
  };

  const formik = useFormik({
    initialValues,
    validationSchema: Yup.object({
      paymentNo: Yup.number().required("Payment Number Required"),
      customerID: Yup.string().required("Customer Required"),
      invoiceID: Yup.string().required("Invoice Required"),
      date: Yup.string().required("Date Required"),
      transactionID: Yup.string().required("Transaction ID Required"),
      paymentMode: Yup.string().required("Payment Mode Required"),
      amount: Yup.number().required("Amount Required"),
    }),
    onSubmit: (values) => {},
  });
  const [allCustomers, setAllCustomers] = useState<Customer[]>([]);
  const [allInvoices, setAllInvoices] = useState<Invoice[]>([]);
  const { toast } = useToast();
  const { user } = useContext(userContext);
  const [date, setDate] = useState<Date>();

  console.log(formik.values);

  // setting duedate
  useEffect(() => {
    formik.setFieldValue("date", date);
  }, [date]);

  //calling create api
  const addPayment = () => {
    const formikErrors = Object.values(formik.errors);
    if (formikErrors.length > 0) {
      return toast({
        title: "Fill the form correctly",
        description: formikErrors.join(" , "),
      });
    }
    if (user?.token) {
      createPayment(user?.token, {
        paymentNo: formik.values.paymentNo,
        customerID: formik.values.customerID,
        invoiceID: formik.values.invoiceID,
        date: formik.values.date,
        transactionID: formik.values.transactionID,
        paymentMode: formik.values.paymentMode,
        amount: formik.values.amount,
      }).then((res) => {
        if (res.success) {
          // clear form values
          formik.resetForm();
          setOpen(false);
          toast({
            title: "Success",
            description: "Payment created successfully",
          });
        }
        if (res.error) {
          toast({
            title: "Error occured",
            description: res.error,
          });
        }
      });
    }
  };

  // fetch customers
  useEffect(() => {
    if (user?.token) {
      getCustomers(user?.token).then((res) => {
        if (res.success) {
          setAllCustomers(res.data.myCustomers);
        } else {
          toast({
            title: "Error occured",
            description: res.error,
          });
        }
      });
    }
  }, [user]);

  // fetch Invoices
  useEffect(() => {
    if (user?.token) {
      getInvoices(user?.token).then((res) => {
        if (res.success) {
          setAllInvoices(res.data.Invoices);
        } else {
          toast({
            title: "Error occured",
            description: res.error,
          });
        }
      });
    }
  }, [user]);

  function padNumber(num: number | string) {
    let str = num.toString();
    let paddedStr = str.padStart(5, "0");
    return paddedStr;
  }

  return (
    <Dialog open={open}>
      {/* <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger> */}
      <DialogContent className="sm:max-w-[425px] ">
        <DialogHeader>
          <div className="">
            <DialogTitle>Add payment</DialogTitle>
            <Button
              variant="outline"
              className="absolute text-sm p-4 rounded-full scale-75 top-2 right-2"
              onClick={() => setOpen(!open)}
            >
              X
            </Button>
          </div>
          <DialogDescription>
            Add payments to users with equal or less authorization.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="paymentNo" className="text-right">
              Payment Number
            </Label>
            <Input
              id="paymentNo"
              className="col-span-3"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.paymentNo}
            />
          </div>

          {/* select Customer */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Customer
            </Label>
            <Select
              onValueChange={(value) => {
                formik.setFieldValue("customerID", value);
                formik.setFieldValue("invoiceID", "");
              }}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {allCustomers.map((user: any, key: any) => {
                    return (
                      <SelectItem value={user._id} key={key}>
                        {user.company}
                      </SelectItem>
                    );
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* select Invoice */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Invoice
            </Label>
            <Select
              onValueChange={(value) =>
                formik.setFieldValue("invoiceID", value)
              }
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {allInvoices.map((invoice: any, key: any) => {
                    return formik.values.customerID == invoice.customer.id ? (
                      <SelectItem value={invoice._id} key={key}>
                        INV-{padNumber(invoice.invoiceNumber)}
                      </SelectItem>
                    ) : null;
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* select Payment mode */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Payment Mode
            </Label>
            <Select
              onValueChange={(value) =>
                formik.setFieldValue("paymentMode", value)
              }
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="Cheque">Cheque</SelectItem>
                  <SelectItem value="Credit Card">Credit Card</SelectItem>
                  <SelectItem value="Debit Card">Debit Card</SelectItem>
                  <SelectItem value="Net Banking">Net Banking</SelectItem>
                  <SelectItem value="UPI">UPI</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Amount
            </Label>
            <Input
              id="amount"
              className="col-span-3"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.amount}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="transactionID" className="text-right">
              Transaction ID
            </Label>
            <Input
              id="transactionID"
              className="col-span-3"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.transactionID}
            />
          </div>

          {/* select Date */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">
              Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[280px] justify-start text-left font-normal",
                    !date && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  // onSelect={
                  //   (date) => setDate(date)
                  // }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <DialogFooter>
          <Button type="submit" onClick={addPayment}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DailogBox;
