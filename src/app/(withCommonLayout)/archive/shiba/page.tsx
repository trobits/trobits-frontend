"use client";
import React, {useState, useEffect, useRef} from "react";
import {Flame, Calendar, Hash, ExternalLink, TrendingDown, Copy} from "lucide-react";
import { NordVPNCard, FanaticsCard, TikTokCard} from "@/components/AffiliateLinks";

interface ShibaBurnRecord {
    id: string;
    currency: string;
    date: string;
    transactionRef: string;
    burnCount: number;
    burnAddress?: string;
    shibaBurnArchiveId?: string;
}

const adClasses = [
    "67d2cfc79eb53572455e13e3",
    "67d2d0779eb53572455e1516",
    "67d2d0c56f9479aa015d006a",
];

const ShibaBurnsPage: React.FC = () => {
    const [records, setRecords] = useState<ShibaBurnRecord[]>([]);
    const [allRecords, setAllRecords] = useState<ShibaBurnRecord[]>([]);
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

    // Function to copy address to clipboard
    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            // You could add a toast notification here
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    // Function to truncate address for display
    const truncateAddress = (address: string, startChars: number = 6, endChars: number = 4) => {
        if (!address || address.length <= startChars + endChars) return address;
        return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
    };

    const fetchShibBurnData = async () => {
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

            // Debug log headers
            const headers = data.values[0];
            console.log("🔎 Sheet Headers:", headers);
            console.log("🔎 Header count:", headers.length);

            const rows = data.values.slice(1).filter((row: string[]) => row.length > 1);

            // Debug: log row lengths and missing cells
            rows.forEach((row: string[], idx: number) => {
                console.log(
                    `Row ${idx + 1}: length=${row.length}, values=`,
                    row.map((val, i) => `[${i}:${headers[i] || "??"}]=${val}`)
                );
            });

            // Find column indices by header names
            const findColumnIndex = (headerName: string) => {
                const index = headers.findIndex((header: string) => 
                    header.toLowerCase().includes(headerName.toLowerCase())
                );
                return index >= 0 ? index : -1;
            };

            // Known column positions
            const finalDateIdx = 0; // Column A
            const finalCurrencyIdx = 1; // Column B
            const finalTransactionIdx = 2; // Column C
            const finalBurnCountIdx = 3; // Column D (SHIB burns)
            const burnAddressIdx = 4; // Find "Shiba burn address" column

            console.log("🔎 Burn Address Column Index:", burnAddressIdx);

            const parsedRecords: ShibaBurnRecord[] = rows
                .map((row: string[], index: number) => {
                    const dateValue = row[finalDateIdx] || "";
                    let formattedDate: string;

                    try {
                        if (dateValue) {
                            formattedDate = new Date(dateValue).toISOString();
                        } else {
                            formattedDate = new Date().toISOString();
                        }
                    } catch {
                        formattedDate = new Date().toISOString();
                    }

                    const currency = row[finalCurrencyIdx] || "SHIB";
                    const transactionRef = row[finalTransactionIdx] || `tx_${index}`;
                    const burnCountStr = row[finalBurnCountIdx] || "0";
                    const burnCount =
                        parseInt(burnCountStr.toString().replace(/,/g, "").replace(/[^0-9]/g, "")) || 0;
                    const burnAddress = burnAddressIdx >= 0 ? (row[burnAddressIdx] || "") : "";

                    return {
                        id: `record_${index}`,
                        currency,
                        date: formattedDate,
                        transactionRef,
                        burnCount,
                        burnAddress,
                        shibaBurnArchiveId: `archive_${index}`,
                    };
                })
                .filter((record) => record.burnCount > 0);

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
            console.error("Failed to fetch SHIB burn data:", error);
        } finally {
            setLoading(false);
        }
    };

    const filterRecordsByMonth = (allRecords: ShibaBurnRecord[], targetMonth: Date) => {
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
        fetchShibBurnData();
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
                    <div
                        className="w-12 h-12 border-4 border-gray-600 border-t-orange-400 rounded-full animate-spin mx-auto mb-4"></div>
                    <div className="text-gray-400 text-lg">Loading SHIB burn data...</div>
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
            {/*<div className="w-full py-4">*/}
            {/*    <div className="flex flex-wrap justify-center gap-2 mx-auto">*/}
            {/*        {adClasses.map((adClass) => (*/}
            {/*            <AdBanner key={adClass} adClass={adClass}/>*/}
            {/*        ))}*/}
            {/*    </div>*/}
            {/*</div>*/}

            <div className="container mt-10 mx-auto px-6 py-16">
                
                {/* Header Section */}
                <div className="text-center mb-16">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Flame className="w-5 h-5 text-orange-400"/>
                        <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                            Burn Archive
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        SHIB Burn Data
                    </h1>

                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Track Shiba Inu token burns with detailed transaction records and historical data
                    </p>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div
                        className="bg-gray-900/50 border border-gray-800/50 backdrop-blur-sm rounded-2xl p-6 text-center">
                        <div className="flex items-center justify-center mb-3">
                            <div className="w-12 h-12 bg-orange-600/20 rounded-xl flex items-center justify-center">
                                <Flame className="w-6 h-6 text-orange-400"/>
                            </div>
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-1">Total Burns</h3>
                        <p className="text-2xl font-bold text-orange-400">
                            {totalBurns.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-400 mt-1">This month</p>
                    </div>

                    <div
                        className="bg-gray-900/50 border border-gray-800/50 backdrop-blur-sm rounded-2xl p-6 text-center">
                        <div className="flex items-center justify-center mb-3">
                            <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center">
                                <Hash className="w-6 h-6 text-blue-400"/>
                            </div>
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-1">Transactions</h3>
                        <p className="text-2xl font-bold text-blue-400">
                            {sortedRecords.length}
                        </p>
                        <p className="text-sm text-gray-400 mt-1">Burn events</p>
                    </div>

                    <div
                        className="bg-gray-900/50 border border-gray-800/50 backdrop-blur-sm rounded-2xl p-6 text-center">
                        <div className="flex items-center justify-center mb-3">
                            <div className="w-12 h-12 bg-green-600/20 rounded-xl flex items-center justify-center">
                                <TrendingDown className="w-6 h-6 text-green-400"/>
                            </div>
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-1">Avg. Burn</h3>
                        <p className="text-2xl font-bold text-green-400">
                            {sortedRecords.length > 0 ? Math.floor(totalBurns / sortedRecords.length).toLocaleString() : "0"}
                        </p>
                        <p className="text-sm text-gray-400 mt-1">Per transaction</p>
                    </div>
                </div>

                {/* Affiliate Cards Section - Following home page pattern */}
                <div className="w-full mb-8">
                    <div className="flex flex-wrap justify-center gap-4 max-w-6xl mx-auto">
                        <div className="flex-shrink-0" style={{ width: 'calc(24% - 1rem)', minWidth: '200px' }}>
                            <div className="max-h-40 h-40">
                                <NordVPNCard compact />
                            </div>
                        </div>
                        <div className="flex-shrink-0" style={{ width: 'calc(24% - 1rem)', minWidth: '200px' }}>
                            <div className="max-h-40 h-40">
                                <FanaticsCard compact />
                            </div>
                        </div>
                        <div className="flex-shrink-0" style={{ width: 'calc(24% - 1rem)', minWidth: '200px' }}>
                            <div className="max-h-40 h-40">
                                <TikTokCard compact />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-900/50 border border-gray-800/50 backdrop-blur-sm rounded-2xl p-6 mb-8">
                    <div className="flex items-center justify-center gap-4">
                        <Calendar className="w-5 h-5 text-gray-400"/>
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
                                    <th className="text-left p-6 text-sm font-semibold text-gray-300 uppercase tracking-wider">
                                        Burn Count
                                    </th>
                                    <th className="text-left p-6 text-sm font-semibold text-gray-300 uppercase tracking-wider">
                                        Transaction Reference
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
                                                    <div
                                                        className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center">
                                                        <Calendar className="w-4 h-4 text-blue-400"/>
                                                    </div>
                                                    <span className="text-white font-medium">
                                                        {formatDate(parseISOString(record.date))}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-6 text-left">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xl font-bold text-orange-400">
                                                        {record.burnCount.toLocaleString()}
                                                    </span>
                                                    <Flame className="w-4 h-4 text-orange-400"/>
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                {record.burnAddress ? (
                                                    <div className="flex items-center gap-2">
                                                        <code className="text-sm text-gray-300 bg-gray-800/50 px-2 py-1 rounded font-mono">
                                                            {truncateAddress(record.burnAddress)}
                                                        </code>
                                                        <button
                                                            onClick={() => copyToClipboard(record.burnAddress || "")}
                                                            className="p-1 text-gray-400 hover:text-white transition-colors duration-200"
                                                            title="Copy full address"
                                                        >
                                                            <Copy className="w-4 h-4"/>
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-500 text-sm">No address</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={3} className="p-12 text-center">
                                            <div className="space-y-4">
                                                <Flame className="w-12 h-12 text-gray-600 mx-auto"/>
                                                <div>
                                                    <h3 className="text-lg font-medium text-gray-400 mb-1">No burn data
                                                        found</h3>
                                                    <p className="text-gray-500 text-sm">
                                                        No burn transactions recorded
                                                        for {formatDate(selectedMonth, "month-year")}
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
const MonthPicker = ({selectedMonth, onChange}: any) => {
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    // Get available months with data from allRecords (we'll need to pass this as prop or get from context)
    // For now, we'll calculate based on years from data
    const years = Array.from({length: 5}, (_, i) => currentYear - 2 + i);

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
                className="px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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

export default ShibaBurnsPage;