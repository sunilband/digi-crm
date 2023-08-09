import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import HomeIcon from "@/public/svgs/homeIcon.svg";
import TasksIcon from "@/public/svgs/TasksIcon.svg";
import CustomerIcon from "@/public/svgs/CustomerIcon.svg";
import LeadsIcon from "@/public/svgs/LeadsIcon.svg";
import SalesIcon from "@/public/svgs/SalesIcon.svg";
import EditUserIcon from "@/public/svgs/EditUserIcon.svg";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { ChevronsUpDown, Plus, X } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import userContext from "@/context/userContext";
import { useContext } from "react";
import Image from "next/image";
import logo from "@/public/images/digiventryLogo.png";

export function Sidebar() {
  const { setUser, user } = useContext(userContext);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [salesSectionOpen, setSalesSectionOpen] = React.useState(false);

  return (
    <Sheet
    // open={sidebarOpen}
    >
      <SheetTrigger asChild>
        <p className="bg-transparent hover:bg-transparent cursor-pointer font-medium tracking-wide dark:text-[#D8D8D9] dark:hover:bg-[#1b212b] bg-opacity-30 px-4 py-2 rounded-md">
          Tools
        </p>
      </SheetTrigger>

      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            <Image
              src={logo}
              alt="loginImage"
              width={200}
              height={100}
              className="dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert transition-all duration-300 ease-in-out "
            />
          </SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[80%] mt-2 rounded-md list-none tracking-wide">
          <div className="p-4 ">
            <Link href="/">
              <h3 className="dark:hover:bg-slate-800 hover:bg-slate-200 rounded-md p-2 w-full flex gap-2">
                <Image
                  src={HomeIcon}
                  height={20}
                  width={20}
                  alt="home"
                  className="dark:invert"
                ></Image>
                Dashboard
              </h3>
            </Link>
            {/* tasks section */}
            <Link href="/tasks">
              <h3 className="dark:hover:bg-slate-800 hover:bg-slate-200 rounded-md p-2 w-full flex gap-2">
                <Image
                  src={TasksIcon}
                  height={20}
                  width={20}
                  alt="home"
                  className="dark:invert"
                ></Image>
                Tasks
              </h3>
            </Link>
            {/* customer section */}
            <Link href="/customers">
              <h3 className="dark:hover:bg-slate-800 hover:bg-slate-200 rounded-md p-2 w-full flex gap-2">
                <Image
                  src={CustomerIcon}
                  height={20}
                  width={20}
                  alt="home"
                  className="dark:invert"
                ></Image>
                Customers
              </h3>
            </Link>
            {/* leads section */}
            <Link href="/leads">
              <h3 className="dark:hover:bg-slate-800 hover:bg-slate-200 rounded-md p-2 w-full flex gap-2">
                <Image
                  src={LeadsIcon}
                  height={20}
                  width={20}
                  alt="home"
                  className="dark:invert"
                ></Image>
                Leads
              </h3>
            </Link>
            {/* sales section */}
            <Collapsible
              open={salesSectionOpen}
              onOpenChange={setSalesSectionOpen}
              className="space-y-2"
            >
              <div className="flex items-center justify-between space-x-4 ">
                <CollapsibleTrigger asChild className="w-80">
                  <h3
                    className={`dark:hover:bg-slate-800 ${
                      salesSectionOpen ? "dark:bg-zinc-800" : null
                    } 
                    ${
                      salesSectionOpen ? "bg-zinc-300" : null
                    } hover:bg-slate-200 rounded-md p-2 w-full flex gap-2 items-center`}
                    onClick={() => setSalesSectionOpen(!salesSectionOpen)}
                  >
                    <Image
                      src={SalesIcon}
                      height={20}
                      width={20}
                      alt="home"
                      className="dark:invert"
                    ></Image>
                    Sales
                    <ChevronDown
                      className={`ml-1 h-3 w-3 transition duration-200 
                  ${salesSectionOpen ? "rotate-180" : null}
                  `}
                      aria-hidden="true"
                    />
                  </h3>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent className="rounded-md  px-4 py-2 ">
                <Link href="/sales/proposals">
                  <ListItem title="Proposals"></ListItem>
                </Link>

                <Link href="/sales/estimates">
                  <ListItem title="Estimates"></ListItem>
                </Link>

                <Link href="/sales/invoices">
                  <ListItem title="Invoices"></ListItem>
                </Link>

                <Link href="/sales/payments">
                  <ListItem title="Payments"></ListItem>
                </Link>

                <Link href="/sales/creditnotes">
                  <ListItem title="Credit Notes"></ListItem>
                </Link>

                <Link href="/sales/items">
                  <ListItem title="Items"></ListItem>
                </Link>
              </CollapsibleContent>
            </Collapsible>

            {user?.admin ? (
              <Link href="/edituser">
                <h3 className="dark:hover:bg-slate-800 hover:bg-slate-200 rounded-md p-2 w-full flex gap-2">
                  <Image
                    src={EditUserIcon}
                    height={20}
                    width={20}
                    alt="home"
                    className="dark:invert"
                  ></Image>
                  Edit user
                </h3>{" "}
              </Link>
            ) : null}
          </div>
        </ScrollArea>

        {/* <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" value="Pedro Duarte" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input id="username" value="@peduarte" className="col-span-3" />
          </div>
        </div> */}
        {/* <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Save changes</Button>
          </SheetClose>
        </SheetFooter> */}
      </SheetContent>
    </Sheet>
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
            className,
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
