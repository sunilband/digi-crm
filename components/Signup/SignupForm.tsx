"use client";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import loginImage from "../../public/svgs/loginImage.svg";
import outerMandala from "../../public/svgs/outerMandala.svg";
import { UserAuthForm } from "./Signup";
import logo from "../../public/images/digiventryLogo.png";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication forms built using the components.",
};

export default function LoginForm() {
  return (
    <>
      <div className="w-screen flex justify-evenly items-center h-screen flex-wrap p-2">
        <div className="flex justify-center flex-col mt-20 sm:mt-0">
          {/* <div className='flex flex-col gap-1 justify-center text-center'>
          <h2 className='text-4xl font-bold tracking-wider'>Digi-CRM</h2>
          <p>Digiventry Technologies and Marketing PVT. LTD</p>
          </div> */}

          <Image
            src={logo}
            alt="loginImage"
            width={400}
            height={400}
            className="dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert hover:scale-105 transition-all duration-300 ease-in-out"
          />
        </div>
        <hr className="border h-80 hidden md:inline-block" />
        <div className="lg:p-8 ">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center mt-0 md:mt-24">
              <h1 className="text-2xl font-semibold tracking-tight">
                Create an account
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter your credentials below to create an account
              </p>
            </div>
            <UserAuthForm />
            <p className="px-8 text-center text-sm text-muted-foreground">
              By signing up, you agree to our{" "}
              <Link
                href="/terms"
                className="underline underline-offset-4 hover:text-primary"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="underline underline-offset-4 hover:text-primary"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
