"use client";

import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Label } from "@/components/ui/label";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Customer } from "./data";
import { useEffect } from "react";
import userContext from "@/context/userContext";
import { useContext } from "react";
import {
  getCustomers,
  updateCustomer,
} from "@/utils/apiRequests/customerFunctions";
import { Separator } from "@/components/ui/separator";
import DailogBox from "@/components/CustomerSection/Dailog/Dailog";
import { cn } from "@/lib/utils";

const dateParser = (date: string) => {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString();
};
const timeParser = (date: string) => {
  const dateObj = new Date(date);
  return dateObj.toLocaleTimeString();
};
const addressParser = (address: any) => {
  const { street, city, state, country, zip } = address;
  return `${street}, ${city} , ${state}, ${zip}, ${country}`;
};

type Props = {};
const CustomerSection = (props: Props) => {
  const { toast } = useToast();
  const [section, setSection] = React.useState<string>("myCustomers");
  const [data, setData] = React.useState<Customer[]>([]);
  const [myCustomers, setMyCustomers] = React.useState<Customer[]>([]);
  const [assignedCustomers, setAssignedCustomers] = React.useState<Customer[]>(
    [],
  );
  const [CustomersTypes, setCustomersTypes] = React.useState<any>({
    Inactive: 0,
    Active: 0,
  });
  const [myCustomerstats, setMyCustomerstats] = React.useState<any>({});
  const [assignedCustomerstats, setAssignedCustomerstats] = React.useState<any>(
    {},
  );
  const { user } = useContext(userContext);
  const [refresh, setRefresh] = React.useState<boolean>(false);
  const [date, setDate] = React.useState<Date>();

  const columns: ColumnDef<Customer>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "serialNo",
      header: "No.",
      cell: ({ row }) => (
        <div className="capitalize ">
          {data.findIndex((task) => task._id === row.getValue("_id")) + 1}
        </div>
      ),
    },
    // {
    //   accessorKey: "name",
    //   header: "Name",
    //   cell: ({ row }) => (
    //     <div className="capitalize ">{row.getValue("name")}</div>
    //   ),
    // },
    {
      accessorKey: "company",
      header: "Company",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("company")}</div>
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Email
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("email")}</div>
      ),
    },

    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("phone")}</div>
      ),
    },
    {
      accessorKey: "address",
      header: "Address",
      cell: ({ row }) => (
        <div className="capitalize">
          {addressParser(row.getValue("address"))}
        </div>
      ),
    },
    // {
    //   accessorKey: "value",
    //   header: "Value",
    //   cell: ({ row }) => (
    //     <div className="capitalize">₹{row.getValue("value")}</div>
    //   ),
    // },
    // {
    //   accessorKey: "source",
    //   header: "Source",
    //   cell: ({ row }) => (
    //     <div className="capitalize">{row.getValue("source")}</div>
    //   ),
    // },
    // {
    //   accessorKey: section == "myCustomers" ? "assignedBy" : "assignedTo",
    //   header: section == "myCustomers" ? "Assigned By" : "Assigned To",
    //   cell: ({ row }) => (
    //     <>
    //       <div className="capitalize">
    //         {
    //           // @ts-ignore
    //           row.getValue(section == "myCustomers" ? "assignedBy" : "assignedTo")?.name
    //         }
    //       </div>
    //     </>
    //   ),
    // },
    // {
    //   accessorKey: "lastContacted",
    //   header: "Last Contacted",
    //   cell: ({ row }) => (
    //     <>
    //       {/* @ts-ignore */}
    //       <div className="capitalize">
    //         {dateParser(row.getValue("lastContacted"))}
    //       </div>
    //       {/* @ts-ignore */}
    //       <p className="capitalize text-xs">
    //         {timeParser(row.getValue("lastContacted"))}
    //       </p>
    //     </>
    //   ),
    // },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <div
          className={`capitalize text-center border p-[1px] flex justify-center items-center  ${
            row.getValue("status") == "Inactive"
              ? "bg-orange-500"
              : row.getValue("status") == "In Progress"
              ? "bg-sky-500"
              : row.getValue("status") == "Testing"
              ? "bg-black text-white dark:bg-white dark:text-black"
              : row.getValue("status") == "Customer"
              ? "bg-yellow-500"
              : row.getValue("status") == "Active"
              ? "bg-green-500"
              : null
          }`}
        >
          {row.getValue("status")}
        </div>
      ),
    },
    {
      accessorKey: "updateStatus",
      header: "Update Status",
      cell: ({ row }) => (
        <>
          <Select
            onValueChange={(value) => {
              setData(
                data.map((task) => {
                  if (task._id === row.getValue("_id")) {
                    // @ts-ignore
                    task.status = value;
                    return task;
                  } else return task;
                }),
              );
            }}
          >
            <SelectTrigger className="text-center">
              <SelectValue placeholder="Set " />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </>
      ),
    },
    {
      accessorKey: "groups",
      header: "Groups",
      cell: ({ row }) => (
        <>
          {/* @ts-ignore */}
          <div className="capitalize">{row.getValue("groups").join(" , ")}</div>
        </>
      ),
    },
    {
      accessorKey: "dateCreated",
      header: "Date Cretated",
      cell: ({ row }) => (
        <>
          {/* @ts-ignore */}
          <div className="capitalize">
            {dateParser(row.getValue("dateCreated"))}
          </div>
          {/* @ts-ignore */}
          <p className="capitalize text-xs">
            {timeParser(row.getValue("dateCreated"))}
          </p>
        </>
      ),
    },

    {
      accessorKey: "_id",
      header: "Save",
      cell: ({ row }) => (
        <>
          {/* @ts-ignore */}
          <Button
            variant="default"
            className="capitalize hover:border-slate-900 dark:hover:border-green-200 bg-slate-600 dark:bg-[#212125] dark:text-white dark:hover:bg-black "
            onClick={() => {
              try {
                if (user?.token)
                  updateCustomer(user?.token, {
                    _id: row.getValue("_id"),
                    status: row.getValue("status"),
                    lastContacted: row.getValue("lastContacted"),
                  })
                    .then((res) => {
                      if (res.success) {
                        toast({
                          title: "Success",
                          description: res.message,
                        });
                      }
                      setRefresh(!refresh);
                    })
                    .catch((err) => {
                      toast({
                        title: "Error occured",
                        description: err.error,
                      });
                    });
              } catch (error) {
                toast({
                  title: "Error occured",
                });
              }
            }}
          >
            Save
          </Button>
        </>
      ),
    },
  ];
  // fetching tasks data
  useEffect(() => {
    if (user)
      getCustomers(user?.token)
        .then((res) => {
          if (section === "myCustomers") {
            setMyCustomers(res.data.myCustomers);
            setData(res.data.myCustomers);
          }
          if (section === "assigned") {
            setAssignedCustomers(res.data.assignedCustomers);
            setData(res.data.assignedCustomers);
          }

          setAssignedCustomers(res.data.assignedCustomers);
          let Inactive = 0,
            Active = 0;

          res.data.myCustomers.forEach((task: any) => {
            if (task.status == "Inactive") Inactive++;
            else if (task.status == "Active") Active++;
          });
          setMyCustomerstats({
            Inactive,
            Active,
          });

          // re calculating for assigned tasks
          // (Inactive = 0),
          //   (Active = 0),
          //   res.data.assignedCustomers.forEach((task: any) => {
          //     if (task.status == "Inactive") Inactive++;
          //     else if (task.status == "Active") Active++;
          //   });
          setAssignedCustomerstats({
            Inactive,
            Active,
          });
        })
        .catch((err) => {
          toast({
            title: "Error occured",
            description: err.error,
          });
        });
  }, [refresh, user]);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,

    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });
  const [openValue, setOpenValue] = React.useState(false);

  return (
    <Tabs
      defaultValue={section}
      onValueChange={(value) => {
        setSection(value);
        if (value === "myCustomers") setData(myCustomers);
        else setData(assignedCustomers);
      }}
    >
      <div className="flex justify-center items-center flex-col ">
        <DailogBox open={openValue} setOpen={setOpenValue} />
        {/* task summary section */}
        <div className="pt-20  w-[95%] ">
          <div className="space-y-1 flex justify-between">
            <h2 className="leading-none text-4xl font-semibold tracking-widest flex items-end ">
              Customers Summary
            </h2>
            <div>
              {/* <TabsList className="self-end mr-2">
                <TabsTrigger value="myCustomers">My Customers</TabsTrigger>
                <TabsTrigger value="assigned">Assigned Customers</TabsTrigger>
              </TabsList> */}
              <Button
                variant="default"
                onClick={() => {
                  setOpenValue(!openValue);
                }}
              >
                Add Customer
              </Button>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="flex h-5 items-center space-x-4 text-sm ">
            <h3 className="tracking-widest text-green-500 font-bold text-xl">
              Active
            </h3>
            <h4 className="font-[800] text-lg">
              {section === "myCustomers"
                ? myCustomerstats.Active
                : assignedCustomerstats.Active}
            </h4>
            <Separator orientation="vertical" />
            <h3 className="tracking-widest text-yellow-500 font-bold text-xl">
              Inactive
            </h3>
            <h4 className="font-[800] text-lg">
              {section === "myCustomers"
                ? myCustomerstats.Inactive
                : assignedCustomerstats.Inactive}
            </h4>
          </div>
        </div>
        {/* task summary section end*/}

        <div className="w-[95%]">
          <div className="flex items-center py-4 ">
            <Input
              placeholder="Search customer ..."
              value={
                (table.getColumn("company")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("company")?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />

            <div className="ml-auto flex items-center">
              <div
                className="mr-2 hover:animate-spin transition-all duration-300 ease-in-out "
                onClick={() => setRefresh(!refresh)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  id="refresh"
                  className="fill-current scale-[0.6]"
                >
                  <path d="M35.3 12.7C32.41 9.8 28.42 8 24 8 15.16 8 8.02 15.16 8.02 24S15.16 40 24 40c7.45 0 13.69-5.1 15.46-12H35.3c-1.65 4.66-6.07 8-11.3 8-6.63 0-12-5.37-12-12s5.37-12 12-12c3.31 0 6.28 1.38 8.45 3.55L26 22h14V8l-4.7 4.7z"></path>
                  <path fill="none" d="M0 0h48v48H0z"></path>
                </svg>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="ml-auto">
                    Columns <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => {
                      return (
                        <DropdownMenuCheckboxItem
                          key={column.id}
                          className="capitalize"
                          checked={column.getIsVisible()}
                          onCheckedChange={(value) =>
                            column.toggleVisibility(!!value)
                          }
                        >
                          {column.id}
                        </DropdownMenuCheckboxItem>
                      );
                    })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          {/* my tasks */}
          <TabsContent value={section}>
            <div className="rounded-md border">
              <Table className="dark:bg-[#111112c5]">
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead key={header.id}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext(),
                                )}
                          </TableHead>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                        className="hover:dark:bg-[#0d0d0e]"
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
              <div className="flex-1 text-sm text-muted-foreground">
                {table.getFilteredSelectedRowModel().rows.length} of{" "}
                {table.getFilteredRowModel().rows.length} row(s) selected.
              </div>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  Next
                </Button>
              </div>
            </div>
          </TabsContent>
        </div>
      </div>
    </Tabs>
  );
};

export default CustomerSection;
