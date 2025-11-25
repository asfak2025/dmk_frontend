// // "use client";

// // import React, { useState, useEffect, useMemo, Suspense } from "react";
// // import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, AreaChart, Area,} from "recharts";
// // import {  Search,  AlertCircle,  TrendingUp,  Phone,  CheckCircle2,  MapPin,  AlertTriangle,  Activity,} from "lucide-react";
// // import constituencyData from "@/data/consti.json";
// // import PageTitle from '@/components/ui/pageTitle'
// // import Container from "@/components/ui/container";
// // import { useRouter, useSearchParams } from "next/navigation";
// // import { Badge } from "@/components/ui/badge";
// // import { Input } from "@/components/ui/input";
// // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// // import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// // import {  Breadcrumb,  BreadcrumbItem,  BreadcrumbLink,  BreadcrumbList,  BreadcrumbPage,  BreadcrumbSeparator,
// // } from "@/components/ui/breadcrumb"
// // interface CustomTooltipProps {
// //   active?: boolean;
// //   payload?: {
// //     name: string;
// //     value: number;
// //     payload: any;
// //     color: string;
// //     dataKey: string;
// //   }[];
// //   label?: string;
// // }

// // const ConstituencyDashboard: React.FC = () => {
// //   const router = useRouter();
// //   const searchParams = useSearchParams();
// //   const [districtId, setDistrictId] = useState<string | null>(null);
// //   const [totalFeedback, setTotalFeedback] = useState<number | null>(null);
// //   const [selectedDistrict, setSelectedDistrict] = useState<any | null>(null);
// //   const [searchTerm, setSearchTerm] = useState("");
// //   const [timePeriod, setTimePeriod] = useState<"day" | "week" | "month">("day");
// //   const [timeRange, setTimeRange] = useState('day'); 

// //   const filterDataByTimeRange = (data, range) => {
// //     return data.map(item => {
// //       let positiveRatio = 1;
// //       let negativeRatio = 1;
      
// //       switch (range) {
// //         case 'day':
// //           positiveRatio = 0.9;
// //           negativeRatio = 1.1;
// //           break;
// //         case 'week':
// //           positiveRatio = 0.95;
// //           negativeRatio = 1.05;
// //           break;
// //         case 'month':
// //           positiveRatio = 1; 
// //           negativeRatio = 1; 
// //           break;
// //         default:
// //           break;
// //       }

// //       const adjustedPositive = item.positiveFeedbackPercent * positiveRatio;
// //       const adjustedNegative = item.negativeFeedbackPercent * negativeRatio;
// //       const total = adjustedPositive + adjustedNegative;
      
// //       const normalizedPositive = Math.round((adjustedPositive / total) * 100);
// //       const normalizedNegative = 100 - normalizedPositive; 

// //       return {
// //         ...item,
// //         positiveFeedbackPercent: normalizedPositive,
// //         negativeFeedbackPercent: normalizedNegative,
// //       };
// //     });
// //   };

// //   useEffect(() => {
// //     const id = searchParams.get("districtId");
// //     const totalFeedback = searchParams.get("feedback");
// //     setDistrictId(id);
// //     setTotalFeedback(totalFeedback ? parseInt(totalFeedback,10) : null );
// //   }, [searchParams]);


// //   useEffect(() => {
// //     if (!districtId) {
// //       setSelectedDistrict(null);
// //       return;
// //     }
// //     const found = constituencyData.find((d) => d.district_id === districtId);
// //     setSelectedDistrict(found ?? null);
// //   }, [districtId]);

// //   const filteredConstituencies = useMemo(() => {
// //     const list = selectedDistrict?.constituencies ?? [];
// //     return list.filter(
// //       (c) =>
// //         c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //         c.constituency_id.toString().includes(searchTerm)
// //     );
// //   }, [selectedDistrict, searchTerm]);

// //   const totals = useMemo(() => {
// //     if (!selectedDistrict) {
// //       return {
// //         totalCompliance: 0,
// //         totalIssues: 0,
// //         totalImprovement: 0,
// //         totalPhoneCalls: 0,
// //         avgPositiveFeedback: 0,
// //         avgNegativeFeedback: 0,
// //       };
// //     }
// //     const list = selectedDistrict.constituencies ?? [];
// //     const acc = list.reduce(
// //       (s, c) => ({
// //         totalCompliance: s.totalCompliance + c.complianceCount,
// //         totalIssues: s.totalIssues + c.issueCount,
// //         totalImprovement: s.totalImprovement + c.improvementCount,
// //         totalPhoneCalls: s.totalPhoneCalls + c.phoneCallCount,
// //         avgPositiveFeedback: s.avgPositiveFeedback + c.positiveFeedbackPercent,
// //         avgNegativeFeedback: s.avgNegativeFeedback + c.negativeFeedbackPercent,
// //       }),
// //       {
// //         totalCompliance: 0,
// //         totalIssues: 0,
// //         totalImprovement: 0,
// //         totalPhoneCalls: 0,
// //         avgPositiveFeedback: 0,
// //         avgNegativeFeedback: 0,
// //       }
// //     );
// //     const len = list.length || 1;
// //     return {
// //       ...acc,
// //       avgPositiveFeedback: Math.round(acc.avgPositiveFeedback / len),
// //       avgNegativeFeedback: Math.round(acc.avgNegativeFeedback / len),
// //     };
// //   }, [selectedDistrict]);

// //   const phoneCallDatas = {
// //     day: [
// //       { time: "9AM", calls: 809 },
// //       { time: "12PM", calls: 335 },
// //       { time: "3PM", calls: 552 },
// //       { time: "6PM", calls: 310 }
// //     ],
// //     week: [
// //       { day: "Mon", calls: 1825 },
// //       { day: "Tue", calls: 1542 },
// //       { day: "Wed", calls: 1438 },
// //       { day: "Thu", calls: 1245 },
// //       { day: "Fri", calls: 1140 }
// //     ],
// //     month: [
// //       { week: "Week 1", calls: 9250 },
// //       { week: "Week 2", calls: 7180 },
// //       { week: "Week 3", calls: 8165 },
// //       { week: "Week 4", calls: 9175 }
// //     ]
// //   };

// //   const CustomTooltip: React.FC<CustomTooltipProps> = ({
// //     active,
// //     payload,
// //     label,
// //   }) => {
// //     if (!active || !payload || !payload.length) return null;
// //     return (
// //       <div className="bg-white p-3 border rounded shadow-lg">
// //         <p className="font-semibold">{payload[0].payload.fullName || label}</p>
// //         {payload.map((e, i) => (
// //           <p key={i} style={{ color: e.color }}>
// //             {e.name}: {e.value}
// //           </p>
// //         ))}
// //       </div>
// //     );
// //   };

// //   const getCardBackgroundColor = (pos: number, neg: number) => {
// //     if (pos > neg) return "bg-green-100 border-green-300";
// //     if (neg > pos) return "bg-red-100 border-red-300";
// //     if (pos === neg) return "bg-yellow-100 border-yellow-300";
// //     return "bg-gray-50 border-gray-200";
// //   };

