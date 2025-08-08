import React, { useState } from 'react'
import { Link ,useNavigate} from 'react-router-dom';
import axios from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query';
const Login = () => {
    const [username,setUsername]=useState("");
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const navigate=useNavigate();
    const queryClient=useQueryClient();

    const loginMutation=useMutation({
        mutationFn:async()=>{
            try {
                const data={username,email,password};
                const response=await axios.post(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1/users/login`,data,{withCredentials:true});
                if (response.status===201) {
                    return response.data.data;
                }
                else throw new Error()
                
            } catch (error) {
                throw error        
            }

        },
        onSuccess:async(data)=>{
            await queryClient.invalidateQueries(['currentUser']); 
            navigate(`/users/${username}`);  
        },
        onError:async()=>{
            alert("Invalid credentials")
            console.log("Incorrect email or password");
            return;
        }
    })

    const loginHandler=()=>{
        loginMutation.mutate();
    }
  return (
    <div className='flex w-full mt-[60px] justify-center items-center box-border h-[92vh] text-white bg-black '>
        <div style={{ boxShadow: '0.5px -0.5px 8px blue, 0.5px 0.5px 8px white' }}
        className='flex flex-col gap-4 w-[40%] p-[25px] bg-[#212121] rounded-2xl'>
            <div  
            className='text-white font-bold text-3xl flex justify-center'>
                Login
            </div>
            <div className='mt-[25px] flex flex-col gap-[35px] items-center text-zinc-800'>
                <input type="text" value={username} onChange={(e)=>{setUsername(e.target.value)}}
                className='bg-white w-[70%] h-[36px] placeholder:text-gray-400 rounded-2xl px-6 py-4 focus:outline-none'
                placeholder='Username'/>
                <input type="text" className='bg-white w-[70%] h-[36px] rounded-2xl px-6 py-4  placeholder:text-gray-400 focus:outline-none' 
                placeholder='email' value={email} onChange={(e)=>{setEmail(e.target.value)}} />
                <input type="password" className='bg-white w-[70%] h-[36px] rounded-2xl px-6 py-4 focus:outline-none  placeholder:text-gray-400' 
                name="" id="" placeholder='password' value={password} onChange={(e)=>{setPassword(e.target.value)}}/>
            </div>
            <div className='flex flex-col gap-[15px] items-center mt-[15px] '>
                <button onClick={loginHandler} className='p-[10px] flex justify-center text-xl rounded-3xl bg-emerald-500 w-[30%] cursor-pointer'>Sign In</button>
                <Link to={"/register"} className='flex justify-center border-b-2 border-b-gray-400'>Don't have an account?Sign Up</Link>
            </div>
        </div>
    </div>
  )
}

export default Login;
