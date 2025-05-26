"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Line, LineChart, ResponsiveContainer } from "recharts";
import { cryptoData } from "../Constant/priceTable.const";

type Tab = "Coins" | "Trending" | "Most Visited" | "Recently Added";

function PricePageCompo() {
  const [activeTab, setActiveTab] = useState<Tab>("Coins");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const totalPages = Math.ceil(cryptoData.length / itemsPerPage);

  const tabs: Tab[] = ["Coins", "Trending", "Most Visited", "Recently Added"];

  const formatLargeNumber = (num: number) => {
    if (num >= 1e12) return (num / 1e12).toFixed(2) + "T";
    if (num >= 1e9) return (num / 1e9).toFixed(2) + "B";
    if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
    if (num >= 1e3) return (num / 1e3).toFixed(2) + "K";
    return num.toFixed(2);
  };

  return (
    <div className="w-full min-h-screen bg-[#0B0E11] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-700 via-gray-900 to-black text-white">
      <Card className="m-6 border-none bg-transparent shadow-none">
        <div className="mb-6 border-b border-gray-800">
          <div className="flex space-x-1">
            {tabs.map((tab) => (
              <Button
                key={tab}
                variant={activeTab === tab ? "default" : "ghost"}
                className={`${
                  activeTab === tab
                    ? "bg-[#00B8D9] text-white"
                    : "text-gray-400 hover:text-white"
                } rounded-t-lg px-4 py-2`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </Button>
            ))}
          </div>
        </div>
        <div className="relative overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-800">
                <TableHead className="text-gray-400">#</TableHead>
                <TableHead className="text-gray-400">Name</TableHead>
                <TableHead className="text-gray-400">Price</TableHead>
                <TableHead className="text-gray-400">24h</TableHead>
                <TableHead className="text-gray-400">7d</TableHead>
                <TableHead className="text-gray-400">30d</TableHead>
                <TableHead className="text-gray-400">Market Cap</TableHead>
                <TableHead className="text-gray-400">Volume(24h)</TableHead>
                <TableHead className="text-gray-400">Last 7 Days</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cryptoData.map((crypto) => (
                <TableRow key={crypto.id} className="border-gray-800">
                  <TableCell className="font-medium text-gray-300">
                    {crypto.id}
                  </TableCell>
                  <TableCell className="text-gray-300">{crypto.name}</TableCell>
                  <TableCell className="text-gray-300">
                    $
                    {crypto.price.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell
                    className={
                      crypto.change24h > 0 ? "text-green-500" : "text-red-500"
                    }
                  >
                    {crypto.change24h.toFixed(3)}%
                  </TableCell>
                  <TableCell
                    className={
                      crypto.change7d > 0 ? "text-green-500" : "text-red-500"
                    }
                  >
                    {crypto.change7d.toFixed(3)}%
                  </TableCell>
                  <TableCell
                    className={
                      crypto.change30d > 0 ? "text-green-500" : "text-red-500"
                    }
                  >
                    {crypto.change30d.toFixed(3)}%
                  </TableCell>
                  <TableCell className="text-gray-300">
                    ${formatLargeNumber(crypto.marketCap)}
                  </TableCell>
                  <TableCell className="text-gray-300">
                    ${formatLargeNumber(crypto.volume)}
                  </TableCell>
                  <TableCell className="w-[100px]">
                    <ResponsiveContainer height={40}>
                      <LineChart data={crypto.sparklineData}>
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="#00B8D9"
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-400">Rows per page:</span>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => setItemsPerPage(Number(value))}
            >
              <SelectTrigger className="w-[70px]">
                <SelectValue placeholder={itemsPerPage} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-gray-400">
              {(currentPage - 1) * itemsPerPage + 1}-
              {Math.min(currentPage * itemsPerPage, cryptoData.length)} of{" "}
              {cryptoData.length}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
export default PricePageCompo;
