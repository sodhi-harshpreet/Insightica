import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import React from 'react'
import WebsiteForm from './_components/WebsiteForm'
import Link from 'next/link'

function AddWebsite() {
  return (
    <div className='flex items-center w-full justify-center mt-10'>
        <div className='max-w-lg flex flex-col items-start w-full'>
            <Link href="/dashboard">
            <Button variant={'outline'}><ArrowLeft/> Dashboard</Button>
            </Link>
            <div className='mt-10 w-full'>
                <WebsiteForm />
            </div>
        </div>
    </div>
  )
}

export default AddWebsite