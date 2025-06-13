"use client";

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
    // IMPORTANT: Move your API key to an environment variable for security
    // In Next.js, add NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY="YOUR_KEY_HERE" to your .env.local file
    // const apiKey = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY;
    const apiKey = "AIzaSyC_pYUok9r2PD5PmIYyWV4ZCvHy8y_Iug0"; // Replace with env variable in production
    const sheetId = "10V4FpmrdcoQBCv-TXABSiNgqXx3dSj63qKqw06-3nFY";
    const range = "A:Z";
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
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
            borderColor: "rgba(255, 99, 132, 1)", // Reddish
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            tension: 0.4,
            fill: true,
            pointRadius: 2,
            pointBackgroundColor: "rgba(255, 99, 132, 1)",
            pointBorderColor: "#fff",
            pointHoverRadius: 5,
          },
          {
            label: "LUNC Burns",
            data: last14.map((row: BurnDataRow) => row.lunc),
            borderColor: "rgba(54, 162, 235, 1)", // Bluish
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            tension: 0.4,
            fill: true,
            pointRadius: 2,
            pointBackgroundColor: "rgba(54, 162, 235, 1)",
            pointBorderColor: "#fff",
            pointHoverRadius: 5,
          },
        ],
      });
    } catch (error) {
      console.error("Failed to fetch burn data:", error);
      // You might want to set an error state here to display a message to the user
    }
  };

  useEffect(() => {
    fetchBurnData();
  }, []);

  useEffect(() => {
    if (!startDate || !endDate) {
      setTotals(null); // Clear totals if dates are not fully selected
      // Revert chart to show last 14 days if dates are cleared
      if (allData.length > 0) {
        const last14 = allData.slice(-14);
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
              pointBackgroundColor: "rgba(255, 99, 132, 1)",
              pointBorderColor: "#fff",
              pointHoverRadius: 5,
            },
            {
              label: "LUNC Burns",
              data: last14.map((row: BurnDataRow) => row.lunc),
              borderColor: "rgba(54, 162, 235, 1)",
              backgroundColor: "rgba(54, 162, 235, 0.2)",
              tension: 0.4,
              fill: true,
              pointRadius: 2,
              pointBackgroundColor: "rgba(54, 162, 235, 1)",
              pointBorderColor: "#fff",
              pointHoverRadius: 5,
            },
          ],
        });
      }
      return;
    }

    const from = new Date(startDate);
    const to = new Date(endDate);
    to.setHours(23, 59, 59, 999); // Set to end of the day

    const filtered = allData.filter((row: BurnDataRow) => {
      // Re-parse date from 'DD Mon YY' to 'YYYY-MM-DD' for accurate comparison
      // The original formatDate returns 'DD Mon YY', so we need to parse it back reliably.
      // Example: "01 Jan 23" -> new Date("2023-01-01")
      const parts = row.date.split(" ");
      const day = parseInt(parts[0]);
      const month = new Date(Date.parse(parts[1] + " 1, 2000")).getMonth(); // Get month index
      const year = parseInt(parts[2]) + 2000; // Assuming 'YY' means '20YY'
      const rowDate = new Date(year, month, day);

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
          pointBackgroundColor: "rgba(255, 99, 132, 1)",
          pointBorderColor: "#fff",
          pointHoverRadius: 5,
        },
        {
          label: "LUNC Burns",
          data: filtered.map((row: BurnDataRow) => row.lunc),
          borderColor: "rgba(54, 162, 235, 1)",
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          tension: 0.4,
          fill: true,
          pointRadius: 2,
          pointBackgroundColor: "rgba(54, 162, 235, 1)",
          pointBorderColor: "#fff",
          pointHoverRadius: 5,
        },
      ],
    });
  }, [startDate, endDate, allData]); // Added allData to dependencies to re-filter if data changes

  const chartOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false, // Allows flexible height based on parent
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "#E0E0E0", // Lighter gray for better contrast
          font: {
            size: 14,
            weight: "bold",
          },
          boxWidth: 20,
          boxHeight: 10,
          padding: 20,
        },
      },
      title: {
        display: true,
        text: "Shiba & LUNC Burns Over Time",
        color: "#F0F0F0", // Almost white for main title
        font: {
          size: 24,
          weight: "bold",
        },
        padding: {
          top: 10,
          bottom: 30,
        },
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
        backgroundColor: "rgba(31, 41, 55, 0.9)", // bg-gray-800 with transparency
        titleColor: "#FFFFFF",
        bodyColor: "#E0E0E0",
        borderColor: "rgba(75, 85, 99, 0.5)", // border-gray-600 with transparency
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        titleFont: { weight: "bold" },
        bodyFont: { size: 14 },
      },
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
          color: "#BBBBBB", // Light gray for ticks
          font: {
            size: 12,
          },
          callback: function (value: string | number) {
            // Format large numbers
            if (typeof value === "number") {
              return value.toLocaleString();
            }
            return value;
          },
        },
        grid: {
          color: "rgba(75, 85, 99, 0.3)", // Subtle grid lines (gray-600)
          // Darker gray for axis line
        },
      },
      x: {
        ticks: {
          color: "#BBBBBB", // Light gray for ticks
          font: {
            size: 12,
          },
        },
        grid: {
          color: "rgba(75, 85, 99, 0.3)", // Subtle grid lines
          // Darker gray for axis line
        },
      },
    },
  };

  return (
    // Outer container matching the overall app background and padding
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4 sm:p-8 pt-20">
      <div className="max-w-6xl mx-auto">
        {/* Main title */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-10 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          Crypto Burn Analytics
        </h1>

        {/* Date range selection and totals card */}
        <div className="bg-gray-800/30 backdrop-blur-xl border border-gray-600/30 rounded-3xl p-6 shadow-xl mb-12 max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold text-white mb-6 text-center">
            Select Burn Range
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-6 items-center justify-center">
            <label className="flex items-center text-gray-300 text-base font-medium">
              📅 Start Date:
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="ml-3 px-4 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300"
              />
            </label>
            <label className="flex items-center text-gray-300 text-base font-medium">
              📅 End Date:
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="ml-3 px-4 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300"
              />
            </label>
          </div>

          {totals && (
            <div className="mt-8 pt-6 border-t border-gray-700/50">
              <h3 className="text-xl font-bold text-white mb-4 text-center">
                Total Burns for Selected Range
              </h3>
              <div className="flex justify-around flex-wrap gap-4 text-center">
                <p className="text-lg text-gray-200">
                  Shiba:{" "}
                  <strong className="text-red-400 text-2xl">
                    {totals.shiba.toLocaleString()}
                  </strong>
                </p>
                <p className="text-lg text-gray-200">
                  LUNC:{" "}
                  <strong className="text-blue-400 text-2xl">
                    {totals.lunc.toLocaleString()}
                  </strong>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Chart Container */}
        <div className="bg-gray-800/30 backdrop-blur-xl border border-gray-600/30 rounded-3xl p-6 shadow-xl relative min-h-[400px] md:min-h-[550px] lg:min-h-[650px] flex items-center justify-center">
          {allData.length > 0 ? (
            <Line options={chartOptions} data={chartData} />
          ) : (
            <div className="text-gray-400 text-lg">Loading burn data...</div>
          )}
        </div>
      </div>
    </div>
  );
}
