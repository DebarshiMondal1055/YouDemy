import axios from "axios"
import { use, useState } from "react"



export const useCustomPostRequest=(urlPath)=>{
    const [error,setError]=useState(false);
    const [loading,setLoading]=useState(false);
    const [data,setData]=useState(null)
    const postRequest=async(inputData)=>{
        try {
            setError(false);
            setLoading(true);
            const response=await axios.post(urlPath,inputData);
            console.log(response.data.data);
            setData(response.data.data)
            setLoading(false)
        } catch (error) {
            setError(true)
            console.error(error)
        }
        return [data,error,loading];
    }
    return [postRequest];  
}