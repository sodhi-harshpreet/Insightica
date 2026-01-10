"use client"
import { Button } from '@/components/ui/button'
import { WebsiteType } from '@/configs/type'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import WebsiteCard from './_components/WebsiteCard'
import { Skeleton } from '@/components/ui/skeleton'


function Dashboard() {
    const [websiteList, setWebsiteList] = useState<WebsiteType[]>([])
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        GetUserWebsites();
    }, []);
    const GetUserWebsites=async ()=> {
        setLoading(true);
        const result= await axios.get('/api/website');
        console.log(result.data);
        setWebsiteList(result.data);
        setLoading(false);
    }

  return (
    <div className='mt-8'>
        <div className='flex justify-between items-center'>
            <h2 className='font-bold text-xl'>My Website</h2>
            <Link href="/dashboard/new">   
                <Button>+ Website</Button>
            </Link>
        </div>

        <div>
            {loading&&<div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5'>
                {[1,2,3,4].map((item,index)=>(
                    <div className='p-4' key={index}>
                        <div className='flex gap-2 items-center'>
                            <Skeleton className='h-8 w-8 rounded-sm'/>
                            <Skeleton className='h-8 w-1/2 rounded-sm'/>
                        </div>
                        <Skeleton className='h-[80px] w-full mt-4 rounded-sm'/>
                    </div>
                ))}
            </div>}

            {!loading && websiteList.length == 0 ? 
                <div className='flex flex-col justify-center items-center gap-4 p-8 border-2 border-dashed border-gray-300 rounded-2xl mt-7' >
                    <Image src={'/website.png'} alt="Add website" height={100} width={100} />
                    <h2 className='font-semibold'>You have not added any websites yet.</h2>
                    <Link href="/dashboard/new">
                        <Button className='mt-4'>+ Website</Button>
                    </Link>
                </div>  :

                <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mt-5'>
                    
                    {/* List of websites will go here */}
                    {websiteList?.map((website,index)=>(
                        <WebsiteCard key={index} website={website} />
                    ))}
                </div>  
        }
        </div>
    </div>
  )
}

export default Dashboard