// //   if (!selectedDistrict) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
// //         <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
// //           <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
// //           <h3 className="text-lg font-semibold">No District Selected</h3>
// //           <p>Please select a district to view constituency data.</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   const getImprovementColor = (improvement: string) => {
// //     return "bg-gray-50 text-gray-900 border-gray-200";
// //   };

// //   return (
// //     <Container className="min-h-screen bg-white">
// //       <PageTitle title={`${selectedDistrict.name} District`} description={` ${selectedDistrict?.constituencies?.length} constituencies`}>
// //           <Breadcrumb>
// //             <BreadcrumbList>
// //               <BreadcrumbItem>
// //                 <BreadcrumbLink href="/operation/dashboard">Dashboard</BreadcrumbLink>
// //               </BreadcrumbItem>
// //               <BreadcrumbSeparator />
// //               <BreadcrumbPage>
// //                 Constituency
// //               </BreadcrumbPage>
// //             </BreadcrumbList>
// //           </Breadcrumb>
// //         </PageTitle>
      
// //       <div className="max-w-7xl mx-auto px-6 py-4">
// //         {/* Key Metrics */}
// //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          

// //           <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
// //               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
// //                         <CardTitle className="text-sm font-medium text-gray-600">
// //                           Total Feedback
// //                         </CardTitle>
// //                         <CheckCircle2 className="h-4 w-4 text-blue-600" />
// //                       </CardHeader>
// //                       <CardContent>
// //                         <div className="text-2xl font-bold text-blue-600">
// //                           {totalFeedback}
// //                         </div>
// //                         <p className="text-xs text-gray-500 mt-1">
// //                           Across all constituencies
// //                         </p>
// //               </CardContent>
// //             </Card>

// //             <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
// //                         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
// //                           <CardTitle className="text-sm font-medium text-gray-600">
// //                             Positive Feedback
// //                           </CardTitle>
// //                           <TrendingUp className="h-4 w-4 text-green-600" />
// //                         </CardHeader>
// //                         <CardContent>
// //                           <div className="text-2xl font-bold text-green-600">
// //                             {totals.avgPositiveFeedback}%
// //                           </div>
// //                           <p className="text-xs text-gray-500 mt-1">
// //                             Satisfaction 
// //                           </p>
// //                         </CardContent>
// //                       </Card>


// //                       <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
// //                         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
// //                           <CardTitle className="text-sm font-medium text-gray-600">
// //                             Negative Feedback
// //                           </CardTitle>
// //                           <AlertCircle className="h-4 w-4 text-red-600" />
// //                         </CardHeader>
// //                         <CardContent>
// //                           <div className="text-2xl font-bold text-red-600">
// //                             {totals.avgNegativeFeedback}%
// //                           </div>
// //                           <p className="text-xs text-gray-500 mt-1">
// //                             Issues 
// //                           </p>
// //                         </CardContent>
// //                       </Card>

// //                       <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
// //                         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
// //                           <CardTitle className="text-sm font-medium text-gray-600">
// //                             Phone Interactions
// //                           </CardTitle>
// //                           <Phone className="h-4 w-4 text-purple-600" />
// //                         </CardHeader>
// //                         <CardContent>
// //                           <div className="text-2xl font-bold text-purple-600">
// //                             {totals.totalPhoneCalls.toLocaleString()}
// //                           </div>
// //                           <p className="text-xs text-gray-500 mt-1">
// //                             Engagement 
// //                           </p>
// //                         </CardContent>
// //                       </Card>  
// //         </div>

// //         {/* Tabs Section */}
// //         <Tabs defaultValue="constituencies" className="w-full">
// //           <TabsList className="grid w-fit grid-cols-2">
            
// //             <TabsTrigger
// //               value="constituencies"
// //               className="flex items-center gap-2"
// //             >
// //               Constituencies
// //             </TabsTrigger>

// //             <TabsTrigger value="analytics" className="flex items-center gap-2">
// //               Analytics
// //             </TabsTrigger>
// //           </TabsList>

// //           <TabsContent value="analytics" className="mt-6">
// //             {/* Charts */}
// //             <div className="grid grid-cols-1  gap-6 mb-8">
// //               {/* Compliance vs Issues Bar Chart */}
// //               <Card className="border border-gray-200 shadow-sm">
// //                 <CardHeader>
// //                   <div className="flex justify-between items-start">
// //                     <div>
// //                       <CardTitle className="text-lg font-semibold">
// //                         Constituencies Feedback
// //                       </CardTitle>
// //                       <p className="text-sm text-muted-foreground">
// //                         Positive and Negative Feedback by Constituency
// //                       </p>
// //                     </div>
// //                     <Tabs 
// //                       value={timeRange}
// //                       onValueChange={(value) => setTimeRange(value as "day" | "week" | "month")}
// //                       className="w-fit"
// //                     >
// //                       <TabsList>
// //                         <TabsTrigger value="day">Day</TabsTrigger>
// //                         <TabsTrigger value="week">Week</TabsTrigger>
// //                         <TabsTrigger value="month">Month</TabsTrigger>
// //                       </TabsList>
// //                     </Tabs>
// //                   </div>
// //                 </CardHeader>
// //               <CardContent>
// //                 <div className="h-[300px]">
// //                   {!selectedDistrict || !selectedDistrict.constituencies ? (
// //                     <div className="flex items-center justify-center h-full">
// //                       <p className="text-gray-500">Loading ward data...</p>
// //                     </div>
// //                   ) : (
// //                     <ResponsiveContainer width="100%" height="100%">
// //                       <BarChart
// //                         data={filterDataByTimeRange(selectedDistrict.constituencies, timeRange)}
// //                         margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
// //                       >
// //                         <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
// //                         <XAxis
// //                           dataKey="name"
// //                           tick={{ fontSize: 10 }}
// //                           angle={-30}
// //                           textAnchor="end"
// //                           interval={0}
// //                         />
// //                         <YAxis />
// //                         <Tooltip/>
// //                         <Bar
// //                           dataKey="positiveFeedbackPercent"
// //                           name="Positive"
// //                           stackId="a"
// //                           fill="#22c55e"
// //                           barSize={50}
// //                         />
// //                         <Bar
// //                           dataKey="negativeFeedbackPercent"
// //                           name="Negative"
// //                           stackId="a"
// //                           fill="#ef4444"
// //                           barSize={50}
// //                         />
// //                       </BarChart>
// //                     </ResponsiveContainer>
// //                   )}
// //                 </div>
// //               </CardContent>
// //               </Card>

