"use client";
import React, { useState, useEffect, useRef } from "react";
import { format, parseISO } from "date-fns";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import {
  useGetAllArchiveQuery,
  useGetAllShibaBurnsQuery,
} from "@/redux/features/api/archiveApi";
import Loading from "@/components/Shared/Loading";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { setPaths } from "@/redux/features/slices/authSlice";
import { usePathname } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Flame, Calendar, Hash, ExternalLink, TrendingDown } from "lucide-react";
import { TextField } from "@mui/material";

interface ShibaBurnRecord {
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

const ShibaBurnsPage: React.FC = () => {
  const [records, setRecords] = useState<ShibaBurnRecord[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const dispatch = useAppDispatch();
  const previousPath = useAppSelector((state) => state.auth.previousPath);
  const currentPath = useAppSelector((state) => state.auth.currentPath);
  const pathName = usePathname();

  const formatSelectedMonth = (date: Date) => {
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return { month, year };
  };
  const { month, year } = formatSelectedMonth(selectedMonth);

  const { data: allArchiveData, isLoading: allArchiveDataLoading } =
    useGetAllArchiveQuery("");

  const { data: allShibaBurnsData, isLoading: allShibaBurnsDataLoading } =
    useGetAllShibaBurnsQuery(`?month=${month}&year=${year}`);

  const allArchive =
    allArchiveData?.data?.length > 0 ? allArchiveData?.data : [];

  useEffect(() => {
    if (allShibaBurnsData?.data?.length > 0) {
      setRecords(allShibaBurnsData.data);
    }
  }, [allShibaBurnsData]);

  if (typeof window !== "undefined") {
    if (previousPath !== "/archive/shiba" && currentPath === "/archive/shiba") {
      dispatch(setPaths(pathName));
      window.location.reload();
    }
  }

  if (allArchiveDataLoading || allShibaBurnsDataLoading) {
    return <Loading />;
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

      <div className="container mx-auto px-6 py-16">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Flame className="w-5 h-5 text-orange-400" />
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
          <div className="bg-gray-900/50 border border-gray-800/50 backdrop-blur-sm rounded-2xl p-6 text-center">
            <div className="flex items-center justify-center mb-3">
              <div className="w-12 h-12 bg-orange-600/20 rounded-xl flex items-center justify-center">
                <Flame className="w-6 h-6 text-orange-400" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">Total Burns</h3>
            <p className="text-2xl font-bold text-orange-400">
              {totalBurns.toLocaleString()}
            </p>
            <p className="text-sm text-gray-400 mt-1">This month</p>
          </div>

          <div className="bg-gray-900/50 border border-gray-800/50 backdrop-blur-sm rounded-2xl p-6 text-center">
            <div className="flex items-center justify-center mb-3">
              <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center">
                <Hash className="w-6 h-6 text-blue-400" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">Transactions</h3>
            <p className="text-2xl font-bold text-blue-400">
              {sortedRecords.length}
            </p>
            <p className="text-sm text-gray-400 mt-1">Burn events</p>
          </div>

          <div className="bg-gray-900/50 border border-gray-800/50 backdrop-blur-sm rounded-2xl p-6 text-center">
            <div className="flex items-center justify-center mb-3">
              <div className="w-12 h-12 bg-green-600/20 rounded-xl flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-green-400" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">Avg. Burn</h3>
            <p className="text-2xl font-bold text-green-400">
              {sortedRecords.length > 0 ? Math.floor(totalBurns / sortedRecords.length).toLocaleString() : "0"}
            </p>
            <p className="text-sm text-gray-400 mt-1">Per transaction</p>
          </div>
        </div>

        {/* Month Picker */}
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
              {format(selectedMonth, "MMMM yyyy")} burn transactions
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800/50">
                  <th className="text-left p-6 text-sm font-semibold text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="text-right p-6 text-sm font-semibold text-gray-300 uppercase tracking-wider">
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
                          <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center">
                            <Calendar className="w-4 h-4 text-blue-400" />
                          </div>
                          <span className="text-white font-medium">
                            {format(parseISO(record.date), "MMM dd, yyyy")}
                          </span>
                        </div>
                      </td>
                      <td className="p-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-xl font-bold text-orange-400">
                            {record.burnCount.toLocaleString()}
                          </span>
                          <Flame className="w-4 h-4 text-orange-400" />
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-2">
                          <code className="bg-gray-800/50 text-gray-300 px-3 py-1 rounded-lg text-sm font-mono">
                            {record.transactionRef}
                          </code>
                          <ExternalLink className="w-4 h-4 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="p-12 text-center">
                      <div className="space-y-4">
                        <Flame className="w-12 h-12 text-gray-600 mx-auto" />
                        <div>
                          <h3 className="text-lg font-medium text-gray-400 mb-1">No burn data found</h3>
                          <p className="text-gray-500 text-sm">
                            No burn transactions recorded for {format(selectedMonth, "MMMM yyyy")}
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

// Month Picker Component
const MonthPicker = ({ selectedMonth, onChange }: any) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        views={["year", "month"]}
        value={selectedMonth}
        onChange={onChange}
        openTo="month"
        slots={{ textField: TextField }}
        slotProps={{
          textField: {
            variant: "outlined",
            size: "small",
            sx: {
              "& .MuiOutlinedInput-root": {
                backgroundColor: "rgba(17, 24, 39, 0.5)",
                color: "white",
                border: "1px solid rgba(75, 85, 99, 0.5)",
                borderRadius: "12px",
                "&:hover": {
                  borderColor: "rgba(156, 163, 175, 0.5)",
                },
                "&.Mui-focused": {
                  borderColor: "white",
                },
              },
              "& .MuiInputLabel-root": {
                color: "rgba(156, 163, 175, 1)",
                "&.Mui-focused": {
                  color: "white",
                },
              },
              "& .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
            },
          },
        }}
      />
    </LocalizationProvider>
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

export default ShibaBurnsPage;