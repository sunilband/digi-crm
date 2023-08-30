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
import { format, set } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getAllUsers } from "@/utils/apiRequests/adminFunctions";
import { UserInterface } from "@/context/userContext";
import userContext from "@/context/userContext";
import { useContext } from "react";
import { useToast } from "@/components/ui/use-toast";
import { createInvoice } from "@/utils/apiRequests/sales functions/InvoiceFunctions";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getCustomers } from "@/utils/apiRequests/customerFunctions";
import { getLeads } from "@/utils/apiRequests/LeadsFunction";
import { getItems } from "@/utils/apiRequests/sales functions/ItemFunctions";
import { Switch } from "@/components/ui/switch";
type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const DailogBox = ({ open, setOpen }: Props) => {
  const initialValues = {
    customerID: "",
    date: "",
    expiryDate: "",
    currency: "",
    discountType: "No Discount",
    tags: "N/A",
    status: "",
    saleAgent: "",
    recurringInvoice: "No",
    paymentMode: "Net Banking",
    streetBill: "",
    cityBill: "",
    stateBill: "",
    zipBill: "",
    countryBill: "",
    streetShip: "",
    cityShip: "",
    stateShip: "",
    zipShip: "",
    countryShip: "",
    invoiceNumber: "",
    reference: "",
    adminNote: "",
    clientNote: "",
    terms: "",
    totalDiscountType: "",
    value: "0",
    adjustment: "0",
  };

  const [sameAddress, setSameAddress] = useState(true);

  const formik = useFormik({
    initialValues,
    validationSchema: Yup.object(
      !sameAddress
        ? {
            customerID: Yup.string().required("Customer ID Required"),
            date: Yup.string().required("Date Required"),
            expiryDate: Yup.string().required("Open Till Required"),
            currency: Yup.string().required("currency Required"),
            discountType: Yup.string().required("Discount Type Required"),
            tags: Yup.string().required("Tags Required"),
            status: Yup.string().required("Status Required"),
            saleAgent: Yup.string().required("Assigned to Required"),
            recurringInvoice: Yup.string().required(
              "Recurring Invoice Required",
            ),
            paymentMode: Yup.string().required("Payment Mode Required"),
            streetBill: Yup.string().required("Street Required"),
            cityBill: Yup.string().required("City Required"),
            stateBill: Yup.string().required("State Required"),
            zipBill: Yup.string().required("Zip Required"),
            countryBill: Yup.string().required("Country Required"),
            streetShip: Yup.string().required(
              "Shipping Street address Required",
            ),
            cityShip: Yup.string().required("Shipping City Required"),
            stateShip: Yup.string().required("Shipping State Required"),
            zipShip: Yup.number().required("Shipping Zip Required"),
            countryShip: Yup.string().required("Shipping Country Required"),
            invoiceNumber: Yup.string().required("Invoice Number Required"),
            reference: Yup.string().required("Reference Required"),
            adminNote: Yup.string().required("Admin Note Required"),
            clientNote: Yup.string().required("Client Note Required"),
            terms: Yup.string().required("Terms Required"),
            totalDiscountType: Yup.string().required(
              "total discount type Required",
            ),
            value: Yup.string().required("Value Required"),
            adjustment: Yup.string().required("adjustment Required"),
          }
        : {
            customerID: Yup.string().required("Customer ID Required"),
            date: Yup.string().required("Date Required"),
            expiryDate: Yup.string().required("Open Till Required"),
            currency: Yup.string().required("currency Required"),
            discountType: Yup.string().required("Discount Type Required"),
            tags: Yup.string().required("Tags Required"),
            status: Yup.string().required("Status Required"),
            saleAgent: Yup.string().required("Assigned to Required"),
            recurringInvoice: Yup.string().required(
              "Recurring Invoice Required",
            ),
            paymentMode: Yup.string().required("Payment Mode Required"),
            streetBill: Yup.string().required("Street Required"),
            cityBill: Yup.string().required("City Required"),
            stateBill: Yup.string().required("State Required"),
            zipBill: Yup.number().required("Zip Required"),
            countryBill: Yup.string().required("Billing Country Required"),
            invoiceNumber: Yup.string().required("Invoice Number Required"),
            reference: Yup.string().required("Reference Required"),
            adminNote: Yup.string().required("Admin Note Required"),
            clientNote: Yup.string().required("Client Note Required"),
            terms: Yup.string().required("Terms Required"),
            totalDiscountType: Yup.string().required(
              "total discount type Required",
            ),
            value: Yup.string().required("Value Required"),
            adjustment: Yup.string().required("adjustment Required"),
          },
    ),
    onSubmit: (values) => {},
  });
  const [allUsers, setAllUsers] = useState<UserInterface[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const { toast } = useToast();
  const { user } = useContext(userContext);
  const [date, setDate] = useState<Date>();
  const [OpenTilldate, setOpenTillDate] = useState<Date>();
  const [refresh, setRefresh] = useState(false);
  const [subTotal, setSubTotal] = useState(0);

  // calculate subtotal
  useEffect(() => {
    const tempItems = selectedItems.map((item) => {
      return { ...item, data: items.find((i) => i._id === item.id) };
    });

    const data = {
      tempItems,
      discount: {
        totalDiscountType: formik.values.totalDiscountType,
        value: formik.values.value,
        adjustment: formik.values.adjustment,
      },
    };

    let total = 0;
    for (let item of data.tempItems) {
      let itemTotal = parseFloat(item.rate) * parseFloat(item.quantity);
      let taxAmount = itemTotal * (parseFloat(item.tax) / 100);
      let ItemTotal = itemTotal + taxAmount;
      // change conversion rate here
      if (item.data.rate.currency === "INR") {
        const conversionRate = 0.013; // 1 INR = 0.013 USD
        ItemTotal *= conversionRate;
      }
      total += ItemTotal;
    }

    if (data.discount.totalDiscountType === "Percentage") {
      // total -= total * (parseFloat(data.discount.value )/ 100);
      total -= total * (parseFloat(formik.values.value) / 100);
    } else if (data.discount.totalDiscountType === "Amount") {
      // total -= parseFloat(data.discount.value);\
      total -= parseFloat(formik.values.value);
    }

    total += parseFloat(formik.values.adjustment);
    total = parseFloat(total.toFixed(4));
    setSubTotal(total);
  }, [
    selectedItems,
    formik.values.adjustment,
    formik.values.value,
    formik.values.totalDiscountType,
    refresh,
  ]);

  useEffect(() => {
    if (user?.token) {
      getCustomers(user?.token).then((res) => {
        if (res.success) {
          setCustomers(res.data.myCustomers);
        } else {
          toast({
            title: "Error occured",
            description: res.error,
          });
        }
      });
    }
    if (user?.token) {
      getLeads(user?.token).then((res) => {
        if (res.success) {
          setLeads(res.data.myLeads);
        } else {
          toast({
            title: "Error occured",
            description: res.error,
          });
        }
      });
    }

    if (user?.token) {
      getItems(user?.token).then((res) => {
        if (res.success) {
          setItems(res.data.myItems);
        } else {
          toast({
            title: "Error occured",
            description: res.error,
          });
        }
      });
    }
  }, [user]);

  // setting date
  useEffect(() => {
    formik.setFieldValue("date", date);
  }, [date]);

  // setting open till date
  useEffect(() => {
    formik.setFieldValue("expiryDate", OpenTilldate);
  }, [OpenTilldate]);

  //calling create api
  const addInvoice = () => {
    const formikErrors = Object.values(formik.errors);

    if (formikErrors.length > 0) {
      return toast({
        title: "Fill the form correctly",
        description: formikErrors.join(" , "),
      });
    }

    if (user?.token) {
      createInvoice(user?.token, {
        customerID: formik.values.customerID,
        date: formik.values.date,
        expiryDate: formik.values.expiryDate,
        currency: formik.values.currency,
        tags:
          formik.values.tags !== ""
            ? [...formik.values.tags.split(",")]
            : ["N/A"],
        billingAddress: {
          street: formik.values.streetBill,
          city: formik.values.cityBill,
          state: formik.values.stateBill,
          zip: formik.values.zipBill,
          country: formik.values.countryBill,
        },
        shippingAddress: {
          street: sameAddress
            ? formik.values.streetBill
            : formik.values.streetShip,
          city: sameAddress ? formik.values.cityBill : formik.values.cityShip,
          state: sameAddress
            ? formik.values.stateBill
            : formik.values.stateShip,
          zip: sameAddress ? formik.values.zipBill : formik.values.zipShip,
          country: sameAddress
            ? formik.values.countryBill
            : formik.values.countryShip,
        },
        status: formik.values.status,
        saleAgent: formik.values.saleAgent,
        paymentMode: formik.values.paymentMode,
        recurringInvoice: formik.values.recurringInvoice,
        invoiceNumber: formik.values.invoiceNumber,
        reference: formik.values.reference,
        adminNote: formik.values.adminNote,
        clientNote: formik.values.clientNote,
        terms: formik.values.terms,
        discountType: formik.values.discountType,
        totalDiscountType: formik.values.totalDiscountType,
        value: formik.values.value,
        adjustment: formik.values.adjustment,
        items: selectedItems,
      }).then((res) => {
        if (res.success) {
          // clear form values
          formik.resetForm();
          setOpen(false);
          toast({
            title: "Success",
            description: "Invoice created successfully",
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

  useEffect(() => {
    if (user?.token) {
      getAllUsers(user?.token).then((res) => {
        if (res.success) {
          setAllUsers(res.data);
        } else {
          toast({
            title: "Error occured",
            description: res.error,
          });
        }
      });
    }
  }, [user]);

  return (
    <Dialog open={open}>
      {/* <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger> */}
      <DialogContent className="sm:max-w-[80vw] max-h-[90vh] ">
        <DialogHeader>
          <div className="">
            <DialogTitle>Add invoice</DialogTitle>
            <Button
              variant="outline"
              className="absolute text-sm p-4 rounded-full scale-75 top-2 right-2"
              onClick={() => setOpen(!open)}
            >
              X
            </Button>
          </div>
          <DialogDescription>
            Add invoices to users with equal or less authorization.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-around">
          <div
            className={`grid gap-4 py-4 w-[40%] ${
              sameAddress ? "h-[42%]" : "h-[33%]"
            }  pr-3 overflow-y-scroll`}
          >
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="invoiceNumber" className="text-right">
                Invoice Number
              </Label>
              <Input
                id="invoiceNumber"
                className="col-span-3"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.invoiceNumber}
              />
            </div>

            {/* select customer */}

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Select Customer
              </Label>
              <Select
                onValueChange={(value) =>
                  formik.setFieldValue("customerID", value)
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {customers.map((item, key) => {
                      return (
                        <SelectItem value={item._id} key={key}>
                          {item.company}
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* date */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "col-span-3 justify-start text-left font-normal",
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
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* open till date */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Expiry date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "col-span-3 justify-start text-left font-normal",
                      !date && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {OpenTilldate ? (
                      format(OpenTilldate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={OpenTilldate}
                    onSelect={setOpenTillDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* currency */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Currency
              </Label>
              <Select
                onValueChange={(value) =>
                  formik.setFieldValue("currency", value)
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="INR">INR</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* discount type */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Discount Type
              </Label>
              <Select
                onValueChange={(value) =>
                  formik.setFieldValue("discountType", value)
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Before Tax">Before Tax</SelectItem>
                    <SelectItem value="After Tax">After Tax</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* tags */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tags" className="text-right">
                Tags
              </Label>
              <Input
                id="tags"
                className="col-span-3"
                placeholder="Enter tags seperated by comma"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.tags}
              />
            </div>

            {/* Reference */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reference" className="text-right">
                Reference #
              </Label>
              <Input
                id="reference"
                className="col-span-3"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.reference}
              />
            </div>

            {/* status */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Status
              </Label>
              <Select
                onValueChange={(value) => formik.setFieldValue("status", value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Overdue">Overdue</SelectItem>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Unpaid">Unpaid</SelectItem>
                    <SelectItem value="Not Sent">Not Sent</SelectItem>
                    <SelectItem value="Partially Paid">
                      Partially Paid
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* select user */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Sale agent
              </Label>
              <Select
                onValueChange={(value) =>
                  formik.setFieldValue("saleAgent", value)
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {allUsers.map((user: any, key: any) => {
                      return (
                        <SelectItem value={user._id} key={key}>
                          {user.name}
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Payment MOde */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Payment mode
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

            {/* recurring  */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Recurring Invoice
              </Label>
              <Select
                onValueChange={(value) =>
                  formik.setFieldValue("recurringInvoice", value)
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="No">No</SelectItem>
                    <SelectItem value="Every 1 month">Every 1 month</SelectItem>
                    <SelectItem value="Every 2 months">
                      Every 2 months
                    </SelectItem>
                    <SelectItem value="Every 3 months">
                      Every 3 months
                    </SelectItem>
                    <SelectItem value="Every 4 months">
                      Every 4 months
                    </SelectItem>
                    <SelectItem value="Every 5 months">
                      Every 5 months
                    </SelectItem>
                    <SelectItem value="Every 6 months">
                      Every 6 months
                    </SelectItem>
                    <SelectItem value="Every 7 months">
                      Every 7 months
                    </SelectItem>
                    <SelectItem value="Every 8 months">
                      Every 8 months
                    </SelectItem>
                    <SelectItem value="Every 9 months">
                      Every 9 months
                    </SelectItem>
                    <SelectItem value="Every 10 months">
                      Every 10 months
                    </SelectItem>
                    <SelectItem value="Every 11 months">
                      Every 11 months
                    </SelectItem>
                    <SelectItem value="Every 12 months">
                      Every 12 months
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/*----------------- billing address ------------------*/}
            <div className="mt-1 border" />
            <p className="text-center">Billing Address</p>
            <div className="mb-1 border" />

            <div className="grid grid-cols-4 items-center gap-4">
              <p className="text-right col-span-3">
                Billing address same as shipping address
              </p>
              <div className="flex items-center space-x-2">
                <Switch
                  id="airplane-mode"
                  checked={sameAddress}
                  onCheckedChange={() => setSameAddress(!sameAddress)}
                />
              </div>
            </div>

            {/* street*/}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="streetBill" className="text-right">
                Street
              </Label>
              <Input
                id="streetBill"
                className="col-span-3"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.streetBill}
              />
            </div>

            {/* city */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cityBill" className="text-right">
                City
              </Label>
              <Input
                id="cityBill"
                className="col-span-3"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.cityBill}
              />
            </div>

            {/* state */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="stateBill" className="text-right">
                State
              </Label>
              <Input
                id="stateBill"
                className="col-span-3"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.stateBill}
              />
            </div>

            {/* zip */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="zipBill" className="text-right">
                Zip
              </Label>
              <Input
                id="zipBill"
                className="col-span-3"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.zipBill}
              />
            </div>

            {/* country */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="countryBill" className="text-right">
                Country
              </Label>
              <Input
                id="countryBill"
                className="col-span-3"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.countryBill}
              />
            </div>

            {/*----------------- shipping address ------------------*/}
            {!sameAddress && (
              <>
                <div className="mt-1 border" />
                <p className="text-center">Shipping Address</p>
                <div className="mb-1 border" />

                {/* street*/}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="streetShip" className="text-right">
                    Street
                  </Label>
                  <Input
                    id="streetShip"
                    className="col-span-3"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.streetShip}
                  />
                </div>

                {/* city */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="cityShip" className="text-right">
                    City
                  </Label>
                  <Input
                    id="cityShip"
                    className="col-span-3"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.cityShip}
                  />
                </div>

                {/* state */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="stateShip" className="text-right">
                    State
                  </Label>
                  <Input
                    id="stateShip"
                    className="col-span-3"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.stateShip}
                  />
                </div>

                {/* zip */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="zipShip" className="text-right">
                    Zip
                  </Label>
                  <Input
                    id="zipShip"
                    className="col-span-3"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.zipShip}
                  />
                </div>

                {/* country */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="countryShip" className="text-right">
                    Country
                  </Label>
                  <Input
                    id="countryShip"
                    className="col-span-3"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.countryShip}
                  />
                </div>
              </>
            )}
            {/* GAP */}
            <div className="mt-1 border" />

            {/* Admin note */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="adminNote" className="text-right">
                Admin Note
              </Label>
              <Input
                id="adminNote"
                className="col-span-3"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.adminNote}
              />
            </div>

            {/* Client note */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="clientNote" className="text-right">
                Client Note
              </Label>
              <Input
                id="clientNote"
                className="col-span-3"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.clientNote}
              />
            </div>

            {/* terms */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="terms" className="text-right">
                Terms and Conditions
              </Label>
              <Input
                id="terms"
                className="col-span-3"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.terms}
              />
            </div>
          </div>

          {/* ----------------------------------divider -------------------------------------*/}
          <div className="border-2 h-96 mt-16"></div>
          {/* --------------------------------right side--------------------- */}
          <div className="flex flex-col gap-4 py-4 w-[40%] h-[50%]">
            {/* select Items */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Items
              </Label>
              <Select
                onValueChange={(value) =>
                  // setSelectedItems([...selectedItems, value])
                  setSelectedItems([
                    ...selectedItems,
                    {
                      id: value,
                      quantity: 1,
                      rate: 0,
                      tax: 0,
                    },
                  ])
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {items.map((item: any, key: any) => {
                      return (
                        <SelectItem value={item._id} key={key}>
                          {item.desc}
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              {/* <p className="text-center col-span-4 tracking-widest ">Items Cart</p> */}
              <div className="col-span-4 h-[200px] overflow-x-hidden overflow-y-auto pr-4 border p-2 rounded-md">
                {selectedItems.length !== 0 ? (
                  selectedItems.map((item, index) => {
                    return (
                      <div
                        key={index}
                        className="flex flex-col gap-2 col-span-4 items-between justify-between"
                      >
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="desc" className="text-right">
                            Description
                          </Label>
                          <Input
                            id="desc"
                            className="col-span-3"
                            value={
                              items.find(
                                (item: any) =>
                                  item._id === selectedItems[index].id,
                              )?.desc
                            }
                            disabled
                          />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="longDesc" className="text-right">
                            Long Description
                          </Label>
                          <Input
                            id="longDesc"
                            className="col-span-3"
                            value={
                              items.find(
                                (item: any) =>
                                  item._id === selectedItems[index].id,
                              )?.longDesc
                            }
                            disabled
                          />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="units" className="text-right">
                            Units (
                            {
                              items.find(
                                (item: any) =>
                                  item._id === selectedItems[index].id,
                              )?.unit
                            }
                            )
                          </Label>
                          <Input
                            id="units"
                            className="col-span-3"
                            onChange={(e) => {
                              selectedItems[index] = {
                                ...selectedItems[index],
                                quantity: e.target.value,
                              };
                              setRefresh(!refresh);
                            }}
                          />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="units" className="text-right">
                            Rate
                          </Label>
                          <Input
                            id="units"
                            className="col-span-3"
                            onChange={(e) => {
                              selectedItems[index] = {
                                ...selectedItems[index],
                                rate: e.target.value,
                              };
                              setRefresh(!refresh);
                            }}
                          />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="units" className="text-right">
                            Tax
                          </Label>
                          <Input
                            id="units"
                            className="col-span-3"
                            onChange={(e) => {
                              selectedItems[index] = {
                                ...selectedItems[index],
                                tax: e.target.value,
                              };
                              setRefresh(!refresh);
                            }}
                          />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="units" className="text-right"></Label>
                          {/* create a button that will remove item from selectedItems */}
                          <Button
                            variant="destructive"
                            className="col-span-3"
                            onClick={() => {
                              selectedItems.splice(index, 1);
                              setRefresh(!refresh);
                            }}
                          >
                            Remove
                          </Button>
                        </div>

                        {/* border */}
                        <div className="border w-72 my-4 self-center" />
                      </div>
                    );
                  })
                ) : (
                  <p className="text-center">No items added</p>
                )}
              </div>

              {/* total */}
              <div className="col-span-4 h-52 mt-4 flex flex-col gap-4">
                <p className="text-center tracking-widest">
                  Subtotal :{" "}
                  <span className="text-green-500">{subTotal} USD</span>
                </p>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="value" className="text-right">
                    Discount
                  </Label>
                  <Input
                    id="value"
                    className="col-span-3"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.value}
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Discount type
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      formik.setFieldValue("totalDiscountType", value)
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="Percentage">Percentage</SelectItem>
                        <SelectItem value="Amount">Amount</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="adjustment" className="text-right">
                    Adjustment
                  </Label>
                  <Input
                    id="adjustment"
                    className="col-span-3"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.adjustment}
                  />
                </div>
                <Button type="submit" onClick={addInvoice}>
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>
        {/* 
        <DialogFooter>
          
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
};

export default DailogBox;
