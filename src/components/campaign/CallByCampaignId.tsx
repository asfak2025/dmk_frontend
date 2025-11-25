import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Eye, Phone, MoreHorizontal } from 'lucide-react'

function CallByCampaignId({ callData }: { callData: Array<any> }) {
  console.log(callData)

  // Flatten the data for easier rendering
  const flattenedData = callData.flatMap(call =>
    call.agentNos.flatMap(agentNos =>
      agentNos.callHistory.map(element => ({
        agentNumber: agentNos.number,
        userNumber: element.userNo,
        timestamp: element.timestamp,
        status: element.status,
        key: `${agentNos.number}-${element.status}-${element.timestamp}`
      }))
    )
  )

  return (

    // <Card className="border-gray-200">
    //   <CardHeader>
    //     <CardTitle className="text-lg">Campaign History</CardTitle>
    //     <CardDescription>Call History of campaign </CardDescription>
    //   </CardHeader>
    //   <CardContent>
    //     <div className="hidden md:block"></div>
    //     <Table className='w-full border border-gray-200 shadow-sm rounded-lg overflow-hidden bg-white'>
    //       <TableHeader className="bg-gray-100">
    //         <TableRow >
    //           <TableHead className="px-6 py-4 text-left text-md font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
    //             Agent No
    //           </TableHead>
    //           <TableHead className="px-6 py-4 text-left text-md font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
    //             User No
    //           </TableHead>
    //           <TableHead className="px-6 py-4 text-left text-md font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
    //             Date/Time
    //           </TableHead>
    //           <TableHead className="px-6 py-4 text-left text-md font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
    //             Status
    //           </TableHead>
    //         </TableRow>
    //       </TableHeader>
    //       <TableBody>
    //         {callData.map(call =>
    //           call.agentNos.map(agentNos =>
    //             agentNos.callHistory.map(element => (
    //               <TableRow key={`${agentNos.number}-${element.status}`}>
    //                 <TableCell className="px-6 py-4 text-sm text-gray-700 font-small">{agentNos.number}</TableCell>
    //                 <TableCell className="px-6 py-4 text-sm text-gray-700 font-small">{element.userNo}</TableCell>
    //                 <TableCell className="px-6 py-4 text-sm text-gray-700 font-small">{element.timestamp}</TableCell>
    //                 <TableCell className="px-6 py-4 text-sm text-gray-700 font-medium justify-center align-middle"><span
    //                   className={`${element.status === "MISSED" ? "bg-red-300 text-red-800" : "bg-green-300 text-green-800"} font-semibold rounded-full align-middle justify-center  p-1.5 `}>
    //                   {element.status}</span></TableCell>
    //               </TableRow>
    //             ))
    //           )
    //         )}
    //       </TableBody>

    //     </Table>
    //   </CardContent>
    // </Card>
    <Card className="border-gray-200">
      <CardHeader>
        <CardTitle className="text-lg">Campaign History</CardTitle>
        <CardDescription>Call History of campaign</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Desktop Table View */}
        <div className="hidden md:block">
          <Table className='w-full border border-gray-200 shadow-sm rounded-lg overflow-hidden bg-white'>
            <TableHeader className="bg-gray-100">
              <TableRow>
                <TableHead className="px-6 py-4 text-left text-md font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                  Agent No
                </TableHead>
                <TableHead className="px-6 py-4 text-left text-md font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                  User No
                </TableHead>
                <TableHead className="px-6 py-4 text-left text-md font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                  Date/Time
                </TableHead>
                <TableHead className="px-6 py-4 text-left text-md font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {callData.map(call =>
                call.agentNos.map(agentNos =>
                  agentNos.callHistory.map(element => (
                    <TableRow key={`${agentNos.number}-${element.status}`}>
                      <TableCell className="px-6 py-4 text-sm text-gray-700 font-small">{agentNos.number}</TableCell>
                      <TableCell className="px-6 py-4 text-sm text-gray-700 font-small">{element.userNo}</TableCell>
                      <TableCell className="px-6 py-4 text-sm text-gray-700 font-small">{element.timestamp}</TableCell>
                      <TableCell className="px-6 py-4 text-sm text-gray-700 font-medium justify-center align-middle">
                        <span 
                          className={`${element.status==="MISSED"? "bg-red-300 text-red-800":"bg-green-300 text-green-800"} font-semibold rounded-full align-middle justify-center p-1.5`}>
                          {element.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                )
              )}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {flattenedData.length === 0 ? (
            <Card className="shadow-sm">
              <CardContent className="p-6 text-center">
                <p className="text-gray-500">No call history found.</p>
              </CardContent>
            </Card>
          ) : (
            flattenedData.map((call, index) => (
              <Card key={call.key} className="shadow-sm border border-gray-200">
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
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <hr className="border-gray-200 mb-3" />
                  
                  {/* Agent Number */}
                  <div className="mb-3">
                    <span className="text-sm font-medium text-gray-600">Agent No:</span>
                    <p className="text-base text-gray-900 mt-1 font-medium">{call.agentNumber}</p>
                  </div>
                  
                  <hr className="border-gray-200 mb-3" />
                  
                  {/* User Number */}
                  <div className="mb-3">
                    <span className="text-sm font-medium text-gray-600">User No:</span>
                    <p className="text-base text-gray-900 mt-1">{call.userNumber}</p>
                  </div>
                  
                  <hr className="border-gray-200 mb-3" />
                  
                  {/* Date/Time */}
                  <div className="mb-3">
                    <span className="text-sm font-medium text-gray-600">Date/Time:</span>
                    <p className="text-base text-gray-900 mt-1">{call.timestamp}</p>
                  </div>
                  
                  <hr className="border-gray-200 mb-3" />
                  
                  {/* Status */}
                  <div>
                    <span className="text-sm font-medium text-gray-600">Status:</span>
                    <div className="mt-2">
                      <span 
                        className={`${call.status==="MISSED"? "bg-red-300 text-red-800":"bg-green-300 text-green-800"} font-semibold rounded-full px-3 py-1.5 text-xs`}>
                        {call.status}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default CallByCampaignId
