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
import { getGroups } from "@/utils/apiRequests/sales functions/ItemFunctions";
import { UserInterface } from "@/context/userContext";
import userContext from "@/context/userContext";
import { useContext } from "react";
import { useToast } from "@/components/ui/use-toast";
import { createItem } from "@/utils/apiRequests/sales functions/ItemFunctions";
import { useFormik } from "formik";
import * as Yup from "yup";

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const DailogBox = ({ open, setOpen }: Props) => {
  const initialValues = {
    desc: "",
    longDesc: "",
    rateValue: "",
    currency: "",
    tax1: "",
    tax2: "",
    unit: "",
    groupName: "",
  };

  const formik = useFormik({
    initialValues,
    validationSchema: Yup.object({
      desc: Yup.string().required("Description is required"),
      longDesc: Yup.string().required("Details are required"),
      rateValue: Yup.number().required("Rate is required"),
      currency: Yup.string().required("Currency is required"),
      tax1: Yup.number().required("Tax 1 is required"),
      tax2: Yup.number().required("Tax 2 "),
      unit: Yup.string().required("Unit is required"),
      groupName: Yup.string().required("Group is required"),
    }),
    onSubmit: (values) => {},
  });
  interface Group {
    name: string;
    createdAt: Date;
    createdBy: {
      name: string;
      id: string;
    };
  }

  const [allGroups, setAllGroups] = useState<Group[]>([]);
  const { toast } = useToast();
  const { user } = useContext(userContext);
  const [date, setDate] = useState<Date>();

  const [Item, setItem] = useState<any>({
    desc: "",
    longDesc: "",
    rateValue: "",
    currency: "",
    tax1: "",
    tax2: "",
    unit: "",
    groupName: "",
  });

  //calling create api
  const addItem = () => {
    const formikErrors = Object.values(formik.errors);
    if (formikErrors.length > 0) {
      return toast({
        title: "Fill the form correctly",
        description: formikErrors.join(" , "),
      });
    }
    if (user?.token) {
      createItem(user?.token, {
        desc: formik.values.desc,
        longDesc: formik.values.longDesc,
        rateValue: formik.values.rateValue,
        currency: formik.values.currency,
        tax1: formik.values.tax1,
        tax2: formik.values.tax2,
        unit: formik.values.unit,
        groupName: formik.values.groupName,
      }).then((res) => {
        if (res.success) {
          // clear form values
          formik.resetForm();
          setOpen(false);
          toast({
            title: "Success",
            description: "Item created successfully",
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
      getGroups(user?.token).then((res: any) => {
        if (res.success) {
          setAllGroups(res.data.myItems);
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
      <DialogContent className="sm:max-w-[425px] ">
        <DialogHeader>
          <div className="">
            <DialogTitle>Add Item</DialogTitle>
            <Button
              variant="outline"
              className="absolute text-sm p-4 rounded-full scale-75 top-2 right-2"
              onClick={() => setOpen(!open)}
            >
              X
            </Button>
          </div>
          <DialogDescription>Add Items to use in sales</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="desc" className="text-right">
              Description
            </Label>
            <Input
              id="desc"
              className="col-span-3"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.desc}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="longDesc" className="text-right">
              Details
            </Label>
            <Input
              id="longDesc"
              className="col-span-3"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.longDesc}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Group
            </Label>
            <Select
              onValueChange={(value) =>
                formik.setFieldValue("groupName", value)
              }
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {allGroups.map((group: any, key: any) => {
                    return (
                      <SelectItem value={group.name} key={key}>
                        {group.name}
                      </SelectItem>
                    );
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="rateValue" className="text-right">
              Rate
            </Label>
            <Input
              id="rateValue"
              className="col-span-3"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.rateValue}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Currency
            </Label>
            <Select
              onValueChange={(value) => formik.setFieldValue("currency", value)}
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

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="unit" className="text-right">
              Unit
            </Label>
            <Input
              id="unit"
              className="col-span-3"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.unit}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Tax 1
            </Label>
            <Select
              onValueChange={(value) => formik.setFieldValue("tax1", value)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="30">30</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Tax 2
            </Label>
            <Select
              onValueChange={(value) => formik.setFieldValue("tax2", value)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="30">30</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button type="submit" onClick={addItem}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DailogBox;
