import { getFromLocalStorage } from "@/components/encryption/encryption";

export const getAnalytics = async (fields: Record<string, any>): Promise<Response | undefined> => {
    if (!fields) return;
    
    const token = await getFromLocalStorage("token");
    const memberId =await getFromLocalStorage('memberId');
    
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_END_POINT}/call/call-analytics`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                "X-Member-Id": memberId
            },
            body: JSON.stringify(fields)
        });
        
        return res;
    } catch (error) {
        console.log("error in Getting analytics", error);
        throw error;
    }
};


export const getChartAnalytics=async(fields:Record<string,any>):Promise<Response|undefined>=>{
    console.log("call analytics api")
    if(!fields) return

    const Response= await fetch(`${process.env.NEXT_PUBLIC_END_POINT}/call/chart-analytics`,{
        method:"POST",
        headers:{
            "Content-Type":"application/json",
            "Authorization":`Bearer ${getFromLocalStorage("token")}`,
             "X-Member-Id":getFromLocalStorage("memberId")
        },
        body:JSON.stringify(fields)
    })
    return Response 
}

export const getCallLogs = async(fields:Record<string,any>):Promise<Response|undefined>=>{
        if(!fields) return
        console.log("function hit")
        const response = await fetch(`${process.env.NEXT_PUBLIC_END_POINT}/call/get-calls`,{
            method:"POST",
            headers: {
                "Content-Type": "application/json",
                    Authorization: `Bearer ${getFromLocalStorage("token")}`,
                    "X-Member-Id": getFromLocalStorage("memberId")
            },
            body:JSON.stringify(fields)
            })
        return response
        
}


export const searchCallAnalytics=async(fields:Record<string,any>):Promise<Response|undefined>=>{
    if(!fields) return
    const Response= await fetch(`${process.env.NEXT_PUBLIC_END_POINT}/call/search-logs`,{
        method:"POST",
        headers:{
            "Content-Type":"application/json",
            "Authorization":`Bearer ${getFromLocalStorage("token")}`,
            "X-Member-Id":getFromLocalStorage("memberId")
        },
        body:JSON.stringify(fields)
    })
    return Response
}