"use client"
import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { useRouter } from "next/navigation";
import { toast } from 'react-toastify';
import { supabase } from '@/app/lib/supabaseClient';

type User = {
 created_at:string,
id:number
name:string,
task:string,
uid:string
}

const Dashboard = () => {
  const router = useRouter();
  const [name,setName] = useState("")
  const [task,setTask] = useState("")
  const [userId,setUserId] = useState("")
  const [allData, setallData] = useState<User[]>([])

  const getData = async () =>{
    const { data, error } = await supabase
    .from('crud')
    .select("*") // select the 'id' column
    .eq('uid', userId)
     return data
  }

const getCookie =  () =>{
  const user =  Cookies.get("user")
  let parsing = null;
  if (user) {
    parsing = JSON.parse(user);
    setUserId(parsing.user.id)
}

}


useEffect(() => {
  getCookie();
}, []);

// userId ke change pe data fetch karo
useEffect(() => {
  if (!userId) return;

  const fetchData = async () => {
    const data = await getData();
    setallData(data || []);
  };
  fetchData();

  // ✅ Supabase Realtime Listener
  const channel = supabase
    .channel('realtime-crud-channel')
    .on(
      'postgres_changes',
      {
        event: '*', // INSERT | UPDATE | DELETE
        schema: 'public',
        table: 'crud',
        filter: `uid=eq.${userId}`,
      },
      (payload) => {
        console.log("Realtime change:", payload);
        fetchData(); // har change ke baad data refresh karo
      }
    )
    .subscribe();

  // ✅ Clean-up on unmount
  return () => {
    supabase.removeChannel(channel);
  };
}, [userId]);


  // Logout button
  const signout = () => {
    Cookies.remove("user")
    toast.success("Logout Successful")
    router.push("/auth/login")
  }

  // Add data in supabase
  const addTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const { data, error } = await supabase
  .from('crud')
  .insert([
    {
      name: name,
      task : task,
      uid : userId,
    },
  ])
  }

  return (
    <>
    <div>Dashboard</div>

    {/* Form */}
    <form action="" onSubmit={addTask}>
    <input type="text" placeholder='Enter name' className='border-2 border-black' value={name} onChange={(e)=>{setName(e.target.value)}}/>
    <textarea placeholder='Add a task' className='border-2 border-black' value={task} onChange={(e)=>{setTask(e.target.value)}}></textarea>
    <button className='cursor-pointer bg-red-600 text-black font-bold p-4'>Add</button>
    </form>

    {/* Logout */}
    <div>
    <button onClick={()=>{signout()}} className='cursor-pointer bg-blue-600 text-black font-bold p-4'>Logout</button>
    </div>

    {/* Data Show */}
    <div>
      {
        allData.map((item,index)=>{
          return(
            <div key={index} className='flex justify-center items-center gap-4  border-2 rounded-2xl border-black'>
                <h1>{item.name}</h1>
                <p>{item.task}</p>
            </div>
          )
        })
      }
    </div>
    </>
  )
}

export default Dashboard