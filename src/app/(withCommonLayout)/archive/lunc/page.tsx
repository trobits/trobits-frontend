/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-unused-vars */

"use client";
import React, { useState, useEffect } from "react";
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
  TextField
} from "@mui/material";
import { format, parseISO } from "date-fns";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import {
  useGetAllArchiveQuery,
  useGetAllLuncBurnsQuery,
} from "@/redux/features/api/archiveApi";
import Loading from "@/components/Shared/Loading";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

interface LuncBurnRecord {
  id: string;
  currency: string;
  date: string; // ISO date string
  transactionRef: string;
  burnCount: number;
  shibaBurnArchiveId?: string; // Optional field if not always present
}

const LuncBurnsPage: React.FC = () => {
  const [records, setRecords] = useState<LuncBurnRecord[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const formatSelectedMonth = (date: Date) => {
    const month = date.getMonth() + 1; // Months are 0-indexed
    const year = date.getFullYear();
    return { month, year };
  };
  const { month, year } = formatSelectedMonth(selectedMonth);

  const { data: allArchiveData, isLoading: allArchiveDataLoading } =
    useGetAllArchiveQuery("");

  const { data: allLuncBurnsData, isLoading: allLuncBurnsDataLoading } =
    useGetAllLuncBurnsQuery(`?month=${month}&year=${year}`);

  const allArchive =
    allArchiveData?.data?.length > 0 ? allArchiveData?.data : [];

  useEffect(() => {
    if (allLuncBurnsData?.data?.length > 0) {
      setRecords(allLuncBurnsData.data);
    }
  }, [allLuncBurnsData]);

  if (allArchiveDataLoading || allLuncBurnsDataLoading) {
    return <Loading />;
  }

  const sortedRecords = [...records].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="p-6 bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen">
      <Grid container spacing={3} justifyContent="center" alignItems="center" direction="column">
        <Grid item xs={12}>
        <Typography
          className="text-4xl font-bold text-center mb-2 text-cyan-600"
            variant="h5"
            sx={{ fontWeight: "bold", textAlign: "center", mb: 2 }}
          >
            Lunc Burn Data
          </Typography>
          <Typography
          className="text-xl font-bold text-center mb-2 text-cyan-600"
            // variant="h5"
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
            sx={{ backgroundColor: "#f8f9fa", borderRadius: "8px", width: "100vw", overflowX: "auto" }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    style={{ fontWeight: "bold", fontSize: "18px", color: "black", textAlign: "center" }}
                  >
                    Date
                  </TableCell>
                  <TableCell
                    style={{ fontWeight: "bold", fontSize: "18px", color: "black", textAlign: "center" }}
                  >
                    Burn Count
                  </TableCell>
                  <TableCell
                    style={{ fontWeight: "bold", fontSize: "18px", color: "black", textAlign: "center" }}
                  >
                    Transaction Ref
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedRecords.map((record, index) => (
                  <TableRow
                    key={record.id}
                    sx={{
                      backgroundColor: index % 2 === 0 ? "#f7f7f7" : "#eaeaea",
                      cursor: "pointer",
                      '&:hover': { backgroundColor: "#d1d1d1" },
                    }}
                  >
                    <TableCell
                      style={{ fontSize: "16px", color: "black", fontWeight: "600", textAlign: "center" }}
                    >
                      {format(parseISO(record.date), "MMMM dd, yyyy")}
                    </TableCell>
                    <TableCell
                      style={{ fontSize: "16px", color: "black", fontWeight: "600", textAlign: "center" }}
                    >
                      {record.burnCount.toLocaleString()}
                    </TableCell>
                    <TableCell
                      style={{ fontSize: "16px", color: "black", fontWeight: "600", textAlign: "center" }}
                    >
                      {record?.transactionRef?.length > 20
                        ? record?.transactionRef?.slice(0, 20) + "..."
                        : record.transactionRef}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </div>
  );
};

//month picker
const MonthPicker = ({ selectedMonth, onChange }: any) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        views={["year", "month"]}
        value={selectedMonth}
        onChange={onChange}
        openTo="month" // This ensures the picker opens to the month view by default
        slots={{ textField: TextField }}
        slotProps={{
          textField: {
            variant: "outlined",
            label: "Select Month",
            fullWidth: false,
            margin: "normal",
            size: "medium",
            sx: { backgroundColor: "#f7f7f7", borderRadius: "8px", fontSize: "20px" },
          },
        }}
      />
    </LocalizationProvider>
  );
};

export default LuncBurnsPage;
