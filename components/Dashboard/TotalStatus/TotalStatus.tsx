"use client";
import React, { use } from "react";
import { useEffect } from "react";
import { useState } from "react";
import userContext from "@/context/userContext";
import { useContext } from "react";
import Image from "next/image";
import { getInvoices } from "@/utils/apiRequests/sales functions/InvoiceFunctions";
import { getEstimates } from "@/utils/apiRequests/sales functions/EstimateFunctions";
import { getProposals } from "@/utils/apiRequests/sales functions/proposalFunctions";
import { getCustomers } from "@/utils/apiRequests/customerFunctions";
import { set } from "date-fns";

type Props = {};

const TotalStatus = (props: Props) => {
  const { user } = useContext(userContext);

  const [myInvoiceStats, setInvoiceStats] = useState<any>({
    Paid: 0,
    Overdue: 0,
    PaidSum: 0,
    OverdueSum: 0,
  });

  const [invoiceData, setInvoiceData] = useState<any>([]);

  const [myEstimateStats, setEstimateStats] = useState<any>({
    Accepted: 0,
    Expired: 0,
    Sent: 0,
    Draft: 0,
    Declined: 0,
  });

  const [myProposalStats, setProposalStats] = useState<any>({
    Accepted: 0,
    Revised: 0,
    Open: 0,
    Sent: 0,
    Draft: 0,
    Declined: 0,
  });

  useEffect(() => {
    user &&
      getInvoices(user?.token).then((res) => {
        let Paid = 0;
        let Overdue = 0;
        let PartiallyPaid = 0;
        let Unpaid = 0;
        let NotSent = 0;
        let Draft = 0;
        let PaidSum = 0;
        let OverdueSum = 0;
        setInvoiceData(res.data.Invoices);
        res.data.Invoices.forEach((Invoice: any) => {
          if (Invoice.status == "Paid") {
            Paid++;
            PaidSum += Invoice.subTotal;
          }
          if (Invoice.status == "Overdue") {
            Overdue++;
            OverdueSum += Invoice.subTotal;
          }
          if (Invoice.status == "Partially Paid") PartiallyPaid++;
          if (Invoice.status == "Unpaid") Unpaid++;
          if (Invoice.status == "Not Sent") NotSent++;
          if (Invoice.status == "Draft") Draft++;
        });
        setInvoiceStats({
          Paid,
          Overdue,
          PartiallyPaid,
          Unpaid,
          NotSent,
          Draft,

          PaidSum,
          OverdueSum,
        });
      });
  }, [user]);

  useEffect(() => {
    user &&
      getEstimates(user?.token).then((res) => {
        let Accepted = 0;
        let Expired = 0;
        let Sent = 0;
        let Draft = 0;
        let Declined = 0;
        res.data.Estimates.forEach((Estimate: any) => {
          if (Estimate.status == "Accepted") Accepted++;
          if (Estimate.status == "Expired") Expired++;
          if (Estimate.status == "Sent") Sent++;
          if (Estimate.status == "Draft") Draft++;
          if (Estimate.status == "Declined") Declined++;
        });
        setEstimateStats({
          Accepted,
          Expired,
          Sent,
          Draft,
          Declined,
        });
      });
  }, [user]);

  useEffect(() => {
    user &&
      getProposals(user?.token).then((res) => {
        let Accepted = 0;
        let Revised = 0;
        let Open = 0;
        let Sent = 0;
        let Draft = 0;
        let Declined = 0;
        res.data.Proposals.forEach((Proposal: any) => {
          if (Proposal.status == "Accepted") Accepted++;
          if (Proposal.status == "Revised") Revised++;
          if (Proposal.status == "Open") Open++;
          if (Proposal.status == "Sent") Sent++;
          if (Proposal.status == "Draft") Draft++;
          if (Proposal.status == "Declined") Declined++;
        });
        setProposalStats({
          Accepted,
          Revised,
          Open,
          Sent,
          Draft,
          Declined,
        });
      });
  }, [user]);

  return (
    <>
      <div className="flex gap-4 justify-center items-center w-screen px-2 mt-4">
        {/* invoices */}
        <div className="w-[30%] border p-2 rounded-md h-96 dark:bg-black dark:hover:bg-[#0d0d0ec5] hover:scale-[1.02] transition-all ease-in-out duration-300 bg-stone-100 hover:drop-shadow-xl">
          <p className="my-2 mb-6 font-extrabold tracking-widest text-xl">
            Invoices Overview
            <span className="text-lg font-semibold pl-2">
              (
              {myInvoiceStats.Paid +
                myInvoiceStats.Overdue +
                myInvoiceStats.PartiallyPaid +
                myInvoiceStats.Unpaid +
                myInvoiceStats.NotSent +
                myInvoiceStats.Draft}
              )
            </span>
          </p>
          <div className="flex flex-col gap-2  tracking-wide font-semibold text-lg">
            <div
              className="flex gap-2 bg-green-500 px-2 transition-all ease-in-out duration-300 hover:scale-[1.02]"
              style={{
                width: `${
                  (myInvoiceStats.Paid /
                    (myInvoiceStats.Paid + myInvoiceStats.Overdue)) *
                  100
                }%`,
              }}
            >
              <p>Paid</p>
              <p>{myInvoiceStats.Paid}</p>
            </div>
            <hr />
            <div
              className="flex gap-2 bg-red-500 px-2 transition-all ease-in-out duration-300 hover:scale-[1.02]"
              style={{
                width: `${
                  (myInvoiceStats.Overdue /
                    (myInvoiceStats.Paid + myInvoiceStats.Overdue)) *
                  100
                }%`,
              }}
            >
              <p>Overdue</p>
              <p>{myInvoiceStats.Overdue}</p>
            </div>
            <hr />

            <div
              className="flex gap-2 bg-yellow-500 px-2 transition-all ease-in-out duration-300 hover:scale-[1.02]"
              style={{
                width: `${
                  (myInvoiceStats.PartiallyPaid /
                    (myInvoiceStats.Paid + myInvoiceStats.Overdue)) *
                  100
                }%`,
              }}
            >
              <p>Partially Paid</p>
              <p>{myInvoiceStats.PartiallyPaid}</p>
            </div>
            <hr />

            <div
              className="flex gap-2 bg-blue-500 px-2 transition-all ease-in-out duration-300 hover:scale-[1.02]"
              style={{
                width: `${
                  (myInvoiceStats.Unpaid /
                    (myInvoiceStats.Paid + myInvoiceStats.Overdue)) *
                  100
                }%`,
              }}
            >
              <p>Unpaid</p>
              <p>{myInvoiceStats.Unpaid}</p>
            </div>
            <hr />

            <div
              className="flex gap-2 bg-black text-white px-2 transition-all ease-in-out duration-300 hover:scale-[1.02]"
              style={{
                width: `${
                  (myInvoiceStats.NotSent /
                    (myInvoiceStats.Paid + myInvoiceStats.Overdue)) *
                  100
                }%`,
              }}
            >
              <p>Not Sent</p>
              <p>{myInvoiceStats.NotSent}</p>
            </div>
            <hr />
            <div
              className="flex gap-2 bg-orange-500 px-2 transition-all ease-in-out duration-300 hover:scale-[1.02]"
              style={{
                width: `${
                  (myInvoiceStats.Draft /
                    (myInvoiceStats.Paid + myInvoiceStats.Overdue)) *
                  100
                }%`,
              }}
            >
              <p>Draft</p>
              <p>{myInvoiceStats.Draft}</p>
            </div>
          </div>
        </div>

        {/* Estimates */}
        <div className="w-[30%] border p-2 rounded-md h-96 dark:bg-black dark:hover:bg-[#0d0d0ec5] hover:scale-[1.02] transition-all ease-in-out duration-300 bg-stone-100 hover:drop-shadow-xl">
          <p className="my-2 mb-6 font-bold tracking-widest text-xl">
            Estimates Overview
            <span className="text-lg font-semibold pl-2">
              (
              {myEstimateStats.Accepted +
                myEstimateStats.Expired +
                myEstimateStats.Sent +
                myEstimateStats.Draft +
                myEstimateStats.Declined}
              )
            </span>
          </p>
          <div className="flex flex-col gap-2 font-semibold tracking-wide font-semi text-lg">
            <div
              className="flex gap-2 bg-green-500 px-2 transition-all ease-in-out duration-300 hover:scale-[1.02]"
              style={{
                width: `${
                  (myEstimateStats.Accepted /
                    (myEstimateStats.Accepted +
                      myEstimateStats.Expired +
                      myEstimateStats.Sent +
                      myEstimateStats.Draft +
                      myEstimateStats.Declined)) *
                  100
                }%`,
              }}
            >
              <p>Accepted</p>
              <p>{myEstimateStats.Accepted}</p>
            </div>
            <hr />
            <div
              className="flex gap-2 dark:bg-white dark:text-black bg-black text-white px-2 transition-all ease-in-out duration-300 hover:scale-[1.02]"
              style={{
                width: `${
                  (myEstimateStats.Expired /
                    (myEstimateStats.Accepted +
                      myEstimateStats.Expired +
                      myEstimateStats.Sent +
                      myEstimateStats.Draft +
                      myEstimateStats.Declined)) *
                  100
                }%`,
              }}
            >
              <p>Expired</p>
              <p>{myEstimateStats.Expired}</p>
            </div>
            <hr />
            <div
              className="flex gap-2 bg-blue-500 px-2 transition-all ease-in-out duration-300 hover:scale-[1.02]"
              style={{
                width: `${
                  (myEstimateStats.Sent /
                    (myEstimateStats.Accepted +
                      myEstimateStats.Expired +
                      myEstimateStats.Sent +
                      myEstimateStats.Draft +
                      myEstimateStats.Declined)) *
                  100
                }%`,
              }}
            >
              <p>Sent</p>
              <p>{myEstimateStats.Sent}</p>
            </div>
            <hr />
            <div
              className="flex gap-2 bg-orange-500 px-2 transition-all ease-in-out duration-300 hover:scale-[1.02]"
              style={{
                width: `${
                  (myEstimateStats.Draft /
                    (myEstimateStats.Accepted +
                      myEstimateStats.Expired +
                      myEstimateStats.Sent +
                      myEstimateStats.Draft +
                      myEstimateStats.Declined)) *
                  100
                }%`,
              }}
            >
              <p>Draft</p>
              <p>{myEstimateStats.Draft}</p>
            </div>
            <hr />
            <div
              className="flex gap-2 bg-red-500 px-2 transition-all ease-in-out duration-300 hover:scale-[1.02]"
              style={{
                width: `${
                  (myEstimateStats.Declined /
                    (myEstimateStats.Accepted +
                      myEstimateStats.Expired +
                      myEstimateStats.Sent +
                      myEstimateStats.Draft +
                      myEstimateStats.Declined)) *
                  100
                }%`,
              }}
            >
              <p>Declined</p>
              <p>{myEstimateStats.Declined}</p>
            </div>
          </div>
        </div>

        {/* Proposals */}
        <div className="w-[30%] border p-2 rounded-md h-96 dark:bg-black dark:hover:bg-[#0d0d0ec5] hover:scale-[1.02] transition-all ease-in-out duration-300 bg-stone-100 hover:drop-shadow-xl">
          <p className="my-2 mb-6 font-bold tracking-widest text-xl">
            Proposals Overview
            <span className="text-lg font-semibold pl-2">
              (
              {myProposalStats.Accepted +
                myProposalStats.Revised +
                myProposalStats.Open +
                myProposalStats.Sent +
                myProposalStats.Draft +
                myProposalStats.Declined}
              )
            </span>
          </p>
          <div className="flex flex-col gap-2 font-semibold tracking-wide font-semi text-lg">
            <div
              className="flex gap-2 bg-green-500 px-2 transition-all ease-in-out duration-300 hover:scale-[1.02]"
              style={{
                width: `${
                  (myProposalStats.Accepted /
                    (myProposalStats.Accepted +
                      myProposalStats.Revised +
                      myProposalStats.Open +
                      myProposalStats.Sent +
                      myProposalStats.Draft +
                      myProposalStats.Declined)) *
                  100
                }%`,
              }}
            >
              <p>Accepted</p>
              <p>{myProposalStats.Accepted}</p>
            </div>
            <hr />
            <div
              className="flex gap-2 bg-yellow-500 px-2 transition-all ease-in-out duration-300 hover:scale-[1.02]"
              style={{
                width: `${
                  (myProposalStats.Revised /
                    (myProposalStats.Accepted +
                      myProposalStats.Revised +
                      myProposalStats.Open +
                      myProposalStats.Sent +
                      myProposalStats.Draft +
                      myProposalStats.Declined)) *
                  100
                }%`,
              }}
            >
              <p>Revised</p>
              <p>{myProposalStats.Revised}</p>
            </div>
            <hr />
            <div
              className="flex gap-2 dark:bg-white dark:text-black bg-black text-white px-2 transition-all ease-in-out duration-300 hover:scale-[1.02]"
              style={{
                width: `${
                  (myProposalStats.Open /
                    (myProposalStats.Accepted +
                      myProposalStats.Revised +
                      myProposalStats.Open +
                      myProposalStats.Sent +
                      myProposalStats.Draft +
                      myProposalStats.Declined)) *
                  100
                }%`,
              }}
            >
              <p>Open</p>
              <p>{myProposalStats.Open}</p>
            </div>
            <hr />
            <div
              className="flex gap-2 bg-blue-500 px-2 transition-all ease-in-out duration-300 hover:scale-[1.02]"
              style={{
                width: `${
                  (myProposalStats.Sent /
                    (myProposalStats.Accepted +
                      myProposalStats.Revised +
                      myProposalStats.Open +
                      myProposalStats.Sent +
                      myProposalStats.Draft +
                      myProposalStats.Declined)) *
                  100
                }%`,
              }}
            >
              <p>Sent</p>
              <p>{myProposalStats.Sent}</p>
            </div>
            <hr />
            <div
              className="flex gap-2 bg-orange-500 px-2 transition-all ease-in-out duration-300 hover:scale-[1.02]"
              style={{
                width: `${
                  (myProposalStats.Draft /
                    (myProposalStats.Accepted +
                      myProposalStats.Revised +
                      myProposalStats.Open +
                      myProposalStats.Sent +
                      myProposalStats.Draft +
                      myProposalStats.Declined)) *
                  100
                }%`,
              }}
            >
              <p>Draft</p>
              <p>{myProposalStats.Draft}</p>
            </div>
            <hr />
            <div
              className="flex gap-2 bg-red-500 px-2 transition-all ease-in-out duration-300 hover:scale-[1.02]"
              style={{
                width: `${
                  (myProposalStats.Declined /
                    (myProposalStats.Accepted +
                      myProposalStats.Revised +
                      myProposalStats.Open +
                      myProposalStats.Sent +
                      myProposalStats.Draft +
                      myProposalStats.Declined)) *
                  100
                }%`,
              }}
            >
              <p>Declined</p>
              <p>{myProposalStats.Declined}</p>
            </div>
          </div>
        </div>
      </div>

      {/* sum section */}
      <div className="w-screen flex gap-4 mt-4 justify-center items-center ">
        {/* all invoices */}
        <div className="border p-2 rounded-md w-48 text-center tracking-wide ">
          <p className="text-xl font-semibold text-black dark:text-white">
            All Invoices
          </p>
          <p className="text-xl font-bold">
            {(
              parseFloat(myInvoiceStats.OverdueSum) +
              parseFloat(myInvoiceStats.PaidSum)
            ).toFixed(2)}{" "}
            USD
          </p>
        </div>

        {/* paid invoices */}
        <div className="border p-2 rounded-md w-48 text-center tracking-wide ">
          <p className="text-xl font-semibold text-green-500">Paid Invoices</p>
          <p className="text-xl font-bold">
            {myInvoiceStats.PaidSum.toFixed(2)} USD
          </p>
        </div>

        {/* overdue invoices */}
        <div className="border p-2 rounded-md w-48 text-center tracking-wide ">
          <p className="text-xl font-semibold text-red-500">Overdue Invoices</p>
          <p className="text-xl font-bold">
            {myInvoiceStats.OverdueSum.toFixed(2)} USD
          </p>
        </div>
      </div>
    </>
  );
};

export default TotalStatus;
