import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Eye } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";

function PaymentTable({ transactionHistory }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="outline" className="border-green-500 text-green-600">
            Completed
          </Badge>
        );
      case "pending":
        return (
          <Badge
            variant="outline"
            className="border-yellow-500 text-yellow-600"
          >
            Pending
          </Badge>
        );
      case "failed":
        return (
          <Badge variant="outline" className="border-red-500 text-red-600">
            Failed
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  return (
    // <div className="overflow-x-auto">
    //   <Table className="w-full border-collapse">
    //     <TableHeader>
    //       <TableRow className="border-b border-gray-200 text-center">
    //         <TableHead className="text-center py-3 px-4 font-medium text-black/75">
    //           Date
    //         </TableHead>
    //         <TableHead className="text-center py-3 px-4 font-medium text-black/75">
    //           Cost
    //         </TableHead>
    //         <TableHead className="text-center py-3 px-4 font-medium text-black/75">
    //           Peak Hours
    //         </TableHead>
    //         <TableHead className="text-center py-3 px-4 font-medium text-black/75">
    //           Off-Peak Hours
    //         </TableHead>
    //         <TableHead className="text-center py-3 px-4 font-medium text-black/75">
    //           Status
    //         </TableHead>
    //       </TableRow>
    //     </TableHeader>
    //     <TableBody>
    //       {transactionHistory.map((txn) => (
    //         <TableRow
    //           key={txn.id}
    //           className="border-b border-gray-100 hover:bg-gray-50 text-center"
    //         >
    //           <TableCell className="py-2 px-4">{txn.date}</TableCell>
    //           <TableCell className="py-2 px-4 font-semibold">
    //             ₹{txn.cost.toFixed(2)}
    //           </TableCell>
    //           <TableCell className="py-2 px-4">{txn.peakHours}</TableCell>
    //           <TableCell className="py-2 px-4">{txn.offPeakHours}</TableCell>
    //           <TableCell className="py-2 px-4">
    //             {getStatusBadge(txn.status)}
    //           </TableCell>
    //         </TableRow>
    //       ))}
    //     </TableBody>
    //   </Table>
    // </div>
      <>
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <Table className="w-full border-collapse">
          <TableHeader>
            <TableRow className="border-b border-gray-200 text-center">
              <TableHead className="text-center py-3 px-4 font-medium text-black/75">
                Date
              </TableHead>
              <TableHead className="text-center py-3 px-4 font-medium text-black/75">
                Cost
              </TableHead>
              <TableHead className="text-center py-3 px-4 font-medium text-black/75">
                Peak Hours
              </TableHead>
              <TableHead className="text-center py-3 px-4 font-medium text-black/75">
                Off-Peak Hours
              </TableHead>
              <TableHead className="text-center py-3 px-4 font-medium text-black/75">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactionHistory.map((txn) => (
              <TableRow
                key={txn.id}
                className="border-b border-gray-100 hover:bg-gray-50 text-center"
              >
                <TableCell className="py-2 px-4">{txn.date}</TableCell>
                <TableCell className="py-2 px-4 font-semibold">
                  ₹{txn.cost.toFixed(2)}
                </TableCell>
                <TableCell className="py-2 px-4">{txn.peakHours}</TableCell>
                <TableCell className="py-2 px-4">{txn.offPeakHours}</TableCell>
                <TableCell className="py-2 px-4">
                  {getStatusBadge(txn.status)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {transactionHistory.length === 0 ? (
          <Card className="shadow-sm">
            <CardContent className="p-6 text-center">
              <p className="text-gray-500">No transactions found.</p>
            </CardContent>
          </Card>
        ) : (
          transactionHistory.map((txn, index) => (
            <Card key={txn.id} className="shadow-sm border border-gray-200">
              <CardContent className="p-4">
                {/* Header with ID and Actions */}
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-medium text-gray-600">#{index + 1}</span>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <hr className="border-gray-200 mb-3" />
                
                {/* Date */}
                <div className="mb-3">
                  <span className="text-sm font-medium text-gray-600">Date:</span>
                  <p className="text-base text-gray-900 mt-1">{txn.date}</p>
                </div>
                
                <hr className="border-gray-200 mb-3" />
                
                {/* Cost */}
                <div className="mb-3">
                  <span className="text-sm font-medium text-gray-600">Cost:</span>
                  <p className="text-base font-semibold text-gray-900 mt-1">₹{txn.cost.toFixed(2)}</p>
                </div>
                
                <hr className="border-gray-200 mb-3" />
                
                {/* Peak Hours */}
                <div className="mb-3">
                  <span className="text-sm font-medium text-gray-600">Peak Hours:</span>
                  <p className="text-base text-gray-900 mt-1">{txn.peakHours}</p>
                </div>
                
                <hr className="border-gray-200 mb-3" />
                
                {/* Off-Peak Hours */}
                <div className="mb-3">
                  <span className="text-sm font-medium text-gray-600">Off-Peak Hours:</span>
                  <p className="text-base text-gray-900 mt-1">{txn.offPeakHours}</p>
                </div>
                
                <hr className="border-gray-200 mb-3" />
                
                {/* Status */}
                <div>
                  <span className="text-sm font-medium text-gray-600">Status:</span>
                  <div className="mt-2">
                    {getStatusBadge(txn.status)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </>
  );
}

export default PaymentTable;
