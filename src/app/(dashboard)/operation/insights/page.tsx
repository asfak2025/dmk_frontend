// 'use client'
// import React, { useState, useEffect, useCallback } from 'react'
// import { Phone, CheckCircle, X, View, ChevronLeft, ChevronRight, Filter, Search, TrendingUp } from 'lucide-react'
// import { useRouter, useSearchParams } from 'next/navigation'
// import { Button } from '@/components/ui/button'
// import CallDetailsModal from '@/components/callData/callDetailsModal'
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Input } from "@/components/ui/input"
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
// import Container from '@/components/ui/container'
// import ReusableTable from '@/components/tvk/table'
// import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from '@/components/ui/breadcrumb'
// import PageTitle from '@/components/ui/pageTitle'
// import { useAlert } from '@/hooks/alertHook'
// import { useAppContext } from '@/hooks/context'
// import { getFromLocalStorage } from '@/components/encryption/encryption'
// import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
// import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts"
// import AudioWaveform from '@/components/ui/wavesurfer'
// import { useSession } from 'next-auth/react'

// interface FilterState {
//   callType: string
//   status: string
//   fromDate: any
//   toDate: any
//   searchTerm: string
// }

// interface ApiResponse {
//   logs: Call[]
//   total: number
//   page: number
//   limit: number
//   totalPages: number
// }

// interface AnalyticsData {
//   period: string
//   totalCalls: number
//   positiveCalls: number
//   negativeCalls: number
//   positiveCount: number
//   negativeCount: number
//   responseTime: number
// }

// interface CallDetailsModalProps {
//   isOpen: boolean;
//   call: Call | null;
//   onClose: () => void;
// }

// interface CallSummary {
//   conversation_summary?: string
//   feedbackType?: string
//   callDuration?: string
//   transcript?: string
//   sentimentAnalysis?: any
//   keyPoints?: string[]
//   emotionalState: string
//   transcription?: string
// }

// interface Call {
//   callId: string;
//   customerNumber: string;
//   callCategory: string;
//   callSummary: CallSummary;
//   callStartTime:string;
//   id?:string;
//   type?: 'positive' | 'negative';
//   date?: string;
//   time?: string;
//   audioUrl?: string;
//   agentNotes?: string;
//   followUpRequired?: boolean;
//   duration?:string;
//   callerNumber?:string;
//   description?:string;
//   status?:string;
//   transcriptions?:any;
// }

// // Debounce utility function
// const debounceApiCall = (func: Function, delay: number) => {
//   let timeoutId: NodeJS.Timeout;
//   return (...args: any[]) => {
//     clearTimeout(timeoutId);
//     timeoutId = setTimeout(() => func.apply(null, args), delay);
//   };
// };

// const Page: React.FC = () => {
//   const router = useRouter()
//   const{data:session}=useSession()
//   const searchParams = useSearchParams()
//   const [isModalOpen, setIsModalOpen] = useState(false)
//   const [selectedCall, setSelectedCall] = useState<Call | null>(null)
//   const [filteredCalls, setFilteredCalls] = useState<Call[]>([])
//   const [filter, setFilter] = useState<FilterState>({
//     callType: 'ALL',
//     status: 'ALL',
//     fromDate: new Date().toISOString().slice(0, 10),
//     toDate: new Date().toISOString().slice(0, 10),
//     searchTerm: ''
//   })

//   const [currentPage, setCurrentPage] = useState(1)
//   const [totalPages, setTotalPages] = useState(1)
//   const recordsPerPage = 10
//   const [isLoading, setIsLoading] = useState(false)
//   const token = getFromLocalStorage('token')
//   const memberId = getFromLocalStorage('memberId')
//   const orgId = getFromLocalStorage('orgId')
//   const constituencyId = searchParams.get('constituencyId')
//   const districtId = searchParams.get('districtId')
//   const districtName=searchParams.get("districtName")
//   const categoryName = searchParams.get("categoryName")
//   const [total, setTotal] = useState({totalCalls:"", totalPositive:"", totalNegative:""})
//   const {URL} = useAppContext()
//   const [selectedTab, setSelectedTab] = useState<'calllogs' | 'analytics'>('calllogs')
//   const [analyticsView, setAnalyticsView] = useState<'day' | 'week' | 'month'>('week')
//   const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc')
//   const [chartData, setChartData] = useState<AnalyticsData[]>([])
//   const [dateFrom, setDateFrom] = useState(new Date(new Date().setDate(1)).toISOString().slice(0, 10));
//   const [dateTo, setDateTo] = useState(new Date().toISOString().slice(0, 10));

//   console.log(total,"totallllll")

//   const resolvedCalls = filteredCalls.filter(call => call.callSummary?.feedbackType === 'Resolved').length
//   const currentCategory = {
//     total: filteredCalls.length,
//     positive: filteredCalls.filter(call => call.callSummary?.feedbackType === 'Positive').length,
//     negative: filteredCalls.filter(call => call.callSummary?.feedbackType === 'Negative').length
//   }

//   // Debounced search function
//   const debouncedSearch = useCallback(
//     debounceApiCall(async (newTerm: string, page: number = currentPage) => {
//       setIsLoading(true)
//       try {
//         const response = await fetch(`${URL}/call/search-log`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${token}`,
//             "X-Member-Id": memberId
//           },
//           body: JSON.stringify({
//             "search_term": newTerm,
//             "page": page,
//             "limit": recordsPerPage,
//           })
//         })

