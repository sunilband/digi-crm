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
import { UserInterface } from "@/context/userContext";
import userContext from "@/context/userContext";
import { useContext } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useFormik } from "formik";
import * as Yup from "yup";
import { createLead } from "@/utils/apiRequests/LeadsFunction";

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const DailogBox = ({ open, setOpen }: Props) => {
  const initialValues = {
    name: "",
    email: "",
    company: "",
    phone: "",
    value: "",
    status: "",
    source: "",
    assignedTo: "",
    lastContacted: "",
    tags: "",
  };

  const formik = useFormik({
    initialValues,
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string()
        .email("Enter valid email")
        .required("Email is required"),
      company: Yup.string().required("Company is required"),
      phone: Yup.string().required("Phone is required"),
      value: Yup.string().required("Value is required"),
      status: Yup.string().required("Status is required"),
      source: Yup.string().required("Source is required"),
      assignedTo: Yup.string().required("Assigned user is required"),
      lastContacted: Yup.string().required("Last contacted is required"),
      tags: Yup.string(),
    }),
    onSubmit: (values) => {},
  });
  const [allUsers, setAllUsers] = useState<UserInterface[]>([]);
  const { toast } = useToast();
  const { user } = useContext(userContext);
  const [date, setDate] = useState<Date>();

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
      createLead(user?.token, {
        name: formik.values.name,
        email: formik.values.email,
        company: formik.values.company,
        phone: formik.values.phone,
        value: formik.values.value,
        status: formik.values.status,
        source: formik.values.source,
        assignedTo: formik.values.assignedTo,
        lastContacted: formik.values.lastContacted,
        tags:
          formik.values.tags !== ""
            ? [...formik.values.tags.split(",")]
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
      <DialogContent className="sm:max-w-[500px]">
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
              <Label htmlFor="name" className="text-start">
                Name
              </Label>
              <Input
                id="name"
                className="w-52"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.name}
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
                    <SelectItem value="Customer">Customer</SelectItem>
                    <SelectItem value="Done">Done</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* third row */}
          <div className="flex justify-center gap-8">
            <div className="flex flex-start flex-col gap-2 items-start">
              <Label htmlFor="assignTo" className="text-right">
                Assign to
              </Label>
              <Select
                onValueChange={(value) =>
                  formik.setFieldValue("assignedTo", value)
                }
              >
                <SelectTrigger className="w-52">
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

            <div className="flex flex-start flex-col gap-2 items-start">
              <Label htmlFor="value" className="text-right">
                Value
              </Label>
              <Input
                id="value"
                className="w-52"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.value}
              />
            </div>
          </div>

          {/* fourth row */}
          <div className="flex justify-center gap-8">
            <div className="flex flex-start flex-col gap-2 items-start">
              <Label htmlFor="source" className="text-right">
                Source
              </Label>
              <Input
                id="source"
                className="w-52"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.source}
              />
            </div>

            {/* select Date */}
            <div className="flex flex-start flex-col gap-2 items-start">
              <Label htmlFor="lastContacted" className="text-right">
                Contacted
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-52 justify-start text-left font-normal",
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
          {/* fifth row */}
          <div className="flex justify-center gap-8">
            {/* set priority */}
            <div className="flex flex-start flex-col gap-2 items-start">
              <Label htmlFor="company" className="text-right">
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

            {/* set tags */}
            <div className="flex flex-start flex-col gap-2 items-start">
              <Label htmlFor="tags" className="text-right">
                Tags
              </Label>
              <Input
                id="tags"
                className="w-52 placeholder:opacity-50"
                placeholder="Enter seperated by comma"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.tags}
              />
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
