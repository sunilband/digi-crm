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
import { Task } from "./data";
import { useEffect } from "react";
import userContext from "@/context/userContext";
import { useContext } from "react";
import { getTasks, updateTask } from "@/utils/apiRequests/TasksFunctions";
import { Separator } from "@/components/ui/separator";
import DailogBox from "@/components/TasksSection/Dailog/Dailog";
import { set } from "date-fns";

const dateParser = (date: string) => {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString();
};
const timeParser = (date: string) => {
  const dateObj = new Date(date);
  return dateObj.toLocaleTimeString();
};

type Props = {};
const TaskSection = (props: Props) => {
  const { toast } = useToast();
  const [section, setSection] = React.useState<string>("myTask");
  const [data, setData] = React.useState<Task[]>([]);
  const [myTasks, setMyTasks] = React.useState<Task[]>([]);
  const [assignedTasks, setAssignedTasks] = React.useState<Task[]>([]);
  const [tasksTypes, setTaskTypes] = React.useState<any>({
    notStarted: 0,
    inProgress: 0,
    testing: 0,
    awaitingFeedback: 0,
    complete: 0,
  });
  const [myTaskStats, setMyTaskStats] = React.useState<any>({});
  const [assignedTaskStats, setAssignedTaskStats] = React.useState<any>({});
  const { user } = useContext(userContext);
  const [refresh, setRefresh] = React.useState<boolean>(false);

  const columns: ColumnDef<Task>[] = [
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
      accessorKey: section == "myTask" ? "assignedBy" : "assignedTo",
      header: section == "myTask" ? "Assigned By" : "Assigned To",
      cell: ({ row }) => (
        <>
          {/* @ts-ignore */}
          <div className="capitalize">
            {
              row.getValue(section == "myTask" ? "assignedBy" : "assignedTo")
                ?.name
            }
          </div>
        </>
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
                }),
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
              try {
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
      getTasks(user?.token)
        .then((res) => {
          if (section === "myTask") {
            setMyTasks(res.data.myTasks);
            setData(res.data.myTasks);
          }
          if (section === "assigned") {
            setAssignedTasks(res.data.assignedTasks);
            setData(res.data.assignedTasks);
          }

          setAssignedTasks(res.data.assignedTasks);
          let notStarted = 0,
            inProgress = 0,
            testing = 0,
            awaitingFeedback = 0,
            complete = 0;
          res.data.myTasks.forEach((task: any) => {
            if (task.status == "Not Started") notStarted++;
            else if (task.status == "In Progress") inProgress++;
            else if (task.status == "Testing") testing++;
            else if (task.status == "Awaiting Feedback") awaitingFeedback++;
            else if (task.status == "Complete") complete++;
          });
          setMyTaskStats({
            notStarted,
            inProgress,
            testing,
            awaitingFeedback,
            complete,
          });

          // re calculating for assigned tasks
          (notStarted = 0),
            (inProgress = 0),
            (testing = 0),
            (awaitingFeedback = 0),
            (complete = 0);
          res.data.assignedTasks.forEach((task: any) => {
            if (task.status == "Not Started") notStarted++;
            else if (task.status == "In Progress") inProgress++;
            else if (task.status == "Testing") testing++;
            else if (task.status == "Awaiting Feedback") awaitingFeedback++;
            else if (task.status == "Complete") complete++;
          });
          setAssignedTaskStats({
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
        if (value === "myTask") setData(myTasks);
        else setData(assignedTasks);
      }}
    >
      <div className="flex justify-center items-center flex-col ">
        <DailogBox open={openValue} setOpen={setOpenValue} />
        {/* task summary section */}
        <div className="pt-20  w-[90%] ">
          <div className="space-y-1 flex justify-between">
            <h2 className="leading-none text-4xl font-semibold tracking-widest flex items-end">
              Tasks Summary
            </h2>
            <div>
              <TabsList className="self-end mr-2">
                <TabsTrigger value="myTask">My Tasks</TabsTrigger>
                <TabsTrigger value="assigned">Assigned Tasks</TabsTrigger>
              </TabsList>
              <Button
                variant="default"
                onClick={() => {
                  setOpenValue(!openValue);
                }}
              >
                Add task
              </Button>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="flex h-5 items-center space-x-4 text-sm ">
            <h3 className="tracking-widest text-green-500 font-bold text-xl">
              Complete
            </h3>
            <h4 className="font-[800] text-lg">
              {section === "myTask"
                ? myTaskStats.complete
                : assignedTaskStats.complete}
            </h4>
            <Separator orientation="vertical" />
            <h3 className="tracking-widest text-yellow-500 font-bold text-xl">
              Awaiting Feedback
            </h3>
            <h4 className="font-[800] text-lg">
              {section === "myTask"
                ? myTaskStats.awaitingFeedback
                : assignedTaskStats.awaitingFeedback}
            </h4>
            <Separator orientation="vertical" />
            <h3 className="tracking-widest text-black dark:text-white font-bold text-xl">
              Testing
            </h3>
            <h4 className="font-[800] text-lg">
              {section === "myTask"
                ? myTaskStats.testing
                : assignedTaskStats.testing}
            </h4>
            <Separator orientation="vertical" />
            <h3 className="tracking-widest text-sky-500 font-bold text-xl">
              In Progress
            </h3>
            <h4 className="font-[800] text-lg">
              {section === "myTask"
                ? myTaskStats.inProgress
                : assignedTaskStats.inProgress}
            </h4>
            <Separator orientation="vertical" />
            <h3 className="tracking-widest text-orange-500 font-bold text-xl">
              Not Started
            </h3>
            <h4 className="font-[800] text-lg">
              {section === "myTask"
                ? myTaskStats.notStarted
                : assignedTaskStats.notStarted}
            </h4>
          </div>
        </div>
        {/* task summary section end*/}

        <div className="w-[90%]">
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

export default TaskSection;
