"use client"
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React, { useState } from 'react'

function Dashboard() {
    const [websiteList, setWebsiteList] = useState([])
  return (
    <div className='mt-8'>
        <div className='flex justify-between items-center'>
            <h2 className='font-bold text-xl'>My Website</h2>
            <Button>+ Website</Button>
        </div>

        <div>
            {websiteList.length == 0 ? 
                <div className='flex flex-col justify-center items-center gap-4 p-8 border-2 border-dashed border-gray-300 rounded-2xl mt-7' >
                    <Image src={'/website.png'} alt="Add website" height={100} width={100} />
                    <h2 className='font-semibold'>You have not added any websites yet.</h2>
                    <Button className='mt-4'>+ Website</Button>
                </div>  :

                <div>
                    {/* List of websites will go here */}
                </div>  
        }
        </div>
    </div>
  )
}

export default Dashboard