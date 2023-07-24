"use client";

import * as React from "react";
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

import { Payment } from "./data";
import { useEffect } from "react";
import userContext from "@/context/userContext";
import { useContext } from "react";
import { getTasks, updateTask } from "@/utils/apiRequests/TasksFunctions";
import { Separator } from "@/components/ui/separator";
import DialogBox from "@/components/Dailog/Dailog";
import DailogBox from "@/components/Dailog/Dailog";

const dateParser = (date: string) => {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString();
};
const timeParser = (date: string) => {
  const dateObj = new Date(date);
  return dateObj.toLocaleTimeString();
};

export default function Home() {
  const { toast } = useToast();
  const [data, setData] = React.useState<Payment[]>([]);
  const [tasksTypes, setTaskTypes] = React.useState<any>({
    notStarted: 0,
    inProgress: 0,
    testing: 0,
    awaitingFeedback: 0,
    complete: 0,
  });
  const { user } = useContext(userContext);
  const [refresh, setRefresh] = React.useState<boolean>(false);

  const columns: ColumnDef<Payment>[] = [
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
        <div className="capitalize ">{
          data.findIndex((task)=>task._id===row.getValue("_id"))+1
          }</div>
      ),
    },
    {
      accessorKey: "taskName",
      header: "Title",
      cell: ({ row }) => (
        <div className="capitalize ">{row.getValue("taskName")}</div>
      ),
    },
    {
      accessorKey: "taskDescription",
      header: "Description",
      cell: ({ row }) => (
        <div className="capitalize ">{row.getValue("taskDescription")}</div>
      ),
    },
    {
      accessorKey: "assignedBy",
      header: "Assigned By",
      cell: ({ row }) => (
        // @ts-ignore
        <div className="capitalize">{row.getValue("assignedBy")?.name}</div>
      ),
    },
    {
      accessorKey: "assignedTime",
      header: "Time",
      cell: ({ row }) => (
        <>
          {/* @ts-ignore */}
          <div className="capitalize">
            {dateParser(row.getValue("assignedTime"))}
          </div>
          {/* @ts-ignore */}
          <p className="capitalize text-xs">
            {timeParser(row.getValue("assignedTime"))}
          </p>
        </>
      ),
    },
    {
      accessorKey: "dueDate",
      header: "Due Date",
      cell: ({ row }) => (
        <>
          {/* @ts-ignore */}
          <div className="capitalize">
            {dateParser(row.getValue("dueDate"))}
          </div>
          {/* @ts-ignore */}
          <p className="capitalize text-xs">
            {timeParser(row.getValue("dueDate"))}
          </p>
        </>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <div
          className={`capitalize text-center border p-[1px] flex justify-center items-center  ${
            row.getValue("status") == "Not Started"
              ? "bg-orange-500"
              : row.getValue("status") == "In Progress"
              ? "bg-sky-500"
              : row.getValue("status") == "Testing"
              ? "bg-black text-white dark:bg-white dark:text-black"
              : row.getValue("status") == "Awaiting Feedback"
              ? "bg-yellow-500"
              : row.getValue("status") == "Complete"
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
                })
              );
            }}
          >
            <SelectTrigger className="text-center">
              <SelectValue placeholder="Set " />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="Not Started">Not Started</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Testing">Testing</SelectItem>
                <SelectItem value="Awaiting Feedback">
                  Awaiting Feedback
                </SelectItem>
                <SelectItem value="Complete">Complete</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
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
      accessorKey: "priority",
      header: "Priority",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("priority")}</div>
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
              if (user?.token)
                updateTask(user?.token, {
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
                    console.log("this is error", err);
                    toast({
                      title: "Error occured",
                      description: err.error,
                    });
                  });
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
      getTasks(user?.token)
        .then((res) => {
          setData(res.data);
          let notStarted = 0,
            inProgress = 0,
            testing = 0,
            awaitingFeedback = 0,
            complete = 0;
          res.data.forEach((task: any) => {
            if (task.status == "Not Started") notStarted++;
            else if (task.status == "In Progress") inProgress++;
            else if (task.status == "Testing") testing++;
            else if (task.status == "Awaiting Feedback") awaitingFeedback++;
            else if (task.status == "Complete") complete++;
          });
          setTaskTypes({
            notStarted,
            inProgress,
            testing,
            awaitingFeedback,
            complete,
          });
        })
        .catch((err) => {
          toast({
            title: "Error occured",
            description: err.error,
          });
        });
  }, [refresh,user]);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
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
   <div className="flex justify-center items-center flex-col ">
    <DailogBox open={openValue} setOpen={setOpenValue}/>
      {/* task summary section */}
      <div className="pt-28  w-[90%] ">
        <div className="space-y-1 flex justify-between">
          <h2 className="font-medium leading-none text-lg tracking-widest flex items-end">Tasks Summary</h2>
          <Button variant="default" onClick={()=>{setOpenValue(!openValue)}}>Add task</Button>
        </div>
        <Separator className="my-4" />
        <div className="flex h-5 items-center space-x-4 text-sm">
          <h3 className="tracking-widest text-green-500 font-bold">Complete</h3>
          <h4 className="font-[1000]">{tasksTypes.complete}</h4>
          <Separator orientation="vertical" />
          <h3 className="tracking-widest text-yellow-500 font-bold">Awaiting Feedback</h3>
          <h4 className="font-[1000]">{tasksTypes.awaitingFeedback}</h4>
          <Separator orientation="vertical" />
          <h3 className="tracking-widest text-black dark:text-white font-bold">Testing</h3>
          <h4 className="font-[1000]">{tasksTypes.testing}</h4>
          <Separator orientation="vertical" />
          <h3 className="tracking-widest text-sky-500 font-bold ">In Progress</h3>
          <h4 className="font-[1000]">{tasksTypes.inProgress}</h4>
          <Separator orientation="vertical" />
          <h3 className="tracking-widest text-orange-500 font-bold">Not Started</h3>
          <h4 className="font-[1000]">{tasksTypes.notStarted}</h4>
        </div>
      </div>
      {/* task summary section end*/}

      <div className="w-[90%] ">
        <div className="flex items-center py-4 ">
          <Input
            placeholder="Search task ..."
            value={
              (table.getColumn("taskName")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("taskName")?.setFilterValue(event.target.value)           
            }
            className="max-w-sm"
          />

          <div className="ml-auto">
            <Button
              variant="outline"
              className="mr-2"
              onClick={() => setRefresh(!refresh)}
            >
              Refresh
            </Button>
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

        <div className="rounded-md border">
          <Table className="">
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
                              header.getContext()
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
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
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
      </div>
    </div>
  );
}
