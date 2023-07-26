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
import { getAllUsers} from "@/utils/apiRequests/adminFunctions";
import { UserInterface } from "@/context/userContext";
import userContext from "@/context/userContext";
import { useContext } from "react";
import { useToast } from "@/components/ui/use-toast";
import { create } from "domain";
import { createTask } from "@/utils/apiRequests/TasksFunctions";
import { useFormik } from "formik";
import * as Yup from "yup";

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const DailogBox = ({ open, setOpen }: Props) => {
  const initialValues = {
    taskName: "",
    taskDesc: "",
    status: "",
    assignedTo: "",
    dueDate: "",
    priority: "",
    tags: "",
  };

  const formik = useFormik({
    initialValues,
    validationSchema: Yup.object({
      taskName: Yup.string().required("Task name is required"),
      taskDesc: Yup.string().required("Task description is required"),
      status: Yup.string().required("Status is required"),
      assignedTo: Yup.string().required("Assigned user is required"),
      dueDate: Yup.string().required("Due date is required"),
      priority: Yup.string().required("Priority is required"),
      tags: Yup.string(),
    }),
    onSubmit: (values) => {},
  });
  const [allUsers, setAllUsers] = useState<UserInterface[]>([]);
  const { toast } = useToast();
  const { user } = useContext(userContext);
  const [date, setDate] = useState<Date>();

  const [task, setTask] = useState<any>({
    taskName: "",
    taskDesc: "",
    status: "",
    assignedTo: "",
    dueDate: date,
    priority: "",
    tags: "",
  });

  // setting duedate
  useEffect(() => {
    formik.setFieldValue("dueDate", date);
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
      
      createTask(user?.token, {
        taskName: formik.values.taskName,
        taskDesc: formik.values.taskDesc,
        status: formik.values.status,
        assignedTo: formik.values.assignedTo,
        dueDate: formik.values.dueDate,
        priority: formik.values.priority,
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
        if(res.error) {
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="">
            <DialogTitle>Add task</DialogTitle>
            <Button
              variant="outline"
              className="absolute text-sm p-4 rounded-full scale-75 top-2 right-2"
              onClick={() => setOpen(!open)}
            >
              X
            </Button>
          </div>
          <DialogDescription>
            Add tasks to users with equal or less authorization.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="taskName" className="text-right">
              Task Name
            </Label>
            <Input
              id="taskName"
              className="col-span-3"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.taskName}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="taskDesc" className="text-right">
              Description
            </Label>
            <Input
              id="taskDesc"
              className="col-span-3"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.taskDesc}
            />
          </div>

          {/* select status */}
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
                  <SelectItem value="Not Started">Not Started</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Testing">Testing</SelectItem>
                  <SelectItem value="Awaiting Feedback">
                    Awaiting Feedback
                  </SelectItem>
                  <SelectItem value="Complete">Complete</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* select user */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              User
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

          {/* select Date */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Due Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[280px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
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
          {/* set priority */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Priority
            </Label>
            <Select
              onValueChange={(value) => formik.setFieldValue("priority", value)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Urgent">Urgent</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* set tags */}
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