//         if (!response.ok) {
//           throw new Error('Failed to fetch calls')
//         }

//         const data = await response.json()
//         console.log("====>", data.log)
//         setFilteredCalls(data.log || [])
//         setTotalPages(data.total || 1)
//         setCurrentPage(page)
//       } catch (error) {
//         console.error('Error fetching calls:', error)
//       } finally {
//         setIsLoading(false)
//       }
//     }, 1000),
//     [URL, token, memberId, recordsPerPage, currentPage]
//   );

//   const fetchCalls = async (page: number = currentPage) => {
//     setIsLoading(true)
//     try {
//       if (!constituencyId || !categoryName) return

//       const payload = {
//         constituencyId,
//         districtId,
//         orgId,
//         callCategory: categoryName,
//         callType: filter.callType !== 'ALL' ? filter.callType : undefined,
//         callStatus: filter.status !== 'ALL' ? filter.status.toLowerCase() : undefined,
//         dateFrom: filter.fromDate || undefined,
//         dateTo: filter.toDate || undefined,
//         searchTerm: filter.searchTerm || undefined,
//         page,
//         limit: recordsPerPage,
//         sortOrder
//       }

//       const response = await fetch(`${URL}/call/get-calls`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//           "X-Member-Id": memberId
//         },
//         body: JSON.stringify(payload)
//       })

//       if (!response.ok) {
//         throw new Error('Failed to fetch calls')
//       }

//       const data: ApiResponse = await response.json()
//       setFilteredCalls(data.logs || [])
//       setTotalPages(data.totalPages || 1)
//       setCurrentPage(page)
//     } catch (error) {
//       console.error('Error fetching calls:', error)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const fetchCallDetails = async (callId: string) => {
//     console.log("Fetching call details for ID:", callId)
//     const token=session?.accessToken
//     const memberId=session?.memberId
//     const orgId=session?.orgId
//     setIsLoading(true);
//     try {
//       if (!callId) throw new Error('Call ID or Org ID is missing');
//       const response = await fetch(`${URL}/call/getlogById/?callId=${callId}`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//           "X-Member-Id": memberId
//         }
//       });
//       if (!response.ok) {
//         throw new Error('Failed to fetch call details');
//       }

//       const data = await response.json();
//       return data;
//     } catch (error) {
//       console.error('Error fetching call details:', error);
//       throw error;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const fetchAnalytics = async () => {
//     setIsLoading(true)
//     try {
//       if (!constituencyId || !categoryName) return

//       const response = await fetch(`${URL}/call/chart-analytics`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//           "X-Member-Id": memberId
//         },
//         body: JSON.stringify({
//           constituencyId,
//           districtId,
//           orgId,
//           dateFrom: filter.fromDate || undefined,
//           dateTo: filter.toDate || undefined,
//           pattern: analyticsView,
//           callCategory: categoryName,
//           groupBy:"callCategory",
//           overallData:true
//         })
//       })

//       if (!response.ok) {
//         throw new Error('Failed to fetch analytics')
//       }

//       const data = await response.json()
//       setChartData(data?.overallData?.timeSeries || [])
//       setTotal(data?.overallData?.summary)
//     } catch (error) {
//       console.error('Error fetching analytics:', error)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   useEffect(() => {
//     if (selectedTab === 'calllogs') {
//       // Use search if there's a search term, otherwise use regular fetch
//       if (filter.searchTerm.trim()) {
//         debouncedSearch(filter.searchTerm, 1);
//       } else {
//         fetchCalls(1);
//       }
//     } else if (selectedTab === 'analytics') {
//       fetchAnalytics();
//     }
//   }, [selectedTab, filter.searchTerm, analyticsView, sortOrder])

//   // useEffect(() => {
//   //   if (selectedTab === 'calllogs' && !filter.searchTerm.trim()) {
//   //     fetchCalls(1)
//   //   }
//   // }, [searchParams, filter.callType, filter.status, filter.fromDate, filter.toDate, selectedTab])

//   const openModal = async (call: Call) => {
//     try {
//       setIsLoading(true);
//       const callDetails = await fetchCallDetails(call.callId);
//       setSelectedCall(callDetails.data);
//       setIsModalOpen(true);
//     } catch (error) {
//       console.error('Error loading call details:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const closeModal = () => {
//     setIsModalOpen(false)
//     setSelectedCall(null)
//   }

//   const resetFilters = () => {
//     setFilter({
//       callType: "ALL",
//       status: "ALL",
//       fromDate: "",
//       toDate: "",
//       searchTerm: ""
//     })
//   }

//   const handlePageChange = (newPage: number) => {
//     if (filter.searchTerm.trim()) {
//       debouncedSearch(filter.searchTerm, newPage);
//     } else {
//       fetchCalls(newPage);
//     }
//   }

//   const truncateWords = (text: string, maxWords: number) => {
//     if (!text) return ''
//     const words = text.split(' ')
//     return words.length > maxWords ? words.slice(0, maxWords).join(' ') + '...' : text
//   }

