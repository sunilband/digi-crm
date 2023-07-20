"use client";
import "./globals.css";
import Navbar from "../components/Navbar/Navbar";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
import { Toaster } from "@/components/ui/toaster";
import { useEffect, useState } from "react";
import userContext from "../context/userContext";
import { UserInterface } from "../context/userContext";

import clsx from "clsx";
import Dailog from "@/components/Dailog/Dailog";
import { setCookie, parseCookies } from "nookies";
import { getCookie } from "@/utils/getCookie";
import { COOKIE_KEYS } from "@/utils/cookieEnums";
import { useRouter } from "next/navigation";
import { getUser } from "@/utils/apiRequests/authFunctions";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

// export const metadata: Metadata = {
//   title: 'Create Next App',
//   description: 'Generated by create next app',
// }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const page = usePathname();
  // set user context state
  const [user, setUser] = useState<UserInterface | null>(null);
  // set token state
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // checking if user in cookies
    const cookies = parseCookies();
    const tokenData = cookies.accessToken ? cookies.accessToken : null;
    if(page==='/')
    {
      if (tokenData === null) {
        router.push("/login");
      }
  
      if (tokenData !== null && token === null) {
        setToken(tokenData);
      }
  
      if (token) {
        try {
          getUser(token).then((res) => {
            if (!res) {
              router.push("/login");
            }
            if(res!==undefined){
              const data = res;
              setUser({
               ...data
              });
              router.push("/");
            }
            console.log("user data", user)
          });
        } catch (error) {
          console.log("no user cookie found", error);
        }
      }
    }
    
  }, [token]);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={clsx(inter.className)}>
        <userContext.Provider value={{ user, setUser }}>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <Navbar />
            {children}
            <Toaster />
          </ThemeProvider>
        </userContext.Provider>
      </body>
    </html>
  );
}
