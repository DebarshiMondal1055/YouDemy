import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const SignUp = () => {
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [isLoading,setIsLoading]=useState(false);

  
  const submitHandler=async()=>{
        if(!username || !fullname || !email || !password || !avatar){
             alert("Required fields not filled");
             return
        }
        try {
          setIsLoading(true);
          const formdata=new FormData();
          formdata.append("username",username)
          formdata.append("fullname",fullname)
          formdata.append("email",email)
          formdata.append("password",password)
          formdata.append("avatar",avatar)
          formdata.append("coverimage",coverImage) 
          const response=await axios.post(`${import.meta.env.BACKEND_BASE_URL}/api/v1/users/register/`,formdata,{withCredentials:true})
          if(response.status===201){
            setIsLoading(false);
            console.log(response.data.data);
            return;
          }
          else throw new Error("Server error");
        } catch (error) {
          console.log(error);
          if (error.response && error.response.data && error.response.data.message) {
            alert(error.response.data.message);
            setIsLoading(false);
          } else {
            alert("Failed to Sign up username or email already taken");
            setIsLoading(false);
          }
          return;
        } 
    }

    if(isLoading){
            return (
                <div className="w-full h-screen flex justify-center items-center bg-black text-white text-2xl">
                    Signing you up..Please wait...
                </div>
            ); 
    }
  return (
    <div className='flex w-full mt-[60px] justify-center items-center box-border h-[92vh] text-white bg-black '>
      <div className='w-[50%] bg-[#212121] p-[25px] items-center flex flex-col gap-4 rounded-2xl shadow-[0_0_12px_rgba(0,123,255,0.5),_0_0_18px_rgba(255,255,255,0.3)] transition-shadow duration-500 ease-in-out hover:shadow-[0_0_18px_rgba(0,123,255,0.7),_0_0_28px_rgba(255,255,255,0.5)]'>
        <div className='w-full flex justify-center text-2xl font-bold'>
          Sign Up
        </div>
        <div className='mt-5 flex flex-col gap-8 w-full items-center'>
          <input type="text" placeholder='Full-name'
            value={fullname} onChange={(e) => setFullname(e.target.value)}
            className='w-[60%] focus:outline-none bg-zinc-500 px-2 py-1 h-[34px] rounded-xl '
          />
          <input type="text" placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)}
            className='w-[60%] focus:outline-none bg-zinc-500 px-2 py-1 h-[34px] rounded-xl '
          />
          <input type="text" placeholder='email' value={email} onChange={(e) => setEmail(e.target.value)}
            className='w-[60%] focus:outline-none bg-zinc-500 px-2 py-1 h-[34px] rounded-xl '
          />
          <input type="password" placeholder='password' value={password} onChange={(e) => setPassword(e.target.value)}
            className='w-[60%] focus:outline-none bg-zinc-500 px-2 py-1 h-[34px] rounded-xl '
          />
        </div>

        <div className='mt-5 flex w-full justify-center gap-4 text-[#b9cbcb]'>
          <label htmlFor="avatarFile" className='cursor-pointer border-b border-b-gray-300'>
            {avatar?.name || "Choose Avatar"}
          </label>
          <input
            type="file"
            id="avatarFile"
            accept='image/*'
            className='hidden'
            onChange={(e) => setAvatar(e.target.files[0])}
          />

          <label htmlFor="coverImageFile" className='cursor-pointer border-b border-b-gray-300'>
            {coverImage?.name || "Choose Cover Image"}
          </label>
          <input
            type="file"
            id="coverImageFile"
            accept='image/*'
            className='hidden'
            onChange={(e) => setCoverImage(e.target.files[0])}
          />
        </div>

        <div className='mt-4 w-full flex justify-center'>
          <Link className='border-b-2 border-b-gray-400' to={"/login"}>
            Already have an account? Sign In
          </Link>
        </div>
        <button onClick={submitHandler} className='bg-emerald-500 p-3 rounded-2xl cursor-pointer mt-2'>
            Sign Up
        </button>
      </div>
    </div>
  );
}

export default SignUp;