//   const formattedData = filteredCalls.map(call => ({
//     'Call ID': call.callId,
//     'Phone Number': call.customerNumber,
//     'Category': call.callCategory,
//     'Description': truncateWords(call.callSummary?.conversation_summary || '', 10),
//     'Status': call.callSummary?.feedbackType || '',
//     // 'Date & Time':new Date(`${call.callStartTime}`).toLocaleString('en-US', {
//     //   day: 'numeric',
//     //   month: 'short',
//     //   year: 'numeric',
//     //   hour: 'numeric',
//     //   minute: 'numeric',
//     //   hour12: true,
//     // }),
//     'Duration': call.callSummary?.callDuration + 's',
//     'Actions': (
//       <Button onClick={(e) => { e.stopPropagation(); openModal(call) }} variant="outline" size="sm">
//         <View className="w-4 h-4" /> Details
//       </Button>
//     ),
//     _original: call
//   }));

//   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const newSearchTerm = e.target.value;
//     setFilter({ ...filter, searchTerm: newSearchTerm });
//   };

//   return (
//     <Container>
//       <div className="max-w-7xl mx-auto">
//         {/* <div className="bg-white shadow-md md:shadow-lg border-b border-gray-200 mb-8">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//               <div className="flex flex-col gap-2">
//                 <PageTitle
//                   title={`Call Logs - ${categoryName || 'Category'}`}
//                   description={`Constituency: ${searchParams.get("constituencyName") || ''}`}
//                 />
//               </div>
//               <div className="flex justify-end">
//                 <Breadcrumb>
//                   <BreadcrumbList>
//                     <BreadcrumbItem>
//                       <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
//                     </BreadcrumbItem>
//                     <BreadcrumbSeparator />
//                     <BreadcrumbItem>
//                       <BreadcrumbPage>Call Logs</BreadcrumbPage>
//                     </BreadcrumbItem>
//                   </BreadcrumbList>
//                 </Breadcrumb>
//               </div>
//             </div>
//           </div>
//         </div> */}

//         <PageTitle
//                   title={`${categoryName || 'Category'} call logs`}
//                   // description={`Constituency: ${searchParams.get("constituencyName") || ''}`}
//                 >
//                   <Breadcrumb>
//                   <BreadcrumbList>
//                     <BreadcrumbItem>
//                       <BreadcrumbLink href="/operation/dashboard">Dashboard</BreadcrumbLink>
//                     </BreadcrumbItem>
//                      <BreadcrumbSeparator />
//                     <BreadcrumbItem>
//                       <BreadcrumbLink href={`/operation/constituency?districtId=${districtId}&districtName=${districtName}`}>Constituency</BreadcrumbLink>
//                     </BreadcrumbItem>
//                     <BreadcrumbSeparator />
//                     <BreadcrumbItem>
//                       <BreadcrumbLink href={`/operation/category?districtId=${districtId}&districtName=${districtName}&constituency_id=${constituencyId}`}>Category</BreadcrumbLink>
//                     </BreadcrumbItem>
//                     <BreadcrumbSeparator />
//                     <BreadcrumbItem>
//                       <BreadcrumbPage>Call Logs</BreadcrumbPage>
//                     </BreadcrumbItem>
//                   </BreadcrumbList>
//                 </Breadcrumb>
//                 </PageTitle>

//         {/* Stats Cards */}
//         {selectedTab === 'analytics' &&
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//           <Card className="transition-transform duration-300 hover:shadow-lg hover:scale-[1.02] ">
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">Total Calls</p>
//                   <p className="text-2xl font-bold text-black">{total.totalCalls}</p>
//                 </div>
//                 <div className="border border-indigo-100 p-3 rounded-2xl bg-indigo-50">
//                   <Phone className="w-6 h-6 text-indigo-600" />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="transition-transform duration-300 hover:shadow-lg hover:scale-[1.02] ">
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">Positive Feedback</p>
//                   <p className="text-2xl font-bold text-black">{total.totalPositive}</p>
//                 </div>
//                 <div className="border border-green-100 p-3 rounded-2xl bg-green-50">
//                   <CheckCircle className="w-6 h-6 text-green-600" />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="transition-transform duration-300 hover:shadow-lg hover:scale-[1.02] ">
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">Negative Feedback</p>
//                   <p className="text-2xl font-bold text-black">{total.totalNegative}</p>
//                 </div>
//                 <div className="border border-red-100 p-3 rounded-2xl bg-red-50">
//                   <X className="w-6 h-6 text-red-600" />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>}

//         {/* Filter */}
//         <Card className="shadow-sm mb-6">
//           <CardHeader className="pb-4">
//             <CardTitle className="flex items-center gap-2 text-lg">
//               <Filter className="w-5 h-5 text-purple-600" />
//               Filters
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//               {/* <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Call Type</label>
//                 <Select
//                   value={filter.callType}
//                   onValueChange={(value) => setFilter({ ...filter, callType: value })}
//                 >
//                   <SelectTrigger className="w-full">
//                     <SelectValue placeholder="All Types" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="ALL">All Types</SelectItem>
//                     <SelectItem value="positive">Positive</SelectItem>
//                     <SelectItem value="negative">Negative</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div> */}

