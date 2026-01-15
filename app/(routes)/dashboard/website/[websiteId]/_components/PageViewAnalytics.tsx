import { Card, CardContent } from "@/components/ui/card";
import { WebsiteInfoType } from "@/configs/type";
import React from "react";
import LabelCountComponent from "./LabelCountComponent";
import { Separator } from "@/components/ui/separator";
import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { tr } from "date-fns/locale";

type Props = {
  websiteInfo: WebsiteInfoType | undefined | null;
  loading?: boolean;
  analyticType?: string;
  liveUserCount?: number;
}


const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

function PageViewAnalytics({ websiteInfo, loading, analyticType,liveUserCount }: Props) {
  const webAnalytic = websiteInfo?.analytics;
  return (
    <div className="mt-7">
      <Card>
        <CardContent className="p-5 flex items-center gap-6">
          <LabelCountComponent
            label="Visitors"
            value={webAnalytic?.totalVisitors.toString() || "0"}
          />
          <Separator orientation="vertical" className="h-12" />
          <LabelCountComponent
            label="Total Page Views"
            value={webAnalytic?.totalSessions.toString() || "0"}
          />
          <Separator orientation="vertical" className="h-12" />
          <LabelCountComponent
            label="Total Active Time"
            value={
              (Number(webAnalytic?.totalActiveTime) / 60).toFixed(1) + " mins"
            }
          />
          <Separator orientation="vertical" className="h-12" />
          <LabelCountComponent
            label="Avg Active Time"
            value={
              (Number(webAnalytic?.avgActiveTime) / 60).toFixed(1) + " mins"
            }
          />
          <Separator orientation="vertical" className="h-12" />
          <LabelCountComponent label="Live Users" value={liveUserCount??0} />
        </CardContent>
        <CardContent className="p-5 mt-5">
          <ChartContainer config={chartConfig} className="h-94 w-full">
            <AreaChart
              accessibilityLayer
              data={
                analyticType == "hourly"
                  ? webAnalytic?.hourlyVisitors
                  : webAnalytic?.dailyVisitors
              }
              margin={{
                left: 12,
                right: 12,
                top: 12,
                bottom: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey={analyticType == "hourly" ? "hourLabel" : "date"}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                // tickFormatter={(value) => value.slice(0, 3)}
              />
              <YAxis
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                width={30}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Area
                dataKey="count"
                type="monotone"
                fill="var(--color-primary)"
                fillOpacity={0.4}
                stroke="var(--color-primary)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}

export default PageViewAnalytics;
