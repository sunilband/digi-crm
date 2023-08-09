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
import { createProposal } from "@/utils/apiRequests/sales functions/proposalFunctions";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getCustomers } from "@/utils/apiRequests/customerFunctions";
import { getLeads } from "@/utils/apiRequests/LeadsFunction";
import { getItems } from "@/utils/apiRequests/sales functions/ItemFunctions";

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const DailogBox = ({ open, setOpen }: Props) => {
  const initialValues = {
    subject: "",
    related: "Customer",
    customerID: "",
    leadID: "",
    date: "",
    openTill: "",
    currency: "",
    discountType: "No Dicsount",
    tags: "N/A",
    status: "",
    assignedTo: "",
    to: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    email: "",
    phone: "",
    totalDiscountType: "",
    value: "0",
    adjustment: "0",
  };

  const formik = useFormik({
    initialValues,
    validationSchema: Yup.object({
      subject: Yup.string().required("Subject Required"),
      related: Yup.string().required("Related Required"),
      customerID: Yup.string().required("Customer ID Required"),
      leadID: Yup.string().required("Lead ID Required"),
      date: Yup.string().required("Date Required"),
      openTill: Yup.string().required("Open Till Required"),
      currency: Yup.string().required("currency Required"),
      discountType: Yup.string().required("Discount Type Required"),
      tags: Yup.string().required("Tags Required"),
      status: Yup.string().required("Status Required"),
      assignedTo: Yup.string().required("Assigned to Required"),
      to: Yup.string().required("To Required"),
      street: Yup.string().required("Street Required"),
      city: Yup.string().required("City Required"),
      state: Yup.string().required("State Required"),
      zip: Yup.string().required("Zip Required"),
      country: Yup.string().required("Country Required"),
      email: Yup.string()
        .email("Enter valid email")
        .required("Email is required"),
      phone: Yup.string().required("Phone Required"),
      totalDiscountType: Yup.string().required("total discount type Required"),
      value: Yup.string().required("Value Required"),
      adjustment: Yup.string().required("adjustment Required"),
    }),
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

  const [proposal, setProposal] = useState<any>({
    proposalName: "",
    proposalDesc: "",
    status: "",
    assignedTo: "",
    dueDate: date,
    priority: "",
    tags: "",
  });

  console.log(formik.values);
  // console.log("selected items",selectedItems);

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
    total = parseFloat(total.toFixed(2));
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
    formik.setFieldValue("openTill", OpenTilldate);
  }, [OpenTilldate]);

  //calling create api
  const addProposal = () => {
    const formikErrors = Object.values(formik.errors);

    if (formikErrors.length > 1) {
      return toast({
        title: "Fill the form correctly",
        description: formikErrors.join(" , "),
      });
    }

    if (user?.token) {
      formik.values.related == "Customer"
        ? createProposal(user?.token, {
            subject: formik.values.subject,
            related: formik.values.related,
            customerID: formik.values.customerID,
            date: formik.values.date,
            openTill: formik.values.openTill,
            currency: formik.values.currency,
            tags:
              formik.values.tags !== ""
                ? [...formik.values.tags.split(",")]
                : ["N/A"],
            status: formik.values.status,
            assignedTo: formik.values.assignedTo,
            to: formik.values.to,
            street: formik.values.street,
            city: formik.values.city,
            state: formik.values.state,
            zip: formik.values.zip,
            country: formik.values.country,
            email: formik.values.email,
            phone: formik.values.phone,
            discountType: formik.values.discountType,
            totalDiscountType: formik.values.totalDiscountType,
            value: formik.values.value,
            adjustment: formik.values.adjustment,
            items: selectedItems,
          }).then((res) => {
            if (res.success) {
              console.log(res);
              // clear form values
              formik.resetForm();
              setOpen(false);
              toast({
                title: "Success",
                description: "Proposal created successfully",
              });
            }
            if (res.error) {
              toast({
                title: "Error occured",
                description: res.error,
              });
            }
          })
        : createProposal(user?.token, {
            subject: formik.values.subject,
            related: formik.values.related,
            leadID: formik.values.leadID,
            date: formik.values.date,
            openTill: formik.values.openTill,
            currency: formik.values.currency,
            tags:
              formik.values.tags !== ""
                ? [...formik.values.tags.split(",")]
                : ["N/A"],
            status: formik.values.status,
            assignedTo: formik.values.assignedTo,
            to: formik.values.to,
            street: formik.values.street,
            city: formik.values.city,
            state: formik.values.state,
            zip: formik.values.zip,
            country: formik.values.country,
            email: formik.values.email,
            phone: formik.values.phone,
            discountType: formik.values.discountType,
            totalDiscountType: formik.values.totalDiscountType,
            value: formik.values.value,
            adjustment: formik.values.adjustment,
            items: selectedItems,
          }).then((res) => {
            if (res.success) {
              console.log(res);
              // clear form values
              formik.resetForm();
              setOpen(false);
              toast({
                title: "Success",
                description: "Proposal created successfully",
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
            <DialogTitle>Add proposal</DialogTitle>
            <Button
              variant="outline"
              className="absolute text-sm p-4 rounded-full scale-75 top-2 right-2"
              onClick={() => setOpen(!open)}
            >
              X
            </Button>
          </div>
          <DialogDescription>
            Add proposals to users with equal or less authorization.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-around">
          <div className="grid gap-4 py-4 w-[40%] h-[50%] pr-3 overflow-y-scroll">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="subject" className="text-right">
                Subject
              </Label>
              <Input
                id="subject"
                className="col-span-3"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.subject}
              />
            </div>
            {/* Related status */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Related
              </Label>
              <Select
                onValueChange={(value) =>
                  formik.setFieldValue("related", value)
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Customer">Customer</SelectItem>
                    <SelectItem value="Lead">Lead</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* select customer */}
            {formik.values.related === "Customer" && (
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
            )}
            {/* select lead */}
            {formik.values.related === "Lead" && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Select Lead
                </Label>
                <Select
                  onValueChange={(value) =>
                    formik.setFieldValue("leadID", value)
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {leads.map((item, key) => {
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
            )}

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
                Open Till
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
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Sent">Sent</SelectItem>
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="Revised">Revised</SelectItem>
                    <SelectItem value="Declined">Declined</SelectItem>
                    <SelectItem value="Accepted">Accepted</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* select user */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Assigned to
              </Label>
              <Select
                onValueChange={(value) =>
                  formik.setFieldValue("assignedTo", value)
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

            {/* to */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="to" className="text-right">
                To
              </Label>
              <Input
                id="to"
                className="col-span-3"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.to}
              />
            </div>
            {/*  street*/}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="street" className="text-right">
                Street
              </Label>
              <Input
                id="street"
                className="col-span-3"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.street}
              />
            </div>

            {/* city */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="city" className="text-right">
                City
              </Label>
              <Input
                id="city"
                className="col-span-3"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.city}
              />
            </div>

            {/* state */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="state" className="text-right">
                State
              </Label>
              <Input
                id="state"
                className="col-span-3"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.state}
              />
            </div>

            {/* zip */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="zip" className="text-right">
                Zip
              </Label>
              <Input
                id="zip"
                className="col-span-3"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.zip}
              />
            </div>

            {/* country */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="country" className="text-right">
                Country
              </Label>
              <Input
                id="country"
                className="col-span-3"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.country}
              />
            </div>

            {/* email */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                className="col-span-3"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.email}
              />
            </div>

            {/* phone */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Phone
              </Label>
              <Input
                id="phone"
                className="col-span-3"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.phone}
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
                <Button type="submit" onClick={addProposal}>
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
