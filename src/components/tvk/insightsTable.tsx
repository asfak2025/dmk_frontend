// 'use client';

// import React, { useState, useMemo, useEffect } from 'react';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
// import { getFromLocalStorage } from '../encryption/encryption';
// import { useAppContext } from '@/hooks/context';
// import { getCallLogs } from '@/apis/analytics';
// import { Button } from '@/components/ui/button';
// import { Eye, MoreHorizontal, Phone } from 'lucide-react';


// export default function ComplaintCallTable({ constituency_id }) {
//   const [selectedCategory, setSelectedCategory] = useState("All");
//    const token = getFromLocalStorage('token')
//       const memberId = getFromLocalStorage('memberId')
//       const orgId = getFromLocalStorage('orgId')
      
//       const [tableData,setTableData] = useState([])
//   // Flatten all calls
//  const categoryOptions = ["All","Water Supply","Garbage Collection","Public Health","Road Condition","Welfare Scheme","Electricity"]
//   useEffect(()=>{
//     fetchRecentCalls()
//   },[selectedCategory])
  
//   async function fetchRecentCalls() {
//     try{
//       console.log("fetched")
//       const payload = {constituency_id:constituency_id}
//       if(selectedCategory !=="All"){
//         payload["callCategory"] = selectedCategory
//       }
//         const response = await  getCallLogs(payload)
//         if(response.status ===200){
//           const data = await response.json()
//           setTableData(data.logs)
//         }
//         else{
//           console.log("error")
//         }
//     }catch(e){
//       console.log(e)
//     }
//   }
// <Card className="p-4 my-5 bg-white rounded shadow-md overflow-x-auto">
//   <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
//     <CardTitle className="text-lg font-semibold">Recent Feedbacks</CardTitle>

//     <div className="w-full sm:w-auto">
//       <Select value={selectedCategory} onValueChange={setSelectedCategory}>
//         <SelectTrigger className="w-full sm:w-[200px]">
//           <SelectValue placeholder="Select category" />
//         </SelectTrigger>
//         <SelectContent>
//           {categoryOptions.map((cat) => (
//             <SelectItem key={`${cat}`} value={`${cat}`}>
//               {`${cat}`}
//             </SelectItem>
//           ))}
//         </SelectContent>
//       </Select>
//     </div>
//   </CardHeader>

//   {tableData?.length === 0 ? (
//     <div className="text-gray-500 text-center py-6">No data available</div>
//   ) : (
//     <>
//       {/* Desktop Table View */}
//       <div className="hidden md:block">
//         <CardContent>
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Call ID</TableHead>
//                 <TableHead>Number</TableHead>
//                 <TableHead>Feedback Type</TableHead>
//                 <TableHead>Emotional State</TableHead>
//                 <TableHead>Category</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {tableData.map((call, index) => (
//                 <TableRow key={index}>
//                   <TableCell>{call.callId}</TableCell>
//                   <TableCell>{call.customerNumber}</TableCell>
//                   <TableCell>{call.callSummary.feedbackType}</TableCell>
//                   <TableCell>{call.callSummary.emotionalState}</TableCell>
//                   <TableCell>{call.callCategory}</TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </CardContent>
//       </div>

//       {/* Mobile Card View */}
//       <div className="md:hidden px-4 pb-4">
//         <div className="space-y-4">
//           {tableData.map((call, index) => (
//             <Card key={index} className="shadow-sm border border-gray-200">
//               <CardContent className="p-4">
//                 {/* Header with ID and Actions */}
//                 <div className="flex justify-between items-center mb-4">
//                   <span className="text-sm font-medium text-gray-600">#{index + 1}</span>
//                   <div className="flex gap-2">
//                     <Button
//                       variant="ghost"
//                       size="icon"
//                       className="h-8 w-8"
//                     >
//                       <Eye className="h-4 w-4" />
//                     </Button>
//                     <Button
//                       variant="ghost"
//                       size="icon"
//                       className="h-8 w-8"
//                     >
//                       <Phone className="h-4 w-4" />
//                     </Button>
//                     <Button
//                       variant="ghost"
//                       size="icon"
//                       className="h-8 w-8"
//                     >
//                       <MoreHorizontal className="h-4 w-4" />
//                     </Button>
//                   </div>
//                 </div>
                
