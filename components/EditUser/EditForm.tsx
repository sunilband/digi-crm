"use client";

import * as React from "react";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import spinner from "../../public/svgs/spinner.svg";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { setCookie, parseCookies } from "nookies";
import { getCookie } from "../../utils/getCookie";
import userContext from "@/context/userContext";
import { UserInterface } from "@/context/userContext";
import { useContext } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useToast } from "@/components/ui/use-toast";
import { adminSignup } from "@/utils/apiRequests/authFunctions";
import { getAllUsers, getManagers, updateUser } from "@/utils/apiRequests/adminFunctions";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const initialValues = {
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    department: "",
    role: "",
    manager:"",
    _id:"",
    managerID:"",
    managerName:""
  };

  const formik = useFormik({
    initialValues,
    validationSchema: Yup.object({
      firstname: Yup.string()
        .max(30, "Firstname should be 30 char or less")
        .required("First Name Required"),
      lastname: Yup.string()
        .max(30, "Lastname should be 30 char or less")
        .required("Last Name Required"),
      email: Yup.string().email("Invalid Email").required("Email Required"),
      phone: Yup.string()
        .min(10, "Phone number must be 10 char or more")
        .required("Phone number Required"),
      department: Yup.string().required("Department Required"),
      role: Yup.string().required("Role Required"),
      manager: Yup.string().required("Manager Required"),
      _id:Yup.string().required("_id required"),
      managerID: Yup.string().required("Manager ID Required"),
      managerName: Yup.string().required("Manager Name Required"),

    }),

    onSubmit: (values) => {},
  });

  const { toast } = useToast();
  const { user, setUser } = useContext(userContext);
  const router = useRouter();
  const page=usePathname()

  // if not admin redirect to main page
  useEffect(() => {
    if(!user?.admin)
    {
      toast({
        title: "Not an admin",
        description: "Admin privileges required",
      });
      router.push("/")
    }
  }, [user]);

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [allUsers, setAllUsers] = React.useState<UserInterface[]>([]);
  const [managers, setManagers] = React.useState<UserInterface[]>([]);
  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    const formikErrors = Object.values(formik.errors);
    if (formikErrors.length > 0) {
      toast({
        title: "Fill the form correctly",
        description: formikErrors.join(" , "),
      });
    } else {
      // call api here
      try {
        if(user?.token)
        updateUser(user?.token,{
          name: formik.values.firstname + " " + formik.values.lastname,
          email: formik.values.email,
          phone: formik.values.phone,
          department: formik.values.department,
          role: formik.values.role,
          manager: {
            name: formik.values.managerName,
            id: formik.values.managerID,
          },
          userID:formik.values._id
        }).then((res) => {
          if (res.success) {
            console.log(res);
            toast({
              title: "Success",
              description: res.message,
            });
          } 
          else
            toast({
              title: "Error occured",
              description: res.error,
            });
        });
      } catch (error: any) {
        console.log(error);
        toast({
          title: "Signup Failed",
          description: error,
        });
      }
    }
  }
  // fetching all users and managers
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

      // get managers
      getManagers(user?.token).then((res) => {
        if (res.success) {
          setManagers(res.data);
        } else {
          toast({
            title: "Error occured",
            description: res.error,
          });
        }
      });
    }

  }, []);

  // setting values as per user selected
  useEffect(() => {
    // @ts-ignore
    const selectedUser = allUsers.find((item) => item?._id === formik.values._id);
    console.log("selected user is",selectedUser)
      formik.setFieldValue('firstname',selectedUser?.name.split(' ')[0])
      formik.setFieldValue('lastname',selectedUser?.name.split(' ')[1])
      formik.setFieldValue('email',selectedUser?.email)
      formik.setFieldValue('phone',selectedUser?.phone)
      formik.setFieldValue('department',selectedUser?.department)
      formik.setFieldValue('role',selectedUser?.role)

  }, [formik.values._id]);

  // setting manager id
  useEffect(() => {
    console.log("manager is",formik.values.manager)
    // @ts-ignore
    const selectedManager = managers.find((item) => item?._id === formik.values.manager);
    console.log("selected manager is",selectedManager)
    formik.setFieldValue('managerID',selectedManager?.employeeID)
    formik.setFieldValue('managerName',selectedManager?.name)
  }, [formik.values.manager]);

  

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Select 
            onValueChange={(value) => formik.setFieldValue('_id',value)}  
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select User" />
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
            
            
            <div className="flex gap-1 mx">
              <Label className="sr-only" htmlFor="firstname">
                First Name
              </Label>
              <Input
                id="firstname"
                placeholder="First Name"
                type="text"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                disabled={true}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.firstname}
              />
              <Label className="sr-only" htmlFor="lastname">
                Last Name
              </Label>
              <Input
                id="lastname"
                placeholder="Last Name"
                type="text"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                disabled={true}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.lastname}
              />
            </div>

            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="Email"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.email}
            />

            <Select 
            onValueChange={(value) => formik.setFieldValue('manager',value)}  
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Manager" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {managers.map((manager: any, key: any) => {
                    return (
                      <SelectItem value={manager._id} key={key}>
                        {manager.name}
                      </SelectItem>
                    );
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>

            <div className="flex justify-center gap-1">
              <Select
                onValueChange={(value) => formik.setFieldValue("role", value)}
              >
                <SelectTrigger className="w-[50%]">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Intern">Intern</SelectItem>
                    <SelectItem value="Junior Developer">Junior Developer</SelectItem>
                    <SelectItem value="Senior Developer">Senior Developer</SelectItem>
                    <SelectItem value="Junior HR">Junior HR</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Select
                onValueChange={(value) =>
                  formik.setFieldValue("department", value)
                }
              >
                <SelectTrigger className="w-[50%]">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Frontend">Front End</SelectItem>
                    <SelectItem value="Backend">Back End</SelectItem>
                    <SelectItem value="Sales">Sales</SelectItem>
                    <SelectItem value="Hr">HR</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <Label className="sr-only" htmlFor="phone">
              Phone
            </Label>
            <Input
              id="phone"
              placeholder="Phone"
              type="text"
              disabled={isLoading}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.phone}
            />
          </div>
          <Button disabled={isLoading}>
            {isLoading && (
              <Image
                src={spinner}
                alt="spinner"
                width={20}
                height={20}
                className="mr-2 h-4 w-4 animate-spin"
              />
            )}
            Update user
          </Button>
        </div>
      </form>
      
    </div>
  );
}
