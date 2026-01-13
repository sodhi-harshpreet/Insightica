"use client";
import { WebsiteInfoType, WebsiteType } from "@/configs/type";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import FormInput from "./_components/FormInput";
import PageViewAnalytics from "./_components/PageViewAnalytics";
import { format } from "date-fns-tz";

function WebsiteDetail() {
  const { websiteId } = useParams();
  const [websiteList, setWebsiteList] = React.useState<WebsiteType[]>([]);
  const [   loading, setLoading] = React.useState(false);
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
    const toDate = formData?.toDate ? format(formData?.toDate, "yyyy-MM-dd") : fromDate;
    // console.log({ fromDate, toDate });
    const websiteResult = await axios.get(
      `/api/website/?websiteId=${websiteId}&from=${fromDate}&to=${toDate}`
    );
    // console.log(websiteResult.data);
    setWebsiteInfo(websiteResult.data);
    setLoading(false);
  };

  useEffect(() => {
    GetWebsiteList();
    GetWebsiteAnalyticalDetail();
  }, []);

    useEffect(() => {
    GetWebsiteAnalyticalDetail();
    },[formData.analyticType, formData.fromDate, formData.toDate])

  return (
    <div className="mt-10">
      <FormInput websiteList={websiteList} setFormData={setFormData} setReloadData={() => GetWebsiteAnalyticalDetail()} />
      <PageViewAnalytics websiteInfo={websiteInfo} loading={loading} analyticType={formData?.analyticType} />
    </div>
  );
}

export default WebsiteDetail;
