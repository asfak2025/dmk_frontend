// "use client"
// import Container from '@/components/ui/container'
// import PageTitle from '@/components/ui/pageTitle'
// import React, { useEffect, useState } from 'react'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { ArrowUp, LucideFileWarning, Phone, PhoneIncoming } from 'lucide-react'
// import Categorycard from '@/components/tvk/categforycard'
// import PieChartComponent from '@/components/tvk/PieChart'
// import ComplaintTable from '@/components/tvk/insightsTable'
// import { useSearchParams } from 'next/navigation'
// import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
// import { TabsContent } from '@radix-ui/react-tabs'

// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbPage,
//   BreadcrumbSeparator,
// } from "@/components/ui/breadcrumb"
// import BarChartComponent from '@/components/tvk/LineChart'
// import AreaChartWithTabs from '@/components/tvk/AreaChart'
// import { useAlert } from '@/hooks/alertHook'
// import { useAppContext } from '@/hooks/context'
// import { getFromLocalStorage } from '@/components/encryption/encryption'
// import { json } from 'stream/consumers'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
// import { useSession } from 'next-auth/react'




// type Category = {
//   booth_id: string;
//   category: string;
//   description: string;
//   total: number;
//   positive: number;
//   negative: number;
//   positive_pct: number;
//   negative_pct: number;
// };

// type Constituency = {
//   constituency_id: number;
//   name: string;
//   complianceCount: number;
//   issueCount: number;
//   improvementNeeded: string;
//   improvementCount: number;
//   phoneCallCount: number;
//   positiveFeedbackPercent: number;
//   negativeFeedbackPercent: number;
//   memberName: string;
//   memberDetails: string;
//   total_complaints?: number;
//   categories?: Category[];
//   callCategory?: any[];
// };

// type District = {
//   district_id: string;
//   name: string;
//   complianceCount: number;
//   issueCount: number;
//   improvementNeeded: string;
//   improvementCount: number;
//   phoneCallCount: number;
//   positiveFeedbackPercent: number;
//   negativeFeedbackPercent: number;
//   topConcerns: string[];
//   constituencies: Constituency[];
// };



// function TvkCategory() {
 
//   const searchParams = useSearchParams()
//     const constituency_id = searchParams.get('constituency_id') ;
//     const district_id = searchParams.get('districtId') 
//     const districtName = searchParams.get('districtName')
//     const {alert,showAlert,hideAlert} = useAlert()
//     const token = getFromLocalStorage('token')
//     const memberId = getFromLocalStorage('memberId')
//     const orgId = getFromLocalStorage('orgId')
//     const [total,setTotal] = useState({totalCalls:"",negativePercentage:"",positivePercentage:""})
//     const [categoryData,setData] = useState([])
//   const {URL} = useAppContext()
//    const [chartLoading, setChartLoading] = useState(false);
//   const [dateFrom, setDateFrom] = useState("2025-07-21");
//     const [dateTo, setDateTo] = useState("2025-07-24");
//     const [members,setMembers] =useState([]);
//     const [pattern, setPattern] = useState<"day" | "week" | "month">("day");
//     const {data:session}=useSession();
 
 



// useEffect(()=>{
//   if(session){
//     fetchCategoryData()
//   fetchMemberDetails()
//   }
  
// },[session])

// async function fetchMemberDetails() {
//   try{
    
//     console.log("orgid",orgId)
//     const payload = {"constituencyId":constituency_id,"districtId":district_id,"orgId":orgId}
//     const response = await fetch(`${URL}/district/getById-constituency`,{
//       method:"POST",
//       headers: {
//             "Content-Type": "application/json",
//                 Authorization: `Bearer ${token}`,
//                 "X-Member-Id": memberId
//           },
//           body:JSON.stringify(payload)

//     })
//     if(response.status ===200){
//       const data = await response.json()
//       console.log("member details",data)
//       setMembers(data.constituencyMembers)
//     }
//   }catch(e){
//     console.log(e)
//   }
// }

//   async function fetchCategoryData(){
//     try{
//       setChartLoading(true)
//         const payload = {
  
//   "pattern": pattern,
//   "constituencyId":constituency_id,
//   "groupBy": "callCategory",
//   "overallData": true
// }
//         const response = await fetch(`${URL}/call/call-analytics`,{
//           method:"POST",
//           headers: {
//             "Content-Type": "application/json",
//                 Authorization: `Bearer ${token}`,
//                 "X-Member-Id": memberId
//           },
//           body:JSON.stringify(payload)
//         })
//         if(response.status === 200){
//           const data = await response.json()
         
