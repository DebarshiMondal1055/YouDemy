import axios from "axios";
import { useEffect, useState } from "react"


export const useCustomGetRequest=(urlPath,dependancy)=>{
    const [error,setError]=useState(false)
    const [data,setData]=useState(null);
    const [loading,setLoading]=useState(false);
    useEffect(()=>{
        ;(async()=>{
            try {
                setError(false);
                setLoading(true)
                const response=await axios.get(urlPath);
                if(response.data.statusCode>=400 && response.data.statusCode<500) throw new Error(response.data.message);
                setLoading(false);
                setData(response.data.data)
            } catch (error) {
                setError(true);
                setLoading(false);
            }
            
        })()
    },[dependancy])
    return [data,error,loading];
}