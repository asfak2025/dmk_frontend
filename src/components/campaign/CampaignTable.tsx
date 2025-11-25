// import { Ban, ChevronRight, Dot, Download, Pause, PauseIcon, Play, Trash } from 'lucide-react';
// import React, { useEffect, useState } from 'react';
// // import Modal from '../Modal/deleteModal';
// import Modal from "@/components/ui/modal";
// import { useRouter } from 'next/navigation';
// import ConfirmActionModal from './ConfirmActionModal';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
// import { useAppContext } from '@/hooks/context';
// import { getFromLocalStorage } from '../encryption/encryption';
// import { useSession } from 'next-auth/react';
// import { useAlert } from '@/hooks/alertHook';
// import Alert from '../alert/alert';


// // Sample data for demonstration

// const formatDate = (ts: number) =>
//   new Date(ts).toLocaleString("en-IN", {
//     dateStyle: "medium",
//     timeStyle: "short",
//     hour12: false,
//   });


// const CampaignTable = () => {
//   const {URL} = useAppContext()
//   const { alert, showAlert, hideAlert } = useAlert();
//   const [campaignId,setCampaignId] = useState("")
//   const [campaignData,setCampaignData] = useState([])
//   const {data:session}=useSession();
//    const token = session?.accessToken
//   const memberId = session?.memberId
//   const orgId = session?.orgId
//   const router=useRouter()
//   const [pauseModal,setPause] = useState(false)
//   const [resumeModal,setResume] = useState(false)
//   const [stopModal,setStop] = useState(false)
//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'ACTIVE':
//         return 'text-green-600 bg-green-50';
//       case 'INACTIVE':
//         return 'text-red-600 bg-red-50';
//       case 'UPLOADED':
//         return 'text-yellow-600 bg-yellow-50';
//       default:
//         return 'text-gray-600 bg-gray-50';
//     }
//   };
//     useEffect(()=>{
//       if(session){
//         fetchCampaigns()
//       }
      
//     },[session])
//   async function fetchCampaigns(){
//     try{
//       const payload = {orgId:orgId,page:1,limit:10,memberId:memberId}
//       console.log(payload)
//       const response = await fetch(`${URL}/campaign/getCampaign`,{
//         method:"POST",
//         headers:{
//           "Content-Type": "application/json",
//                "Authorization": `Bearer ${token}`,
//                 "X-Member-Id": memberId
//         },
//         body:JSON.stringify(payload)

//       })

//       if(response.status === 200){
//           const data = await response.json()
//           console.log(data)
//           setCampaignData(data.campaigns)
//       }else{
//          console.log("Error Fetching Data","error")
//       }
      
//     }catch(e){
      
//     }
//   }
//   async function handleStatusChange(status:string){
//     try{
      
//       const payload = {campaignId:campaignId,status:status}
//       const result = await fetch(`${URL}/campaign/updateCampaign`,{
//         method:"POST",
//         headers:{
//           "Content-Type": "application/json",
//                "Authorization": `Bearer ${token}`,
//                 "X-Member-Id": memberId
          
//         },
//         body:JSON.stringify(payload)


//       })

//       if(result.ok ){
//         showAlert("Campaign Updated successfully","success")
//         fetchCampaigns()
//       }else{
//         showAlert("Error Updating Campaign","error")
//       }
//     }catch(e){
       
