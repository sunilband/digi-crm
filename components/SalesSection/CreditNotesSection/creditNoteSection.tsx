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
import { CreditNote } from "./data";
import { useEffect } from "react";
import userContext from "@/context/userContext";
import { useContext } from "react";
import {
  getCreditNotes,
  updateCreditNote,
} from "@/utils/apiRequests/sales functions/CreditNoteFunctions";
import { Separator } from "@/components/ui/separator";
import DailogBox from "@/components/SalesSection/CreditNotesSection/AddCreditNoteDailog/Dailog";

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
const CreditNoteSection = (props: Props) => {
  const { toast } = useToast();
  const [section, setSection] = React.useState<string>("myCreditNote");
  const [data, setData] = React.useState<CreditNote[]>([]);
  const [myCreditNotes, setMyCreditNotes] = React.useState<CreditNote[]>([]);
  const [assignedCreditNotes, setAssignedCreditNotes] = React.useState<
    CreditNote[]
  >([]);
  const [CreditNotesTypes, setCreditNoteTypes] = React.useState<any>({
    Draft: 0,
    Sent: 0,
    Open: 0,
    Expired: 0,
    Declined: 0,
    Accepted: 0,
  });
  const [myCreditNoteStats, setMyCreditNoteStats] = React.useState<any>({});
  const [assignedCreditNoteStats, setAssignedCreditNoteStats] =
    React.useState<any>({});
  const { user } = useContext(userContext);
  const [refresh, setRefresh] = React.useState<boolean>(false);

  const columns: ColumnDef<CreditNote>[] = [
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
          {data.findIndex(
            (CreditNote) => CreditNote._id === row.getValue("_id"),
          ) + 1}
        </div>
      ),
    },

    {
      accessorKey: "creditNoteNumber",
      header: "CreditNote No.",
      cell: ({ row }) => (
        <div className="capitalize ">
          {<p>CN-{padNumber(row.getValue("creditNoteNumber"))}</p>}
        </div>
      ),
    },

    {
      accessorKey: "customer",
      header: "Customer",
      cell: ({ row }) => (
        <div className="capitalize ">
          {/* @ts-ignore */}
          {<p>{row.getValue("customer").name}</p>}
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
      accessorKey: "subTotal",
      header: "Remaining Amount",
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
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <div
          className={`capitalize text-center border p-[1px] flex justify-center items-center bg-blue-500`}
        >
          Open
        </div>
      ),
    },
  ];

  // fetching CreditNotes data
  useEffect(() => {
    if (user)
      getCreditNotes(user?.token)
        .then((res) => {
          if (section === "myCreditNote") {
            setMyCreditNotes(res.data.CreditNotes);
            setData(res.data.CreditNotes);
          }
          if (section === "assigned") {
            setAssignedCreditNotes(res.data.assignedCreditNotes);
            setData(res.data.assignedCreditNotes);
          }

          setAssignedCreditNotes(res.data.assignedCreditNotes);
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
        if (value === "myCreditNote") setData(myCreditNotes);
        else setData(assignedCreditNotes);
      }}
    >
      <div className="flex justify-center items-center flex-col ">
        <DailogBox open={openValue} setOpen={setOpenValue} />
        {/* CreditNote summary section */}
        <div className="pt-20  w-[90%] ">
          <div className="space-y-1 flex justify-between">
            <h2 className="leading-none text-4xl font-semibold tracking-widest flex items-end">
              Credit Notes
            </h2>
            <div>
              <Button
                variant="default"
                onClick={() => {
                  setOpenValue(!openValue);
                }}
              >
                Add CreditNote
              </Button>
            </div>
          </div>
          <Separator className="my-4" />
        </div>
        {/* CreditNote summary section end*/}

        <div className="w-[90%]">
          <div className="flex items-center py-4 ">
            <Input
              placeholder="Search CreditNote ..."
              value={
                (table
                  .getColumn("creditNoteNumber")
                  ?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table
                  .getColumn("creditNoteNumber")
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
          {/* my CreditNotes */}
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

export default CreditNoteSection;