// //               <Card className="border border-gray-200 shadow-sm">
// //                 <CardHeader>
// //                   <div className="flex justify-between items-start">
// //                     <div>
// //                       <CardTitle className="text-lg font-semibold">
// //                         Phone Call Analysis
// //                       </CardTitle>
// //                       <p className="text-sm text-muted-foreground">
// //                         Citizen engagement through phone calls
// //                       </p>
// //                     </div>
// //                     <Tabs 
// //                       value={timePeriod}
// //                       onValueChange={(value) => setTimePeriod(value as "day" | "week" | "month")}
// //                       className="w-fit"
// //                     >
// //                       <TabsList>
// //                         <TabsTrigger value="day">Day</TabsTrigger>
// //                         <TabsTrigger value="week">Week</TabsTrigger>
// //                         <TabsTrigger value="month">Month</TabsTrigger>
// //                       </TabsList>
// //                     </Tabs>
// //                   </div>
// //                 </CardHeader>
// //                 <CardContent>
// //                   <div className="h-[300px]">
// //                     <ResponsiveContainer width="100%" height="100%">
// //                       <AreaChart
// //                         data={phoneCallDatas[timePeriod]}
// //                         margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
// //                       >
// //                         <defs>
// //                           <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
// //                             <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
// //                             <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
// //                           </linearGradient>
// //                         </defs>
// //                         <XAxis 
// //                           dataKey={timePeriod === "day" ? "time" : timePeriod === "week" ? "day" : "week"} 
// //                         />
// //                         <YAxis />
// //                         <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
// //                         <Tooltip 
// //                           formatter={(value) => [`${value} calls`, "Phone Calls"]}
// //                           labelFormatter={(label) => timePeriod === "day" ? `Time: ${label}` : 
// //                                             timePeriod === "week" ? `Day: ${label}` : `Week: ${label}`}
// //                         />
// //                         <Area
// //                           type="monotone"
// //                           dataKey="calls"
// //                           stroke="#3b82f6"
// //                           fillOpacity={1}
// //                           fill="url(#colorCalls)"
// //                           activeDot={{ r: 8 }}
// //                         />
// //                       </AreaChart>
// //                     </ResponsiveContainer>
// //                   </div>
// //                 </CardContent>
// //               </Card>
// //             </div>
// //           </TabsContent>

// //           <TabsContent value="constituencies" className="space-y-6">
// //             {/* Constituency Cards */}
// //             <Card>
// //               <CardHeader>
// //                 <div className="w-full flex justify-between">
// //                   <div className="flex items-center justify-between gap-2 mb-4">
// //                     <h2 className="text-xl font-semibold text-gray-900">
// //                       Constituencies ({filteredConstituencies.length})
// //                     </h2>
// //                     {searchTerm && (
// //                       <p className="text-sm text-gray-500">
// //                         Showing results for "{searchTerm}"
// //                       </p>
// //                     )}
// //                   </div>
// //                   <div className="relative max-w-md">
// //                     <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
// //                     <Input
// //                       type="text"
// //                       placeholder="Search constituencies..."
// //                       value={searchTerm}
// //                       onChange={(e) => setSearchTerm(e.target.value)}
// //                       className="pl-10 pr-4 py-2 w-full md:w-80"
// //                     />
// //                   </div>
// //                 </div>
// //               </CardHeader>

// //               <CardContent>
// //                 {filteredConstituencies.length === 0 ? (
// //                   <Card className="border border-gray-200 shadow-sm">
// //                     <CardContent className="p-8 text-center">
// //                       <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
// //                       <p className="text-gray-600">
// //                         No constituencies found matching your search criteria.
// //                       </p>
// //                     </CardContent>
// //                   </Card>
// //                 ) : (
// //                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
// //                     {filteredConstituencies.map((constituency: any) => (
// //                       <Card
// //                         key={constituency.constituency_id}
// //                         className={`hover:shadow-md transition-shadow cursor-pointer ${getCardBackgroundColor(
// //                           constituency.positiveFeedbackPercent,
// //                           constituency.negativeFeedbackPercent
// //                         )}`}
// //                         onClick={() =>
// //                           router.push(
// //                             `/operation/category?districtId=${districtId}&constituency_id=${constituency.constituency_id}`
// //                           )
// //                         }
// //                       >
// //                         <CardHeader>
// //                           <div className="flex items-center justify-between">
// //                             <CardTitle className="text-lg font-semibold text-slate-900">
// //                               {constituency.name}
// //                             </CardTitle>
// //                             <Badge
// //                               variant="outline"
// //                               className="text-xs border-gray-500"
// //                             >
// //                               {constituency.constituency_id}
// //                             </Badge>
// //                           </div>
// //                         </CardHeader>
// //                         <CardContent className="space-y-4">
// //                           <div className="flex justify-between items-center mb-4">
// //                             <div className="text-center flex-1 px-2">
// //                               <div className="text-base font-bold text-orange-600">
// //                                 {constituency.issueCount}
// //                               </div>
// //                               <div className="text-xs text-orange-700">
// //                                 Feedbacks
// //                               </div>
// //                             </div>
// //                             <div className="text-center flex-1 px-2 border-l border-slate-200">
// //                               <div className="text-base font-semibold text-green-600">
// //                                 {constituency.positiveFeedbackPercent}%
// //                               </div>
// //                               <div className="text-xs text-slate-600">
// //                                 Positive
// //                               </div>
// //                             </div>
// //                             <div className="text-center flex-1 px-2 border-l border-slate-200">
// //                               <div className="text-base font-semibold text-red-600">
// //                                 {constituency.negativeFeedbackPercent}%
// //                               </div>
// //                               <div className="text-xs text-slate-600">
// //                                 Negative
// //                               </div>
// //                             </div>
// //                           </div>

// //                           <div className="pt-4 border-t border-slate-200 border-opacity-50">
// //                             <div className="flex items-center justify-between mb-2">
// //                               <span className="text-xs text-slate-600">
// //                                 Priority Focus:
// //                               </span>
// //                               <Activity className="h-4 w-4 text-slate-600" />
// //                             </div>
// //                             <Badge
// //                               variant="outline"
// //                               className={`text-xs px-3 py-1 ${getImprovementColor(
// //                                 constituency.improvementNeeded
// //                               )}`}
// //                             >
// //                               {constituency.improvementNeeded}
// //                             </Badge>
// //                           </div>
// //                         </CardContent>
// //                       </Card>
// //                     ))}
// //                   </div>
// //                 )}
// //               </CardContent>
// //             </Card>
// //           </TabsContent>
// //         </Tabs>
// //       </div>
// //     </Container>
// //   );
// // };

// // export default function PageWrapper() {
// //   return (
// //     <Suspense fallback={<div>Loading Dashboard...</div>}>
// //       <ConstituencyDashboard />
// //     </Suspense>
// //   );
// // }

// "use client";

