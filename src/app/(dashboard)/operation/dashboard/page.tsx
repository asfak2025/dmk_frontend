// "use client";
// import React, { useState, useEffect, useMemo } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Input } from "@/components/ui/input";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Button } from "@/components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
//   AreaChart,
//   Area,
//   LineChart,
//   Line,
// } from "recharts";
// import {
//   Phone,
//   AlertTriangle,
//   CheckCircle,
//   TrendingUp,
//   Search,
//   MessageCircleWarning,
//   Router,
//   Calendar,
//   CalendarDays,
//   Clock,
//   ChevronLeft,
//   ChevronRight,
// } from "lucide-react";
// import Container from "@/components/ui/container";
// import PageTitle from "@/components/ui/pageTitle";
// import { useRouter } from "next/navigation";
// import { CustomTooltip } from "@/components/ui/customToolTip";
// import {
//   getAnalytics,
//   getChartAnalytics,
//   searchCallAnalytics,
// } from "@/apis/analytics";
// import { useSession } from "next-auth/react";
// import { debounceApiCall } from "@/lib/debounce";
// import{useAppContext} from "@/hooks/context"

// interface DistrictResult {
//   key: string;
//   callLogsLength: number;
//   positivePercentage: number;
//   negativePercentage: number;
//   districtName: string;
// }

// interface ApiResponse {
//   groupBy: string;
//   results: DistrictResult[];
//   totalGroups: number;
//   overallStats: {
//     totalCalls: number;
//     positivePercentage: number;
//     negativePercentage: number;
//   };
// }

// type PartialApiData = Pick<ApiResponse, "results" | "totalGroups">;

// interface ChartGroup {
//   groupKey: string;
//   groupName: string;
//   positiveCount: number;
//   negativeCount: number;
// }

// interface TimeSeriesData {
//   timeLabel: string;
//   timestamp: string;
//   totalCalls: number;
//   positiveCount: number;
//   negativeCount: number;
// }

// interface ChartAnalyticsResponse {
//   pattern: string;
//   groupBy: string;
//   dateRange: {
//     from: string;
//     to: string;
//   };
//   groups: ChartGroup[];
//   overallData: {
//     timeSeries: TimeSeriesData[];
//     summary: {
//       totalCalls: number;
//       totalPositive: number;
//       totalNegative: number;
//     };
//   };
// }

// interface campainIdType{
// campaignId:string,
// campaignName:string
// }

// const DistrictDashboard: React.FC = () => {
//   const { data: session } = useSession();
//   const {URL}=useAppContext()
//   const [apiData, setApiData] = useState<ApiResponse | null>(null);
//   const [chartData, setChartData] = useState<ChartAnalyticsResponse | null>(
//     null
//   );
//   const[campaignIds,setCampaignIds]=useState<campainIdType[]>([])
//   const [loading, setLoading] = useState(false);
//   const [chartLoading, setChartLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [limit] = useState(9); // 3x3 grid
//   const [activeTab, setActiveTab] = useState("districts");
//   const [selectedCampaign,setSelectedCampaign]=useState("")


//   // Chart analytics state
//   const [dateFrom, setDateFrom] = useState(new Date(new Date().setDate(1)).toISOString().slice(0, 10));
//   const [dateTo, setDateTo] = useState(new Date().toISOString().slice(0, 10));
//   const [pattern, setPattern] = useState<"day" | "week" | "month">("day");

//   const router = useRouter();

//   const fetchAnalytics = async (page: number = 1) => {
//     setLoading(true);
//     setError(null);

//     try {
//       const payload = {
//         groupBy: "districtId",
//         page: page,
//         limit: limit,
//       };
//         if (selectedCampaign) {
//           (payload as any).campaignId = selectedCampaign;
//         }
//       const response = await getAnalytics(payload);
//       if (response && response.ok) {
//         const data: ApiResponse = await response.json();
//         setApiData(data);
//       } else {
//         setError("Failed to fetch analytics data");
//       }
//     } catch (err) {
//       setError("Error fetching analytics data");
//       console.error("Analytics fetch error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchChartAnalytics = async () => {
//     setChartLoading(true);
//     setError(null);

//     try {
//       const payload = {
//         dateFrom: dateFrom,
//         dateTo: dateTo,
//         pattern: pattern,
//         groupBy: "districtId",
//         overallData: true,
//       };

//       const response = await getChartAnalytics(payload);
//       if (response && response.ok) {
//         const data: ChartAnalyticsResponse = await response.json();
//         setChartData(data);
//       } else {
//         setError("Failed to fetch chart analytics data");
//       }
//     } catch (err) {
//       setError("Error fetching chart analytics data");
//       console.error("Chart analytics fetch error:", err);
//     } finally {
//       setChartLoading(false);
//     }
//   };

//   const searchAnalytics = async (searchTerm) => {
//     setLoading(true);
//     try {
//       const payload = {
//         searchTerm: searchTerm,
//         mode: "district",
//         page: 1,
//         limit: 10,
//       };