//     }
//   }

 
//   return (
//     // <div className="w-full max-w-full overflow-x-auto">
//     //   <Table className="w-full border border-gray-200 shadow-sm rounded-lg overflow-hidden bg-white">
//     //     <TableHeader className="bg-gray-100">
//     //       <TableRow>
//     //          <TableHead className="px-6 py-4 text-left text-md font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
//     //           Campaign ID
//     //         </TableHead>
//     //         <TableHead className="px-6 py-4 text-left text-md font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
//     //           Campaign Name
//     //         </TableHead>
//     //         <TableHead className="px-6 py-4 text-left text-md font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
//     //           Date
//     //         </TableHead>
//     //         <TableHead className="px-6 py-4 text-left text-md font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
//     //           Status
//     //         </TableHead>
//     //         <TableHead className="px-6 py-4 text-left text-md font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
//     //           Action
//     //         </TableHead>
//     //       </TableRow>
//     //     </TableHeader>
//     //     <TableBody className="divide-y divide-gray-200">
//     //       {campaignData.map((campaign, index) => (
//     //         <TableRow key={campaign.campaignId}  className="hover:bg-gray-50 hover:cursor-pointer transition-colors duration-150">
//     //           <TableCell onClick={() => router.push('/campaign/CampaignInsights')} className="px-6 py-4 text-sm text-gray-900 font-medium">
//     //             {campaign.campaignId}
//     //           </TableCell>
//     //           <TableCell onClick={() => router.push('/campaign/CampaignInsights')} className="px-6 py-4 text-sm text-gray-900 font-medium">
//     //             {campaign.campaignName}
//     //           </TableCell>
//     //           <TableCell className="px-6 py-4 text-sm text-gray-900">
//     //             {(campaign.updatedDate)}
//     //           </TableCell>
//     //           <TableCell className="px-6 py-4 text-sm">
//     //             <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(campaign.status)}`}>
//     //               {campaign.status}
//     //             </span>
//     //           </TableCell>
//     //           <TableCell className="px-6 py-4 text-xs flex flex-row gap-2">
               
                 
//     //               {campaign.status==='ACTIVE'? 
//     //               <button onClick={()=>{setPause(true),setCampaignId(campaign.campaignId)}} className="text-black gap-2 flex flex-row hover:underline font-normal transition-colors duration-150"><Pause  size={20} /></button> :
//     //               <button onClick={()=>{setResume(true),setCampaignId(campaign.campaignId)}} className="text-black gap-2 flex flex-row hover:underline font-normal transition-colors duration-150"><Play  size={20} /></button>}
                
//     //             <button><Download  size={20} /></button>
                
//     //           </TableCell>
//     //         </TableRow>
//     //       ))}
//     //     </TableBody>
//     //   </Table>
//     //   {/* {pauseModal && <Trash onClick={()=>{setStop(true)}} size={20} /> <ConfirmActionModal modalConfig={{title:"Pause Campaign",message:"Do You want to pause the campaign",confirmText:"Pause",icon:<Pause/>}} onConfirm={()=>{setPause(false),console.log("Job Paused")}} onClose={()=>{setPause(false)}}/>}
//     //     {resumeModal && <ConfirmActionModal modalConfig={{title:"Resume Campaign",message:"Do You want to Resume the campaign",confirmText:"Resume",icon:<Play/>}} onConfirm={()=>{setResume(false),console.log("Job Paused")}} onClose={()=>{setResume(false)}}/>}
//     //   <Modal open={stopModal} onClose={()=>{setStop(false)}} onConfirm={()=>{setStop(false), console.log('job Stoped')}}></Modal> */}
//     //   <Modal
//     //     isOpen={pauseModal}
//     //     onClose={()=>{setPause(false)}}
//     //     title={`Pause Campaign`}
//     //     onSave={()=>{setPause(false),handleStatusChange("INACTIVE")}}
//     //     btnName='Pause'
//     //   >
//     //     <div className="mb-4 p-5 text-gray-700">
//     //       {`Are you sure you want to Pause the campaign (${campaignId} )?`}
//     //     </div>
      
//     //   </Modal>
//     //   <Modal
//     //     isOpen={resumeModal}
//     //     onClose={()=>{setResume(false)}}
//     //     title={`Start Campaign`}
//     //     onSave={()=>{setResume(false),handleStatusChange("ACTIVE")}}
//     //     btnName='Start'
//     //   >
//     //     <div className="mb-4 p-5 text-gray-700">
//     //       {`Are you sure you want to Start the campaign (${campaignId} )?`}
//     //     </div>
      
