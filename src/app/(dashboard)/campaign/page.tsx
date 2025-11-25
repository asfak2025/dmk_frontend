"use client";

import { useState } from "react";
import { parseCsvOrExcel, validateRows } from "@/lib/validateCsv";

import Container from "@/components/ui/container";
import PageTitle from "@/components/ui/pageTitle";
import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import { PlusIcon } from "lucide-react";
import AddCampaignModal from "@/components/campaign/addCampaignModal";
import CampaignTable from "@/components/campaign/CampaignTable";
import { useSession } from "next-auth/react";
import { useAppContext } from "@/hooks/context";
import { useAlert } from "@/hooks/alertHook";
import Alert from "@/components/alert/alert";


export default function CsvUploader() {
  const [open,setOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null);
  const [status,setStatus] = useState('')
  const { alert, showAlert, hideAlert } = useAlert();
  const {data:session}=useSession();
     const token = session?.accessToken
    const memberId = session?.memberId
    const orgId = session?.orgId
    const {URL} = useAppContext()
    const APIURL = URL
  const [datas,setDatas] = useState({campaignName:"",campaignDescription:"",campaignUrl:"https://campaign.com"})
  // const handleDownload = async()=>{
  //   console.log("download successfull")
  //   try{
        
  //   const response = await fetch('/sample.xlsx');
  //   const blob = await response.blob();
  //   const url = window.URL.createObjectURL(blob);
  //   const link = document.createElement('a');
  //   link.href = url;
  //   link.download = 'sample.xlsx';
  //   document.body.appendChild(link);
  //   link.click();
  //   link.remove();
  //   window.URL.revokeObjectURL(url);
  

  //   }catch(e){
  //     console.error('error',e)
  //   }
  // }
  const campaignData = [
  { id:"001",name: 'Public concerns', date: '12/07/2025', status: 'Active' },
  { id:"002",name: ' feedbacks', date: '15/06/2025', status: 'Inactive' },
  { id:"003",name: 'Collecting Feedbacks ', date: '02/07/2025', status: 'Active' },
  // { id:"004",name: 'customer calls', date: Date.now(), status: 'Paused' },
  // { id:"005",name: 'customer calls', date: Date.now(), status: 'Inactive' },
];

  

  const handleValidate = async () => {
    console.log(file)
    if (!file) return;

    try {
      const rows = await parseCsvOrExcel(file);
      const errors = validateRows(rows);
      //setFrontendErrors(errors);

      if (errors.length === 0) {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("http://localhost:8000/validate-csv", {
          method: "POST",
          body: formData,
        });

        const result = await res.json();
        if (result.status === "success") {
          setStatus("✅ CSV/Excel is valid!");
        } else {
          //setBackendErrors(result.details);
          setStatus("⚠️ Backend validation found issues.");
        }
      } else {
        setStatus("❌ Frontend validation failed.");
      }
    } catch (err) {
      console.error(err);
      setStatus("❌ Error parsing file.");
    }
  };
  const handleDownload = async()=>{
    console.log("download successfull")
    try{
        
    const response = await fetch('/sample.xlsx');
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sample.xlsx';
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    

    }catch(e){
      console.error('error',e)
    }
  }

  async function handleCreate(data:any){
      try{
        data["orgId"] = orgId
        data["memberId"] = memberId
        const response = await fetch(`${APIURL}/campaign/createCampaign`,{
          method:"POST",
        headers:{
          "Content-Type": "application/json",
               "Authorization": `Bearer ${token}`,
                "X-Member-Id": memberId
        },
        body:JSON.stringify(data)
        })

        if(response.status === 200){
          showAlert("Campaign created successfully","success")
          console.log("created successfully")
        }
        else{
          console.log("could not create campaign")
        }
      }catch(e){
        console.log(e)
      }
  }

  return (
    <Container>
    <PageTitle title="Campaign" description="List of all the Campaigns">
      <Button onClick={handleDownload}>Download Sample File</Button>
    <Button onClick={()=>setOpen(true)}><PlusIcon/> Add Campaign</Button>
    </PageTitle>
    <div className="flex flex-col gap-2">


 <CampaignTable />
 
<div>
 
 
 </div>


      <Modal isOpen={open}  onClose={()=>{setOpen(false)}} title={'File Upload'} onSave={()=>{handleCreate(datas),setOpen(false)}}>
       <AddCampaignModal datas={(e:any)=>setDatas(e)}  fileSelected ={(e:any)=>setFile(e)}/>
         </Modal>

      {/* <div className="flex justify-end">
      <button
        onClick={handleValidate}
        className={`mt-4 bg-black text-white px-4 py-2 rounded`}
        disabled={!file}
      >
        Validate
      </button>
          </div>
      {status && <p className="mt-4 font-semibold">{status}</p>}

      {frontendErrors.length > 0 && (
        <div className="mt-4 bg-red-100 p-4 rounded">
          <h2 className="font-bold text-red-600">Frontend Errors</h2>
          <ul className="list-disc list-inside text-sm text-red-800">
            {frontendErrors.map((e, i) => (
              <li key={i}>
                Row {e.row}: {e.errors.join(", ")}
              </li>
            ))}
          </ul>
        </div>
      )}

      {backendErrors.length > 0 && (
        <div className="mt-4 bg-orange-100 p-4 rounded">
          <h2 className="font-bold text-orange-600">Backend Errors</h2>
          <ul className="list-disc list-inside text-sm text-orange-800">
            {backendErrors.map((e, i) => (
              <li key={i}>
                Row {e.row}: {e.errors.join(", ")}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div> */}
   
   
    {/* Format Guidelines
        
        <div className="bg-white rounded-lg shadow-md  p-6 ">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Format Guidelines</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2 flex items-center space-x-2"><Check />
                <span>Best Practices</span>
              </h4>

              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Use the first row for headers only</li>
                <li>• Keep data consistent within each column</li>
                <li>• Make Sure to follow the Given Format</li>
                <li>• Avoid merged cells in data rows</li>
                <li>• Make sure to enter Valid Phone Numbers</li>
                
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2 flex items-center space-x-2"><X/> <span>Avoid</span></h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Empty rows between data</li>
                <li>• Special characters in headers</li>
                <li>• Mixed data types in columns</li>
                <li>• Formatting instead of data</li>
                <li>• Multiple tables in one sheet</li>
              </ul>
            </div>
          </div>
        </div>
         */}
         </div>
    
     {alert && <Alert alert={alert} hideAlert={hideAlert} />}
    </Container>
  );
}
