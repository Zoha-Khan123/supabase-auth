import React from 'react'
import Link from 'next/link'

const page = () => {
  return (
    <div className='flex justify-center items-center w-full h-screen gap-4'>
      <div className='border-2 border-black p-4'><button><Link href="/auth/signup">SignUp</Link></button></div>
      <div className='border-2 border-black p-4'><button><Link href="/auth/login">Login</Link></button></div>
    </div>
  )
}

export default page