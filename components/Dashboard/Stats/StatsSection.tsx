"use client";
import React, { use } from "react";
import Stats from "./Stats";
import { getTasks } from "@/utils/apiRequests/TasksFunctions";
import { getLeads } from "@/utils/apiRequests/LeadsFunction";
import { getCustomers } from "@/utils/apiRequests/customerFunctions";
import { useEffect } from "react";
import { useState } from "react";
import userContext from "@/context/userContext";
import { useContext } from "react";

type Props = {};

const StatsSection = (props: Props) => {
  const { user } = useContext(userContext);
  const [myLeadStats, setLeadStats] = useState<any>({});
  const [myTaskStats, setTaskStats] = useState<any>({});
  const [myCustomerStats, setCustomerStats] = useState<any>({});

  useEffect(() => {
    user &&
      getLeads(user?.token).then((res) => {
        let Done = 0;
        let Customer = 0;
        res.data.myLeads.forEach((Lead: any) => {
          if (Lead.status == "Done") Done++;
          if (Lead.status == "Customer") Customer++;
        });
        setLeadStats({
          Done,
          Customer,
        });
      });
  }, [user]);

  useEffect(() => {
    user &&
      getTasks(user?.token).then((res) => {
        let Complete = 0;
        let AwaitingFeedback = 0;
        let Testing = 0;
        let InProgress = 0;
        let NotStarted = 0;

        res.data.myTasks.forEach((Task: any) => {
          if (Task.status == "Complete") Complete++;
          if (Task.status == "Awaiting Feedback") AwaitingFeedback++;
          if (Task.status == "Testing") Testing++;
          if (Task.status == "In Progress") InProgress++;
          if (Task.status == "Not Started") NotStarted++;
        });
        setTaskStats({
          Complete,
          AwaitingFeedback,
          Testing,
          InProgress,
          NotStarted,
        });
      });
  }, [user]);

  useEffect(() => {
    user &&
      getCustomers(user?.token).then((res) => {
        let Active = 0;
        let Inactive = 0;
        res.data.myCustomers.forEach((Customer: any) => {
          if (Customer.status == "Active") Active++;
          if (Customer.status == "Inactive") Inactive++;
        });
        setCustomerStats({
          Active,
          Inactive,
        });
      });
  }, [user]);

  return (
    <div className="w-screen flex gap-3 mt-4 pb-2 justify-center">
      {/* tasks */}
      <div className="px-2 font-semibold text-xl text-center">
        <p>Leads Overview</p>
        <Stats
          labels={["Done", "Customer"]}
          data={[myLeadStats.Done, myLeadStats.Customer]}
        />
      </div>

      {/* tasks */}
      <div className="px-2 font-semibold text-xl text-center">
        <p>Tasks Overview</p>
        <Stats
          labels={[
            "Complete",
            "Awaiting Feedback",
            "Testing",
            "In Progress",
            "Not Started",
          ]}
          data={[
            myTaskStats.Complete,
            myTaskStats.AwaitingFeedback,
            myTaskStats.Testing,
            myTaskStats.InProgress,
            myTaskStats.NotStarted,
          ]}
        />
      </div>

      {/* customers */}
      <div className="px-2 font-semibold text-xl text-center">
        <p>Customers Overview</p>
        <Stats
          labels={["Active", "Inactive"]}
          data={[myCustomerStats.Active, myCustomerStats.Inactive]}
        />
      </div>
    </div>
  );
};

export default StatsSection;