// import React, { useState, useEffect, useMemo, Suspense } from "react";
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, AreaChart, Area,} from "recharts";
// import {  Search,  AlertCircle,  TrendingUp,  Phone,  CheckCircle2,  MapPin,  AlertTriangle,  Activity, ChevronLeft, ChevronRight} from "lucide-react";
// import { getAnalytics, getChartAnalytics, searchCallAnalytics } from "@/apis/analytics";
// import PageTitle from '@/components/ui/pageTitle'
// import Container from "@/components/ui/container";
// import { useRouter, useSearchParams } from "next/navigation";
// import { Badge } from "@/components/ui/badge";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import {  Breadcrumb,  BreadcrumbItem,  BreadcrumbLink,  BreadcrumbList,  BreadcrumbPage,  BreadcrumbSeparator,
// } from "@/components/ui/breadcrumb"
// import { debounceApiCall } from "@/lib/debounce";
// import { useSession } from "next-auth/react";

// interface CustomTooltipProps {
//   active?: boolean;
//   payload?: {
//     name: string;
//     value: number;
//     payload: any;
//     color: string;
//     dataKey: string;
//   }[];
//   label?: string;
// }

// interface AnalyticsResult {
//   key: string;
//   callLogsLength: number;
//   positivePercentage: number;
//   negativePercentage: number;
//   constituencyName: string;
// }

// interface AnalyticsResponse {
//   groupBy: string;
//   results: AnalyticsResult[];
//   totalGroups: number;
//   overallStats: {
//     totalCalls: number;
//     positivePercentage: number;
//     negativePercentage: number;
//   };
// }

// interface ChartAnalyticsResponse {
//   pattern: string;
//   groupBy: string;
//   dateRange: {
//     from: string;
//     to: string;
//   };
//   groups: {
//     groupKey: string;
//     groupName: string;
//     positiveCount: number;
//     negativeCount: number;
//   }[];
//   overallData: {
//     timeSeries: {
//       timeLabel: string;
//       timestamp: string;
//       totalCalls: number;
//       positiveCount: number;
//       negativeCount: number;
//     }[];
//     summary: {
//       totalCalls: number;
//       totalPositive: number;
//       totalNegative: number;
//     };
//   };
// }

// const ConstituencyDashboard: React.FC = () => {
//   const router = useRouter();
//   const {data:session}=useSession();
//   const searchParams = useSearchParams();
//   const [districtId, setDistrictId] = useState<string | null>(null);
//   const[districtName,setDistrictName]=useState<string>(null)
//   const [analyticsData, setAnalyticsData] = useState<AnalyticsResponse | null>(null);
//   const [chartData, setChartData] = useState<ChartAnalyticsResponse | null>(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [activeTab, setActiveTab] = useState("constituencies");
//   const [loading, setLoading] = useState(false);
//   const [chartLoading, setChartLoading] = useState(false);

//   // Pagination states
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(9); // 3 columns * 3 rows
//   const [totalPages, setTotalPages] = useState(1);

//   // Analytics filter states
//   const [dateFrom, setDateFrom] = useState("");
//   const [dateTo, setDateTo] = useState("");
//   const [pattern, setPattern] = useState<"day" | "week" | "month">("day");

//   // Get current date range for chart analytics
//   const getDateRange = () => {
//     const today = new Date();
//     const threeDaysAgo = new Date(today);
//     threeDaysAgo.setDate(today.getDate() - 3);
    
//     return {
//       dateFrom: threeDaysAgo.toISOString().split('T')[0],
//       dateTo: today.toISOString().split('T')[0]
//     };
//   };

//   // Initialize date filters
//   useEffect(() => {
//     const { dateFrom: defaultFrom, dateTo: defaultTo } = getDateRange();
//     setDateFrom(defaultFrom);
//     setDateTo(defaultTo);
//   }, []);

//   useEffect(() => {
//     const id = searchParams.get("districtId");
//     const districtName=searchParams.get("districtName")
//     setDistrictName(districtName)
//     setDistrictId(id);
//   }, [searchParams]);


//    const fetchAnalytics = async () => {
//       try {
//         setLoading(true);
//         const payload = {
//           groupBy: "constituencyId",
//           districtId: districtId,
//           page: currentPage,
//           limit: itemsPerPage
//         };
//         const response = await getAnalytics(payload);
//         if (response.ok) {
//           const data = await response.json();
//           setAnalyticsData(data);
//           setTotalPages(Math.ceil(data.totalGroups / itemsPerPage));
//         } else {
//           console.error("Failed to fetch analytics data:", response.statusText);
//         }
//       } catch (error) {
//         console.error("Error fetching analytics:", error);
//       } finally {
//         setLoading(false);
//       }
//     };


//     const searchAnalytics = async (searchTerm) => {
//       setLoading(true);
//        try {
//         const payload={
//       "searchTerm":searchTerm,
//       "mode":"constituency",
//       "page":1,
//       "limit":10,
//       districtId:districtId
//         }
    
//       const response = await searchCallAnalytics(payload);
//       const newData=await response.json();
//       if(response.status===200){
//         setLoading(false)
//        setAnalyticsData(prev => ({
//       ...prev,
//       results: newData.results,
//       totalGroups: newData.totalGroups,
//     }));
//       }
//       else{
//         setLoading(false)
//         console.log("no data found")
//       }
//     }catch (error) {
//         console.log(error);
//        }    
//     }

//   // Fetch analytics data for cards with pagination
//   useEffect(() => {
//    if(session && districtId){
//     if(!searchTerm.trim()){
//      fetchAnalytics();
//     }else if(filteredConstituencies?.length==0){
//      debouncedSearch(searchTerm)
//     }
//   }
//   }, [districtId, currentPage, itemsPerPage,searchTerm,session]);

//   const debouncedSearch=debounceApiCall(searchAnalytics,1000);

//   // Fetch chart analytics function
//   const fetchChartAnalytics = async () => {
//     if (!districtId) return;

//     try {
//       setChartLoading(true);
//       const payload = {
//         dateFrom,
//         dateTo,
//         pattern,
//         groupBy: "constituencyId",
//         districtId: districtId,
//         overallData: true
//       };
//       const response = await getChartAnalytics(payload);
//       if(response.status === 200){
//         setChartData(await response.json());
//       }
//     } catch (error) {
//       console.error("Error fetching chart analytics:", error);
//     } finally {
//       setChartLoading(false);
//     }
//   };

//   // Fetch chart analytics when analytics tab is active or filters change
//   useEffect(() => {
//     if (!districtId || activeTab !== "analytics" || !dateFrom || !dateTo) return;
//     fetchChartAnalytics();
//   }, [districtId, activeTab, dateFrom, dateTo, pattern]);

//   const filteredConstituencies = useMemo(() => {
//     if (!analyticsData?.results) return [];
    
//     return analyticsData.results.filter(
//       (c) =>
//         c.constituencyName?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
//         c.key.toString().includes(searchTerm)
//     );
//   }, [analyticsData, searchTerm]);

//   // Transform chart data for constituency feedback chart
//   const constituencyChartData = useMemo(() => {
//     if (!chartData?.groups) return [];
    
