'use client'
import { supabase } from "@/app/lib/supabaseClient";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const SignUp = () => {
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const router = useRouter();

    async function signUpNewUser() {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password:password,
      })
      if(error){
        toast.error(error.message)
      }else{
        toast.success("Sign Up Successful")
        router.push("/auth/login")
      }
    }
    
    
  return <div>
    <input type="email" className="border-black border-2" value={email} onChange={(e)=>{setEmail(e.target.value)}}/>
    <input type="password" className="border-black border-2"  value={password} onChange={(e)=>{setPassword(e.target.value)}}/>
    <button onClick={()=>{signUpNewUser()}}>SignUp</button>
  </div>;
};

export default SignUp;
