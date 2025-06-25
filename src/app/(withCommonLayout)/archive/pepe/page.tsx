"use client";
import React, { useState, useEffect, useRef } from "react";
import { Flame, Calendar, Hash, ExternalLink, TrendingDown } from "lucide-react";

interface PepeBurnRecord {
    id: string;
    currency: string;
    date: string;
    transactionRef: string;
    burnCount: number;
    shibaBurnArchiveId?: string;
}

const adClasses = [
    "67d2cfc79eb53572455e13e3",
    "67d2d0779eb53572455e1516",
    "67d2d0c56f9479aa015d006a",
];

const PepeBurnsPage: React.FC = () => {
    const [records, setRecords] = useState<PepeBurnRecord[]>([]);
    const [allRecords, setAllRecords] = useState<PepeBurnRecord[]>([]);
    const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
    const [loading, setLoading] = useState(true);

    // Date formatting functions
    const formatDate = (date: Date, formatType: string = "full") => {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const fullMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        if (formatType === "full") {
            return `${months[date.getMonth()]} ${date.getDate().toString().padStart(2, '0')}, ${date.getFullYear()}`;
        } else if (formatType === "month-year") {
            return `${fullMonths[date.getMonth()]} ${date.getFullYear()}`;
        }
        return date.toLocaleDateString();
    };

    const parseISOString = (dateStr: string) => {
        return new Date(dateStr);
    };

    const fetchPepeBurnData = async () => {
        // Google Sheets API configuration
        const apiKey = "AIzaSyC_pYUok9r2PD5PmIYyWV4ZCvHy8y_Iug0";
        const sheetId = "10V4FpmrdcoQBCv-TXABSiNgqXx3dSj63qKqw06-3nFY";
        const range = "A:Z";
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;

        try {
            setLoading(true);
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
            const rows = data.values.slice(1).filter((row: string[]) => row.length > 1);

            // Column positions for PEPE data - adjust based on your sheet structure
            const finalDateIdx = 0; // Column A
            const finalCurrencyIdx = 1; // Column B
            const finalTransactionIdx = 2; // Column C
            const finalBurnCountIdx = 8; // Column I (PEPE burns - adjust as needed)

            const parsedRecords: PepeBurnRecord[] = rows.map((row: string[], index: number) => {
                // Parse date - handle various date formats
                let dateValue = row[finalDateIdx] || "";
                let formattedDate: string;

                try {
                    // Create a more robust date parser
                    if (dateValue) {
                        // Handle DD MMM YY format (like "01 Jan 25")
                        if (dateValue.includes(' ')) {
                            formattedDate = new Date(dateValue).toISOString();
                        } else if (dateValue.includes('-')) {
                            formattedDate = new Date(dateValue).toISOString();
                        } else if (dateValue.includes('/')) {
                            formattedDate = new Date(dateValue).toISOString();
                        } else {
                            // Try direct parsing
                            formattedDate = new Date(dateValue).toISOString();
                        }
                    } else {
                        formattedDate = new Date().toISOString();
                    }
                } catch {
                    // Fallback to current date if parsing fails
                    formattedDate = new Date().toISOString();
                }

                const currency = row[finalCurrencyIdx] || "PEPE";
                const transactionRef = row[finalTransactionIdx] || `tx_${index}`;
                const burnCountStr = row[finalBurnCountIdx] || "0";
                const burnCount = parseInt(burnCountStr.toString().replace(/,/g, "").replace(/[^0-9]/g, "")) || 0;

                return {
                    id: `record_${index}`,
                    currency,
                    date: formattedDate,
                    transactionRef,
                    burnCount,
                    shibaBurnArchiveId: `archive_${index}`
                };
            }).filter(record => record.burnCount > 0);

            setAllRecords(parsedRecords);

            // Find the most recent month with data and set it as default
            if (parsedRecords.length > 0) {
                const sortedByDate = [...parsedRecords].sort(
                    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
                );
                const mostRecentDate = new Date(sortedByDate[0].date);
                setSelectedMonth(mostRecentDate);
                filterRecordsByMonth(parsedRecords, mostRecentDate);
            } else {
                filterRecordsByMonth(parsedRecords, selectedMonth);
            }

        } catch (error) {
            console.error("Failed to fetch PEPE burn data:", error);
        } finally {
            setLoading(false);
        }
    };

    const filterRecordsByMonth = (allRecords: PepeBurnRecord[], targetMonth: Date) => {
        const targetYear = targetMonth.getFullYear();
        const targetMonthNum = targetMonth.getMonth();

        const filteredRecords = allRecords.filter(record => {
            const recordDate = new Date(record.date);
            return recordDate.getFullYear() === targetYear &&
                recordDate.getMonth() === targetMonthNum;
        });

        setRecords(filteredRecords);
    };

    useEffect(() => {
        fetchPepeBurnData();
    }, []);

    useEffect(() => {
        if (allRecords.length > 0) {
            filterRecordsByMonth(allRecords, selectedMonth);
        }
    }, [selectedMonth, allRecords]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-gray-600 border-t-green-400 rounded-full animate-spin mx-auto mb-4"></div>
                    <div className="text-gray-400 text-lg">Loading PEPE burn data...</div>
                </div>
            </div>
        );
    }

    const sortedRecords = [...records].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    // Calculate total burns for the month
    const totalBurns = sortedRecords.reduce((sum, record) => sum + record.burnCount, 0);

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Ad Banner */}
            <div className="w-full py-4">
                <div className="flex flex-wrap justify-center gap-2 mx-auto">
                    {adClasses.map((adClass) => (
                        <AdBanner key={adClass} adClass={adClass} />
                    ))}
                </div>
            </div>

            <div className="container mt-10 mx-auto px-6 py-16">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Flame className="w-5 h-5 text-green-400" />
                        <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">
              Burn Archive
            </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        PEPE Burn Data
                    </h1>

                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Track PEPE token burns with detailed transaction records and historical data
                    </p>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-gray-900/50 border border-gray-800/50 backdrop-blur-sm rounded-2xl p-6 text-center">
                        <div className="flex items-center justify-center mb-3">
                            <div className="w-12 h-12 bg-green-600/20 rounded-xl flex items-center justify-center">
                                <Flame className="w-6 h-6 text-green-400" />
                            </div>
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-1">Total Burns</h3>
                        <p className="text-2xl font-bold text-green-400">
                            {totalBurns.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-400 mt-1">This month</p>
                    </div>

                    <div className="bg-gray-900/50 border border-gray-800/50 backdrop-blur-sm rounded-2xl p-6 text-center">
                        <div className="flex items-center justify-center mb-3">
                            <div className="w-12 h-12 bg-emerald-600/20 rounded-xl flex items-center justify-center">
                                <Hash className="w-6 h-6 text-emerald-400" />
                            </div>
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-1">Transactions</h3>
                        <p className="text-2xl font-bold text-emerald-400">
                            {sortedRecords.length}
                        </p>
                        <p className="text-sm text-gray-400 mt-1">Burn events</p>
                    </div>

                    <div className="bg-gray-900/50 border border-gray-800/50 backdrop-blur-sm rounded-2xl p-6 text-center">
                        <div className="flex items-center justify-center mb-3">
                            <div className="w-12 h-12 bg-lime-600/20 rounded-xl flex items-center justify-center">
                                <TrendingDown className="w-6 h-6 text-lime-400" />
                            </div>
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-1">Avg. Burn</h3>
                        <p className="text-2xl font-bold text-lime-400">
                            {sortedRecords.length > 0 ? Math.floor(totalBurns / sortedRecords.length).toLocaleString() : "0"}
                        </p>
                        <p className="text-sm text-gray-400 mt-1">Per transaction</p>
                    </div>
                </div>

                <div className="bg-gray-900/50 border border-gray-800/50 backdrop-blur-sm rounded-2xl p-6 mb-8">
                    <div className="flex items-center justify-center gap-4">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <span className="text-lg font-medium text-white">Select Month:</span>
                        <MonthPicker
                            selectedMonth={selectedMonth}
                            onChange={(newValue: Date | null) => {
                                if (newValue) {
                                    setSelectedMonth(newValue);
                                }
                            }}
                        />
                    </div>
                </div>

                {/* Data Table */}
                <div className="bg-gray-900/50 border border-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-gray-800/50">
                        <h3 className="text-xl font-bold text-white">Burn Records</h3>
                        <p className="text-gray-400 text-sm mt-1">
                            {formatDate(selectedMonth, "month-year")} burn transactions
                        </p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                            <tr className="border-b border-gray-800/50">
                                <th className="text-left p-6 text-sm font-semibold text-gray-300 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="p-6 text-sm font-semibold text-gray-300 uppercase tracking-wider">
                                    Burn Count
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {sortedRecords.length > 0 ? (
                                sortedRecords.map((record, index) => (
                                    <tr
                                        key={record.id}
                                        className={`
                        border-b border-gray-800/30 hover:bg-gray-800/30 transition-colors duration-200
                        ${index % 2 === 0 ? 'bg-gray-800/10' : ''}
                      `}
                                    >
                                        <td className="p-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-emerald-600/20 rounded-lg flex items-center justify-center">
                                                    <Calendar className="w-4 h-4 text-emerald-400" />
                                                </div>
                                                <span className="text-white font-medium">
                            {formatDate(parseISOString(record.date))}
                          </span>
                                            </div>
                                        </td>
                                        <td className="p-6 text-center">
                                            <div className="flex items-center justify-center gap-2">
                          <span className="text-xl font-bold text-green-400">
                            {record.burnCount.toLocaleString()}
                          </span>
                                                <Flame className="w-4 h-4 text-green-400" />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={2} className="p-12 text-center">
                                        <div className="space-y-4">
                                            <Flame className="w-12 h-12 text-gray-600 mx-auto" />
                                            <div>
                                                <h3 className="text-lg font-medium text-gray-400 mb-1">No burn data found</h3>
                                                <p className="text-gray-500 text-sm">
                                                    No burn transactions recorded for {formatDate(selectedMonth, "month-year")}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Simple Month Picker Component (without external dependencies)
const MonthPicker = ({ selectedMonth, onChange }: any) => {
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

    const isMonthDisabled = (monthIndex: number, year: number) => {
        // Disable future months
        if (year > currentYear) return true;
        if (year === currentYear && monthIndex > currentMonth) return true;
        return false;
    };

    const handleMonthChange = (monthIndex: number) => {
        const newDate = new Date(selectedMonth);
        newDate.setMonth(monthIndex);
        onChange(newDate);
    };

    const handleYearChange = (year: number) => {
        const newDate = new Date(selectedMonth);
        newDate.setFullYear(year);
        // If the selected month is disabled for this year, select the most recent valid month
        if (isMonthDisabled(newDate.getMonth(), year)) {
            if (year === currentYear) {
                newDate.setMonth(currentMonth);
            } else {
                newDate.setMonth(11); // December for past years
            }
        }
        onChange(newDate);
    };

    return (
        <div className="flex gap-3">
            <select
                value={selectedMonth.getMonth()}
                onChange={(e) => handleMonthChange(parseInt(e.target.value))}
                className="px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
                {months.map((month, index) => (
                    <option
                        key={month}
                        value={index}
                        className="bg-gray-800"
                        disabled={isMonthDisabled(index, selectedMonth.getFullYear())}
                    >
                        {month}
                    </option>
                ))}
            </select>

            <select
                value={selectedMonth.getFullYear()}
                onChange={(e) => handleYearChange(parseInt(e.target.value))}
                className="px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
                {years.map((year) => (
                    <option key={year} value={year} className="bg-gray-800">
                        {year}
                    </option>
                ))}
            </select>
        </div>
    );
};

// Ad Banner Component
const AdBanner = ({ adClass }: { adClass: string }) => {
    const adContainerRef = useRef<HTMLDivElement>(null);

    const injectAdScript = () => {
        if (!adContainerRef.current) return;

        const existingScript = document.querySelector(`script[data-ad-class="${adClass}"]`);
        if (existingScript) {
            existingScript.remove();
        }

        const script = document.createElement("script");
        script.innerHTML = `
      !function(e,n,c,t,o,r,d){
        !function e(n,c,t,o,r,m,d,s,a){
          s=c.getElementsByTagName(t)[0],
          (a=c.createElement(t)).async=!0,
          a.src="https://"+r[m]+"/js/"+o+".js?v="+d,
          a.onerror=function(){a.remove(),(m+=1)>=r.length||e(n,c,t,o,r,m)},
          s.parentNode.insertBefore(a,s)
        }(window,document,"script","${adClass}",["cdn.bmcdn6.com"], 0, new Date().getTime())
      }();
    `;
        script.setAttribute("data-ad-class", adClass);
        document.body.appendChild(script);
    };

    useEffect(() => {
        injectAdScript();
        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                injectAdScript();
            }
        };
        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [adClass]);

    return (
        <div ref={adContainerRef} className="w-full flex justify-center">
            <ins
                className={adClass}
                style={{ display: "inline-block", width: "1px", height: "1px" }}
            ></ins>
        </div>
    );
};

export default PepeBurnsPage;