//     return chartData.groups.map(group => {
//       console.log(group,"group")
//       return ({
//       name: group.groupName,
//       fullName: group.groupName,
//       positiveFeedbackPercent: Math.round((group.positiveCount / (group.positiveCount + group.negativeCount)) * 100) || 0,
//       negativeFeedbackPercent: Math.round((group.negativeCount / (group.positiveCount + group.negativeCount)) * 100) || 0,
//       positiveCount: group.positiveCount,
//       negativeCount: group.negativeCount,
//       totalCount: group.positiveCount + group.negativeCount
//     })});
//   }, [chartData]);

//   // Transform chart data for phone call analysis
//   const phoneCallChartData = useMemo(() => {
//     if (!chartData?.overallData?.timeSeries) return [];
    
//     return chartData.overallData.timeSeries.map(item => ({
//       time: item.timeLabel,
//       calls: item.totalCalls
//     }));
//   }, [chartData]);

//   // Pagination handlers
//   const handlePageChange = (page: number) => {
//     if (page >= 1 && page <= totalPages) {
//       setCurrentPage(page);
//     }
//   };

//   // Pagination component
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
//       //           onClick={() => typeof pageNum === 'number' && handlePageChange(pageNum)}
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
//       //     Page {currentPage} of {totalPages} ({analyticsData?.totalGroups} total constituencies)
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
//             onClick={() => typeof pageNum === 'number' && handlePageChange(pageNum)}
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
//       Page {currentPage} of {totalPages} ({analyticsData?.totalGroups} total constituencies)
//     </div>
//   </div>

//   {/* Mobile View */}
//   <div className="md:hidden space-y-4">
//     {/* Page Info */}
//     <div className="text-center text-sm text-gray-500">
//       Page {currentPage} of {totalPages}
//     </div>
//     <div className="text-center text-xs text-gray-400">
//       {analyticsData?.totalGroups} total constituencies
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

//   const CustomTooltip: React.FC<CustomTooltipProps> = ({
//     active,
//     payload,
//     label,
//   }) => {
//     if (!active || !payload || !payload.length) return null;
//     return (
//       <div className="bg-white p-3 border rounded shadow-lg">
//         <p className="font-semibold">{payload[0].payload.fullName || label}</p>
//         {payload.map((e, i) => (
//           <p key={i} style={{ color: e.color }}>
//             {e.name}: {e.value}
//           </p>
//         ))}
//       </div>
//     );
//   };

//   const getCardBackgroundColor = (pos: number, neg: number) => {
//     if (pos > neg) return "bg-gray-50 border-green-500";
//     if (neg > pos) return "bg-gray-50 border-red-500";
//     return "bg-gray-50 border-gray-200";
//   };

//   if (!districtId) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
//         <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
//           <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//           <h3 className="text-lg font-semibold">No District Selected</h3>
//           <p>Please select a district to view constituency data.</p>
//         </div>
//       </div>
//     );
//   }

//   const getImprovementColor = (improvement: string) => {
//     return "bg-gray-50 text-gray-900 border-gray-200";
//   };

//   return (
//     <Container className="min-h-screen bg-white">
//       <PageTitle title={`${districtName} Constituencies`} description={` ${analyticsData?.totalGroups || 0} constituencies`}>
//           <Breadcrumb>
//             <BreadcrumbList>
//               <BreadcrumbItem>
//                 <BreadcrumbLink href="/operation/dashboard">Dashboard</BreadcrumbLink>
//               </BreadcrumbItem>
//               <BreadcrumbSeparator />
//               <BreadcrumbPage>
//                 Constituency
//               </BreadcrumbPage>
//             </BreadcrumbList>
//           </Breadcrumb>
//         </PageTitle>
      
//       <div className="max-w-7xl mx-auto  py-4">
//         {/* Key Metrics */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                         <CardTitle className="text-sm font-medium text-gray-600">
//                           Total Feedback
//                         </CardTitle>
//                         <CheckCircle2 className="h-4 w-4 text-blue-600" />
//                       </CardHeader>
//                       <CardContent>
//                         <div className="text-2xl font-bold text-blue-600">
//                           {loading ? "Loading..." : analyticsData?.overallStats?.totalCalls?.toLocaleString() || 0}
//                         </div>
//                         <p className="text-xs text-gray-500 mt-1">
//                           Across all constituencies
//                         </p>
//               </CardContent>
//             </Card>

//             <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
//                         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                           <CardTitle className="text-sm font-medium text-gray-600">
//                             Positive Feedback
//                           </CardTitle>
//                           <TrendingUp className="h-4 w-4 text-green-600" />
//                         </CardHeader>
//                         <CardContent>
//                           <div className="text-2xl font-bold text-green-600">
//                             {loading ? "Loading..." : `${Math.round(analyticsData?.overallStats?.positivePercentage || 0)}%`}
//                           </div>
//                           <p className="text-xs text-gray-500 mt-1">
//                             Satisfaction 
//                           </p>
//                         </CardContent>
//                       </Card>

//                       <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
//                         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                           <CardTitle className="text-sm font-medium text-gray-600">
//                             Negative Feedback
//                           </CardTitle>
//                           <AlertCircle className="h-4 w-4 text-red-600" />
//                         </CardHeader>
//                         <CardContent>
//                           <div className="text-2xl font-bold text-red-600">
//                             {loading ? "Loading..." : `${Math.round(analyticsData?.overallStats?.negativePercentage || 0)}%`}
//                           </div>
//                           <p className="text-xs text-gray-500 mt-1">
//                             Issues 
//                           </p>
//                         </CardContent>
//                       </Card>

//                       <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
//                         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                           <CardTitle className="text-sm font-medium text-gray-600">
//                             Total Constituencies
//                           </CardTitle>
//                           <Phone className="h-4 w-4 text-purple-600" />
//                         </CardHeader>
//                         <CardContent>
//                           <div className="text-2xl font-bold text-purple-600">
//                             {loading ? "Loading..." : analyticsData?.totalGroups?.toLocaleString() || 0}
//                           </div>
//                           <p className="text-xs text-gray-500 mt-1">
//                             Active constituencies
//                           </p>
//                         </CardContent>
//                       </Card>  
//         </div>

//         {/* Tabs Section */}
//         <Tabs defaultValue="constituencies" className="w-full" onValueChange={setActiveTab}>
//           <TabsList className="grid w-fit grid-cols-2">
//             <TabsTrigger
//               value="constituencies"
//               className="flex items-center gap-2"
//             >
//               Constituencies
//             </TabsTrigger>

//             <TabsTrigger value="analytics" className="flex items-center gap-2">
//               Analytics
//             </TabsTrigger>
//           </TabsList>

//           <TabsContent value="analytics" className="mt-6">
//             {/* Analytics Filters */}
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
//                       onChange={(e) => setDateFrom(e.target.value)}
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
//                     <Select value={pattern} onValueChange={(value: "day" | "week" | "month") => setPattern(value)}>
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

