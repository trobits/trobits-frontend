// /* eslint-disable @typescript-eslint/no-unused-vars */
// import { useState } from "react";

// const Slider = () => {
//   const [currentSlide, setCurrentSlide] = useState(0);

//   return (
//     <div className="flex flex-col sm:flex-row justify-between items-center mt-10 sm:mt-20 border-2 border-opacity-80 border-cyan-400 p-4 bg-blue-800 bg-opacity-60 w-full max-w-[900px] mx-auto min-h-40 rounded-lg">

//     </div>
//   );
// };

// export default Slider;

/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

// "use client";

import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface BurnDataRow {
  date: string;
  shiba: number;
  lunc: number;
}

import { ChartData, ChartOptions } from "chart.js";

export default function BurnChartWithCalculator() {
  const [chartData, setChartData] = useState<ChartData<"line">>({
    labels: [],
    datasets: [],
  });
  const [allData, setAllData] = useState<BurnDataRow[]>([]);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [totals, setTotals] = useState<{ shiba: number; lunc: number } | null>(
    null
  );

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "2-digit",
    });
  };

  const fetchBurnData = async (): Promise<void> => {
    const apiKey = "AIzaSyC_pYUok9r2PD5PmIYyWV4ZCvHy8y_Iug0";
    const sheetId = "10V4FpmrdcoQBCv-TXABSiNgqXx3dSj63qKqw06-3nFY";
    const range = "A:Z";
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.values || data.values.length < 2) {
      console.error("No data found in sheet");
      return;
    }

    const headers = data.values[0];
    const dateIdx = headers.findIndex((h: string) =>
      h.toLowerCase().includes("date")
    );
    const shibaIdx = 3; // Column D
    const luncIdx = 5; // Column F

    const rows = data.values
      .slice(1)
      .filter((row: string[]) => row.length > luncIdx);

    const parsedData: BurnDataRow[] = rows.map((row: string[]) => {
      const date = formatDate(row[dateIdx]);
      const shiba = parseInt(row[shibaIdx]?.replace(/,/g, "") || "0");
      const lunc = parseInt(row[luncIdx]?.replace(/,/g, "") || "0");
      return { date, shiba, lunc };
    });

    setAllData(parsedData);

    const last14 = parsedData.slice(-14);
    setChartData({
      labels: last14.map((row: BurnDataRow) => row.date),
      datasets: [
        {
          label: "Shiba Burns",
          data: last14.map((row: BurnDataRow) => row.shiba),
          borderColor: "rgba(255, 99, 132, 1)",
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          tension: 0.4,
          fill: true,
          pointRadius: 2,
        },
        {
          label: "LUNC Burns",
          data: last14.map((row: BurnDataRow) => row.lunc),
          borderColor: "rgba(54, 162, 235, 1)",
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          tension: 0.4,
          fill: true,
          pointRadius: 2,
        },
      ],
    });
  };

  useEffect(() => {
    fetchBurnData();
  }, []);

  useEffect(() => {
    if (!startDate || !endDate) {
      setTotals(null);
      return;
    }

    const from = new Date(startDate);
    const to = new Date(endDate);
    to.setHours(23, 59, 59, 999);

    const filtered = allData.filter((row: BurnDataRow) => {
      const [d, m, y] = row.date.split(" ");
      const rowDate = new Date(`20${y}-${m}-` + d);
      return rowDate >= from && rowDate <= to;
    });

    const total = filtered.reduce(
      (acc: { shiba: number; lunc: number }, row: BurnDataRow) => {
        acc.shiba += row.shiba;
        acc.lunc += row.lunc;
        return acc;
      },
      { shiba: 0, lunc: 0 }
    );

    setTotals(total);

    setChartData({
      labels: filtered.map((row: BurnDataRow) => row.date),
      datasets: [
        {
          label: "Shiba Burns",
          data: filtered.map((row: BurnDataRow) => row.shiba),
          borderColor: "rgba(255, 99, 132, 1)",
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          tension: 0.4,
          fill: true,
          pointRadius: 2,
        },
        {
          label: "LUNC Burns",
          data: filtered.map((row: BurnDataRow) => row.lunc),
          borderColor: "rgba(54, 162, 235, 1)",
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          tension: 0.4,
          fill: true,
          pointRadius: 2,
        },
      ],
    });
  }, [startDate, endDate]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "#ffffff",
        },
      },
      title: {
        display: true,
        text: "Shiba & LUNC Burns Over Time",
        color: "#ffffff",
      },
      tooltip: { mode: "index" as const, intersect: false },
    },
    interaction: {
      mode: "nearest" as const,
      axis: "x" as const,
      intersect: false,
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: "#ffffff",
        },
      },
      x: {
        ticks: {
          color: "#ffffff",
        },
      },
    },
  };

  return (
    <div className="p-8 pt-32 text-white">
      <h1 className="text-3xl font-bold mb-10 text-white">
        Shiba and LUNC Burns Dashboard
      </h1>

      <div className="bg-white text-black border p-6 rounded-lg shadow mb-10 w-full max-w-xl mx-auto">
        <div className="flex flex-wrap gap-4 mb-4 items-center">
          <label className="block">
            📅 Start Date:
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="ml-2 px-2 py-1 border border-gray-300 rounded"
            />
          </label>
          <label className="block">
            📅 End Date:
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="ml-2 px-2 py-1 border border-gray-300 rounded"
            />
          </label>
        </div>

        {totals && (
          <div className="mt-2">
            <h2 className="text-lg font-semibold mb-2">
              Total Burns for Selected Range
            </h2>
            <p>
              Shiba: <strong>{totals.shiba.toLocaleString()}</strong>
            </p>
            <p>
              LUNC: <strong>{totals.lunc.toLocaleString()}</strong>
            </p>
          </div>
        )}
      </div>

      <div className="bg-gray-800 p-6 rounded-xl shadow">
        <Line options={chartOptions} data={chartData} />
      </div>
    </div>
  );
}