//       const response = await searchCallAnalytics(payload);
//       const newData = await response.json();
//       if (response.status === 200) {
//         setApiData((prev) => ({
//           ...prev,
//           results: newData.results,
//           totalGroups: newData.totalGroups,
//         }));
//       } else {
//         setLoading(false);
//         console.log("no data found");
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   function handleGetCampaigns(){
//     if(campaignIds.length===0){
//       getCampaignsId()
//     }
//   }

//   const getCampaignsId=async ()=>{
//     try{
//      const orgId=session.orgId
//      const token=session.accessToken
//      const memberId=session.memberId
//      const response=await fetch(`${URL}/campaign/getCampaignId`,{
//       method:"POST",
//       headers:{
//         "Content-Type":"application/json",
//          "Authorizaion":`Bearer ${token}`,
//          "X-Member-Id":memberId
//         },
//       body:JSON.stringify({orgId})
//      })

//     const data=await response.json()

//     if(response.status===200){
//       console.log("getting data",data)
//       setCampaignIds([{campaignName:"ALL",campaignId:null},...data.data])
//     }else{
//       console.log("no data found");
//     }

//     }catch(error){
//      console.log("getting error in campaign",error)
//     }
//   }

//   useEffect(() => {
//     if (session &&activeTab !== "analytics") {
//       if (!searchTerm.trim()) {
//         fetchAnalytics(currentPage);
//       } else if (filteredDistricts?.length == 0) {
//         debouncedSearch(searchTerm);
//       }
//     }
//   }, [currentPage, session, searchTerm,selectedCampaign]);

//   useEffect(() => {
//     if (activeTab === "analytics" && session) {
//       fetchChartAnalytics();
//     }
//   }, [activeTab, dateFrom, dateTo, pattern]);

//   const debouncedSearch = debounceApiCall(searchAnalytics, 1000);

//   const filteredDistricts = useMemo(() => {
//     if (!apiData?.results) return [];

//     return apiData.results.filter(
//       (district) =>
//         district.districtName
//           .toLowerCase()
//           .includes(searchTerm.toLowerCase()) ||
//         district.key.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   }, [apiData, searchTerm]);

//   const districtChartData = useMemo(() => {
//     if (!chartData?.groups) return [];

//     return chartData.groups.map((group) => ({
//       name: group.groupName,
//       positive: group.positiveCount,
//       negative: group.negativeCount,
//       total: group.positiveCount + group.negativeCount,
//       positivePercentage: (
//         (group.positiveCount / (group.positiveCount + group.negativeCount)) *
//         100
//       ).toFixed(1),
//       negativePercentage: (
//         (group.negativeCount / (group.positiveCount + group.negativeCount)) *
//         100
//       ).toFixed(1),
//     }));
//   }, [chartData]);

//   const timeSeriesChartData = useMemo(() => {
//     if (!chartData?.overallData?.timeSeries) return [];

//     return chartData.overallData.timeSeries.map((item) => ({
//       time: item.timeLabel,
//       totalCalls: item.totalCalls,
//       positive: item.positiveCount,
//       negative: item.negativeCount,
//       timestamp: item.timestamp,
//     }));
//   }, [chartData]);

//   const totalPages = apiData ? Math.ceil(apiData.totalGroups / limit) : 0;

//   const handlePageChange = (newPage: number) => {
//     if (newPage >= 1 && newPage <= totalPages) {
//       setCurrentPage(newPage);
//     }
//   };

//   const renderPagination = () => {
//     if (totalPages <= 1) return null;

//     const getPageNumbers = () => {
//       const delta = 2;
//       const range = [];
//       const rangeWithDots = [];

//       for (
//         let i = Math.max(2, currentPage - delta);
//         i <= Math.min(totalPages - 1, currentPage + delta);
//         i++
//       ) {
//         range.push(i);
//       }

//       if (currentPage - delta > 2) {
//         rangeWithDots.push(1, "...");
//       } else {
//         rangeWithDots.push(1);
//       }

//       rangeWithDots.push(...range);

//       if (currentPage + delta < totalPages - 1) {
//         rangeWithDots.push("...", totalPages);
//       } else {
//         rangeWithDots.push(totalPages);
//       }

//       return rangeWithDots;
//     };

//     return (
//       // <div className="flex items-center justify-between mt-6">
//       //   <div className="flex items-center gap-2">
//       //     <Button
//       //       variant="outline"
//       //       size="sm"
//       //       onClick={() => handlePageChange(currentPage - 1)}
//       //       disabled={currentPage <= 1}
//       //       className="flex items-center gap-2"
//       //     >
//       //       <ChevronLeft className="h-4 w-4" />
//       //       Previous
//       //     </Button>

//       //     <div className="flex items-center gap-1">
//       //       {getPageNumbers().map((pageNum, index) => (
//       //         <Button
//       //           key={index}
//       //           variant={currentPage === pageNum ? "default" : "outline"}
//       //           size="sm"
//       //           onClick={() =>
//       //             typeof pageNum === "number" && handlePageChange(pageNum)
//       //           }
//       //           disabled={pageNum === "..."}
//       //           className="min-w-[40px]"
//       //         >
//       //           {pageNum}
//       //         </Button>
//       //       ))}
//       //     </div>

//       //     <Button
//       //       variant="outline"
//       //       size="sm"
//       //       onClick={() => handlePageChange(currentPage + 1)}
//       //       disabled={currentPage >= totalPages}
//       //       className="flex items-center gap-2"
//       //     >
//       //       Next
//       //       <ChevronRight className="h-4 w-4" />
//       //     </Button>
//       //   </div>

//       //   <div className="text-sm text-gray-500">
//       //     Page {currentPage} of {totalPages} ({apiData?.totalGroups} total
//       //     districts)
//       //   </div>
//       // </div>
//       <div className="mt-6">
//   {/* Desktop View */}
//   <div className="hidden md:flex items-center justify-between">
//     <div className="flex items-center gap-2">
//       <Button
//         variant="outline"
//         size="sm"
//         onClick={() => handlePageChange(currentPage - 1)}
//         disabled={currentPage <= 1}
//         className="flex items-center gap-2"
//       >
//         <ChevronLeft className="h-4 w-4" />
//         Previous
//       </Button>

//       <div className="flex items-center gap-1">
//         {getPageNumbers().map((pageNum, index) => (
//           <Button
//             key={index}
//             variant={currentPage === pageNum ? "default" : "outline"}
//             size="sm"
//             onClick={() =>
//               typeof pageNum === "number" && handlePageChange(pageNum)
//             }
//             disabled={pageNum === "..."}
//             className="min-w-[40px]"
//           >
//             {pageNum}
//           </Button>
//         ))}
//       </div>

//       <Button
//         variant="outline"
//         size="sm"
//         onClick={() => handlePageChange(currentPage + 1)}
//         disabled={currentPage >= totalPages}
//         className="flex items-center gap-2"
//       >
//         Next
//         <ChevronRight className="h-4 w-4" />
//       </Button>
//     </div>

//     <div className="text-sm text-gray-500">
//       Page {currentPage} of {totalPages} ({apiData?.totalGroups} total
//       districts)
//     </div>
//   </div>

//   {/* Mobile View */}
//   <div className="md:hidden space-y-4">
//     {/* Page Info */}
//     <div className="text-center text-sm text-gray-500">
//       Page {currentPage} of {totalPages}
//     </div>
//     <div className="text-center text-xs text-gray-400">
//       {apiData?.totalGroups} total districts
//     </div>

//     {/* Navigation Controls */}
//     <div className="flex items-center justify-between gap-2">
//       <Button
//         variant="outline"
//         size="sm"
//         onClick={() => handlePageChange(currentPage - 1)}
//         disabled={currentPage <= 1}
//         className="flex items-center gap-2 flex-1 max-w-[120px]"
//       >
//         <ChevronLeft className="h-4 w-4" />
//         Previous
//       </Button>

//       {/* Simplified Page Numbers - Show only current, first, last and adjacent pages */}
//       <div className="flex items-center gap-1 flex-1 justify-center">
//         {currentPage > 2 && (
//           <>
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => handlePageChange(1)}
//               className="min-w-[36px] text-xs"
//             >
//               1
//             </Button>
//             {currentPage > 3 && (
//               <span className="text-gray-400 text-xs px-1">...</span>
//             )}
//           </>
//         )}

