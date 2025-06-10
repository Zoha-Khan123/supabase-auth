'use client'
import { supabase } from "@/app/lib/supabaseClient";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Cookies from 'js-cookie'

const Login = () => {
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const router = useRouter();

   async function signInWithEmail() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  })
  
    if(error){
    toast.error(error.message)
    }else{
        toast.success("Sign In Successful")
        router.push("/pages/dashboard")
    }
    if(data){
     Cookies.set('user', JSON.stringify(data))
    }
  console.log("cookie set" ,data);

}
  return <div>
    <input type="email" className="border-black border-2" value={email} onChange={(e)=>{setEmail(e.target.value)}}/>
    <input type="password" className="border-black border-2"  value={password} onChange={(e)=>{setPassword(e.target.value)}}/>
    <button onClick={()=>{signInWithEmail()}}>Login</button>
  </div>;
};

export default Login;