//           setData(data.results)
//           setTotal(data.overallStats)
//           setChartLoading(false)
//         }
//         else{
//           setChartLoading(false)
//         }

//     }catch(e){
//       console.log("error",e)
//     }
//   }


// if(!categoryData){
//   return (
//     <Container>
//       <PageTitle title='Complaint Category' />
//       <div className='flex-1 absolute top-72 left-[800px] flex items-center justify-center'>
//         <div className='flex items-center gap-3 bg-red-100 border border-red-300 rounded-lg px-6 py-4'>
//           <LucideFileWarning className="text-red-600" size={24} />
//           <h2 className='text-red-700 font-semibold text-lg'>No Data Found</h2>
//         </div>
//       </div>
//     </Container>
//   )
// }

//   return (
//     <Container>
//         <PageTitle title={`Complaint Category `} description={`Complaints registered in `}>
//           <Breadcrumb>
//             <BreadcrumbList>
//               <BreadcrumbItem>
//                 <BreadcrumbLink href="/operation/dashboard">Dashboard</BreadcrumbLink>
//               </BreadcrumbItem>
//               <BreadcrumbSeparator />
//               <BreadcrumbItem>
//                 <BreadcrumbLink href={`/operation/constituency?districtId=${district_id}&districtName=${districtName}`}>Constituency</BreadcrumbLink>
//               </BreadcrumbItem>
//               <BreadcrumbSeparator />
//               <BreadcrumbItem>
//                 <BreadcrumbPage>Categories</BreadcrumbPage>
//               </BreadcrumbItem>
//             </BreadcrumbList>
//           </Breadcrumb>
//         </PageTitle>
//       {/* summary cards */}
//       <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6'>
//         <Card>
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Total Complaints/FeedBacks</p>
//                 <p className="text-2xl font-bold text-black">               
//                     {total.totalCalls}
//                 </p>
//               </div>
//               <div className="border border-gray-100 p-3 rounded-2xl bg-gray-100">
//                 <PhoneIncoming className="h-4 w-4 text-blue-600" />
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600"> Positive Feedbacks</p>
//                 <p className="text-2xl font-bold text-black">
//                  {total.positivePercentage}%
//                 </p>
//               </div>
//               <div className="border border-gray-100 p-3 rounded-2xl bg-gray-100">
//                 <PhoneIncoming className="h-4 w-4 text-green-600" />
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Negative FeedBack</p>
//                 <p className="text-2xl font-bold text-black">
//                  {total.negativePercentage}%
//                 </p>
//               </div>
//               <div className="border border-gray-100 p-3 rounded-2xl bg-gray-100">
//                 <Phone className="h-4 w-4 text-red-600" />
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Category count</p>
//                 <p className="text-2xl font-bold text-black">
//                  {categoryData.length}
//                 </p>
//               </div>
//               <div className="border border-gray-100 p-3 rounded-2xl bg-gray-100">
//                 <ArrowUp className="h-4 w-4 text-green-600" />
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//         {/* member info */}
//       <Card className='my-5'>
//           <CardHeader>
//             <CardTitle>Member Information</CardTitle>
//           </CardHeader>
//           <CardContent className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
//              {members?.map((member, index) => (
//               <div
//                 key={index}
//                 className="border rounded-md p-4 bg-muted text-muted-foreground hover:bg-muted/70 transition"
//               >
//                 <p className="text-sm">
//                   <span className="font-medium text-gray-800">Member ID:</span> {member.memberId}
//                 </p>
//                 <p className="text-sm">
//                   <span className="font-medium text-gray-800">Name:</span> {member.memberName}
//                 </p>
//                 <p className="text-sm">
//                   <span className="font-medium text-gray-800">Position:</span> {member.memberPosition}
//                 </p>
//               </div>
//             ))}
//           </CardContent>
//       </Card>  
//       <Tabs defaultValue="category" className="w-full">
//           <TabsList className="w-fit">
//             <TabsTrigger value="category">Categories</TabsTrigger>
//             <TabsTrigger value="analytics">Analytics</TabsTrigger>      
//           </TabsList>
//          {/* Categories Card */}
//           <TabsContent value='category'>
//             <Card className='mb-6 bg-card text-card-foreground border-none md:border md:shadow-sm'>
//               <CardHeader className="px-0 py-6 md:p-6">
//                 <CardTitle>Categories</CardTitle>
//               </CardHeader>
//               <CardContent className="p-0 md:p-6">
//                   <Categorycard districtId={district_id} constituency_id={constituency_id } complaintData={categoryData} districtName={districtName}/>
//               </CardContent>
//             </Card>
//           </TabsContent>
//         {/*  Charts */}
//         <TabsContent value='analytics'>
//         <Card className='my-5'>
//           <Card className="m-6 ">
            
