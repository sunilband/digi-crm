"use client";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Chart as Chartjs } from "chart.js/auto";
import { Bar, Doughnut } from "react-chartjs-2";
import { CategoryScale } from "chart.js";
Chartjs.register(CategoryScale);

type Props = {
  labels: string[];
  data: number[];
};

const Stats = ({ labels, data }: Props) => {
  return (
    <div>
      <Doughnut
        data={{
          labels: labels,
          datasets: [
            {
              data: data,
              backgroundColor: [
                "rgb(255, 99, 132)",
                "rgb(54, 162, 235)",
                "rgb(255, 205, 86)",
                "rgb(75, 192, 192)",
                "rgb(153, 102, 255)",
                "rgb(255, 159, 64)",
              ],
              hoverOffset: 4,
            },
          ],
        }}
      />
    </div>
  );
};

export default Stats;
