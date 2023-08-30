"use client";

import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Invoice } from "./data";
import { useEffect } from "react";
import userContext from "@/context/userContext";
import { useContext } from "react";
import {
  getInvoices,
  updateInvoice,
} from "@/utils/apiRequests/sales functions/InvoiceFunctions";
import { Separator } from "@/components/ui/separator";
import DailogBox from "@/components/SalesSection/InvoicesSection/AddInvoiceDailog/Dailog";

const dateParser = (date: string) => {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString();
};
const timeParser = (date: string) => {
  const dateObj = new Date(date);
  return dateObj.toLocaleTimeString();
};

function padNumber(num: number | string) {
  let str = num.toString();
  let paddedStr = str.padStart(5, "0");
  return paddedStr;
}

type Props = {};
const InvoiceSection = (props: Props) => {
  const { toast } = useToast();
  const [section, setSection] = React.useState<string>("myInvoice");
  const [data, setData] = React.useState<Invoice[]>([]);
  const [myInvoices, setMyInvoices] = React.useState<Invoice[]>([]);
  const [assignedInvoices, setAssignedInvoices] = React.useState<Invoice[]>([]);
  const [InvoicesTypes, setInvoiceTypes] = React.useState<any>({
    Draft: 0,
    Sent: 0,
    Open: 0,
    Expired: 0,
    Declined: 0,
    Accepted: 0,
  });
  const [myInvoiceStats, setMyInvoiceStats] = React.useState<any>({});
  const [assignedInvoiceStats, setAssignedInvoiceStats] = React.useState<any>(
    {},
  );
  const { user } = useContext(userContext);
  const [refresh, setRefresh] = React.useState<boolean>(false);

  const columns: ColumnDef<Invoice>[] = [
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
          {data.findIndex((Invoice) => Invoice._id === row.getValue("_id")) + 1}
        </div>
      ),
    },

    {
      accessorKey: "invoiceNumber",
      header: "Invoice No.",
      cell: ({ row }) => (
        <div className="capitalize ">
          {<p>INV-{padNumber(row.getValue("invoiceNumber"))}</p>}
        </div>
      ),
    },

    {
      accessorKey: "subTotal",
      header: "Amount",
      cell: ({ row }) => (
        <div className="capitalize ">
          {parseFloat(row.getValue("subTotal")).toFixed(2)} USD
        </div>
      ),
    },

    {
      accessorKey: "reference",
      header: "Reference",
      cell: ({ row }) => (
        <div className="capitalize ">{<p>{row.getValue("reference")}</p>}</div>
      ),
    },

    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => (
        <>
          {/* @ts-ignore */}
          <div className="capitalize">{dateParser(row.getValue("date"))}</div>
          {/* @ts-ignore */}
          <p className="capitalize text-xs">
            {timeParser(row.getValue("date"))}
          </p>
        </>
      ),
    },
    {
      accessorKey: "expiryDate",
      header: "Expiry Date",
      cell: ({ row }) => (
        <>
          {/* @ts-ignore */}
          <div className="capitalize">
            {dateParser(row.getValue("expiryDate"))}
          </div>
          {/* @ts-ignore */}
          <p className="capitalize text-xs">
            {timeParser(row.getValue("expiryDate"))}
          </p>
        </>
      ),
    },
    {
      accessorKey: "tags",
      header: "Tags",
      cell: ({ row }) => (
        <>
          {/* @ts-ignore */}
          <div className="capitalize">{row.getValue("tags").join(" , ")}</div>
        </>
      ),
    },

    {
      accessorKey: "adminNote",
      header: "Admin Note",
      cell: ({ row }) => (
        <div className="capitalize ">{<p>{row.getValue("adminNote")}</p>}</div>
      ),
    },

    {
      accessorKey: "clientNote",
      header: "Client Note",
      cell: ({ row }) => (
        <div className="capitalize ">{<p>{row.getValue("clientNote")}</p>}</div>
      ),
    },

    {
      accessorKey: "terms",
      header: "T&C",
      cell: ({ row }) => (
        <div className="capitalize ">{<p>{row.getValue("terms")}</p>}</div>
      ),
    },
    {
      accessorKey: "saleAgent",
      header: "Agent",
      cell: ({ row }) => (
        // @ts-ignore
        <div className="capitalize ">
          {/* @ts-ignore */}
          {<p>{row.getValue("saleAgent")?.name}</p>}
        </div>
      ),
    },
    {
      accessorKey: "paymentMode",
      header: "Payment Mode",
      cell: ({ row }) => (
        // @ts-ignore
        <div className="capitalize ">
          {<p>{row.getValue("paymentMode")}</p>}
        </div>
      ),
    },
    {
      accessorKey: "recurringInvoice",
      header: "Recurring Payment",
      cell: ({ row }) => (
        // @ts-ignore
        <div className="capitalize ">
          {<p>{row.getValue("recurringInvoice")}</p>}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <div
          className={`capitalize text-center border p-[1px] flex justify-center items-center  ${
            row.getValue("status") == "Overdue"
              ? "bg-red-500"
              : row.getValue("status") == "Paid"
              ? "bg-green-500"
              : row.getValue("status") == "Partially Paid"
              ? "bg-yellow-500"
              : row.getValue("status") == "Unpaid"
              ? "bg-red-500"
              : row.getValue("status") == "Not Sent"
              ? "dark:bg-white dark:text-black bg-black text-white "
              : row.getValue("status") == "Draft"
              ? "bg-gray-500"
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
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Overdue">Overdue</SelectItem>
                <SelectItem value="Partially Paid">Partially Paid</SelectItem>
                <SelectItem value="Unpaid">Unpaid</SelectItem>
                <SelectItem value="Not Sent">Not Sent</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </>
      ),
    },
    {
      accessorKey: "_id",
      header: "Update",
      cell: ({ row }) => (
        <>
          {/* @ts-ignore */}
          <Button
            variant="outline"
            className="capitalize hover:border-slate-900 dark:hover:border-green-200"
            onClick={() => {
              try {
                if (user?.token)
                  updateInvoice(user?.token, {
                    _id: row.getValue("_id"),
                    status: row.getValue("status"),
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

  // fetching Invoices data
  useEffect(() => {
    if (user)
      getInvoices(user?.token)
        .then((res) => {
          if (section === "myInvoice") {
            setMyInvoices(res.data.Invoices);
            setData(res.data.Invoices);
          }
          if (section === "assigned") {
            setAssignedInvoices(res.data.assignedInvoices);
            setData(res.data.assignedInvoices);
          }

          setAssignedInvoices(res.data.assignedInvoices);
          let Paid = 0;
          let Overdue = 0;
          res.data.Invoices.forEach((Invoice: any) => {
            if (Invoice.status == "Paid") Paid++;
            else if (Invoice.status == "Overdue") Overdue++;
          });
          setMyInvoiceStats({
            Paid,
            Overdue,
          });

          // re calculating for assigned Invoices
          Paid = 0;
          Overdue = 0;
          res.data.assignedInvoices.forEach((Invoice: any) => {
            if (Invoice.status == "Paid") Paid++;
            else if (Invoice.status == "Overdue") Overdue++;
          });
          setAssignedInvoiceStats({
            Paid,
            Overdue,
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
        if (value === "myInvoice") setData(myInvoices);
        else setData(assignedInvoices);
      }}
    >
      <div className="flex justify-center items-center flex-col ">
        <DailogBox open={openValue} setOpen={setOpenValue} />
        {/* Invoice summary section */}
        <div className="pt-20  w-[90%] ">
          <div className="space-y-1 flex justify-between">
            <h2 className="leading-none text-4xl font-semibold tracking-widest flex items-end">
              Invoices Summary
            </h2>
            <div>
              <TabsList className="self-end mr-2">
                <TabsTrigger value="myInvoice">Invoices</TabsTrigger>
                <TabsTrigger value="assigned">Assigned Invoices</TabsTrigger>
              </TabsList>
              <Button
                variant="default"
                onClick={() => {
                  setOpenValue(!openValue);
                }}
              >
                Add Invoice
              </Button>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="flex h-5 items-center space-x-4 text-sm ">
            <h3 className="tracking-widest text-green-500 font-bold text-xl">
              Paid
            </h3>
            <h4 className="font-[800] text-lg">
              {section === "myInvoice"
                ? myInvoiceStats.Paid
                : assignedInvoiceStats.Paid}
            </h4>

            <Separator orientation="vertical" />
            <h3 className="tracking-widest text-red-500 font-bold text-xl">
              Overdue
            </h3>
            <h4 className="font-[800] text-lg">
              {section === "myInvoice"
                ? myInvoiceStats.Overdue
                : assignedInvoiceStats.Overdue}
            </h4>
          </div>
        </div>
        {/* Invoice summary section end*/}

        <div className="w-[90%]">
          <div className="flex items-center py-4 ">
            <Input
              placeholder="Search Invoice ..."
              value={
                (table
                  .getColumn("InvoiceNumber")
                  ?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table
                  .getColumn("InvoiceNumber")
                  ?.setFilterValue(event.target.value)
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
          {/* my Invoices */}
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

export default InvoiceSection;