//                         <CardHeader>
//                           <CardTitle className="text-lg font-semibold text-gray-900">
//                             Analytics Filters
//                           </CardTitle>
//                         </CardHeader>
//                         <CardContent>
//                           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                             <div className="space-y-2">
//                               <label className="text-sm font-medium text-gray-700">
//                                 From Date
//                               </label>
//                               <Input
//                                 type="date"
//                                 value={dateFrom}
//                                 onChange={(e) => setDateFrom(e.target.value)}
//                               />
//                             </div>
//                             <div className="space-y-2">
//                               <label className="text-sm font-medium text-gray-700">
//                                 To Date
//                               </label>
//                               <Input
//                                 type="date"
//                                 value={dateTo}
//                                 onChange={(e) => setDateTo(e.target.value)}
//                               />
//                             </div>
//                             <div className="space-y-2">
//                               <label className="text-sm font-medium text-gray-700">
//                                 Pattern
//                               </label>
//                               <Select value={pattern} onValueChange={(value: "day" | "week" | "month") => setPattern(value)}>
//                                 <SelectTrigger>
//                                   <SelectValue />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                   <SelectItem value="day">Day</SelectItem>
//                                   <SelectItem value="week">Week</SelectItem>
//                                   <SelectItem value="month">Month</SelectItem>
//                                 </SelectContent>
//                               </Select>
//                             </div>
//                             <div className="flex items-end">
//                               <Button
//                                 onClick={fetchCategoryData} 
//                                 disabled={chartLoading}
//                                 className="w-full"
//                               >
//                                 {chartLoading ? (
//                                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                                 ) : null}
//                                 Refresh
//                               </Button>
//                             </div>
//                           </div>
//                         </CardContent>
//                       </Card>
         
//           <CardContent >
//             <div className="flex flex-col md:flex-row gap-5 my-5">
//               <div className="flex-1 min-w-[300px]">
//                 <BarChartComponent complaintData={categoryData} />
//               </div>
//               <div className="flex-2 min-w-[300px]">
//                 <PieChartComponent complaintData={categoryData} />
//               </div>
//             </div>   
//                   <AreaChartWithTabs complaintData={categoryData}/>            
//           </CardContent>
//           </Card>
                
//         </TabsContent>       
//       </Tabs>
//         {/* Recent calls table */}
//       <ComplaintTable constituency_id={constituency_id}/>
//     </Container>
//   )

// }

// export default TvkCategory



"use client"
import Container from '@/components/ui/container'
import PageTitle from '@/components/ui/pageTitle'
import React, { useEffect, useState } from 'react'
//import data from '@/data/tn_constituency_complaints.json'
import datas from '@/data/tn_constituency_complaints.json'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowUp, LucideFileWarning, Phone, PhoneIncoming, PhoneOutgoing } from 'lucide-react'
import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import InsightsTable from '@/components/tvk/insightsTable'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Categorycard from '@/components/tvk/categforycard'
import LineChartComponent from '@/components/tvk/LineChart'
import PieChartComponent from '@/components/tvk/PieChart'
import ComplaintTable from '@/components/tvk/insightsTable'
import { useParams, useSearchParams } from 'next/navigation'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TabsContent } from '@radix-ui/react-tabs'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import BarChartComponent from '@/components/tvk/LineChart'
import AreaChartWithTabs from '@/components/tvk/AreaChart'
import { useSession } from 'next-auth/react'



type Category = {
  booth_id: string;
  category: string;
  description: string;
  total: number;
  positive: number;
  negative: number;
  positive_pct: number;
  negative_pct: number;
};

type Constituency = {
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
  categories?: Category[];
  callCategory?: any[];
};

type District = {
  district_id: string;
  name: string;
  complianceCount: number;
  issueCount: number;
  improvementNeeded: string;
  improvementCount: number;
  phoneCallCount: number;
  positiveFeedbackPercent: number;
  negativeFeedbackPercent: number;
  topConcerns: string[];
  constituencies: Constituency[];
};

