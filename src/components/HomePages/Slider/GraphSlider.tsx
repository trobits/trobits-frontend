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
import { Calendar, TrendingUp, Flame, BarChart3 } from "lucide-react";

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
            borderColor: "rgba(34, 197, 94, 1)", // Green for SHIB
            backgroundColor: "rgba(34, 197, 94, 0.1)",
            tension: 0.4,
            fill: true,
            pointRadius: 3,
            pointBackgroundColor: "rgba(34, 197, 94, 1)",
            pointBorderColor: "#fff",
            pointHoverRadius: 6,
            borderWidth: 2,
          },
          {
            label: "LUNC Burns",
            data: last14.map((row: BurnDataRow) => row.lunc),
            borderColor: "rgba(59, 130, 246, 1)", // Blue for LUNC
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            tension: 0.4,
            fill: true,
            pointRadius: 3,
            pointBackgroundColor: "rgba(59, 130, 246, 1)",
            pointBorderColor: "#fff",
            pointHoverRadius: 6,
            borderWidth: 2,
          },
        ],
      });
    } catch (error) {
      console.error("Failed to fetch burn data:", error);
    }
  };

  useEffect(() => {
    fetchBurnData();
  }, []);

  useEffect(() => {
    if (!startDate || !endDate) {
      setTotals(null);
      if (allData.length > 0) {
        const last14 = allData.slice(-14);
        setChartData({
          labels: last14.map((row: BurnDataRow) => row.date),
          datasets: [
            {
              label: "Shiba Burns",
              data: last14.map((row: BurnDataRow) => row.shiba),
              borderColor: "rgba(34, 197, 94, 1)",
              backgroundColor: "rgba(34, 197, 94, 0.1)",
              tension: 0.4,
              fill: true,
              pointRadius: 3,
              pointBackgroundColor: "rgba(34, 197, 94, 1)",
              pointBorderColor: "#fff",
              pointHoverRadius: 6,
              borderWidth: 2,
            },
            {
              label: "LUNC Burns",
              data: last14.map((row: BurnDataRow) => row.lunc),
              borderColor: "rgba(59, 130, 246, 1)",
              backgroundColor: "rgba(59, 130, 246, 0.1)",
              tension: 0.4,
              fill: true,
              pointRadius: 3,
              pointBackgroundColor: "rgba(59, 130, 246, 1)",
              pointBorderColor: "#fff",
              pointHoverRadius: 6,
              borderWidth: 2,
            },
          ],
        });
      }
      return;
    }

    const from = new Date(startDate);
    const to = new Date(endDate);
    to.setHours(23, 59, 59, 999);

    const filtered = allData.filter((row: BurnDataRow) => {
      const parts = row.date.split(" ");
      const day = parseInt(parts[0]);
      const month = new Date(Date.parse(parts[1] + " 1, 2000")).getMonth();
      const year = parseInt(parts[2]) + 2000;
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
          borderColor: "rgba(34, 197, 94, 1)",
          backgroundColor: "rgba(34, 197, 94, 0.1)",
          tension: 0.4,
          fill: true,
          pointRadius: 3,
          pointBackgroundColor: "rgba(34, 197, 94, 1)",
          pointBorderColor: "#fff",
          pointHoverRadius: 6,
          borderWidth: 2,
        },
        {
          label: "LUNC Burns",
          data: filtered.map((row: BurnDataRow) => row.lunc),
          borderColor: "rgba(59, 130, 246, 1)",
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          tension: 0.4,
          fill: true,
          pointRadius: 3,
          pointBackgroundColor: "rgba(59, 130, 246, 1)",
          pointBorderColor: "#fff",
          pointHoverRadius: 6,
          borderWidth: 2,
        },
      ],
    });
  }, [startDate, endDate, allData]);

  const chartOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "#E5E7EB",
          font: {
            size: 14,
            weight: "600",
          },
          boxWidth: 12,
          boxHeight: 12,
          padding: 20,
          usePointStyle: true,
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
        backgroundColor: "rgba(17, 24, 39, 0.95)",
        titleColor: "#FFFFFF",
        bodyColor: "#E5E7EB",
        borderColor: "rgba(75, 85, 99, 0.5)",
        borderWidth: 1,
        cornerRadius: 12,
        padding: 16,
        titleFont: { weight: "bold", size: 14 },
        bodyFont: { size: 13 },
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y.toLocaleString()}`;
          }
        }
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
          color: "#9CA3AF",
          font: {
            size: 12,
          },
          callback: function (value: string | number) {
            if (typeof value === "number") {
              return value.toLocaleString();
            }
            return value;
          },
        },
        grid: {
          color: "rgba(75, 85, 99, 0.2)",
        },
        border: {
          color: "rgba(75, 85, 99, 0.3)",
        },
      },
      x: {
        ticks: {
          color: "#9CA3AF",
          font: {
            size: 12,
          },
        },
        grid: {
          color: "rgba(75, 85, 99, 0.2)",
        },
        border: {
          color: "rgba(75, 85, 99, 0.3)",
        },
      },
    },
  };

  const formatNumber = (value: number) => {
    if (!value) return "0";
    return Number(value).toLocaleString();
  };

  return (
      <section className="container mx-auto mt-28 px-0">
        <div className="flex justify-center items-center">
          <div className="w-full max-w-7xl mx-auto px-6">
            <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-800/50 rounded-3xl p-8">

              {/* Header */}
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-orange-400" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  Crypto Burn Analytics
                </h2>
                <p className="text-gray-400 text-lg">
                  Track SHIB and LUNC burn statistics over time
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Date Selection & Totals */}
                <div className="lg:col-span-1 space-y-6">

                  {/* Date Range Selection */}
                  <div className="bg-gray-900/60 border border-gray-700/50 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">Date Range</h3>
                        <p className="text-sm text-gray-400">Select period to analyze</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Start Date
                        </label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          End Date
                        </label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Totals Display */}
                  {totals && (
                      <div className="space-y-4">

                        {/* SHIB Total */}
                        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-6">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <Flame className="w-5 h-5 text-green-400" />
                            <span className="text-lg font-medium text-green-300">SHIB Burns</span>
                          </div>
                          <div className="text-center text-2xl font-bold text-white">
                            {formatNumber(totals.shiba)}
                          </div>
                        </div>

                        {/* LUNC Total */}
                        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl p-6">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <TrendingUp className="w-5 h-5 text-blue-400" />
                            <span className="text-lg font-medium text-blue-300">LUNC Burns</span>
                          </div>
                          <div className="text-center text-2xl font-bold text-white">
                            {formatNumber(totals.lunc)}
                          </div>
                        </div>

                      </div>
                  )}

                  {/* Status Indicator */}
                  <div className="bg-gray-900/60 border border-gray-700/50 rounded-xl p-4 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-sm text-green-400 font-medium">
                      {allData.length > 0 ? "Data Loaded" : "Loading..."}
                    </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {totals ? "Custom Range" : "Last 14 Days"}
                    </p>
                  </div>

                </div>

                {/* Chart Area */}
                <div className="lg:col-span-2">
                  <div className="bg-gray-900/60 border border-gray-700/50 rounded-2xl p-6">

                    {/* Chart Header */}
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-purple-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">Burn Chart</h3>
                        <p className="text-sm text-gray-400">Burns over time comparison</p>
                      </div>
                    </div>

                    {/* Chart Container */}
                    <div className="bg-gray-800/30 border border-gray-700/30 rounded-xl p-4" style={{ height: '400px' }}>
                      {allData.length > 0 ? (
                          <Line options={chartOptions} data={chartData} />
                      ) : (
                          <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                              <div className="w-12 h-12 border-4 border-gray-600 border-t-blue-400 rounded-full animate-spin mx-auto mb-4"></div>
                              <div className="text-gray-400 text-lg">Loading burn data...</div>
                            </div>
                          </div>
                      )}
                    </div>

                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>
  );
}