//                 <hr className="border-gray-200 mb-3" />
                
//                 {/* Call ID */}
//                 <div className="mb-3">
//                   <span className="text-sm font-medium text-gray-600">Call ID:</span>
//                   <p className="text-base text-gray-900 mt-1 font-medium">{call.callId}</p>
//                 </div>
                
//                 <hr className="border-gray-200 mb-3" />
                
//                 {/* Number */}
//                 <div className="mb-3">
//                   <span className="text-sm font-medium text-gray-600">Number:</span>
//                   <p className="text-base text-gray-900 mt-1">{call.customerNumber}</p>
//                 </div>
                
//                 <hr className="border-gray-200 mb-3" />
                
//                 {/* Feedback Type */}
//                 <div className="mb-3">
//                   <span className="text-sm font-medium text-gray-600">Feedback Type:</span>
//                   <p className="text-base text-gray-900 mt-1">{call.callSummary.feedbackType}</p>
//                 </div>
                
//                 <hr className="border-gray-200 mb-3" />
                
//                 {/* Emotional State */}
//                 <div className="mb-3">
//                   <span className="text-sm font-medium text-gray-600">Emotional State:</span>
//                   <p className="text-base text-gray-900 mt-1 capitalize">{call.callSummary.emotionalState}</p>
//                 </div>
                
//                 <hr className="border-gray-200 mb-3" />
                
//                 {/* Category */}
//                 <div>
//                   <span className="text-sm font-medium text-gray-600">Category:</span>
//                   <p className="text-base text-gray-900 mt-1">{call.callCategory}</p>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       </div>
//     </>
//   )}
// </Card>
 
// }


'use client';

import React, { useState, useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export default function ComplaintCallTable({ categories }) {
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Flatten all calls
  const allCalls = useMemo(() => {
    const calls = [];
    categories?.forEach((category) => {
      category.calls?.forEach((call) => {
        calls.push({
          booth_id: category.booth_id,
          number: call.callerNumber,
          description: call.transcript,
          emotional_state: call.emotional_state,
          category: category.category,
        });
      });
    });
    return calls;
  }, [categories]);

  // Unique category options
  const categoryOptions = useMemo(() => {
    const unique = new Set(categories?.map((c) => c.category));
    return ["All", ...Array.from(unique)];
  }, [categories]);

  const filteredCalls =
    selectedCategory === "All"
      ? allCalls
      : allCalls.filter((call) => call.category === selectedCategory);

  return (
    <Card className="p-4 my-5 bg-white rounded shadow-md overflow-x-auto">
      <CardHeader >
        <CardTitle className="text-lg font-semibold"> Recent Feedbacks</CardTitle>
        <div className='flex justify-end'>
        <Select  value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categoryOptions.map((cat) => (
              <SelectItem key={`${cat}`} value={`${cat}`}>
                {`${cat}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        </div>
      </CardHeader>

      {filteredCalls.length === 0 ? (
        <div className="text-gray-500 text-center py-6">No data available</div>
      ) : (
        <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Booth ID</TableHead>
              <TableHead>Number</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Emotional State</TableHead>
              <TableHead>Category</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCalls.slice(0,10).map((call, index) => (
              <TableRow key={index}>
                <TableCell>{call.booth_id}</TableCell>
                <TableCell>{call.number}</TableCell>
                <TableCell>{call.description}</TableCell>
                <TableCell>{call.emotional_state}</TableCell>
                <TableCell>{call.category}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </CardContent>
      )}
    </Card>
  );
}