//         {currentPage > 1 && (
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => handlePageChange(currentPage - 1)}
//             className="min-w-[36px] text-xs"
//           >
//             {currentPage - 1}
//           </Button>
//         )}

//         <Button
//           variant="default"
//           size="sm"
//           className="min-w-[36px] text-xs"
//         >
//           {currentPage}
//         </Button>

//         {currentPage < totalPages && (
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => handlePageChange(currentPage + 1)}
//             className="min-w-[36px] text-xs"
//           >
//             {currentPage + 1}
//           </Button>
//         )}

//         {currentPage < totalPages - 1 && (
//           <>
//             {currentPage < totalPages - 2 && (
//               <span className="text-gray-400 text-xs px-1">...</span>
//             )}
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => handlePageChange(totalPages)}
//               className="min-w-[36px] text-xs"
//             >
//               {totalPages}
//             </Button>
//           </>
//         )}
//       </div>

//       <Button
//         variant="outline"
//         size="sm"
//         onClick={() => handlePageChange(currentPage + 1)}
//         disabled={currentPage >= totalPages}
//         className="flex items-center gap-2 flex-1 max-w-[120px]"
//       >
//         Next
//         <ChevronRight className="h-4 w-4" />
//       </Button>
//     </div>
//   </div>
// </div>
//     );
//   };

//   if (!apiData) {
//     return (
//       <Container>
//         <div className="max-w-7xl mx-auto">
//           <Card className="border border-gray-200 shadow-sm">
//             <CardContent className="p-8 text-center">
//               <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//               <p className="text-gray-600">No data available</p>
//             </CardContent>
//           </Card>
//         </div>
//       </Container>
//     );
//   }

//   return (
//     <Container>
//       <div className="max-w-7xl mx-auto">
//         <PageTitle
//           title="District Analytics Dashboard"
//           description="Overview of call logs, feedback analysis across districts"
//         > 
//       <Select onOpenChange={handleGetCampaigns} value={selectedCampaign} onValueChange={setSelectedCampaign}>
//       <SelectTrigger className="w-[180px] h-auto">
//         <SelectValue placeholder="Campaigns" />
//       </SelectTrigger>
//       <SelectContent className="h-auto">
//         {loading ? (
//           <div className="p-2 text-sm text-muted-foreground">Loading...</div>
//         ) : campaignIds?.length!=0 ? (
//           campaignIds?.map((campaign) => (
//             <SelectItem key={campaign.campaignId} value={campaign.campaignId}>
//               {campaign.campaignName}
//             </SelectItem>
//           ))
//         ) : (
//           <div className="p-2 text-sm text-muted-foreground">No campaigns found</div>
//         )}
//       </SelectContent>
//          </Select>
//         </PageTitle>

//         {/* Summary Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
//           <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium text-gray-600">
//                 Total Call Logs
//               </CardTitle>
//               <Phone className="h-4 w-4 text-blue-600" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold text-blue-600">
//                 {apiData.overallStats.totalCalls.toLocaleString()}
//               </div>
//               <p className="text-xs text-gray-500 mt-1">Across all districts</p>
//             </CardContent>
//           </Card>

//           <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium text-gray-600">
//                 Positive Feedback
//               </CardTitle>
//               <CheckCircle className="h-4 w-4 text-green-600" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold text-green-600">
//                 {apiData.overallStats.positivePercentage.toFixed(1)}%
//               </div>
//               <p className="text-xs text-gray-500 mt-1">
//                 Overall positive sentiment
//               </p>
//             </CardContent>
//           </Card>