//             {/* Charts */}
//             <div className="grid grid-cols-1 gap-6 mb-8">
//               {/* Compliance vs Issues Bar Chart */}
//               <Card className="border border-gray-200 shadow-sm">
//                 <CardHeader>
//                   <div className="flex justify-between items-start">
//                     <div>
//                       <CardTitle className="text-lg font-semibold">
//                         Constituencies Feedback
//                       </CardTitle>
//                       <p className="text-sm text-muted-foreground">
//                         Positive and Negative Feedback by Constituency
//                       </p>
//                     </div>
//                   </div>
//                 </CardHeader>
//               <CardContent>
//                 <div className="h-[300px]">
//                   {chartLoading ? (
//                     <div className="flex items-center justify-center h-full">
//                       <p className="text-gray-500">Loading chart data...</p>
//                     </div>
//                   ) : constituencyChartData.length === 0 ? (
//                     <div className="flex items-center justify-center h-full">
//                       <p className="text-gray-500">No chart data available</p>
//                     </div>
//                   ) : (
//                     <ResponsiveContainer width="100%" height="100%">
//                       <BarChart
//                         data={constituencyChartData}
//                         margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
//                       >
//                         <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
//                         <XAxis
//                           dataKey="name"
//                           tick={{ fontSize: 10 }}
//                           angle={-30}
//                           textAnchor="end"
//                           interval={0}
//                         />
//                         <YAxis />
//                         <Tooltip/>
//                         <Bar
//                           dataKey="positiveFeedbackPercent"
//                           name="Positive"
//                           stackId="a"
//                           fill="#22c55e"
//                           barSize={50}
//                         />
//                         <Bar
//                           dataKey="negativeFeedbackPercent"
//                           name="Negative"
//                           stackId="a"
//                           fill="#ef4444"
//                           barSize={50}
//                         />
//                       </BarChart>
//                     </ResponsiveContainer>
//                   )}
//                 </div>
//               </CardContent>
//               </Card>

//               <Card className="border border-gray-200 shadow-sm">
//                 <CardHeader>
//                   <div className="flex justify-between items-start">
//                     <div>
//                       <CardTitle className="text-lg font-semibold">
//                         Phone Call Analysis
//                       </CardTitle>
//                       <p className="text-sm text-muted-foreground">
//                         Citizen engagement through phone calls over time
//                       </p>
//                     </div>
//                   </div>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="h-[300px]">
//                     {chartLoading ? (
//                       <div className="flex items-center justify-center h-full">
//                         <p className="text-gray-500">Loading chart data...</p>
//                       </div>
//                     ) : phoneCallChartData.length === 0 ? (
//                       <div className="flex items-center justify-center h-full">
//                         <p className="text-gray-500">No phone call data available</p>
//                       </div>
//                     ) : (
//                       <ResponsiveContainer width="100%" height="100%">
//                         <AreaChart
//                           data={phoneCallChartData}
//                           margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
//                         >
//                           <defs>
//                             <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
//                               <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
//                               <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
//                             </linearGradient>
//                           </defs>
//                           <XAxis dataKey="time" />
//                           <YAxis />
//                           <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
//                           <Tooltip 
//                             formatter={(value) => [`${value} calls`, "Phone Calls"]}
//                             labelFormatter={(label) => `Time: ${label}`}
//                           />
//                           <Area
//                             type="monotone"
//                             dataKey="calls"
//                             stroke="#3b82f6"
//                             fillOpacity={1}
//                             fill="url(#colorCalls)"
//                             activeDot={{ r: 8 }}
//                           />
//                         </AreaChart>
//                       </ResponsiveContainer>
//                     )}
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//           </TabsContent>

//           <TabsContent value="constituencies" className="space-y-6">
//             {/* Constituency Cards */}
//             <Card className="mb-6 bg-card text-card-foreground border-none md:border md:shadow-sm">
//               <CardHeader className="px-0 py-6  md:p-6">
//                 <div className="w-full flex flex-col md:flex-row items-centers justify-between">
//                   <div className="flex items-center justify-between gap-2 mb-4">
//                     <h2 className="text-xl font-semibold text-gray-900">
//                       Constituencies ({filteredConstituencies.length})
//                     </h2>
//                     {searchTerm && (
//                       <p className="text-sm text-gray-500">
//                         Showing results for "{searchTerm}"
//                       </p>
//                     )}
//                   </div>
//                   <div className="relative max-w-md">
//                     <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//                     <Input
//                       type="text"
//                       placeholder="Search constituencies..."
//                       value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)}
//                       className="pl-10 pr-4 py-2 w-full md:w-80"
//                     />
//                   </div>
//                 </div>
//               </CardHeader>

//               <CardContent className="px-0 py-6  md:p-6">
//                 {loading ? (
//                   <div className="flex items-center justify-center p-8">
//                     <p className="text-gray-500">Loading constituencies...</p>
//                   </div>
//                 ) : filteredConstituencies.length === 0 ? (
//                   <Card className="border border-gray-200 shadow-sm">
//                     <CardContent className="p-8 text-center">
//                       <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//                       <p className="text-gray-600">
//                         No constituencies found matching your search criteria.
//                       </p>
//                     </CardContent>
//                   </Card>
//                 ) : (
//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                     {filteredConstituencies.map((constituency: AnalyticsResult) => (
//                       <Card
//                         key={constituency.key}
//                         className={`hover:shadow-md transition-shadow cursor-pointer ${getCardBackgroundColor(
//                           constituency.positivePercentage,
//                           constituency.negativePercentage
//                         )}`}
//                         onClick={() =>
//                           router.push(
//                             `/operation/category?districtId=${districtId}&districtName=${districtName}&constituency_id=${constituency.key}`
//                           )
//                         }
//                       >
//                         <CardHeader>
//                           <div className="flex items-center justify-between">
//                             <CardTitle className="text-lg font-semibold text-slate-900">
//                               {constituency.constituencyName}
//                             </CardTitle>
//                             <Badge
//                               variant="outline"
//                               className="text-xs border-gray-500"
//                             >
//                               {constituency.key}
//                             </Badge>
//                           </div>
//                         </CardHeader>
//                         <CardContent className="space-y-4 bg-none">
//                           <div className="flex justify-between items-center mb-4">
//                             <div className="text-center flex-1 px-2">
//                               <div className="text-base font-bold text-orange-600">
//                                 {constituency.callLogsLength}
//                               </div>
//                               <div className="text-xs text-orange-700">
//                                 Total Calls
//                               </div>
//                             </div>
//                             <div className="text-center flex-1 px-2 border-l border-slate-200">
//                               <div className="text-base font-semibold text-green-600">
//                                 {Math.round(constituency.positivePercentage)}%
//                               </div>
//                               <div className="text-xs text-slate-600">
//                                 Positive
//                               </div>
//                             </div>
//                             <div className="text-center flex-1 px-2 border-l border-slate-200">
//                               <div className="text-base font-semibold text-red-600">
//                                 {Math.round(constituency.negativePercentage)}%
//                               </div>
//                               <div className="text-xs text-slate-600">
//                                 Negative
//                               </div>
//                             </div>
//                           </div>