//               {/* Status */}
//               {/* <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
//                 <Select value={filter.status} onValueChange={(value) => setFilter({ ...filter, status: value })}>
//                   <SelectTrigger className="w-full">
//                     <SelectValue placeholder="All Status" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="ALL">All Status</SelectItem>
//                     <SelectItem value="Resolved">Resolved</SelectItem>
//                     <SelectItem value="Pending">Pending</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div> */}

//               {/* From Date */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
//                 <Input
//                   type="date"
//                   value={filter.fromDate}
//                   onChange={(e) => setFilter({ ...filter, fromDate: e.target.value })}
//                   className="w-full"
//                   max={new Date().toISOString().split("T")[0]}
//                 />
//               </div>

//               {/* To Date */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
//                 <Input
//                   type="date"
//                   value={filter.toDate}
//                   onChange={(e) => setFilter({ ...filter, toDate: e.target.value })}
//                   className="w-full"
//                   max={new Date().toISOString().split("T")[0]}
//                 />
//               </div>

//               {/* Search Term */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
//                 <div className="relative">
//                   <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
//                   <Input
//                     type="text"
//                     placeholder="Search calls..."
//                     value={filter.searchTerm}
//                     onChange={handleSearchChange}
//                     className="pl-10 w-full"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="mt-6 flex justify-end gap-3">
//               <Button onClick={resetFilters} variant="outline" size="sm">
//                 Reset All Filters
//               </Button>
//               <Button onClick={()=>{
//                 if (filter.searchTerm.trim()) {
//                   debouncedSearch(filter.searchTerm, 1);
//                 } else {
//                   if(selectedTab!=='analytics'){
//                     fetchCalls(1);
//                   }else{
//                     fetchAnalytics()
//                   }
//                 }
//               }} variant="default" size="sm" className="bg-white hover:bg-black text-black hover:text-white border text-sm">
//                 <Search className="w-4 h-4 mr-2" />
//                 Search
//               </Button>
//             </div>
//           </CardContent>
//         </Card>

//         <div className="flex flex-col sm:flex-row sm:items-center gap-4 ">
//           <Tabs value={selectedTab} onValueChange={(value) => setSelectedTab(value as 'calllogs' | 'analytics')}>
//             <TabsList className="grid grid-cols-2 w-fit">
//               <TabsTrigger value="calllogs" className="flex items-center gap-2">
//                 <Phone className="w-4 h-4 text-indigo-600" />
//                 Logs
//               </TabsTrigger>
//               <TabsTrigger value="analytics" className="flex items-center gap-2">
//                 <TrendingUp className="w-4 h-4 text-purple-600" />
//                 Analytics
//               </TabsTrigger>
//             </TabsList>
//           </Tabs>
//         </div>

//         <Card className=" bg-card text-card-foreground border-none md:border md:shadow-sm">
//           <CardHeader className="px-0 py-6 md:p-6">
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between  gap-2">
//               <div className="flex flex-col sm:flex-row sm:items-center gap-4">
//                 <h2 className="text-xl font-semibold text-gray-800 ">
//                   {selectedTab === 'calllogs' ? 'Call History' : 'Analytics'}
//                 </h2>
//               </div>
//             </div>
//           </CardHeader>

//           <CardContent  className="p-0 md:p-6">
//             {selectedTab === 'analytics' ? (
//               <div className="bg-white rounded-lg shadow-sm border">
//                 <div className="p-6 pb-4">
//                   <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//                     <div>
//                       <h3 className="text-lg font-semibold text-gray-900 mb-1">Call Analytics Overview</h3>
//                       <p className="text-sm text-gray-600">
//                         {analyticsView === 'week' ? 'Weekly' : analyticsView === 'month' ? 'Monthly' : 'Daily'} call metrics breakdown
//                       </p>
//                     </div>
//                     <div className="flex gap-2">
//                       {['day', 'week', 'month'].map((view) => (
//                         <button
//                           key={view}
//                           onClick={() => setAnalyticsView(view as 'day' | 'week' | 'month')}
//                           className={`px-3 py-1 text-sm rounded transition-colors ${analyticsView === view
//                             ? 'bg-indigo-600 text-white'
//                             : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                             }`}
//                         >
//                           {view.charAt(0).toUpperCase() + view.slice(1)}
//                         </button>
//                       ))}
//                     </div>
//                   </div>
//                 </div>