//           <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium text-gray-600">
//                 Negative Feedback
//               </CardTitle>
//               <AlertTriangle className="h-4 w-4 text-red-600" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold text-red-600">
//                 {apiData.overallStats.negativePercentage.toFixed(1)}%
//               </div>
//               <p className="text-xs text-gray-500 mt-1">Requires attention</p>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Tabs Section */}
//         <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//           <div className="w-full flex flex-col gap-2 lg:gap-5 lg:flex-row lg:justify-between">
//             <TabsList className="w-fit">
//               <TabsTrigger value="districts">Districts</TabsTrigger>
//               <TabsTrigger value="analytics">Analytics</TabsTrigger>
//             </TabsList>
//           </div>

//           <TabsContent value="analytics" className="mt-6">
//             {/* Analytics Controls */}
//             <Card className="mb-6">
//               <CardHeader>
//                 <CardTitle className="text-lg font-semibold text-gray-900">
//                   Analytics Filters
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                   <div className="space-y-2">
//                     <label className="text-sm font-medium text-gray-700">
//                       From Date
//                     </label>
//                     <Input
//                       type="date"
//                       value={dateFrom}
//                       onChange={(e) => {
                        
//                         console.log("date",e.target.value)
//                         setDateFrom(e.target.value)}}
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <label className="text-sm font-medium text-gray-700">
//                       To Date
//                     </label>
//                     <Input
//                       type="date"
//                       value={dateTo}
//                       onChange={(e) => setDateTo(e.target.value)}
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <label className="text-sm font-medium text-gray-700">
//                       Pattern
//                     </label>
//                     <Select
//                       value={pattern}
//                       onValueChange={(value: "day" | "week" | "month") =>
//                         setPattern(value)
//                       }
//                     >
//                       <SelectTrigger>
//                         <SelectValue />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="day">Day</SelectItem>
//                         <SelectItem value="week">Week</SelectItem>
//                         <SelectItem value="month">Month</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                   <div className="flex items-end">
//                     <Button
//                       onClick={fetchChartAnalytics}
//                       disabled={chartLoading}
//                       className="w-full"
//                     >
//                       {chartLoading ? (
//                         <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                       ) : null}
//                       Refresh
//                     </Button>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {chartLoading ? (
//               <Card className="border border-gray-200 shadow-sm">
//                 <CardContent className="p-8 text-center">
//                   <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//                   <p className="text-gray-600">Loading analytics data...</p>
//                 </CardContent>
//               </Card>
//             ) : chartData ? (
//               <div className="grid grid-cols-1 gap-6 mb-8">
//                 {/* Summary Stats */}
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                   <Card className="border border-gray-200 shadow-sm">
//                     <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                       <CardTitle className="text-sm font-medium text-gray-600">
//                         Total Calls ({pattern})
//                       </CardTitle>
//                       <Phone className="h-4 w-4 text-blue-600" />
//                     </CardHeader>
//                     <CardContent>
//                       <div className="text-2xl font-bold text-blue-600">
//                         {chartData?.overallData?.summary?.totalCalls?.toLocaleString()}
//                       </div>
//                     </CardContent>
//                   </Card>

//                   <Card className="border border-gray-200 shadow-sm">
//                     <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                       <CardTitle className="text-sm font-medium text-gray-600">
//                         Positive Feedback
//                       </CardTitle>
//                       <CheckCircle className="h-4 w-4 text-green-600" />
//                     </CardHeader>
//                     <CardContent>
//                       <div className="text-2xl font-bold text-green-600">
//                         {chartData?.overallData?.summary?.totalPositive.toLocaleString()}
//                       </div>
//                       <p className="text-xs text-gray-500 mt-1">
//                         {(
//                           (chartData?.overallData?.summary.totalPositive /
//                             chartData?.overallData?.summary.totalCalls) *
//                           100
//                         ).toFixed(1)}
//                         %
//                       </p>
//                     </CardContent>
//                   </Card>

//                   <Card className="border border-gray-200 shadow-sm">
//                     <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                       <CardTitle className="text-sm font-medium text-gray-600">
//                         Negative Feedback
//                       </CardTitle>
//                       <AlertTriangle className="h-4 w-4 text-red-600" />
//                     </CardHeader>
//                     <CardContent>
//                       <div className="text-2xl font-bold text-red-600">
//                         {chartData?.overallData?.summary.totalNegative.toLocaleString()}
//                       </div>
//                       <p className="text-xs text-gray-500 mt-1">
//                         {(
//                           (chartData?.overallData?.summary.totalNegative /
//                             chartData?.overallData?.summary.totalCalls) *
//                           100
//                         ).toFixed(1)}
//                         %
//                       </p>
//                     </CardContent>
//                   </Card>
//                 </div>

//                 {/* Time Series Chart */}
//                 <Card className="border border-gray-200 shadow-sm">
//                   <CardHeader>
//                     <CardTitle className="text-lg font-semibold text-gray-900">
//                       Call Trends Over Time ({pattern})
//                     </CardTitle>
//                     <p className="text-sm text-gray-500">
//                       Positive vs Negative feedback trends
//                     </p>
//                   </CardHeader>
//                   <CardContent>
//                     <ResponsiveContainer width="100%" height={400}>
//                       <LineChart data={timeSeriesChartData}>
//                         <CartesianGrid strokeDasharray="3 3" />
//                         <XAxis
//                           dataKey="time"
//                           tick={{ fontSize: 12 }}
//                           angle={-45}
//                           textAnchor="end"
//                           height={100}
//                         />
//                         <YAxis />
//                         <Tooltip />
//                         <Line
//                           type="monotone"
//                           dataKey="positive"
//                           stroke="#10b981"
//                           strokeWidth={2}
//                           name="Positive"
//                           dot={{ fill: "#10b981" }}
//                         />
//                         <Line
//                           type="monotone"
//                           dataKey="negative"
//                           stroke="#ef4444"
//                           strokeWidth={2}
//                           name="Negative"
//                           dot={{ fill: "#ef4444" }}
//                         />
//                         <Line
//                           type="monotone"
//                           dataKey="totalCalls"
//                           stroke="#3b82f6"
//                           strokeWidth={2}
//                           name="Total Calls"
//                           dot={{ fill: "#3b82f6" }}
//                         />
//                       </LineChart>
//                     </ResponsiveContainer>
//                   </CardContent>
//                 </Card>

