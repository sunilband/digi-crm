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
import { languages, currencies } from "../data";
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
import { useFormik } from "formik";
import * as Yup from "yup";
import { createCustomer } from "@/utils/apiRequests/customerFunctions";
//
import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
];

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const DailogBox = ({ open, setOpen }: Props) => {
  const initialValues = {
    company: "",
    vat: "",
    phone: "",
    website: "",
    currency: "",
    language: "",
    status: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    groups: "",
  };

  const formik = useFormik({
    initialValues,
    validationSchema: Yup.object({
      company: Yup.string().required("Company is required"),
      vat: Yup.string().required("Vat is required"),
      phone: Yup.string().required("Phone is required"),
      website: Yup.string().required("Website is required"),
      currency: Yup.string().required("Currency is required"),
      language: Yup.string().required("Language is required"),
      status: Yup.string().required("Status is required"),
      email: Yup.string()
        .email("Enter valid email")
        .required("Email is required"),
      street: Yup.string().required("Street is required"),
      city: Yup.string().required("City is required"),
      state: Yup.string().required("State is required"),
      zip: Yup.string().required("Zip is required"),
      country: Yup.string().required("Country is required"),
      groups: Yup.string(),
    }),
    onSubmit: (values) => {},
  });
  const [allUsers, setAllUsers] = useState<UserInterface[]>([]);
  const { toast } = useToast();
  const { user } = useContext(userContext);
  const [date, setDate] = useState<Date>();
  const [dailogOpen, setdailogOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  // setting duedate
  useEffect(() => {
    formik.setFieldValue("lastContacted", date);
  }, [date]);

  //calling create api
  const addTask = () => {
    const formikErrors = Object.values(formik.errors);
    if (formikErrors.length > 0) {
      return toast({
        title: "Fill the form correctly",
        description: formikErrors.join(" , "),
      });
    }
    if (user?.token) {
      createCustomer(user?.token, {
        company: formik.values.company,
        vat: formik.values.vat,
        phone: formik.values.phone,
        website: formik.values.website,
        currency: formik.values.currency,
        language: formik.values.language,
        status: formik.values.status,
        email: formik.values.email,
        address: {
          street: formik.values.street,
          city: formik.values.city,
          state: formik.values.state,
          zip: formik.values.zip,
          country: formik.values.country,
        },
        groups:
          formik.values.groups !== ""
            ? [...formik.values.groups.split(",")]
            : ["N/A"],
      }).then((res) => {
        if (res.success) {
          // clear form values
          formik.resetForm();
          setOpen(false);
          toast({
            title: "Success",
            description: "Task created successfully",
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
      <DialogContent className="sm:max-w-[500px] ">
        <DialogHeader>
          <div className="">
            <DialogTitle>Add Lead</DialogTitle>
            <Button
              variant="outline"
              className="absolute text-sm p-4 rounded-full scale-75 top-2 right-2"
              onClick={() => setOpen(!open)}
            >
              X
            </Button>
          </div>
          <DialogDescription>
            Add Leads to users with equal or less authorization.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          {/* first row */}
          <div className="flex justify-center gap-8">
            <div className="flex flex-start flex-col gap-2 items-start">
              <Label htmlFor="company" className="text-start">
                Company
              </Label>
              <Input
                id="company"
                className="w-52"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.company}
              />
            </div>
            <div className="flex flex-start flex-col gap-2 items-start">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                className="w-52"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.email}
              />
            </div>
          </div>

          {/* second row */}
          <div className="flex justify-center gap-8">
            <div className="flex flex-start flex-col gap-2 items-start">
              <Label htmlFor="phone" className="text-right">
                Phone
              </Label>
              <Input
                id="phone"
                className="w-52"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.phone}
              />
            </div>
            <div className="flex flex-start flex-col gap-2 items-start">
              <Label htmlFor="website" className="text-right">
                Website
              </Label>
              <Input
                id="website"
                className="w-52"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.website}
              />
            </div>
          </div>

          {/* third row */}
          <div className="flex justify-center gap-8">
            <div className="flex flex-start flex-col gap-2 items-start">
              <Label htmlFor="vat" className="text-right">
                VAT
              </Label>
              <Input
                id="vat"
                className="w-52"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.vat}
              />
            </div>
            <div className="flex flex-start flex-col gap-2 items-start">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select
                onValueChange={(value) => formik.setFieldValue("status", value)}
              >
                <SelectTrigger className="w-52">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* fourth row */}
          <div className="flex justify-center gap-8">
            <Popover>
              <div className="flex flex-start flex-col gap-2 items-start">
                <Label htmlFor="website" className="text-right">
                  Address
                </Label>
                <PopoverTrigger asChild className="w-52">
                  <Button variant="outline">Click to fill</Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium leading-none">Address</h4>
                      <p className="text-sm text-muted-foreground">
                        Fill the address fields
                      </p>
                    </div>
                    <div className="grid gap-2">
                      <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="street">Street</Label>
                        <Input
                          id="street"
                          defaultValue="100%"
                          className="col-span-2 h-8"
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                          value={formik.values.street}
                        />
                      </div>
                      <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          defaultValue="300px"
                          className="col-span-2 h-8"
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                          value={formik.values.city}
                        />
                      </div>
                      <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          defaultValue="25px"
                          className="col-span-2 h-8"
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                          value={formik.values.state}
                        />
                      </div>
                      <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="zip">Zip</Label>
                        <Input
                          id="zip"
                          defaultValue="none"
                          className="col-span-2 h-8"
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                          value={formik.values.zip}
                        />
                      </div>
                      <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="country">Country</Label>
                        <Input
                          id="country"
                          defaultValue="none"
                          className="col-span-2 h-8"
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                          value={formik.values.country}
                        />
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </div>
            </Popover>

            <div className="flex flex-start flex-col gap-2 items-start">
              <Label htmlFor="assignTo" className="text-right">
                Currency
              </Label>
              <Select
                onValueChange={(value) =>
                  formik.setFieldValue("currency", value)
                }
              >
                <SelectTrigger className="w-52">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {currencies.map((currency: any, key: any) => {
                      return (
                        <SelectItem value={currency} key={key}>
                          {currency}
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          {/* fifth row */}
          <div className="flex justify-center gap-8">
            <div className="flex flex-start flex-col gap-2 items-start">
              <Label htmlFor="groups" className="text-right">
                Groups
              </Label>
              <Input
                id="groups"
                className="w-52 placeholder:opacity-50"
                placeholder="Enter seperated by comma"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.groups}
              />
            </div>
            <div className="flex flex-start flex-col gap-2 items-start">
              <Label htmlFor="assignTo" className="text-right">
                Language
              </Label>
              <Select
                onValueChange={(value) =>
                  formik.setFieldValue("language", value)
                }
              >
                <SelectTrigger className="w-52">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {languages.map((language: any, key: any) => {
                      return (
                        <SelectItem value={language} key={key}>
                          {language}
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="submit" onClick={addTask}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DailogBox;