function TvkCategory() {
  const { data: session, status } = useSession();
    console.log("session data:", session);
  
  const [user, setUser] = useState<Array<any> | null>(null);
  const params = useParams();
  const searchParams = useSearchParams()
    const code = Number(searchParams.get('constituency_id')) ;
    const district_id = searchParams.get('districtId') 
  const [constituency,setConstituent] = useState('Chennai South')
  const categoryMap = {};
  
  // const allConstituencies = data.flatMap(district => district.constituencies);
     useEffect(() => {
    if (status === "authenticated" && session) {
      setUser(session?.memberData);
    }
  }, [session, status]);

 

const matched = datas.find(c => c.constituency_id === code);

console.log('dtas matched',matched)
if(!matched){
  return (
    <Container>
      <PageTitle title='Complaint Category' />
      <div className='flex-1 absolute top-72 left-[800px] flex items-center justify-center'>
        <div className='flex items-center gap-3 bg-red-100 border border-red-300 rounded-lg px-6 py-4'>
          <LucideFileWarning className="text-red-600" size={24} />
          <h2 className='text-red-700 font-semibold text-lg'>No Data Found</h2>
        </div>
      </div>
    </Container>
  )
}
  const sum = matched.categories.reduce((acc, item) => acc + item.total, 0);

  return (

    <Container>
        <PageTitle title={`Complaint Category - ${matched.name}`} description={`Complaints registered in ${matched.name}`}>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/operation/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href={`/operation/constituency?districtId=${district_id}`}>Constituency</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Categories</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </PageTitle>
      {/* summary cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6'>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Complaints/FeedBacks</p>
                <p className="text-2xl font-bold text-black">
                
                    {sum}

                </p>
              </div>
              <div className="border border-gray-100 p-3 rounded-2xl bg-gray-100">
                <PhoneIncoming className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600"> Positive Feedbacks</p>
                <p className="text-2xl font-bold text-black">
                 {matched.positiveFeedbackPercent}%
                </p>
              </div>
              <div className="border border-gray-100 p-3 rounded-2xl bg-gray-100">
                <PhoneIncoming className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Negative FeedBack</p>
                <p className="text-2xl font-bold text-black">
                 {matched.negativeFeedbackPercent}%
                </p>
              </div>
              <div className="border border-gray-100 p-3 rounded-2xl bg-gray-100">
                <Phone className="h-4 w-4 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Improvement count</p>
                <p className="text-2xl font-bold text-black">
                 {matched.improvementCount}
                </p>
              </div>
              <div className="border border-gray-100 p-3 rounded-2xl bg-gray-100">
                <ArrowUp className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        </div>

        {/* member info */}
        <Card className='my-5'>
          <CardHeader>
            <CardTitle>Member Information</CardTitle>
          </CardHeader>
         <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {user?.map((member, index) => (
      <div
        key={index}
        className="border rounded-md p-4 bg-muted text-muted-foreground hover:bg-muted/70 transition"
      >
        <p className="text-sm">
          <span className="font-medium text-gray-800">Member ID:</span> {member.memberId}
        </p>
        <p className="text-sm">
          <span className="font-medium text-gray-800">Name:</span> {member.name}
        </p>
        <p className="text-sm">
          <span className="font-medium text-gray-800">Position:</span> {member.position}
        </p>
      </div>
    ))}
  </CardContent>
        </Card>
       
        <Tabs defaultValue="category" className="w-full">
          <TabsList className="w-fit">
            <TabsTrigger value="category">Categories</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            
          </TabsList>
         

        
         {/* Categories Card */}
          <TabsContent value='category'>
            <Card className='mt-5'>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent>
                  <Categorycard districtId={district_id} constituency_id={code } complaintData={matched.categories}/>
              </CardContent>
            </Card>
          </TabsContent>
        {/*  Charts */}
        <TabsContent value='analytics'>
        <Card className='my-5'>
          <CardHeader>
            <CardTitle>Analytics</CardTitle>
          </CardHeader>
          <CardContent >
            <div className="flex flex-col md:flex-row gap-5 my-5">
              <div className="flex-1 min-w-[300px]">
                <BarChartComponent complaintData={matched.categories} />
              </div>
              <div className="flex-2 min-w-[300px]">
                <PieChartComponent complaintData={matched.categories} />
              </div>
            </div>
            
                
                  <AreaChartWithTabs/>
               
            
          </CardContent>
        </Card>
          
        </TabsContent>
        
      </Tabs>
        

        {/* Recent calls table */}
        <ComplaintTable categories={matched.categories}/>
    </Container>
  )

}

export default TvkCategory