//                           <div className="pt-4 border-t border-slate-200 border-opacity-50">
//                             <div className="flex items-center justify-between mb-2">
//                               <span className="text-xs text-slate-600">
//                                 Status:
//                               </span>
//                               <Activity className="h-4 w-4 text-slate-600" />
//                             </div>
//                             <Badge
//                               variant="outline"
//                               className={`text-xs px-3 py-1 ${
//                                 constituency.positivePercentage > constituency.negativePercentage
//                                   ? " text-green-900 border-green-200"
//                                   : " text-red-900 border-red-200"
//                               }`}
//                             >
//                               {constituency.positivePercentage > constituency.negativePercentage
//                                 ? "Positive Trend"
//                                 : "Needs Attention"}
//                             </Badge>
//                           </div>
//                         </CardContent>
//                       </Card>
//                     ))}
//                   </div>
//                 )}
//                 {renderPagination()}
//               </CardContent>
//             </Card>
//           </TabsContent>
//         </Tabs>
//       </div>
//     </Container>
//   );
// };

// export default function PageWrapper() {
//   return (
//     <Suspense fallback={<div>Loading Dashboard...</div>}>
//       <ConstituencyDashboard />
//     </Suspense>
//   );
// }



"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import {
  Search,
  AlertCircle,
  TrendingUp,
  Phone,
  CheckCircle2,
  MapPin,
  AlertTriangle,
  Activity,
} from "lucide-react";
import constituencyData from "@/data/consti.json";
import PageTitle from '@/components/ui/pageTitle'
import Container from "@/components/ui/container";
import { useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
interface CustomTooltipProps {
  active?: boolean;
  payload?: {
    name: string;
    value: number;
    payload: any;
    color: string;
    dataKey: string;
  }[];
  label?: string;
}

const ConstituencyDashboard: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [districtId, setDistrictId] = useState<string | null>(null);
  const [totalFeedback, setTotalFeedback] = useState<number | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [timePeriod, setTimePeriod] = useState<"day" | "week" | "month">("day");
  const [timeRange, setTimeRange] = useState('day'); 

  const filterDataByTimeRange = (data, range) => {
    return data.map(item => {
      let positiveRatio = 1;
      let negativeRatio = 1;
      
      switch (range) {
        case 'day':
          positiveRatio = 0.9;
          negativeRatio = 1.1;
          break;
        case 'week':
          positiveRatio = 0.95;
          negativeRatio = 1.05;
          break;
        case 'month':
          positiveRatio = 1; 
          negativeRatio = 1; 
          break;
        default:
          break;
      }

      const adjustedPositive = item.positiveFeedbackPercent * positiveRatio;
      const adjustedNegative = item.negativeFeedbackPercent * negativeRatio;
      const total = adjustedPositive + adjustedNegative;
      
      const normalizedPositive = Math.round((adjustedPositive / total) * 100);
      const normalizedNegative = 100 - normalizedPositive; 

      return {
        ...item,
        positiveFeedbackPercent: normalizedPositive,
        negativeFeedbackPercent: normalizedNegative,
      };
    });
  };

  useEffect(() => {
    const id = searchParams.get("districtId");
    const totalFeedback = searchParams.get("feedback");
    setDistrictId(id);
    setTotalFeedback(totalFeedback ? parseInt(totalFeedback,10) : null );
  }, [searchParams]);


  useEffect(() => {
    if (!districtId) {
      setSelectedDistrict(null);
      return;
    }
    const found = constituencyData.find((d) => d.district_id === districtId);
    setSelectedDistrict(found ?? null);
  }, [districtId]);

  const filteredConstituencies = useMemo(() => {
    const list = selectedDistrict?.constituencies ?? [];
    return list.filter(
      (c) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.constituency_id.toString().includes(searchTerm)
    );
  }, [selectedDistrict, searchTerm]);

  const totals = useMemo(() => {
    if (!selectedDistrict) {
      return {
        totalCompliance: 0,
        totalIssues: 0,
        totalImprovement: 0,
        totalPhoneCalls: 0,
        avgPositiveFeedback: 0,
        avgNegativeFeedback: 0,
      };
    }
    const list = selectedDistrict.constituencies ?? [];
    const acc = list.reduce(
      (s, c) => ({
        totalCompliance: s.totalCompliance + c.complianceCount,
        totalIssues: s.totalIssues + c.issueCount,
        totalImprovement: s.totalImprovement + c.improvementCount,
        totalPhoneCalls: s.totalPhoneCalls + c.phoneCallCount,
        avgPositiveFeedback: s.avgPositiveFeedback + c.positiveFeedbackPercent,
        avgNegativeFeedback: s.avgNegativeFeedback + c.negativeFeedbackPercent,
      }),
      {
        totalCompliance: 0,
        totalIssues: 0,
        totalImprovement: 0,
        totalPhoneCalls: 0,
        avgPositiveFeedback: 0,
        avgNegativeFeedback: 0,
      }
    );
    const len = list.length || 1;
    return {
      ...acc,
      avgPositiveFeedback: Math.round(acc.avgPositiveFeedback / len),
      avgNegativeFeedback: Math.round(acc.avgNegativeFeedback / len),
    };
  }, [selectedDistrict]);

  const phoneCallDatas = {
    day: [
      { time: "9AM", calls: 809 },
      { time: "12PM", calls: 335 },
      { time: "3PM", calls: 552 },
      { time: "6PM", calls: 310 }
    ],
    week: [
      { day: "Mon", calls: 1825 },
      { day: "Tue", calls: 1542 },
      { day: "Wed", calls: 1438 },
      { day: "Thu", calls: 1245 },
      { day: "Fri", calls: 1140 }
    ],
    month: [
      { week: "Week 1", calls: 9250 },
      { week: "Week 2", calls: 7180 },
      { week: "Week 3", calls: 8165 },
      { week: "Week 4", calls: 9175 }
    ]
  };

  const CustomTooltip: React.FC<CustomTooltipProps> = ({
    active,
    payload,
    label,
  }) => {
    if (!active || !payload || !payload.length) return null;
    return (
      <div className="bg-white p-3 border rounded shadow-lg">
        <p className="font-semibold">{payload[0].payload.fullName || label}</p>
        {payload.map((e, i) => (
          <p key={i} style={{ color: e.color }}>
            {e.name}: {e.value}
          </p>
        ))}
      </div>
    );
  };

  const getCardBackgroundColor = (pos: number, neg: number) => {
    if (pos > neg) return "bg-green-100 border-green-300";
    if (neg > pos) return "bg-red-100 border-red-300";
    if (pos === neg) return "bg-yellow-100 border-yellow-300";
    return "bg-gray-50 border-gray-200";
  };

  if (!selectedDistrict) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold">No District Selected</h3>
          <p>Please select a district to view constituency data.</p>
        </div>
      </div>
    );
  }

  const getImprovementColor = (improvement: string) => {
    return "bg-gray-50 text-gray-900 border-gray-200";
  };

  return (
    <Container className="min-h-screen bg-white">
      <PageTitle title={`${selectedDistrict.name} District`} description={` ${selectedDistrict?.constituencies?.length} constituencies`}>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/operation/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbPage>
                Constituency
              </BreadcrumbPage>
            </BreadcrumbList>
          </Breadcrumb>
        </PageTitle>
      
      <div className="max-w-7xl mx-auto px-6 py-4">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          

          <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                          Total Feedback
                        </CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-blue-600" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-blue-600">
                          {totalFeedback}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Across all constituencies
                        </p>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium text-gray-600">
                            Positive Feedback
                          </CardTitle>
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-green-600">
                            {totals.avgPositiveFeedback}%
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Satisfaction 
                          </p>
                        </CardContent>
                      </Card>


                      <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium text-gray-600">
                            Negative Feedback
                          </CardTitle>
                          <AlertCircle className="h-4 w-4 text-red-600" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-red-600">
                            {totals.avgNegativeFeedback}%
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Issues 
                          </p>
                        </CardContent>
                      </Card>

                      <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium text-gray-600">
                            Phone Interactions
                          </CardTitle>
                          <Phone className="h-4 w-4 text-purple-600" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-purple-600">
                            {totals.totalPhoneCalls.toLocaleString()}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Engagement 
                          </p>
                        </CardContent>
                      </Card>  
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="constituencies" className="w-full">
          <TabsList className="grid w-fit grid-cols-2">
            
            <TabsTrigger
              value="constituencies"
              className="flex items-center gap-2"
            >
              Constituencies
            </TabsTrigger>

            <TabsTrigger value="analytics" className="flex items-center gap-2">
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="mt-6">
            {/* Charts */}
            <div className="grid grid-cols-1  gap-6 mb-8">
              {/* Compliance vs Issues Bar Chart */}
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg font-semibold">
                        Constituencies Feedback
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Positive and Negative Feedback by Constituency
                      </p>
                    </div>
                    <Tabs 
                      value={timeRange}
                      onValueChange={(value) => setTimeRange(value as "day" | "week" | "month")}
                      className="w-fit"
                    >
                      <TabsList>
                        <TabsTrigger value="day">Day</TabsTrigger>
                        <TabsTrigger value="week">Week</TabsTrigger>
                        <TabsTrigger value="month">Month</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  {!selectedDistrict || !selectedDistrict.constituencies ? (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-gray-500">Loading ward data...</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={filterDataByTimeRange(selectedDistrict.constituencies, timeRange)}
                        margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis
                          dataKey="name"
                          tick={{ fontSize: 10 }}
                          angle={-30}
                          textAnchor="end"
                          interval={0}
                        />
                        <YAxis />
                        <Tooltip/>
                        <Bar
                          dataKey="positiveFeedbackPercent"
                          name="Positive"
                          stackId="a"
                          fill="#22c55e"
                          barSize={50}
                        />
                        <Bar
                          dataKey="negativeFeedbackPercent"
                          name="Negative"
                          stackId="a"
                          fill="#ef4444"
                          barSize={50}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
              </Card>

              <Card className="border border-gray-200 shadow-sm">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg font-semibold">
                        Phone Call Analysis
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Citizen engagement through phone calls
                      </p>
                    </div>
                    <Tabs 
                      value={timePeriod}
                      onValueChange={(value) => setTimePeriod(value as "day" | "week" | "month")}
                      className="w-fit"
                    >
                      <TabsList>
                        <TabsTrigger value="day">Day</TabsTrigger>
                        <TabsTrigger value="week">Week</TabsTrigger>
                        <TabsTrigger value="month">Month</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={phoneCallDatas[timePeriod]}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis 
                          dataKey={timePeriod === "day" ? "time" : timePeriod === "week" ? "day" : "week"} 
                        />
                        <YAxis />
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <Tooltip 
                          formatter={(value) => [`${value} calls`, "Phone Calls"]}
                          labelFormatter={(label) => timePeriod === "day" ? `Time: ${label}` : 
                                            timePeriod === "week" ? `Day: ${label}` : `Week: ${label}`}
                        />
                        <Area
                          type="monotone"
                          dataKey="calls"
                          stroke="#3b82f6"
                          fillOpacity={1}
                          fill="url(#colorCalls)"
                          activeDot={{ r: 8 }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="constituencies" className="space-y-6">
            {/* Constituency Cards */}
            <Card>
              <CardHeader>
                <div className="w-full flex justify-between">
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Constituencies ({filteredConstituencies.length})
                    </h2>
                    {searchTerm && (
                      <p className="text-sm text-gray-500">
                        Showing results for "{searchTerm}"
                      </p>
                    )}
                  </div>
                  <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search constituencies..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 w-full md:w-80"
                    />
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                {filteredConstituencies.length === 0 ? (
                  <Card className="border border-gray-200 shadow-sm">
                    <CardContent className="p-8 text-center">
                      <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">
                        No constituencies found matching your search criteria.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredConstituencies.map((constituency: any) => (
                      <Card
                        key={constituency.constituency_id}
                        className={`hover:shadow-md transition-shadow cursor-pointer ${getCardBackgroundColor(
                          constituency.positiveFeedbackPercent,
                          constituency.negativeFeedbackPercent
                        )}`}
                        onClick={() =>
                          router.push(
                            `/operation/category?districtId=${districtId}&constituency_id=${constituency.constituency_id}`
                          )
                        }
                      >
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg font-semibold text-slate-900">
                              {constituency.name}
                            </CardTitle>
                            <Badge
                              variant="outline"
                              className="text-xs border-gray-500"
                            >
                              {constituency.constituency_id}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex justify-between items-center mb-4">
                            <div className="text-center flex-1 px-2">
                              <div className="text-base font-bold text-orange-600">
                                {constituency.issueCount}
                              </div>
                              <div className="text-xs text-orange-700">
                                Feedbacks
                              </div>
                            </div>
                            <div className="text-center flex-1 px-2 border-l border-slate-200">
                              <div className="text-base font-semibold text-green-600">
                                {constituency.positiveFeedbackPercent}%
                              </div>
                              <div className="text-xs text-slate-600">
                                Positive
                              </div>
                            </div>
                            <div className="text-center flex-1 px-2 border-l border-slate-200">
                              <div className="text-base font-semibold text-red-600">
                                {constituency.negativeFeedbackPercent}%
                              </div>
                              <div className="text-xs text-slate-600">
                                Negative
                              </div>
                            </div>
                          </div>

                          <div className="pt-4 border-t border-slate-200 border-opacity-50">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs text-slate-600">
                                Priority Focus:
                              </span>
                              <Activity className="h-4 w-4 text-slate-600" />
                            </div>
                            <Badge
                              variant="outline"
                              className={`text-xs px-3 py-1 ${getImprovementColor(
                                constituency.improvementNeeded
                              )}`}
                            >
                              {constituency.improvementNeeded}
                            </Badge>
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

export default function PageWrapper() {
  return (
    <Suspense fallback={<div>Loading Dashboard...</div>}>
      <ConstituencyDashboard />
    </Suspense>
  );
}