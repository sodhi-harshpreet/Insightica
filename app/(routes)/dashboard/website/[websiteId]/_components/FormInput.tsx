"use client";
import React, { use, useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WebsiteType } from "@/configs/type";
import { useParams, useRouter } from "next/navigation";
import { format, set } from "date-fns";
import {
  Calendar as CalendarIcon,
  RefreshCcw,
  SettingsIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DateRange } from "react-day-picker";
import { fr, se } from "date-fns/locale";
import Link from "next/link";

type Props = {
  websiteList: WebsiteType[];
  setFormData: any;
  setReloadData: any;
};

function FormInput({ websiteList, setFormData , setReloadData }: Props) {
  const { websiteId } = useParams();
  const today = new Date();
  const [analyticType, setAnalyticType] = useState("hourly");
  const router = useRouter();
  const [date, setDate] = useState<DateRange | undefined>({
    from: today,
  });

  const handleDateChange = (range: DateRange | undefined) => {
    if (!range?.from) {
      return;
    }

    if (range?.from && !range.to) {
      setDate({ from: range.from });
      return;
    }
    setDate({ from: range.from, to: range.to });
  };

  const handleToday = () => {
    setDate({ from: today });
  };
  const handleReset = () => {
    setDate({ from: today });
  };

  useEffect(() => {
    setFormData({
      analyticType,
      fromDate: date?.from ?? today,
      toDate: date?.to ?? today,
    });
  }, [date, analyticType]);

  return (
    <div className="flex items-center gap-5 justify-between">
      <div className="flex items-center gap-5 ">
        <Select
          value={(websiteId as string) || ""}
          onValueChange={(v) => router.push(`/dashboard/website/${v}`)}
        >
          <SelectTrigger className="w-[240px]">
            <SelectValue placeholder="Select a website" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Website</SelectLabel>
              {websiteList.map((website, index) => (
                <SelectItem key={index} value={website.websiteId}>
                  {website.domain.replace("https://", "")}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              data-empty={!date}
              className={`data-[empty=true]:text-muted-foreground w-full justify-start text-left font-normal 
                ${date?.to ? "w-[380px]" : "w-[220px]"}
            `}
            >
              <CalendarIcon />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date?.from, "PPP")} - {format(date?.to, "PPP")}
                  </>
                ) : (
                  <>{format(date?.from, "PPP")}</>
                )
              ) : (
                <span>Select date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <div className="flex justify-between items-center my-3 px-2">
              <Button variant={"outline"} onClick={handleToday}>
                Today
              </Button>
              <Button variant={"outline"} onClick={handleReset}>
                Reset
              </Button>
            </div>
            <Calendar
              mode="range"
              selected={date}
              onSelect={handleDateChange}
              className="w-[280px]"
            />
          </PopoverContent>
        </Popover>

        <Select
          value={analyticType}
          onValueChange={(value) => setAnalyticType(value)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Select a website" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="hourly">Hourly</SelectItem>
              <SelectItem value="daily">Daily</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Button variant={"outline"} onClick={() => setReloadData(true)}>
          <RefreshCcw className="h-4 w-4" />
        </Button>
      </div>

      <Link href={`/dashboard/website/${websiteId}/settings`}>
        <Button variant={"outline"}>
          <SettingsIcon />
        </Button>
      </Link>
    </div>
  );
}

export default FormInput;
