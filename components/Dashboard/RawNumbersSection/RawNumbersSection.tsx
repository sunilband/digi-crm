"use client";
import React, { use } from "react";
import { useEffect } from "react";
import { useState } from "react";
import userContext from "@/context/userContext";
import { useContext } from "react";
import Image from "next/image";
import SalesIcon from "@/public/svgs/SalesIcon.svg";
import LeadsIcon from "@/public/svgs/LeadsIcon.svg";
import TasksIcon from "@/public/svgs/TasksIcon.svg";
import CustomerIcon from "@/public/svgs/CustomerIcon.svg";
import { getInvoices } from "@/utils/apiRequests/sales functions/InvoiceFunctions";
import { getLeads } from "@/utils/apiRequests/LeadsFunction";
import { getTasks } from "@/utils/apiRequests/TasksFunctions";
import { getCustomers } from "@/utils/apiRequests/customerFunctions";

type Props = {};

const RawNumbersSection = (props: Props) => {
  const { user } = useContext(userContext);
  const [myInvoiceStats, setInvoiceStats] = useState<any>({
    Paid: 0,
    Total: 0,
  });

  const [myLeadStats, setLeadStats] = useState<any>({
    Done: 0,
    Total: 0,
  });

  const [myCustomerStats, setCustomerStats] = useState<any>({
    Active: 0,
    Total: 0,
  });

  const [myTaskStats, setTaskStats] = useState<any>({
    Complete: 0,
    Total: 0,
  });

  useEffect(() => {
    user &&
      getInvoices(user?.token).then((res) => {
        let Overdue = 0;
        let Total = res.data.Invoices.length;
        res.data.Invoices.forEach((Invoice: any) => {
          if (Invoice.status == "Overdue") Overdue++;
        });
        setInvoiceStats({
          Overdue,
          Total,
        });
      });
  }, [user]);

  useEffect(() => {
    user &&
      getLeads(user?.token).then((res) => {
        let Done = 0;
        let Total = res.data.myLeads.length;
        res.data.myLeads.forEach((Lead: any) => {
          if (Lead.status == "Done") Done++;
        });
        setLeadStats({
          Done,
          Total,
        });
      });
  }, [user]);

  useEffect(() => {
    user &&
      getCustomers(user?.token).then((res) => {
        let Active = 0;
        let Total = res.data.myCustomers.length;
        res.data.myCustomers.forEach((Customer: any) => {
          if (Customer.status == "Active") Active++;
        });
        setCustomerStats({
          Active,
          Total,
        });
      });
  }, [user]);

  useEffect(() => {
    user &&
      getTasks(user?.token).then((res) => {
        let Complete = 0;
        let Total = res.data.myTasks.length;
        res.data.myTasks.forEach((Task: any) => {
          if (Task.status == "Complete") Complete++;
        });
        setTaskStats({
          Complete,
          Total,
        });
      });
  }, [user]);

  return (
    <div className="flex gap-2 w-screen justify-between px-4">
      {/* invoice */}
      <div className="w-96 border p-5 rounded-md hover:scale-[1.02] transition-all ease-in-out duration-300 bg-slate-100 dark:bg-black hover:drop-shadow-xl">
        <div className="flex gap-2 h-16  justify-center items-center  tracking-wide p-2">
          <Image
            src={SalesIcon}
            alt="sales icon"
            className="w-5 h-5 dark:invert"
          ></Image>
          <p>Invoices awating payment</p>
          <p className="text-lg font-extrabold">
            {myInvoiceStats.Overdue}/{myInvoiceStats.Total}
          </p>
        </div>
        <div className="mx-2 w-[100%] h-2 border rounded-xl relative">
          <div
            className={`absolute top-[30%]  h-1 bg-red-500 rounded-xl`}
            style={{
              width: `${
                (myInvoiceStats.Overdue / myInvoiceStats.Total) * 100
              }%`,
            }}
          />
        </div>
      </div>

      {/* Leads */}
      <div className="w-96 border p-5 rounded-md hover:scale-[1.02] transition-all ease-in-out duration-300 bg-slate-100 dark:bg-black hover:drop-shadow-xl">
        <div className="flex gap-2 h-16 justify-center items-center  tracking-wide p-2">
          <Image
            src={LeadsIcon}
            alt="sales icon"
            className="w-5 h-5 dark:invert"
          ></Image>
          <p>Converted Leads</p>
          <p className="text-lg font-extrabold">
            {myLeadStats.Done}/{myLeadStats.Total}
          </p>
        </div>
        <div className="mx-2 w-[100%] h-2 border rounded-xl relative">
          <div
            className={`absolute top-[30%] h-1 bg-green-500 rounded-xl`}
            style={{
              width: `${(myLeadStats.Done / myLeadStats.Total) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Customers */}
      <div className="w-96 border p-5 rounded-md hover:scale-[1.02] transition-all ease-in-out duration-300 bg-slate-100 dark:bg-black hover:drop-shadow-xl">
        <div className="flex gap-2 h-16 justify-center items-center  tracking-wide p-2">
          <Image
            src={CustomerIcon}
            alt="sales icon"
            className="w-5 h-5 dark:invert"
          ></Image>
          <p>Active Customers</p>
          <p className="text-lg font-extrabold">
            {myCustomerStats.Active}/{myCustomerStats.Total}
          </p>
        </div>
        <div className="mx-2 w-[100%] h-2 border rounded-xl relative">
          <div
            className={`absolute top-[30%] h-1 bg-blue-500 rounded-xl`}
            style={{
              width: `${
                (myCustomerStats.Active / myCustomerStats.Total) * 100
              }%`,
            }}
          />
        </div>
      </div>

      {/* Tasks */}
      <div className="w-96 border p-5 rounded-md hover:scale-[1.02] transition-all ease-in-out duration-300 bg-slate-100 dark:bg-black hover:drop-shadow-xl">
        <div className="flex gap-2 h-16 justify-center items-center  tracking-wide p-2">
          <Image
            src={TasksIcon}
            alt="sales icon"
            className="w-5 h-5 dark:invert"
          ></Image>
          <p>Incomplete Tasks</p>
          <p className="text-lg font-extrabold">
            {myTaskStats.Total - myTaskStats.Complete}/{myTaskStats.Total}
          </p>
        </div>
        <div className="mx-2 w-[100%] h-2 border rounded-xl relative">
          <div
            className={`absolute top-[30%] h-1 bg-yellow-500 rounded-xl`}
            style={{
              width: `${
                ((myTaskStats.Total - myTaskStats.Complete) /
                  myTaskStats.Total) *
                100
              }%`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default RawNumbersSection;