//                 <div className="px-6 pb-4">
//                   <div className="h-80">
//                     <ResponsiveContainer width="100%" height="100%">
//                       <BarChart
//                         data={chartData}
//                         margin={{
//                           top: 20,
//                           right: 30,
//                           left: 20,
//                           bottom: 40,
//                         }}
//                       >
//                         <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
//                         <XAxis
//                           dataKey="timeLabel"
//                           tickLine={true}
//                           axisLine={true}
//                           tick={{
//                             fontSize: 11,
//                             fill: '#6b7280',
//                           }}
//                           interval={1 }
//                         />
//                         <YAxis
//                           tickLine={true}
//                           axisLine={true}
//                           tick={{
//                             fontSize: 12,
//                             fill: '#6b7280',
//                           }}
//                         />
//                         <Tooltip
//                           content={({ active, payload, label }) => {
//                             if (active && payload && payload.length) {
//                               return (
//                                 <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
//                                   <p className="font-medium text-gray-900 mb-2">{label}</p>
//                                   {payload.map((entry, index) => (
//                                     <p key={index} className="text-sm" style={{ color: entry.color }}>
//                                       {entry.name}: {entry.value}
//                                     </p>
//                                   ))}
//                                 </div>
//                               )
//                             }
//                             return null
//                           }}
//                         />
//                         <Bar
//                           dataKey="positiveCount"
//                           stackId="calls"
//                           fill="#4ade80"
//                           radius={[0, 0, 0, 0]}
//                           name="Positive Calls"
//                           barSize={80}
//                         />
//                         <Bar
//                           dataKey="negativeCount"
//                           stackId="calls"
//                           fill="#f87171"
//                           radius={[0, 0, 0, 0]}
//                           name="Negative Calls"
//                           barSize={80}
//                         />
//                         <Bar
//                           dataKey="totalCalls"
//                           stackId="calls"
//                           fill="#8b5cf6"
//                           radius={[4, 4, 0, 0]}
//                           name="Total Calls"
//                           barSize={80}
//                         />
//                       </BarChart>
//                     </ResponsiveContainer>
//                   </div>
//                   <div className="flex justify-center gap-6 mt-4">
//                     <div className="flex items-center gap-2">
//                       <div className="w-3 h-3 rounded-full bg-purple-500"></div>
//                       <span className="text-sm text-gray-600">Total Calls</span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <div className="w-3 h-3 rounded-full bg-green-400"></div>
//                       <span className="text-sm text-gray-600">Positive Calls</span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <div className="w-3 h-3 rounded-full bg-red-400"></div>
//                       <span className="text-sm text-gray-600">Negative Calls</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ) : (
//               <ReusableTable
//                 headers={['Call ID', 'Phone Number', 'Description', 'Status', 'Duration', 'Actions']}
//                 data={formattedData}
//                 title={`${categoryName || 'Category'} Call Logs`}
//               />
//             )}
//           </CardContent>
//         </Card>

//         {/* {selectedCall && (
//           <CallDetailsModal
//             isOpen={isModalOpen}
//             call={{
//               id: selectedCall.callId || selectedCall.id || '',
//               audioUrl: selectedCall.audioUrl || '',
//               duration: selectedCall.callSummary?.callDuration || selectedCall.duration || '',
//               customerPhone: selectedCall.customerNumber || selectedCall.callerNumber,
//               callStartTime: selectedCall.callStartTime,
//               callSummary: selectedCall.callSummary,
//               transcriptions: selectedCall.transcriptions || undefined
//             }}
//             onClose={closeModal}
//           />
//         )} */}
//       </div>
//     </Container>
//   )
// }

// export default Page

"use client";
import React, { useState, useEffect } from "react";
import {
  PhoneIncoming,
  PhoneOutgoing,
  ArrowLeft,
  Download,
  Calendar,
  Clock,
  User,
  Play,
  Pause,
  PhoneMissed,
  X,
  Volume2,
  View,
  Users,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Star,
  MessageCircle,
  Heart,
  FileText,
  CheckCircle,
  Filter,
  Search,
} from "lucide-react";
import { Phone, PhoneCall, Plus, PhoneOff } from "lucide-react";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import AudioWaveform from "@/components/ui/wavesurfer";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import CallDetailsModal from "@/components/callData/callDetailsModal";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltipContent,
  ChartConfig,
  ChartLegendContent,
} from "@/components/ui/charts";
import Container from "@/components/ui/container";
import ReusableTable from "@/components/tvk/table";
import constituency from "@/data/constituency.json";
import { Legend, CartesianGrid } from "recharts";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import PageTitle from "@/components/ui/pageTitle";

// interface PageProps {
//   params: {
//     constituencyId: string
//     categoryName: string
//   }
// }

interface TranscriptionLine {
  speaker: string;
  text: string;
  language: string;
}

interface Call {
  id: string;
  type: "positive" | "negative";
  date: string;
  time: string;
  callerNumber: string;
  description: string;
  audioUrl: string;
  transcript: string;
  followUp: string;
  status: string;
  transcription: TranscriptionLine[];
  duration: string;
  gender: string;
  overall_performance_rating: string;
  positive_feedback: string;
  improvement_feedback: string;
  communication_quality: string;
  communication_feedback: string;
  property_buying_interest: string;
  emotional_state: string;
  conversation_summary: string;
  call_outcome: string;
}

interface Category {
  booth_id: string;
  category: string;
  description: string;
  total: number;
  positive: number;
  negative: number;
  positive_pct: number;
  negative_pct: number;
  calls: Call[];
}

interface ConstituencyData {
  constituency_id: number;
  name: string;
  complianceCount: number;
  issueCount: number;
  improvementNeeded: string;
  improvementCount: number;
  phoneCallCount: number;
  positiveFeedbackPercent: number;
  negativeFeedbackPercent: number;
  memberName: string;
  memberDetails: string;
  total_complaints?: number;
  categories: Category[];
}

interface FilterState {
  callType: string;
  status: string;
  fromDate: string;
  toDate: string;
  searchTerm: string;
}

