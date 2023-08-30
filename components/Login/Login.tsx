"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import spinner from "../../public/svgs/spinner.svg";
import googleIcon from "@/public/svgs/google.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import userContext from "@/context/userContext";
import { setCookie, parseCookies } from "nookies";
import { getCookie } from "../../utils/getCookie";
import { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useToast } from "@/components/ui/use-toast";
import { getUser, userLogin } from "@/utils/apiRequests/authFunctions";
import { COOKIE_KEYS } from "@/utils/cookieEnums";

type Props = {};

const Login = (props: Props) => {
  useEffect(() => {
    if (user) {
      // router.push('/')
    }
  }, []);

  const initialValues = {
    email: "",
    password: "",
  };
  const formik = useFormik({
    initialValues,
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid Email").required("Email Required"),
      password: Yup.string()
        .min(6, "Password must be 6 char or more")
        .required("Password Required"),
    }),
    onSubmit: (values) => {},
  });
  const { toast } = useToast();
  const router = useRouter();
  const { user, setUser } = useContext(userContext);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    // call api here
    try {
      userLogin({
        email: formik.values.email,
        password: formik.values.password,
      }).then((res) => {
        if (res.success) {
          setCookie(null, COOKIE_KEYS.ACCESS_TOKEN, res.token, {
            maxAge: 30 * 24 * 60 * 60,
            path: "/",
          });
          try {
            let token = res.token;
            getUser(token).then((res) => {
              const data = res;
              setUser({
                ...data,
                token: token,
              });
              toast({
                title: "Login Success",
                description: res.message,
              });
              router.push("/");
            });
          } catch (error) {
            console.log("no user cookie found", error);
          }
        } else
          toast({
            title: "Error occured",
            description: res.error,
          });
      });
    } catch (error: any) {
      console.log(error);
      toast({
        title: "Login Failed",
        description: error,
      });
    }
  }

  return (
    <div className={cn("grid gap-6")} {...props}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.email}
            />
            <Label className="sr-only" htmlFor="password">
              password
            </Label>
            <Input
              id="password"
              placeholder="******"
              type="password"
              autoCapitalize="none"
              autoComplete="password"
              autoCorrect="off"
              disabled={isLoading}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.password}
            />
          </div>
          <Button disabled={isLoading}>
            {isLoading && (
              //   <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              <Image
                src={spinner}
                alt="spinner"
                width={20}
                height={20}
                className="mr-2 h-4 w-4 animate-spin"
              />
            )}
            Sign In
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Dont have an account ?
          </span>
        </div>
      </div>
      <Button
        type="button"
        variant="link"
        disabled={isLoading}
        onClick={() => router.push("/signup")}
      >
        {isLoading ? (
          //   <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          <Image
            src={spinner}
            alt="spinner"
            width={100}
            height={100}
            className="mr-2 h-4 w-4 animate-spin"
          />
        ) : null}{" "}
        Signup
      </Button>
    </div>
  );
};

export default Login;