//     //   </Modal>
//     //    {alert && <Alert alert={alert} hideAlert={hideAlert} />}
//     // </div>
//     <div className="w-full max-w-full overflow-x-auto">
//   {/* Desktop Table View */}
//   <div className="hidden md:block">
//     <Table className="w-full border border-gray-200 shadow-sm rounded-lg overflow-hidden bg-white">
//       <TableHeader className="bg-gray-100">
//         <TableRow>
//           <TableHead className="px-6 py-4 text-left text-md font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
//             Campaign ID
//           </TableHead>
//           <TableHead className="px-6 py-4 text-left text-md font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
//             Campaign Name
//           </TableHead>
//           <TableHead className="px-6 py-4 text-left text-md font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
//             Date
//           </TableHead>
//           <TableHead className="px-6 py-4 text-left text-md font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
//             Status
//           </TableHead>
//           <TableHead className="px-6 py-4 text-left text-md font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
//             Action
//           </TableHead>
//         </TableRow>
//       </TableHeader>
//       <TableBody className="divide-y divide-gray-200">
//         {campaignData.map((campaign, index) => (
//           <TableRow key={campaign.campaignId} className="hover:bg-gray-50 hover:cursor-pointer transition-colors duration-150">
//             <TableCell onClick={() => router.push('/campaign/CampaignInsights')} className="px-6 py-4 text-sm text-gray-900 font-medium">
//               {campaign.campaignId}
//             </TableCell>
//             <TableCell onClick={() => router.push('/campaign/CampaignInsights')} className="px-6 py-4 text-sm text-gray-900 font-medium">
//               {campaign.campaignName}
//             </TableCell>
//             <TableCell className="px-6 py-4 text-sm text-gray-900">
//               {(campaign.updatedDate)}
//             </TableCell>
//             <TableCell className="px-6 py-4 text-sm">
//               <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(campaign.status)}`}>
//                 {campaign.status}
//               </span>
//             </TableCell>
//             <TableCell className="px-6 py-4 text-xs flex flex-row gap-2">
//               {campaign.status==='ACTIVE'? 
//                 <button onClick={()=>{setPause(true),setCampaignId(campaign.campaignId)}} className="text-black gap-2 flex flex-row hover:underline font-normal transition-colors duration-150"><Pause size={20} /></button> :
//                 <button onClick={()=>{setResume(true),setCampaignId(campaign.campaignId)}} className="text-black gap-2 flex flex-row hover:underline font-normal transition-colors duration-150"><Play size={20} /></button>}
//               <button><Download size={20} /></button>
//             </TableCell>
//           </TableRow>
//         ))}
//       </TableBody>
//     </Table>
//   </div>

//   {/* Mobile Card View */}
//   <div className="md:hidden space-y-4">
//     {campaignData.length === 0 ? (
//       <Card className="shadow-sm">
//         <CardContent className="p-6 text-center">
//           <p className="text-gray-500">No campaigns found.</p>
//         </CardContent>
//       </Card>
//     ) : (
//       campaignData.map((campaign, index) => (
//         <Card key={campaign.campaignId} className="shadow-sm border border-gray-200">
//           <CardContent className="p-4">
//             {/* Header with ID and Actions */}
//             <div className="flex justify-between items-center mb-4">
//               <span className="text-sm font-medium text-gray-600">#{index + 1}</span>
//               <div className="flex gap-2">
//                 {campaign.status==='ACTIVE'? 
//                   <button onClick={()=>{setPause(true),setCampaignId(campaign.campaignId)}} className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-150">
//                     <Pause size={18} />
//                   </button> :
//                   <button onClick={()=>{setResume(true),setCampaignId(campaign.campaignId)}} className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-150">
//                     <Play size={18} />
//                   </button>
//                 }
//                 <button className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-150">
//                   <Download size={18} />
//                 </button>
//               </div>
//             </div>
            
//             <hr className="border-gray-200 mb-3" />
            
