import * as React from "react";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import userContext from "@/context/userContext";
import { useContext } from "react";
import { ThemeButton } from "../ThemeButton/ThemeButton";
import { signOut } from "firebase/auth";
import { destroyCookie } from "nookies";
import { COOKIE_KEYS } from "@/utils/cookieEnums";
import Avatar from "react-avatar";
import { usePathname } from "next/navigation";
import { useRouter } from 'next/navigation'
import Link from "next/link";


function Navbar() {
  const router = useRouter();
  const page = usePathname();
  const routes = ["/login", "/signup","/adminsignup"];
  const { setUser, user } = useContext(userContext);
  console.log("user from nav",user)
  const logout = () => {
  destroyCookie(null, COOKIE_KEYS.ACCESS_TOKEN);
  setUser(null); 
  };

  return (
    <div className="flex justify-center absolute left-0 right-0 z-50 ">
      <NavigationMenu className="h-16 ">
        <NavigationMenuList>
          {!routes.includes(page) && (
            <NavigationMenuItem>
              <NavigationMenuTrigger className="bg-transparent hover:bg-transparent">
                Tools
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-6 border w-[300px] md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]
                ">

                  <Link href="/">
                  <ListItem  title="Dashboard">
                    View and control all your essential data
                  </ListItem>
                  </Link>
                  
                  <Link href="/tasks">
                  <ListItem  title="Tasks">
                    Manage and track all your tasks and their progress
                  </ListItem>
                  </Link>

                   <Link href="/customers">
                  <ListItem  title="Customers">
                    Keep track of all your customers 
                  </ListItem>
                  </Link>

                  <Link href="/leads">
                  <ListItem  title="Leads">
                    Manage all your leads and their status
                  </ListItem>
                  </Link>

                  <Link href="/sales">
                  <ListItem  title="Sales">
                    Manage all your sales and their status
                  </ListItem>
                  </Link>

                  {user?.admin?
                  <Link href="/edituser">
                  <ListItem  title="Edit User">
                   Edit data of employees
                  </ListItem>
                  </Link>:null}

                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          )}

          {!routes.includes(page) ? (
            <NavigationMenuItem>
              <NavigationMenuTrigger className="bg-transparent hover:bg-transparent">
                User
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="flex justify-center items-center gap-4 p-6 w-[320px] md:w-[400px] lg:w-[400px] ">
                  <li className="flex flex-col justify-center items-center w-auto">
                    <div className="mb-2">
                      <Avatar
                        name={user?.name}
                        round={true}
                        size="70"
                        color="gray"
                      />
                    </div>

                    <ListItem
                      href="/docs"
                      title="Profile"
                      className="text-center w-64"
                    ></ListItem>
                    <ListItem
                      onClick={logout}
                      href="/"
                      title="Sign Out"
                      className="text-center text-[#EF4444] hover:text-[#EF4444] w-64"
                    ></ListItem>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          ) : null}

          {/* theme button */}
          <NavigationMenuItem>
            <ThemeButton />
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default Navbar;