const Page: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [analyticsView, setAnalyticsView] = useState<
    "week" | "month" | "latest"
  >("week");
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);
  const [selectedTab, setSelectedTab] = useState<"calllogs" | "analytics">(
    "calllogs"
  );
  const [filteredCalls, setFilteredCalls] = useState<Call[]>([]);
  const [currentConstituency, setCurrentConstituency] =
    useState<ConstituencyData | null>(null);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [filter, setFilter] = useState<FilterState>({
    callType: "ALL",
    status: "ALL",
    fromDate: "",
    toDate: "",
    searchTerm: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  useEffect(() => {
    const constituencyIdParam = searchParams.get("constituencyId"); // ✅ match URL
    const districtIdParam = searchParams.get("districtId"); // ✅ match URL
    const categoryName = searchParams.get("categoryName"); // ✅ match URL

    const constituencyId = constituencyIdParam
      ? Number(constituencyIdParam)
      : undefined;
    const districtId = districtIdParam ?? undefined;

    if (!constituencyId) return;

    const foundConstituencyRaw = constituency.find(
      (c) => c.constituency_id === constituencyId // Make sure this matches the type
    );

    if (foundConstituencyRaw) {
      const foundConstituency: ConstituencyData = {
        ...foundConstituencyRaw,
        categories: (foundConstituencyRaw.categories || []).map((cat: any) => ({
          ...cat,
          calls: (cat.calls || []).map((call: any) => ({
            ...call,
            type: call.type === "positive" ? "positive" : "negative",
          })),
        })),
      };
      console.log("Found Constituency:", foundConstituency);
      setCurrentConstituency(foundConstituency);

      if (categoryName) {
        const foundCategory = foundConstituency.categories.find(
          (cat) => cat.category.toLowerCase() === categoryName.toLowerCase()
        );
        if (foundCategory) {
          setCurrentCategory(foundCategory);
          setFilteredCalls(foundCategory.calls || []);
        }
      }
    }

    console.log("District ID:", districtId);
    console.log("Constituency ID:", constituencyId);
  }, [searchParams]);

  useEffect(() => {
    if (!currentCategory) return;

    const search = filter.searchTerm.trim().toLowerCase();

    const filtered = (currentCategory.calls || []).filter((call) => {
      const matchesType =
        filter.callType === "ALL" ||
        call.type === filter.callType.toLowerCase();
      const matchesStatus =
        filter.status === "ALL" || call.status === filter.status;
      const matchesDate =
        (!filter.fromDate ||
          new Date(call.date) >= new Date(filter.fromDate)) &&
        (!filter.toDate || new Date(call.date) <= new Date(filter.toDate));
      const matchesSearch =
        !search ||
        call.description.toLowerCase().includes(search) ||
        call.id.toLowerCase().includes(search) ||
        call.callerNumber.toLowerCase().includes(search) ||
        (currentCategory?.booth_id?.toLowerCase().includes(search) ?? false);

      return matchesType && matchesStatus && matchesDate && matchesSearch;
    });

    setFilteredCalls(filtered);
    setCurrentPage(1);
  }, [filter, currentCategory]);

  // Sort calls based on sortOrder
  const sortedCalls = [...filteredCalls].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`).getTime();
    const dateB = new Date(`${b.date}T${b.time}`).getTime();
    return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
  });

  const startIndex = (currentPage - 1) * recordsPerPage;
  const paginatedCalls = sortedCalls.slice(
    startIndex,
    startIndex + recordsPerPage
  );
  const totalPages = Math.ceil(sortedCalls.length / recordsPerPage);

  const openModal = (call: Call) => {
    setSelectedCall(call);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCall(null);
  };

  // Stats calculations
  // const totalCalls = filteredCalls.length
  const totalCalls = currentCategory?.calls.length || 0;
  const positiveCalls = filteredCalls.filter(
    (call) => call.type === "positive"
  ).length;
  const negativeCalls = filteredCalls.filter(
    (call) => call.type === "negative"
  ).length;
  const resolvedCalls = filteredCalls.filter(
    (call) => call.status === "Resolved"
  ).length;
  const pendingCalls = filteredCalls.filter(
    (call) => call.status === "Pending"
  ).length;

  // Get status color
  const getStatusColor = (status: string) => {
    return status === "Resolved"
      ? "bg-green-100 text-green-800 hover:bg-green-200"
      : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
  };

  // Get type icon and color
  const getTypeIcon = (type: string) => {
    return type === "positive" ? (
      <CheckCircle className="w-4 h-4 text-green-600" />
    ) : (
      <X className="w-4 h-4 text-red-600" />
    );
  };

  // Reset filters
  const resetFilters = () => {
    setFilter({
      callType: "ALL",
      status: "ALL",
      fromDate: "",
      toDate: "",
      searchTerm: "",
    });
    setCurrentPage(1);
  };

  // Generate chart data for analytics
  const generateAnalyticsData = (view: "week" | "month" | "latest") => {
    const data = [];
    if (view === "week") {
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      days.forEach((day) => {
        data.push({
          period: day,
          totalCalls: Math.floor(Math.random() * 10) + 5,
          positiveCalls: Math.floor(Math.random() * 8) + 3,
          negativeCalls: Math.floor(Math.random() * 3) + 1,
          responseTime: Math.floor(Math.random() * 60) + 20,
        });
      });
    } else if (view === "month") {
      for (let i = 1; i <= 4; i++) {
        data.push({
          period: `Week ${i}`,
          totalCalls: Math.floor(Math.random() * 30) + 20,
          positiveCalls: Math.floor(Math.random() * 25) + 15,
          negativeCalls: Math.floor(Math.random() * 8) + 2,
          responseTime: Math.floor(Math.random() * 200) + 100,
        });
      }
    } else {
      data.push({
        period: "All Time",
        totalCalls: totalCalls,
        positiveCalls: positiveCalls,
        negativeCalls: negativeCalls,
        responseTime: 120,
      });
    }
    return data;
  };
  const chartConfig = {
    positive: {
      label: "Positive Calls",
      color: "#4ade80", // green
    },
    negative: {
      label: "Negative Calls",
      color: "#f87171", // red
    },
    response: {
      label: "Response Time",
      color: "#60a5fa", // blue
    },
  } satisfies ChartConfig;

  const chartData = generateAnalyticsData(analyticsView);

  // Format data for ReusableTable
  const formattedData = paginatedCalls.map((call) => ({
    "Booth ID": currentCategory?.booth_id || "N/A",
    Number: call.callerNumber,
    Category: currentCategory?.category || "N/A",
    CallType: call.type,
    Description: call.description,
    Status: call.status,
    Date: call.date,
    Time: call.time,
    Actions: (
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
        onClick={() => openModal(call)}
      >
        <View className="w-4 h-4" />
        Details
      </Button>
    ),
    _original: call, // Keep original call data for actions
  }));

  // Show loading or error state
  if (!currentConstituency || !currentCategory) {
    return (
      <Container>
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-10">
            <PhoneOff className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-600">
              {!currentConstituency
                ? "Constituency not found"
                : "Category not found"}
            </p>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white shadow-md md:shadow-lg border-b border-gray-200 mb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* Left Side: Page title + constituency info */}
              <div className="flex flex-col gap-2">
                <PageTitle
                  title={`Complaint Category - ${
                    currentCategory?.category || "N/A"
                  }`}
                  description={`Complaints registered in ${
                    currentConstituency?.name || "N/A"
                  }`}
                />
              </div>

              <div className="flex justify-end">
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink href="/operation/dashboard">
                        Dashboard
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbLink
                        href={`/operation/constituency?districtId=${
                          searchParams.get("districtId") || ""
                        }`}
                      >
                        Constituency
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbLink
                        href={`/operation/category?districtId=${
                          searchParams.get("districtId") || ""
                        }&constituency_id=${
                          searchParams.get("constituencyId") || ""
                        }`}
                      >
                        Categories
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Insights</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="transition-transform duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Calls
                  </p>
                  <p className="text-2xl font-bold text-black">
                    {currentCategory.total}
                  </p>
                </div>
                <div className="border border-indigo-100 p-3 rounded-2xl bg-indigo-50">
                  <Phone className="w-6 h-6 text-indigo-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="transition-transform duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Positive Feedback
                  </p>
                  <p className="text-2xl font-bold text-black">
                    {currentCategory.positive}
                  </p>
                </div>
                <div className="border border-green-100 p-3 rounded-2xl bg-green-50">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="transition-transform duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Negative Feedback
                  </p>
                  <p className="text-2xl font-bold text-black">
                    {currentCategory.negative}
                  </p>
                </div>
                <div className="border border-red-100 p-3 rounded-2xl bg-red-50">
                  <X className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="transition-transform duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Resolved Issues
                  </p>
                  <p className="text-2xl font-bold text-black">
                    {resolvedCalls}
                  </p>
                </div>
                <div className="border border-blue-100 p-3 rounded-2xl bg-blue-50">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter */}
        <Card className="shadow-sm mb-6">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Filter className="w-5 h-5 text-purple-600" />
              Advanced Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {/* Call Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Call Type
                </label>
                <Select
                  value={filter.callType}
                  onValueChange={(value) =>
                    setFilter({ ...filter, callType: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Types</SelectItem>
                    <SelectItem value="positive">Positive</SelectItem>
                    <SelectItem value="negative">Negative</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <Select
                  value={filter.status}
                  onValueChange={(value) =>
                    setFilter({ ...filter, status: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Status</SelectItem>
                    <SelectItem value="Resolved">Resolved</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* From Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  From Date
                </label>
                <Input
                  type="date"
                  value={filter.fromDate}
                  onChange={(e) =>
                    setFilter({ ...filter, fromDate: e.target.value })
                  }
                  className="w-full"
                />
              </div>

              {/* To Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  To Date
                </label>
                <Input
                  type="date"
                  value={filter.toDate}
                  onChange={(e) =>
                    setFilter({ ...filter, toDate: e.target.value })
                  }
                  className="w-full"
                />
              </div>

              {/* Search Term */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search calls..."
                    value={filter.searchTerm}
                    onChange={(e) =>
                      setFilter({ ...filter, searchTerm: e.target.value })
                    }
                    className="pl-10 w-full"
                  />
                </div>
              </div>
            </div>

            {/* Reset Button */}
            <div className="mt-6 flex justify-end">
              <Button onClick={resetFilters} variant="outline" size="sm">
                Reset All Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4 pb-6 border-spacing-1">
          <Tabs
            value={selectedTab}
            onValueChange={(value) =>
              setSelectedTab(value as "calllogs" | "analytics")
            }
          >
            <TabsList className="grid grid-cols-2 w-fit">
              <TabsTrigger value="calllogs" className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-indigo-600" />
                Logs
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="flex items-center gap-2"
              >
                <TrendingUp className="w-4 h-4 text-purple-600" />
                Analytics
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <h2 className="text-xl font-semibold text-gray-800 py-3">
                  {selectedTab === "calllogs" ? "Call History" : "Analytics"}
                </h2>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {selectedTab === "analytics" ? (
              <>
                <div className="flex justify-between items-center mb-6">
                  <div className="text-sm text-gray-500">
                    Overview of call metrics over time
                  </div>
                  <div className="flex gap-2">
                    {["week", "month", "latest"].map((view) => (
                      <button
                        key={view}
                        onClick={() =>
                          setAnalyticsView(view as "week" | "month" | "latest")
                        }
                        className={`px-3 py-1 text-sm rounded transition-colors ${
                          analyticsView === view
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {view.charAt(0).toUpperCase() + view.slice(1)}
                      </button>
                    ))}
                    <select
                      className={`px-3 py-1 text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 rounded border transition-colors`}
                      value={sortOrder}
                      onChange={(e) =>
                        setSortOrder(e.target.value as "desc" | "asc")
                      }
                    >
                      <option value="desc">Latest First</option>
                      <option value="asc">Oldest First</option>
                    </select>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border">
                  <div className="p-6 pb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      Call Analytics - Stacked Overview
                    </h3>
                    <p className="text-sm text-gray-600">
                      {analyticsView === "week"
                        ? "Weekly"
                        : analyticsView === "month"
                        ? "Monthly"
                        : "Latest"}{" "}
                      call metrics breakdown
                    </p>
                  </div>

                  <div className="px-6 pb-4">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={chartData}
                          margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="#f3f4f6"
                          />
                          <XAxis
                            dataKey="period"
                            tickLine={false}
                            axisLine={false}
                            tick={{
                              fontSize: 12,
                              fill: "#6b7280",
                            }}
                          />
                          <YAxis
                            tickLine={false}
                            axisLine={false}
                            tick={{
                              fontSize: 12,
                              fill: "#6b7280",
                            }}
                          />
                          <Tooltip
                            content={({ active, payload, label }) => {
                              if (active && payload && payload.length) {
                                return (
                                  <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                                    <p className="font-medium text-gray-900 mb-2">
                                      {label}
                                    </p>
                                    {payload.map((entry, index) => (
                                      <p
                                        key={index}
                                        className="text-sm"
                                        style={{ color: entry.color }}
                                      >
                                        {entry.name}: {entry.value}
                                      </p>
                                    ))}
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          <Bar
                            dataKey="totalCalls"
                            stackId="calls"
                            fill="#8b5cf6"
                            radius={[0, 0, 4, 4]}
                            name="Total Calls"
                            barSize={60}
                          />
                          <Bar
                            dataKey="positiveCalls"
                            stackId="calls"
                            fill="#4ade80"
                            radius={[0, 0, 0, 0]}
                            name="Positive Calls"
                            barSize={60}
                          />
                          <Bar
                            dataKey="negativeCalls"
                            stackId="calls"
                            fill="#f87171"
                            radius={[0, 0, 0, 0]}
                            name="Negative Calls"
                            barSize={60}
                          />
                          <Bar
                            dataKey="responseTime"
                            stackId="calls"
                            fill="#60a5fa"
                            radius={[4, 4, 0, 0]}
                            name="Response Time (min)"
                            barSize={60}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Legend */}
                    <div className="flex justify-center gap-6 mt-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                        <span className="text-sm text-gray-600">
                          Total Calls
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                        <span className="text-sm text-gray-600">
                          Positive Calls
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                        <span className="text-sm text-gray-600">
                          Negative Calls
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                        <span className="text-sm text-gray-600">
                          Response Time (min)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <ReusableTable
                  title="Recent Complaints"
                  headers={[
                    "Booth ID",
                    "Number",
                    "CallType",
                    "Status",
                    "Date",
                    "Time",
                    "Actions",
                  ]}
                  data={formattedData}
                  filterByKey="CallType"
                />

                {paginatedCalls.length === 0 && (
                  <div className="text-center py-10">
                    <PhoneOff className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-600">
                      No calls found matching your criteria
                    </p>
                  </div>
                )}

                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6 pt-4 border-t">
                    <div className="text-sm text-gray-600">
                      Showing {startIndex + 1} to{" "}
                      {Math.min(
                        startIndex + recordsPerPage,
                        sortedCalls.length
                      )}{" "}
                      of {sortedCalls.length} calls
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(1, prev - 1))
                        }
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Previous
                      </Button>
                      <span className="text-sm text-gray-600">
                        Page {currentPage} of {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(totalPages, prev + 1)
                          )
                        }
                        disabled={currentPage === totalPages}
                      >
                        Next
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Call Details Modal */}
      {selectedCall && (
        <CallDetailsModal
          isOpen={isModalOpen}
          call={selectedCall}
          onClose={closeModal}
        />
      )}
    </Container>
  );
};

export default Page;
