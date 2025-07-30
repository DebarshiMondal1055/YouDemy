import { createContext,useContext } from "react";

export const authenticationContext=createContext({
    user:{
        _id:"",
        username:"",
        avatar:""
    },
    isLoading:true
})

export const AuthenticationContextProvider=authenticationContext.Provider;

export const useAuthContext=()=>{
    return useContext(authenticationContext)
}