//             {/* Campaign ID */}
//             <div className="mb-3 flex justify-between items-center" onClick={() => router.push('/campaign/CampaignInsights')} role="button" tabIndex={0}>
//               <div>
//                 <span className="text-sm font-medium text-gray-600">Campaign ID:</span>
//                 <p className="text-base font-semibold text-gray-900 mt-1 cursor-pointer hover:text-blue-600 transition-colors">{campaign.campaignId}</p>
//               </div>
//               <ChevronRight />
//             </div>
            
//             <hr className="border-gray-200 mb-3" />
            
//             {/* Campaign Name */}
//             <div className="mb-3" onClick={() => router.push('/campaign/CampaignInsights')} role="button" tabIndex={0}>
//               <span className="text-sm font-medium text-gray-600">Campaign Name:</span>
//               <p className="text-base font-semibold text-gray-900 mt-1 cursor-pointer hover:text-blue-600 transition-colors">{campaign.campaignName}</p>
//             </div>
            
//             <hr className="border-gray-200 mb-3" />
            
//             {/* Date */}
//             <div className="mb-3">
//               <span className="text-sm font-medium text-gray-600">Date:</span>
//               <p className="text-base text-gray-900 mt-1">{campaign.updatedDate}</p>
//             </div>
            
//             <hr className="border-gray-200 mb-3" />
            
//             {/* Status */}
//             <div>
//               <span className="text-sm font-medium text-gray-600">Status:</span>
//               <div className="mt-2">
//                 <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(campaign.status)}`}>
//                   {campaign.status}
//                 </span>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       ))
//     )}
//   </div>

//   {/* Modals */}
//   <Modal
//     isOpen={pauseModal}
//     onClose={()=>{setPause(false)}}
//     title={`Pause Campaign`}
//     onSave={()=>{setPause(false),handleStatusChange("INACTIVE")}}
//     btnName='Pause'
//   >
//     <div className="mb-4 p-5 text-gray-700">
//       {`Are you sure you want to Pause the campaign (${campaignId} )?`}
//     </div>
//   </Modal>
  
//   <Modal
//     isOpen={resumeModal}
//     onClose={()=>{setResume(false)}}
//     title={`Start Campaign`}
//     onSave={()=>{setResume(false),handleStatusChange("ACTIVE")}}
//     btnName='Start'
//   >
//     <div className="mb-4 p-5 text-gray-700">
//       {`Are you sure you want to Start the campaign (${campaignId} )?`}
//     </div>
//   </Modal>
  
//   {alert && <Alert alert={alert} hideAlert={hideAlert} />}
// </div>
//   );
// };

// export default CampaignTable;

import { Ban, ChevronRight, Dot, Download, Pause, PauseIcon, Play, Trash } from 'lucide-react';
import React, { useEffect, useState } from 'react';
// import Modal from '../Modal/deleteModal';
import Modal from "@/components/ui/modal";
import { useRouter } from 'next/navigation';
import ConfirmActionModal from './ConfirmActionModal';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { useAppContext } from '@/hooks/context';
import { getFromLocalStorage } from '../encryption/encryption';
import { useSession } from 'next-auth/react';
import { useAlert } from '@/hooks/alertHook';
import Alert from '../alert/alert';

// Sample static data for demonstration
const staticCampaignData = [
  {
    campaignId: "CAMP-001",
    campaignName: "DMK Youth Wing Outreach",
    updatedDate: "2025-12-01T10:30:00Z",
    status: "ACTIVE"
  },
  {
    campaignId: "CAMP-002",
    campaignName: "Stalin Vision 2025 Campaign",
    updatedDate: "2025-11-25T14:20:00Z",
    status: "INACTIVE"
  },
  {
    campaignId: "CAMP-003",
    campaignName: "Tamil Development Initiative",
    updatedDate: "2025-11-20T09:15:00Z",
    status: "ACTIVE"
  },
  {
    campaignId: "CAMP-004",
    campaignName: "Women Empowerment Program",
    updatedDate: "2025-11-15T16:45:00Z",
    status: "UPLOADED"
  },
  {
    campaignId: "CAMP-005",
    campaignName: "Customer Retention Program",
    updatedDate: "2025-12-05T11:00:00Z",
    status: "ACTIVE"
  }
];

