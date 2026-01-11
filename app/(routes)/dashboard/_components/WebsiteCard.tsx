import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { WebsiteInfoType, WebsiteType } from '@/configs/type'
import { Globe } from 'lucide-react'
import React from 'react'
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"


type Props= {
    websiteInfo: WebsiteInfoType
}

function WebsiteCard({ websiteInfo }: Props) {

    const hourlyData = websiteInfo?.analytics?.hourlyVisitors

    const chartData = hourlyData.length==1?
    [
        { 
            ...hourlyData[0], 
            hour:Number(hourlyData[0].hour)-1>=0?Number(hourlyData[0].hour)-1:0 ,
            count:0,
            hourLabel:`${Number(hourlyData[0].hour)-1}AM/PM`
        },
        hourlyData[0]
    ]:hourlyData 

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

  return (
    <div>
        <Card>
            <CardHeader>
                <CardTitle> 
                    <div className='flex gap-2 items-center'>
                        <Globe className='h-8 w-8 p-2 rounded-md bg-primary text-white'/>
                        <h2 className='font-bold text-lg'>{websiteInfo?.website?.domain.replace("https://", "")}</h2>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className='h-[80px] w-full'>
                    <AreaChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                        left: 12,
                        right: 12,
                        }}
                    >
                        
                        <Area
                        dataKey="count"
                        type="natural"
                        fill="var(--color-desktop)"
                        fillOpacity={0}
                        stroke="var(--color-primary)"
                        strokeWidth={2}
                        />
                    </AreaChart>
                </ChartContainer>
                <h2 className='text-sm mt-2'><strong>{websiteInfo?.analytics?.last24hVisitors} </strong>visitors</h2>
            </CardContent>
        </Card>
    </div>
  )
}

export default WebsiteCard