//                 {/* District Feedback Analysis */}
//                 <Card className="border border-gray-200 shadow-sm">
//                   <CardHeader>
//                     <div className="flex items-center justify-between">
//                       <CardTitle className="text-lg font-semibold text-gray-900">
//                         District Feedback Analysis
//                       </CardTitle>
//                     </div>
//                   </CardHeader>
//                   <CardContent>
//                     <ResponsiveContainer width="100%" height={400}>
//                       <BarChart data={districtChartData}>
//                         <CartesianGrid strokeDasharray="3 3" />
//                         <XAxis
//                           dataKey="name"
//                           angle={-45}
//                           textAnchor="end"
//                           height={100}
//                           tick={{ fontSize: 12 }}
//                         />
//                         <YAxis />
//                         <Tooltip content={<CustomTooltip />} />
//                         <Bar
//                           dataKey="positive"
//                           fill="#10b981"
//                           stackId="a"
//                           name="Positive"
//                         />
//                         <Bar
//                           dataKey="negative"
//                           fill="#ef4444"
//                           stackId="a"
//                           name="Negative"
//                         />
//                       </BarChart>
//                     </ResponsiveContainer>
//                   </CardContent>
//                 </Card>

//                 {/* Call Volume by District */}
//                 <Card className="border border-gray-200 shadow-sm">
//                   <CardHeader>
//                     <CardTitle className="text-lg font-semibold text-gray-900">
//                       Total Calls by District
//                     </CardTitle>
//                     <p className="text-sm text-gray-500">
//                       Overall call volume per district
//                     </p>
//                   </CardHeader>
//                   <CardContent>
//                     <ResponsiveContainer width="100%" height={400}>
//                       <AreaChart
//                         data={districtChartData}
//                         margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
//                       >
//                         <CartesianGrid strokeDasharray="3 3" />
//                         <XAxis
//                           dataKey="name"
//                           angle={-45}
//                           textAnchor="end"
//                           height={100}
//                           interval={0}
//                           tick={{ fontSize: 12 }}
//                         />
//                         <YAxis
//                           tick={{ fontSize: 12 }}
//                           label={{
//                             angle: -90,
//                             position: "insideLeft",
//                           }}
//                         />
//                         <Tooltip />
//                         <Area
//                           type="monotone"
//                           dataKey="total"
//                           stroke="#3b82f6"
//                           fill="#3b82f6"
//                           fillOpacity={0.3}
//                           strokeWidth={2}
//                           name="Total Calls"
//                         />
//                       </AreaChart>
//                     </ResponsiveContainer>
//                   </CardContent>
//                 </Card>
//               </div>
//             ) : (
//               <Card className="border border-gray-200 shadow-sm">
//                 <CardContent className="p-8 text-center">
//                   <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//                   <p className="text-gray-600">No analytics data available</p>
//                 </CardContent>
//               </Card>
//             )}
//           </TabsContent>

//           <TabsContent value="districts" className="mt-6">
//             <Card className="mb-6 bg-card text-card-foreground border-none md:border md:shadow-sm">
//               <CardHeader className="p-0 md:p-6">
//                 <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
//                   <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4">
//                     <div className="flex items-center gap-2 mb-4">
//                       <h2 className="text-xl font-semibold text-gray-900">
//                         Districts ({filteredDistricts.length})
//                       </h2>
//                       {loading && (
//                         <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
//                       )}
//                     </div>
//                     {searchTerm && (
//                       <p className="text-sm text-gray-500 mb-4">
//                         Showing results for "{searchTerm}"
//                       </p>
//                     )}
//                   </div>
//                   <div className="relative max-w-md">
//                     <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//                     <Input
//                       type="text"
//                       placeholder="Search districts..."
//                       value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)}
//                       className="pl-10 pr-4 py-2 w-full md:w-80"
//                     />
//                   </div>
//                 </div>
//               </CardHeader>