const formatDate = (ts: number) =>
  new Date(ts).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    hour12: false,
  });


const CampaignTable = () => {
  const {URL} = useAppContext()
  const { alert, showAlert, hideAlert } = useAlert();
  const [campaignId,setCampaignId] = useState("")
  const [campaignData,setCampaignData] = useState(staticCampaignData) // Initialize with static data
  const {data:session}=useSession();
   const token = session?.accessToken
  const memberId = session?.memberId
  const orgId = session?.orgId
  const router=useRouter()
  const [pauseModal,setPause] = useState(false)
  const [resumeModal,setResume] = useState(false)
  const [stopModal,setStop] = useState(false)
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'text-green-600 bg-green-50';
      case 'INACTIVE':
        return 'text-red-600 bg-red-50';
      case 'UPLOADED':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const formatDisplayDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  useEffect(()=>{
    if(session){
      fetchCampaigns()
    } else {
      // Use static data when no session
      setCampaignData(staticCampaignData)
    }
  },[session])

  async function fetchCampaigns(){
    try{
      const payload = {orgId:orgId,page:1,limit:10,memberId:memberId}
      console.log(payload)
      const response = await fetch(`${URL}/campaign/getCampaign`,{
        method:"POST",
        headers:{
          "Content-Type": "application/json",
               "Authorization": `Bearer ${token}`,
                "X-Member-Id": memberId
        },
        body:JSON.stringify(payload)
      })

      if(response.status === 200){
          const data = await response.json()
          console.log(data)
          setCampaignData(data.campaigns)
      }else{
         console.log("Error Fetching Data","error")
         // Fallback to static data if API fails
         setCampaignData(staticCampaignData)
      }
      
    }catch(e){
      // Fallback to static data on error
      setCampaignData(staticCampaignData)
    }
  }

  async function handleStatusChange(status:string){
    try{
      const payload = {campaignId:campaignId,status:status}
      const result = await fetch(`${URL}/campaign/updateCampaign`,{
        method:"POST",
        headers:{
          "Content-Type": "application/json",
               "Authorization": `Bearer ${token}`,
                "X-Member-Id": memberId
        },
        body:JSON.stringify(payload)
      })

      if(result.ok){
        showAlert("Campaign Updated successfully","success")
        fetchCampaigns()
      }else{
        showAlert("Error Updating Campaign","error")
      }
    }catch(e){
      showAlert("Error Updating Campaign","error")
    }
  }

  return (
    <div className="w-full max-w-full overflow-x-auto">
      {/* Desktop Table View */}
      <div className="hidden md:block">
        <Table className="w-full border border-gray-200 shadow-sm rounded-lg overflow-hidden bg-white">
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead className="px-6 py-4 text-left text-md font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                Campaign ID
              </TableHead>
              <TableHead className="px-6 py-4 text-left text-md font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                Campaign Name
              </TableHead>
              <TableHead className="px-6 py-4 text-left text-md font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                Date
              </TableHead>
              <TableHead className="px-6 py-4 text-left text-md font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                Status
              </TableHead>
              <TableHead className="px-6 py-4 text-left text-md font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-200">
            {campaignData.map((campaign, index) => (
              <TableRow key={campaign.campaignId} className="hover:bg-gray-50 hover:cursor-pointer transition-colors duration-150">
                <TableCell onClick={() => router.push('/campaign/CampaignInsights')} className="px-6 py-4 text-sm text-gray-900 font-medium">
                  {campaign.campaignId}
                </TableCell>
                <TableCell onClick={() => router.push('/campaign/CampaignInsights')} className="px-6 py-4 text-sm text-gray-900 font-medium">
                  {campaign.campaignName}
                </TableCell>
                <TableCell className="px-6 py-4 text-sm text-gray-900">
                  {formatDisplayDate(campaign.updatedDate)}
                </TableCell>
                <TableCell className="px-6 py-4 text-sm">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(campaign.status)}`}>
                    {campaign.status}
                  </span>
                </TableCell>
                <TableCell className="px-6 py-4 text-xs flex flex-row gap-2">
                  {campaign.status==='ACTIVE'? 
                    <button onClick={()=>{setPause(true),setCampaignId(campaign.campaignId)}} className="text-black gap-2 flex flex-row hover:underline font-normal transition-colors duration-150"><Pause size={20} /></button> :
                    <button onClick={()=>{setResume(true),setCampaignId(campaign.campaignId)}} className="text-black gap-2 flex flex-row hover:underline font-normal transition-colors duration-150"><Play size={20} /></button>}
                  <button><Download size={20} /></button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {campaignData.length === 0 ? (
          <Card className="shadow-sm">
            <CardContent className="p-6 text-center">
              <p className="text-gray-500">No campaigns found.</p>
            </CardContent>
          </Card>
        ) : (
          campaignData.map((campaign, index) => (
            <Card key={campaign.campaignId} className="shadow-sm border border-gray-200">
              <CardContent className="p-4">
                {/* Header with ID and Actions */}
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-medium text-gray-600">#{index + 1}</span>
                  <div className="flex gap-2">
                    {campaign.status==='ACTIVE'? 
                      <button onClick={()=>{setPause(true),setCampaignId(campaign.campaignId)}} className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-150">
                        <Pause size={18} />
                      </button> :
                      <button onClick={()=>{setResume(true),setCampaignId(campaign.campaignId)}} className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-150">
                        <Play size={18} />
                      </button>
                    }
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-150">
                      <Download size={18} />
                    </button>
                  </div>
                </div>
                
                <hr className="border-gray-200 mb-3" />
                
                {/* Campaign ID */}
                <div className="mb-3 flex justify-between items-center" onClick={() => router.push('/campaign/CampaignInsights')} role="button" tabIndex={0}>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Campaign ID:</span>
                    <p className="text-base font-semibold text-gray-900 mt-1 cursor-pointer hover:text-blue-600 transition-colors">{campaign.campaignId}</p>
                  </div>
                  <ChevronRight />
                </div>
                
                <hr className="border-gray-200 mb-3" />
                
                {/* Campaign Name */}
                <div className="mb-3" onClick={() => router.push('/campaign/CampaignInsights')} role="button" tabIndex={0}>
                  <span className="text-sm font-medium text-gray-600">Campaign Name:</span>
                  <p className="text-base font-semibold text-gray-900 mt-1 cursor-pointer hover:text-blue-600 transition-colors">{campaign.campaignName}</p>
                </div>
                
                <hr className="border-gray-200 mb-3" />
                
                {/* Date */}
                <div className="mb-3">
                  <span className="text-sm font-medium text-gray-600">Date:</span>
                  <p className="text-base text-gray-900 mt-1">{formatDisplayDate(campaign.updatedDate)}</p>
                </div>
                
                <hr className="border-gray-200 mb-3" />
                
                {/* Status */}
                <div>
                  <span className="text-sm font-medium text-gray-600">Status:</span>
                  <div className="mt-2">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(campaign.status)}`}>
                      {campaign.status}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Modals */}
      <Modal
        isOpen={pauseModal}
        onClose={()=>{setPause(false)}}
        title={`Pause Campaign`}
        onSave={()=>{setPause(false),handleStatusChange("INACTIVE")}}
        btnName='Pause'
      >
        <div className="mb-4 p-5 text-gray-700">
          {`Are you sure you want to Pause the campaign (${campaignId} )?`}
        </div>
      </Modal>
      
      <Modal
        isOpen={resumeModal}
        onClose={()=>{setResume(false)}}
        title={`Start Campaign`}
        onSave={()=>{setResume(false),handleStatusChange("ACTIVE")}}
        btnName='Start'
      >
        <div className="mb-4 p-5 text-gray-700">
          {`Are you sure you want to Start the campaign (${campaignId} )?`}
        </div>
      </Modal>
      
      {alert && <Alert alert={alert} hideAlert={hideAlert} />}
    </div>
  );
};

export default CampaignTable;