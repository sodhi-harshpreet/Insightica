    "use client";
    import { LiveUserType, WebsiteInfoType, WebsiteType } from "@/configs/type";
    import axios from "axios";
    import { useParams } from "next/navigation";
    import React, { useEffect } from "react";
    import FormInput from "./_components/FormInput";
    import PageViewAnalytics from "./_components/PageViewAnalytics";
    import { format } from "date-fns-tz";
    import SourceWidget from "./_components/SourceWidget";
    import DeviceWidget from "./_components/DeviceWidget";
    import GeoWidget from "./_components/GeoWidget";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

    function WebsiteDetail() {
    const { websiteId } = useParams();
    const [websiteList, setWebsiteList] = React.useState<WebsiteType[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [liveUsers, setLiveUsers] = React.useState<LiveUserType[]>([]);
    const [websiteInfo, setWebsiteInfo] =
        React.useState<WebsiteInfoType | null>();
    const [formData, setFormData] = React.useState<any>({
        analyticType: "hourly",
        fromDate: new Date(),
        toDate: new Date(),
    });

    const GetWebsiteList = async () => {
        const websites = await axios.get("/api/website?websiteOnly=true");
        // console.log(websites.data);
        setWebsiteList(websites.data);
    };

    const GetWebsiteAnalyticalDetail = async () => {
        setLoading(true);
        const fromDate = format(formData?.fromDate, "yyyy-MM-dd");
        const toDate = formData?.toDate
        ? format(formData?.toDate, "yyyy-MM-dd")
        : fromDate;
        // console.log({ fromDate, toDate });
        const websiteResult = await axios.get(
        `/api/website/?websiteId=${websiteId}&from=${fromDate}&to=${toDate}`
        );
        // console.log(websiteResult.data);
        setWebsiteInfo(websiteResult.data);
        setLoading(false);
        GetLiveUsers();
    };

    const GetLiveUsers=async ()=>{
        const result=await axios.get('/api/live?websiteId='+websiteId);
        setLiveUsers(result.data);
        // console.log("Live Users:", result);
    }

    useEffect(() => {
        GetWebsiteList();
        GetWebsiteAnalyticalDetail();
    }, []);

    useEffect(() => {
        GetWebsiteAnalyticalDetail();
    }, [formData.analyticType, formData.fromDate, formData.toDate]);

    useEffect(() => {
  if (!websiteId) return;

  let interval: NodeJS.Timeout;

  const startPolling = () => {
    interval = setInterval(() => {
      GetLiveUsers();
    }, 15000);
  };

  const stopPolling = () => {
    if (interval) clearInterval(interval);
  };

  const handleVisibilityChange = () => {
    document.hidden ? stopPolling() : startPolling();
  };

  document.addEventListener("visibilitychange", handleVisibilityChange);

  // initial call + start polling
  GetLiveUsers();
  startPolling();

  return () => {
    stopPolling();
    document.removeEventListener("visibilitychange", handleVisibilityChange);
  };
}, [websiteId]);


        return (
            <div className="mt-10">
                <div className="mb-6">
                <Link href="/dashboard">
                
                <Button><ArrowLeft /> Dashboard</Button>
                </Link>
                </div>

            <FormInput
                websiteList={websiteList}
                setFormData={setFormData}
                setReloadData={() => GetWebsiteAnalyticalDetail()}
            />
            <PageViewAnalytics
                websiteInfo={websiteInfo}
                loading={loading}
                analyticType={formData?.analyticType}
                liveUserCount={liveUsers.length}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-7">
                <SourceWidget websiteAnalytics={websiteInfo?.analytics} loading={loading} />
                <GeoWidget websiteAnalytics={websiteInfo?.analytics} loading={loading}/>
                <DeviceWidget websiteAnalytics={websiteInfo?.analytics} loading={loading} />
            </div>
            </div>
        );
    }

    export default WebsiteDetail;
