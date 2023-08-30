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
import { Item } from "./data";
import { useEffect } from "react";
import userContext from "@/context/userContext";
import { useContext } from "react";
import { getItems } from "@/utils/apiRequests/sales functions/ItemFunctions";
import { Separator } from "@/components/ui/separator";
import DailogBox from "@/components/SalesSection/ItemsSection/AddItemDailog/Dailog/Dailog";
import GroupDailogBox from "@/components/SalesSection/ItemsSection/AddGroupDailog/Dailog";

const dateParser = (date: string) => {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString();
};
const timeParser = (date: string) => {
  const dateObj = new Date(date);
  return dateObj.toLocaleTimeString();
};

type Props = {};
const ItemSection = (props: Props) => {
  const { toast } = useToast();
  const [section, setSection] = React.useState<string>("myItem");
  const [data, setData] = React.useState<Item[]>([]);
  const [myItems, setMyItems] = React.useState<Item[]>([]);
  const [assignedItems, setAssignedItems] = React.useState<Item[]>([]);
  const [ItemsTypes, setItemTypes] = React.useState<any>({
    notStarted: 0,
    inProgress: 0,
    testing: 0,
    awaitingFeedback: 0,
    complete: 0,
  });
  const [myItemStats, setMyItemStats] = React.useState<any>({});
  const [assignedItemStats, setAssignedItemStats] = React.useState<any>({});
  const { user } = useContext(userContext);
  const [refresh, setRefresh] = React.useState<boolean>(false);

  const columns: ColumnDef<Item>[] = [
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
      accessorKey: "_id",
      header: "No.",
      cell: ({ row }) => (
        <div className="capitalize ">
          {data.findIndex((Item) => Item._id === row.getValue("_id")) + 1}
        </div>
      ),
    },
    {
      accessorKey: "desc",
      header: "Description",
      cell: ({ row }) => (
        <div className="capitalize ">{row.getValue("desc")}</div>
      ),
    },
    {
      accessorKey: "longDesc",
      header: "Details",
      cell: ({ row }) => (
        <div className="capitalize ">{row.getValue("longDesc")}</div>
      ),
    },
    {
      accessorKey: "rate",
      header: "Rate",
      cell: ({ row }) => (
        <div className="capitalize ">
          {/* @ts-ignore */}
          {row.getValue("rate").rateValue + " " + row.getValue("rate").currency}
        </div>
      ),
    },
    {
      accessorKey: "tax1",
      header: "Tax 1",
      cell: ({ row }) => (
        // @ts-ignore
        <div className="capitalize ">{row.getValue("tax1")}</div>
      ),
    },
    {
      accessorKey: "tax2",
      header: "Tax 2",
      cell: ({ row }) => (
        // @ts-ignore
        <div className="capitalize ">{row.getValue("tax2")}</div>
      ),
    },
    {
      accessorKey: "unit",
      header: "Unit",
      cell: ({ row }) => (
        // @ts-ignore
        <div className="capitalize ">{row.getValue("unit")}</div>
      ),
    },
    {
      accessorKey: "groupName",
      header: "Group",
      cell: ({ row }) => (
        // @ts-ignore
        <div className="capitalize ">{row.getValue("groupName")}</div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Date Created",
      cell: ({ row }) => (
        // @ts-ignore
        <div className="capitalize ">
          <>
            {/* @ts-ignore */}
            <div className="capitalize">
              {dateParser(row.getValue("createdAt"))}
            </div>
            {/* @ts-ignore */}
            <p className="capitalize text-xs">
              {timeParser(row.getValue("createdAt"))}
            </p>
          </>
        </div>
      ),
    },
    {
      accessorKey: "createdBy",
      header: "Created By",
      cell: ({ row }) => (
        // @ts-ignore
        <div className="capitalize ">{row.getValue("createdBy").name}</div>
      ),
    },
  ];
  // fetching Items data
  useEffect(() => {
    if (user)
      getItems(user?.token)
        .then((res) => {
          if (section === "myItem") {
            setMyItems(res.data.myItems);
            setData(res.data.myItems);
          }
          if (section === "assigned") {
            setAssignedItems(res.data.assignedItems);
            setData(res.data.assignedItems);
          }
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
  const [openValue2, setOpenValue2] = React.useState(false);

  return (
    <Tabs
      defaultValue={section}
      onValueChange={(value) => {
        setSection(value);
        if (value === "myItem") setData(myItems);
        else setData(assignedItems);
      }}
    >
      <div className="flex justify-center items-center flex-col ">
        <DailogBox open={openValue} setOpen={setOpenValue} />
        <GroupDailogBox open={openValue2} setOpen={setOpenValue2} />

        {/* Item summary section */}
        <div className="pt-20  w-[90%] ">
          <div className="space-y-1 flex justify-between">
            <h2 className="leading-none text-4xl font-semibold tracking-widest flex items-end">
              Items
            </h2>
            <div className="flex gap-2">
              <Button
                variant="default"
                onClick={() => {
                  setOpenValue2(!openValue2);
                }}
              >
                Add/Search Group
              </Button>
              <Button
                variant="default"
                onClick={() => {
                  setOpenValue(!openValue);
                }}
              >
                Add Item
              </Button>
            </div>
          </div>
          <Separator className="my-4" />
        </div>
        {/* Item summary section end*/}

        <div className="w-[90%]">
          <div className="flex items-center py-4 ">
            <Input
              placeholder="Search Item ..."
              value={
                (table.getColumn("desc")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("desc")?.setFilterValue(event.target.value)
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
          {/* my Items */}
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

export default ItemSection;
