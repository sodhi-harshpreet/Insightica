"use client"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@radix-ui/react-separator'
import React, { useState } from 'react'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { Globe, Loader, Loader2Icon, Plus } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from '@/components/ui/button'
import { set } from 'date-fns'
import axios from 'axios'
import {  useRouter } from 'next/navigation'



function WebsiteForm() {

    const [domain, setDomain] = useState('');
    const [timezone, setTimezone] = useState('');
    const [enableLocalhostTracking, setEnableLocalhostTracking] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const onFormSubmit = async (e: any) => {
        e.preventDefault();
        console.log({domain, timezone, enableLocalhostTracking});
        setLoading(true);
        const websiteId=crypto.randomUUID();
        const result = await axios.post('/api/website', {
            websiteId:websiteId,
            domain,
            timezone,
            enableLocalhostTracking
        });
        console.log(result.data);
        if(result.data.data){
            router.push('/dashboard/new?step=script&websiteId='+result?.data?.data?.websiteId+'&domain='+result?.data?.data?.domain);
        }
        else if(!result.data.message){
            router.push('/dashboard/new?step=script&websiteId='+websiteId+'&domain='+domain);
        }
        else{
            alert(result.data.message);
        }
        setLoading(false);
    }
    return (
    <div>
        <Card>
            <CardHeader>
                <CardTitle >Add New Website</CardTitle>
            </CardHeader>
            <Separator />
            <hr />

            <CardContent>
                 <form className='mt-5' onSubmit={(e)=>onFormSubmit(e)}>
                    <label className='text-sm' htmlFor="domain">Domain </label>
                    <InputGroup>
                        <InputGroupInput type='text' id="domain" 
                        placeholder="mywebsite.com" required 
                        onChange={(e) => setDomain('https://'+ e.target.value)} />
                        <InputGroupAddon>
                        <Globe />
                        <span>https://</span>
                        </InputGroupAddon>
                    </InputGroup>
                    <div className='mt-5'>
                        <label className='text-sm ' htmlFor="timezone">Timezone </label>
                    
                        <Select required onValueChange={(value)=>setTimezone(value)}>
                            <SelectTrigger id='timezone' className="w-full">
                                <SelectValue placeholder="Select a timezone" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                <SelectLabel>North America</SelectLabel>
                                <SelectItem value="est">Eastern Standard Time (EST)</SelectItem>
                                <SelectItem value="cst">Central Standard Time (CST)</SelectItem>
                                <SelectItem value="mst">Mountain Standard Time (MST)</SelectItem>
                                <SelectItem value="pst">Pacific Standard Time (PST)</SelectItem>
                                <SelectItem value="akst">Alaska Standard Time (AKST)</SelectItem>
                                <SelectItem value="hst">Hawaii Standard Time (HST)</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>Europe & Africa</SelectLabel>
                                <SelectItem value="gmt">Greenwich Mean Time (GMT)</SelectItem>
                                <SelectItem value="cet">Central European Time (CET)</SelectItem>
                                <SelectItem value="eet">Eastern European Time (EET)</SelectItem>
                                <SelectItem value="west">
                                    Western European Summer Time (WEST)
                                </SelectItem>
                                <SelectItem value="cat">Central Africa Time (CAT)</SelectItem>
                                <SelectItem value="eat">East Africa Time (EAT)</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>Asia</SelectLabel>
                                <SelectItem value="msk">Moscow Time (MSK)</SelectItem>
                                <SelectItem value="ist">India Standard Time (IST)</SelectItem>
                                <SelectItem value="cst_china">China Standard Time (CST)</SelectItem>
                                <SelectItem value="jst">Japan Standard Time (JST)</SelectItem>
                                <SelectItem value="kst">Korea Standard Time (KST)</SelectItem>
                                <SelectItem value="ist_indonesia">
                                    Indonesia Central Standard Time (WITA)
                                </SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>Australia & Pacific</SelectLabel>
                                <SelectItem value="awst">
                                    Australian Western Standard Time (AWST)
                                </SelectItem>
                                <SelectItem value="acst">
                                    Australian Central Standard Time (ACST)
                                </SelectItem>
                                <SelectItem value="aest">
                                    Australian Eastern Standard Time (AEST)
                                </SelectItem>
                                <SelectItem value="nzst">New Zealand Standard Time (NZST)</SelectItem>
                                <SelectItem value="fjt">Fiji Time (FJT)</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>South America</SelectLabel>
                                <SelectItem value="art">Argentina Time (ART)</SelectItem>
                                <SelectItem value="bot">Bolivia Time (BOT)</SelectItem>
                                <SelectItem value="brt">Brasilia Time (BRT)</SelectItem>
                                <SelectItem value="clt">Chile Standard Time (CLT)</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div> 

                    <div className='mt-5 flex items-center gap-2'>
                        <Checkbox onCheckedChange={(value:boolean)=>setEnableLocalhostTracking(value)}/><span>Enable localhost tracking in development</span>
                    </div>
                    <div className='mt-4 w-full'>
                    <Button className='w-full' disabled={loading} type='submit'>
                        {loading ? <Loader2Icon className='animate-spin'/> : <Plus></Plus>} 
                        Add Website
                    </Button>
                    </div>

                </form>   
            </CardContent>
        </Card>
    </div>
  )
}

export default WebsiteForm