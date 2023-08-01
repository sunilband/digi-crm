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
import { use, useEffect, useState } from "react";
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
import { create } from "domain";
import {
  createGroup,
  getGroups,
} from "@/utils/apiRequests/sales functions/ItemFunctions";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import { Check, ChevronsUpDown } from "lucide-react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const DailogBox = ({ open, setOpen }: Props) => {
  const initialValues = {
    name: "",
  };

  const formik = useFormik({
    initialValues,
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
    }),
    onSubmit: (values) => {},
  });
  const [allUsers, setAllUsers] = useState<UserInterface[]>([]);
  const { toast } = useToast();
  const { user } = useContext(userContext);
  const [date, setDate] = useState<Date>();
  const [existingGroups, setExistingGroups] = useState<any[]>([]);
  const [Group, setGroup] = useState<any>({
    name: "",
  });

  useEffect(() => {
    if (user?.token)
      getGroups(user?.token).then((res) => {
        setExistingGroups(res.data.myItems);
      });
  }, [user]);

  //calling create api
  const addGroup = () => {
    const formikErrors = Object.values(formik.errors);
    if (formikErrors.length > 0) {
      return toast({
        title: "Fill the form correctly",
        description: formikErrors.join(" , "),
      });
    }
    if (user?.token) {
      createGroup(user?.token, {
        name: formik.values.name,
      }).then((res) => {
        if (res.success) {
          // clear form values
          formik.resetForm();
          setOpen(false);
          toast({
            title: "Success",
            description: "Group created successfully",
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

  const [openPopover, setOpenPopover] = useState(false);
  const [value, setValue] = useState("");

  return (
    <Dialog open={open}>
      {/* <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger> */}
      <DialogContent className="sm:max-w-[425px] ">
        <DialogHeader>
          <div className="">
            <DialogTitle>Add Group</DialogTitle>
            <Button
              variant="outline"
              className="absolute text-sm p-4 rounded-full scale-75 top-2 right-2"
              onClick={() => setOpen(!open)}
            >
              X
            </Button>
          </div>
          <DialogDescription>Add a Group for use in items.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Search
            </Label>
            <Popover open={openPopover} onOpenChange={setOpenPopover}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="col-span-3 justify-between"
                >
                  Open
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="col-span-3 p-0">
                <Command>
                  <CommandInput placeholder="Search Existing..." />
                  <CommandEmpty>No framework found.</CommandEmpty>
                  <CommandGroup>
                    {existingGroups.map((group) => (
                      <CommandItem key={group.name}>
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            value === group.value ? "opacity-100" : "opacity-0",
                          )}
                        />
                        {group.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          <hr />
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              className="col-span-3"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.name}
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="submit" onClick={addGroup}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DailogBox;
