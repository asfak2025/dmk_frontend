'use client';

import { useState } from 'react';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
  import { Button } from '@/components/ui/button';
import { Edit, Eye, Trash2 } from 'lucide-react';


type TableRowData = Record<string, string|any|unknown>;

type ReusableTableProps = {
  title: string;
  headers: string[];
  data: TableRowData[];
  filterByKey?: string; // Optional: key to filter by (e.g., 'category')
};

export default function ReusableTable({
  title,
  headers,
  data,
  filterByKey,
}: ReusableTableProps) {
  const [selectedFilter, setSelectedFilter] = useState('All');
 console.log("data", data); 
  const allFilterValues = filterByKey
    ? Array.from(new Set(data.map((item) => item[filterByKey])))
    : [];

  const filteredData =
    selectedFilter === 'All'
      ? data
      : data.filter((item) => item[filterByKey!] === selectedFilter);

  return (
    // <Card>
    //   <CardHeader>
    //     <CardTitle>{title}</CardTitle>
    //     {filterByKey && (
    //       <div className="flex justify-end items-center gap-4">
    //         <label htmlFor="category" className="font-medium">
    //           Filter by {filterByKey.charAt(0).toUpperCase() + filterByKey.slice(1)}:
    //         </label>
    //         <Select onValueChange={setSelectedFilter} defaultValue="All">
    //           <SelectTrigger className="w-64">
    //             <SelectValue placeholder="Select filter" />
    //           </SelectTrigger>
    //           <SelectContent>
    //             <SelectItem value="All">All</SelectItem>
    //             {allFilterValues.map((val) => (
    //               <SelectItem key={val} value={val}>
    //                 {val}
    //               </SelectItem>
    //             ))}
    //           </SelectContent>
    //         </Select>
    //       </div>
    //     )}
    //   </CardHeader>

    //   <CardContent>
    //     <Table>
    //       <TableHeader>
    //         <TableRow>
    //           {headers.map((header) => (
    //             <TableHead key={header}>{header}</TableHead>
    //           ))}
    //         </TableRow>
    //       </TableHeader>
    //       <TableBody>
    //         {filteredData.slice(0, 20).map((row, idx) => (
    //           <TableRow key={idx}>
    //             {headers.map((header) => (
    //               <TableCell key={header}>{row[header] ?? '-'}</TableCell>
    //             ))}
    //           </TableRow>
    //         ))}
    //       </TableBody>
    //     </Table>
    //   </CardContent>
    // </Card>
     <Card>
      <CardHeader>
        <CardTitle >{title}</CardTitle>
        {filterByKey && (
          <div className="flex justify-end items-center gap-4">
            <label htmlFor="category" className="font-medium">
              Filter by {filterByKey.charAt(0).toUpperCase() + filterByKey.slice(1)}:
            </label>
            <Select onValueChange={setSelectedFilter} defaultValue="All">
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Select filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                {allFilterValues.map((val) => (
                  <SelectItem key={val} value={val}>
                    {val}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </CardHeader>

      <CardContent>
        {/* Desktop Table View */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                {headers.map((header) => (
                  <TableHead key={header}>{header}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.slice(0, 20).map((row, idx) => (
                <TableRow key={idx}>
                  {headers.map((header) => (
                    <TableCell key={header}>{row[header] ?? '-'}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {filteredData.length === 0 ? (
            <Card className="shadow-sm">
              <CardContent className="p-6 text-center">
                <p className="text-gray-500">No records found.</p>
              </CardContent>
            </Card>
          ) : (
            filteredData.slice(0, 20).map((row, index) => (
              <Card key={index} className="shadow-sm border border-gray-200">
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
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <hr className="border-gray-200 mb-3" />
                  
                  {/* Dynamic Fields */}
                  {headers.map((header, headerIndex) => (
                    <div key={header}>
                      <div className="mb-3">
                        <span className="text-sm font-medium text-gray-600">
                          {header.charAt(0).toUpperCase() + header.slice(1)}:
                        </span>
                        <p className="text-base text-gray-900 mt-1">
                          {row[header] ?? '-'}
                        </p>
                      </div>
                      
                      {/* Add HR line except for the last item */}
                      {headerIndex < headers.length - 1 && (
                        <hr className="border-gray-200 mb-3" />
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
