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
import { auth, provider } from "../../firebase/firebase";
import { destroyCookie } from "nookies";
import { COOKIE_KEYS } from "@/utils/cookieEnums";
import Avatar from "react-avatar";
import { usePathname } from "next/navigation";

function Navbar() {
  const page = usePathname();
  const routes = ["/login", "/signup"];
  const { setUser, user } = useContext(userContext);

  const logout = () => {
    signOut(auth)
      .then(() => {
        setUser(null);
        destroyCookie(null, COOKIE_KEYS.User, {
          path: "/",
        });
        console.log("User signed out");
      })
      .catch((error) => {
        console.log(error);
      });
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
                  <ListItem href="/how-to-use" title="Dashboard">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Nostrum eos sed beatae iure ipsam veritatis, eaque
                    voluptatum facere ullam accusantium?
                  </ListItem>
                  <ListItem href="/Disclaimer" title="Customers">
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                    Fuga, quas. Rerum, ipsa mollitia accusamus laborum
                    voluptatum possimus amet nesciunt architecto?
                  </ListItem>
                  <ListItem href="/Contact" title="Sales">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Non
                    nisi accusamus neque quibusdam incidunt aliquam repellendus
                    quos eius nemo error.{" "}
                  </ListItem>
                  <ListItem href="/about" title="Tasks">
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                    Aperiam blanditiis sint atque dignissimos cupiditate! Hic
                    quis eligendi nisi aut tempora?
                  </ListItem>
                  <ListItem href="/about" title="Leads">
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                    Aperiam blanditiis sint atque dignissimos cupiditate! Hic
                    quis eligendi nisi aut tempora?
                  </ListItem>
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
                        src={user?.image}
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