//               <CardContent className="p-0 md:p-6">
//                 {filteredDistricts.length === 0 ? (
//                   <Card className="border border-gray-200 shadow-sm">
//                     <CardContent className="p-8 text-center">
//                       <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//                       <p className="text-gray-600">
//                         No districts found matching your search criteria.
//                       </p>
//                     </CardContent>
//                   </Card>
//                 ) : (
//                   <>
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                       {filteredDistricts.map((district, index) => (
//                         <Card
//                           key={district.key}
//                           className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
//                           onClick={() =>
//                             router.push(
//                               `/operation/constituency?districtId=${district.key}&districtName=${district.districtName}`
//                             )
//                           }
//                         >
//                           <CardHeader>
//                             <div className="flex items-center justify-between">
//                               <CardTitle className="text-lg font-semibold text-gray-900">
//                                 {district.districtName}
//                               </CardTitle>
//                               <Badge variant="outline" className="text-xs">
//                                 {district.key}
//                               </Badge>
//                             </div>
//                           </CardHeader>
//                           <CardContent>
//                             <div className="space-y-4">
//                               <div className="grid grid-cols-3 gap-4">
//                                 <div className="text-center">
//                                   <div className="text-2xl font-bold text-blue-600">
//                                     {district.callLogsLength}
//                                   </div>
//                                   <div className="text-xs text-gray-500">
//                                     Call Logs
//                                   </div>
//                                 </div>
//                                 <div className="text-center">
//                                   <div className="text-2xl font-bold text-green-600">
//                                     {district.positivePercentage.toFixed(1)}%
//                                   </div>
//                                   <div className="text-xs text-gray-500">
//                                     Positive
//                                   </div>
//                                 </div>
//                                 <div className="text-center">
//                                   <div className="text-2xl font-bold text-red-600">
//                                     {district.negativePercentage.toFixed(1)}%
//                                   </div>
//                                   <div className="text-xs text-gray-500">
//                                     Negative
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                           </CardContent>
//                         </Card>
//                       ))}
//                     </div>

//                     {!searchTerm && renderPagination()}
//                   </>
//                 )}
//               </CardContent>
//             </Card>
//           </TabsContent>
//         </Tabs>
//       </div>
//     </Container>
//   );
// };

// export default DistrictDashboard;


"use client";
import React, { useState, useEffect, use, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue,} from "@/components/ui/select";
import {BarChart,Bar,XAxis,YAxis,CartesianGrid,Tooltip,ResponsiveContainer,PieChart,Pie,Cell,AreaChart,Area,Line,} from "recharts";
import { Phone, AlertTriangle, CheckCircle, TrendingUp, Search, MessageCircleWarning, Router, Calendar, CalendarDays, Clock,} from "lucide-react";
import campaign1 from "@/data/campaign1.json";
import campaign2 from '@/data/campaign2.json';
import Container from "@/components/ui/container";
import PageTitle from "@/components/ui/pageTitle";
import { useRouter } from "next/navigation";
import { CustomTooltip } from "@/components/ui/customToolTip";

interface HourlyData {
  hour: number;
  hourLabel: string;
  complianceCount: number;
  issueCount: number;
  phoneCallCount: number;
  positiveFeedbackPercent: number;
  negativeFeedbackPercent: number;
}

interface DayData {
  date: string;
  day: number;
  complianceCount: number;
  issueCount: number;
  phoneCallCount: number;
  positiveFeedbackPercent: number;
  negativeFeedbackPercent: number;
  Time: HourlyData[];
  constituent_id?: string;
}

interface WeekData {
  complianceCount: number;
  issueCount: number;
  phoneCallCount: number;
  positiveFeedbackPercent: number;
  negativeFeedbackPercent: number;
}

interface MonthData {
  complianceCount: number;
  issueCount: number;
  phoneCallCount: number;
  positiveFeedbackPercent: number;
  negativeFeedbackPercent: number;
  days: DayData[];
  weeks: WeekData[];
}

interface DistrictData {
  district_id: string;
  name: string;
  month: MonthData;
  improvementNeeded: string;
  topConcerns: string[];
}

type TimeFilter = "day" | "week" | "month";
const campaigns = [
  {"id":"CP212320021",
    "name":"12/07/25-Public Concerns"
  }, 
  {"id":"CP212320022",
    "name":"2/07/25-Collecting feedback"
  }, 
 
];

const DistrictDashboard: React.FC = () => {
  const [districts, setDistricts] = useState<DistrictData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("day");
  const [selectedCampaign, setSelectedCampaign] =useState<Record<string,string>>(campaigns[0]);

  const router = useRouter();
 

    useEffect(() => {
    const data=campaigns[0].id===selectedCampaign.id?campaign1:campaign2
    setDistricts(data);
  }, [selectedCampaign]);


  // Get current data based on time filter
  const getCurrentData = (district: DistrictData) => {
    switch (timeFilter) {
      case "day":
        return district.month.days;
      case "week":
        return district.month.weeks;
      case "month":
        return [district.month];
      default:
        return district.month.days;
    }
  };

  // Get aggregated district data based on time filter
  const getAggregatedDistrictData = (district: DistrictData) => {
    const currentData = getCurrentData(district);

    const totals = currentData.reduce(
      (acc, item) => ({
        complianceCount: acc.complianceCount + item.complianceCount,
        issueCount: acc.issueCount + item.issueCount,
        phoneCallCount: acc.phoneCallCount + item.phoneCallCount,
        positiveFeedbackPercent:
          acc.positiveFeedbackPercent + item.positiveFeedbackPercent,
        negativeFeedbackPercent:
          acc.negativeFeedbackPercent + item.negativeFeedbackPercent,
      }),
      {
        complianceCount: 0,
        issueCount: 0,
        phoneCallCount: 0,
        positiveFeedbackPercent: 0,
        negativeFeedbackPercent: 0,
      }
    );

    const dataLength = currentData.length || 1;

    return {
      ...district,
      complianceCount: totals.complianceCount,
      issueCount: totals.issueCount,
      phoneCallCount: totals.phoneCallCount,
      positiveFeedbackPercent: Math.round(
        totals.positiveFeedbackPercent / dataLength
      ),
      negativeFeedbackPercent: Math.round(
        totals.negativeFeedbackPercent / dataLength
      ),
    };
  };

  
  // const getPhoneCallData = () => {
  //   if (timeFilter === "day") {
    
  //     const hourlyMap = new Map();

  //     districts.forEach((district) => {
  //       district.month.days.forEach((day) => {
  //         day.Time.forEach((hourData) => {
  //           const key = `${hourData.hourLabel}`;
  //           if (!hourlyMap.has(key)) {
  //             hourlyMap.set(key, {
  //               name: hourData.hourLabel,
  //               fullName: `Hour ${hourData.hourLabel}`,
  //               calls: 0,
  //             });
  //           }

  //           const existing = hourlyMap.get(key);
  //           existing.calls += hourData.phoneCallCount;
  //         });
  //       });
  //     });

  //     return Array.from(hourlyMap.values());
  //   } else if (timeFilter === "week") {
  //     // For week filter, show weekly phone call data
  //     const weeklyData = [];
  //     const maxWeeks = Math.max(...districts.map((d) => d.month.weeks.length));

  //     for (let i = 0; i < maxWeeks; i++) {
  //       const weekData = {
  //         name: `Week ${i + 1}`,
  //         fullName: `Week ${i + 1}`,
  //         calls: 0,
  //       };

  //       districts.forEach((district) => {
  //         if (district.month.weeks[i]) {
  //           weekData.calls += district.month.weeks[i].phoneCallCount;
  //         }
  //       });

  //       weeklyData.push(weekData);
  //     }

  //     return weeklyData;
  //   } else if (timeFilter === "month") {
  //     // For month filter, show daily phone call data
  //     const dailyMap = new Map();

  //     districts.forEach((district) => {
  //       district.month.days.forEach((day) => {
  //         const key = day.date;
  //         if (!dailyMap.has(key)) {
  //           dailyMap.set(key, {
  //             name: `Day ${day.day}`,
  //             fullName: `Day ${day.day} (${day.date})`,
  //             calls: 0,
  //             date: day.date,
  //           });
  //         }

  //         const existing = dailyMap.get(key);
  //         existing.calls += day.phoneCallCount;
  //       });
  //     });

  //     return Array.from(dailyMap.values()).sort(
  //       (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  //     );
  //   }

  //   return [];
  // };

  const getPhoneCallData = () => {
  const chennai = districts[0];
  if (!chennai) return [];

  if (timeFilter === "day") {
    const hourlyMap = new Map();

    chennai.month.days.forEach((day) => {
      day.Time.forEach((hourData) => {
        const key = hourData.hourLabel;
        if (!hourlyMap.has(key)) {
          hourlyMap.set(key, {
            name: hourData.hourLabel,
            fullName: `Hour ${hourData.hourLabel}`,
            calls: 0,
          });
        }

        const existing = hourlyMap.get(key);
        existing.calls += hourData.phoneCallCount;
      });
    });

    return Array.from(hourlyMap.values());
  }

  if (timeFilter === "week") {
    return chennai.month.weeks.map((week, i) => ({
      name: `Week ${i + 1}`,
      fullName: `Week ${i + 1}`,
      calls: week.phoneCallCount,
    }));
  }

  if (timeFilter === "month") {
    return chennai.month.days
      .map((day) => ({
        name: `Day ${day.day}`,
        fullName: `Day ${day.day} (${day.date})`,
        calls: day.phoneCallCount,
        date: day.date,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  return [];
};

  const filteredDistricts = useMemo(() => {
    const set = new Set(
      districts
        .filter(
          (d) =>
            d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            d.district_id.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .map((d) => d.district_id)
    );
    return districts
      .filter((d) => set.has(d.district_id))
      .map(getAggregatedDistrictData);
  }, [districts, searchTerm]);

  const calculateTotals = () => {
    return filteredDistricts?.reduce(
      (acc, district) => ({
        totalCompliance: acc.totalCompliance + (district.complianceCount || 0),
        totalIssues: acc.totalIssues + (district.issueCount || 0),
        totalImprovement:
          acc.totalImprovement + (district.positiveFeedbackPercent || 0),
        totalPhoneCalls:
          acc.totalPhoneCalls + (district.negativeFeedbackPercent || 0),
      }),
      {
        totalCompliance: 0,
        totalIssues: 0,
        totalImprovement: 0,
        totalPhoneCalls: 0,
      }
    );
  };

  const totals = calculateTotals();

  const phoneCallData = getPhoneCallData();

  const chartData = filteredDistricts.map((district) => ({
    name: district.name,
    compliance: district.month.positiveFeedbackPercent,
    issues: district.month.negativeFeedbackPercent,
    improvement: district.improvementNeeded,
    phoneCalls: district.phoneCallCount,
  }));

  const pieData = [
    { name: "Feedback", value: totals.totalCompliance, color: "#2563eb" },
    { name: "Issues", value: totals.totalIssues, color: "#d97706" },
    { name: "Improvement", value: totals.totalImprovement, color: "#16a34a" },
  ];

  const PhoneCallTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{data.fullName}</p>
          <p className="text-sm text-blue-600">Phone Calls: {data.calls}</p>
        </div>
      );
    }
    return null;
  };

  const getTimeFilterIcon = (filter: TimeFilter) => {
    switch (filter) {
      case "day":
        return <Clock className="h-4 w-4" />;
      case "week":
        return <CalendarDays className="h-4 w-4" />;
      case "month":
        return <Calendar className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getTimeFilterLabel = (filter: TimeFilter) => {
    switch (filter) {
      case "day":
        return "Day";
      case "week":
        return "Week";
      case "month":
        return "Month";
      default:
        return "Day";
    }
  };

  const getChartTitle = () => {
    switch (timeFilter) {
      case "day":
        return "Hourly Feedback Comparison";
      case "week":
        return "Weekly Feedback Comparison";
      case "month":
        return "Daily Feedback Comparison";
      default:
        return "Feedback Comparison";
    }
  };

  const getPhoneCallTitle = () => {
    switch (timeFilter) {
      case "day":
        return "Hourly Phone Call Analytics";
      case "week":
        return "Weekly Phone Call Analytics";
      case "month":
        return "Daily Phone Call Analytics";
      default:
        return "Phone Call Analytics";
    }
  };

  return (
    <Container>
      <div className="max-w-7xl mx-auto">
        <PageTitle
          title="Dashboard"
          description="Overview of feedbacks, issues, and improvement metrics across districts"
        >
        <Select value={selectedCampaign ? JSON.stringify(selectedCampaign) : ""} onValueChange={(val) => {
          const parsed = JSON.parse(val);
          setSelectedCampaign(parsed);
        }}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Select campaign" />
          </SelectTrigger>
          <SelectContent>
            {campaigns.map((campaign) => (
              <SelectItem key={campaign.id} value={JSON.stringify(campaign)}>
                {campaign.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        </PageTitle>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Feedback
              </CardTitle>
              <MessageCircleWarning className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {totals.totalCompliance.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Across all districts
              </p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Issues
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">
                {totals.totalIssues.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Requires attention 
              </p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Avg Positive Feedback
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {Math.floor(totals.totalImprovement / (districts.length || 1))}%
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Average Positive Feedback 
              </p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Avg Negative Feedback
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {Math.ceil(totals.totalPhoneCalls / (districts.length || 1))}%
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Average Negative Feedback 
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="districts" className="w-full">
          <div className=" w-full flex flex-col gap-2 lg:gap-5 lg:flex-row lg:justify-between">
            <TabsList className="w-fit">
              <TabsTrigger value="districts">Districts</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

           
          </div>
          <TabsContent value="analytics" className="mt-6">
            {/* Charts Section */}
            <div className="grid grid-cols-1 gap-6 mb-8">
              {/* Bar Chart */}
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-gray-900">
                      {getChartTitle()}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="name"
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis />
                      <Tooltip content={<CustomTooltip/>} />
                      <Bar
                        dataKey="compliance"
                        fill="#10b981"
                        stackId="a"
                        name="Positive(%)"
                      />
                      <Bar
                        dataKey="issues"
                        fill="#ef4444"
                        stackId="a"
                        name="Negative(%)"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 shadow-sm">
                <CardHeader>
                  <div className="flex flex-col lg:flex-row justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-900">
                      {getPhoneCallTitle()}
                    </CardTitle>
                  <p className="text-sm text-gray-500">
                    Number of calls across all districts
                  </p>
                  </div>
                   <div className="flex gap-2 mb-1 p-1 bg-gray-100 rounded-lg w-fit">
              {(["day", "week", "month"] as TimeFilter[]).map((filter) => (
                <Button
                  key={filter}
                  variant={timeFilter === filter ? "outline" : "ghost"}
                  size="sm"
                  onClick={() => setTimeFilter(filter)}
                  className="flex items-center gap-2"
                >
                  {getTimeFilterIcon(filter)}
                  {getTimeFilterLabel(filter)}
                </Button>
              ))}
            </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <AreaChart
                      data={phoneCallData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="name"
                        angle={-45}
                        textAnchor="end"
                        height={100}
                        interval={0}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis
                        yAxisId="calls"
                        tick={{ fontSize: 12 }}
                        label={{
                          angle: -90,
                          position: "insideLeft",
                        }}
                      />
                      <Tooltip content={<PhoneCallTooltip />} />
                      <Area
                        yAxisId="calls"
                        type="monotone"
                        dataKey="calls"
                        stroke="#3b82f6"
                        fill="#3b82f6"
                        fillOpacity={0.3}
                        strokeWidth={2}
                        name="Phone Calls"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="districts" className="mt-6">
            {/* District Cards */}
            <Card className="mb-6">
              <CardHeader>
                <div className="w-full flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 mb-4">
                      <h2 className="text-xl font-semibold text-gray-900">
                        Districts ({filteredDistricts.length})
                      </h2>
                    </div>
                    {searchTerm && (
                      <p className="text-sm text-gray-500 mb-4">
                        Showing results for "{searchTerm}"
                      </p>
                    )}
                  </div>
                  <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search districts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 w-full md:w-80"
                    />
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                {filteredDistricts.length === 0 ? (
                  <Card className="border border-gray-200 shadow-sm">
                    <CardContent className="p-8 text-center">
                      <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">
                        No districts found matching your search criteria.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDistricts.map((district, index) => (
                      <Card
                        key={district.district_id}
                        className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() =>
                          router.push(
                            `/operation/constituency?districtId=${district.district_id}&feedback=${district.complianceCount}`
                          )
                        }
                      >
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg font-semibold text-gray-900">
                              {district.name}
                            </CardTitle>
                            <Badge variant="outline" className="text-xs">
                              {district.district_id}-{index + 1}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="grid grid-cols-3 gap-4">
                              <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">
                                  {district.complianceCount}
                                </div>
                                <div className="text-xs text-gray-500">
                                  Feedbacks
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">
                                  {district.positiveFeedbackPercent}%
                                </div>
                                <div className="text-xs text-gray-500">
                                  Positive
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="text-2xl font-bold text-red-600">
                                  {district.negativeFeedbackPercent}%
                                </div>
                                <div className="text-xs text-gray-500">
                                  Negative
                                </div>
                              </div>
                            </div>

                            <div className="pt-4 border-t border-gray-100">
                              <div className="text-sm text-gray-600 mb-2">
                                Top Concerns
                              </div>
                              <div className="flex gap-1">
                                {district?.topConcerns?.map((data, index) => (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                    key={index}
                                  >
                                    {data}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
};

export default DistrictDashboard;

