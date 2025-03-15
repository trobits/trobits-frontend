/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */


"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Typography,
  Grid,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
} from "@mui/material";
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

interface ShibaBurnRecord {
  id: string;
  currency: string;
  date: string; // ISO date string
  transactionRef: string;
  burnCount: number;
  shibaBurnArchiveId?: string; // Optional field if not always present
}

const adClasses = [
  "67d2cfc79eb53572455e13e3",
  "67d2d0779eb53572455e1516",
  "67d2d0c56f9479aa015d006a",
];

const ShibaBurnsPage: React.FC = () => {
  const [ records, setRecords ] = useState<ShibaBurnRecord[]>([]);
  const [ selectedMonth, setSelectedMonth ] = useState<Date>(new Date());
  const dispatch = useAppDispatch();
  const previousPath = useAppSelector((state) => state.auth.previousPath);
  const currentPath = useAppSelector((state) => state.auth.currentPath);
  const pathName = usePathname();

  const formatSelectedMonth = (date: Date) => {
    const month = date.getMonth() + 1; // Months are 0-indexed
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
  }, [ allShibaBurnsData ]);

  if (window) {
    if (previousPath !== "/archive/shiba" && currentPath === "/archive/shiba") {
      dispatch(setPaths(pathName));
      window.location.reload();
    }
  }
  if (allArchiveDataLoading || allShibaBurnsDataLoading) {
    return <Loading />;
  }

  const sortedRecords = [ ...records ].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="p-6 bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen">
      {/* Ad Banners at the top */}
      <div className="flex flex-wrap justify-center items-center gap-2">
        {adClasses.map((adClass) => (
          <div key={adClass} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
            <AdBanner adClass={adClass} />
          </div>
        ))}
      </div>

      <Grid
        container
        spacing={3}
        justifyContent="center"
        alignItems="center"
        direction="column"
      >
        <Grid item xs={12}>
          <Typography
            className="text-4xl font-bold text-center mb-2 text-cyan-600"
            variant="h5"
            sx={{ fontWeight: "bold", textAlign: "center", mb: 2 }}
          >
            SHIB Burn Data
          </Typography>
          <Typography
            className="text-xl font-bold text-center mb-2 text-cyan-600"
            sx={{ fontWeight: "bold", textAlign: "center", mb: 2 }}
          >
            Pick your Month to see Burn Data on This Month
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
            <MonthPicker
              selectedMonth={selectedMonth}
              onChange={(newValue: Date | null) => {
                if (newValue) {
                  setSelectedMonth(newValue);
                }
              }}
            />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <TableContainer
            component={Paper}
            sx={{
              backgroundColor: "#f8f9fa",
              borderRadius: "8px",
              width: "100vw",
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    style={{
                      fontWeight: "bold",
                      fontSize: "18px",
                      color: "black",
                      textAlign: "center",
                    }}
                  >
                    Date
                  </TableCell>
                  <TableCell
                    style={{
                      fontWeight: "bold",
                      fontSize: "18px",
                      color: "black",
                      textAlign: "center",
                    }}
                  >
                    Burn Count
                  </TableCell>
                  <TableCell
                    style={{
                      fontWeight: "bold",
                      fontSize: "18px",
                      color: "black",
                      textAlign: "center",
                    }}
                  >
                    Transaction Ref
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {allShibaBurnsData?.data?.length > 0 ? (
                  sortedRecords.map((record, index) => (
                    <TableRow
                      key={record.id}
                      sx={{
                        backgroundColor:
                          index % 2 === 0 ? "#f7f7f7" : "#eaeaea",
                        cursor: "pointer",
                        "&:hover": { backgroundColor: "#d1d1d1" },
                      }}
                    >
                      <TableCell
                        style={{
                          fontSize: "16px",
                          color: "black",
                          fontWeight: "600",
                          textAlign: "center",
                        }}
                      >
                        {format(parseISO(record.date), "MMMM dd, yyyy")}
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: "16px",
                          color: "black",
                          fontWeight: "600",
                          textAlign: "center",
                        }}
                      >
                        {record.burnCount.toLocaleString()}
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: "16px",
                          color: "black",
                          fontWeight: "600",
                          textAlign: "center",
                        }}
                      >
                        {record.transactionRef}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      style={{
                        textAlign: "center",
                        fontSize: "16px",
                        color: "black",
                        fontWeight: "600",
                      }}
                    >
                      No Data Found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </div>
  );
};

// Month Picker Component
const MonthPicker = ({ selectedMonth, onChange }: any) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        views={[ "year", "month" ]}
        value={selectedMonth}
        onChange={onChange}
        openTo="month"
        slots={{ textField: TextField }}
        slotProps={{
          textField: {
            variant: "outlined",
            label: "Select Month",
            fullWidth: false,
            margin: "normal",
            size: "medium",
            sx: {
              backgroundColor: "#f7f7f7",
              borderRadius: "8px",
              fontSize: "20px",
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

    // Remove existing ad script if any
    const existingScript = document.querySelector(`script[data-ad-class="${adClass}"]`);
    if (existingScript) {
      existingScript.remove();
    }

    // Create and inject new ad script
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
    console.log(`Injecting ad: ${adClass}`);
    injectAdScript(); // Inject on mount

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        injectAdScript(); // Re-inject ads on page activation
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [ adClass ]);

  return (
    <div ref={adContainerRef}>
      <ins
        className={adClass}
        style={{  }}
      ></ins>
    </div>
  );
};

export default ShibaBurnsPage;