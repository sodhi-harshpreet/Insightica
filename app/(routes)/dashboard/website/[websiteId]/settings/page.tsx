"use client";

import { Button } from "@/components/ui/button";
import { WebsiteType } from "@/configs/type";
import { Arrow } from "@radix-ui/react-tooltip";
import axios from "axios";
import { se } from "date-fns/locale";
import { ArrowLeft, Check, Copy, Loader, Trash } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { use, useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import InstallScript from "../../../new/_components/InstallScript";
import { Input } from "@/components/ui/input";
import { set } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

function WebsiteSettings() {
  const { websiteId } = useParams();
  const [websiteDetails, setWebsiteDetails] = React.useState<WebsiteType>();
  const [copied, setCopied] = useState(false);
  const [websiteDomain, setWebsiteDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleCopy = async () => {
    await navigator.clipboard.writeText(script);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  useEffect(() => {
    GetWebsiteDetails();
  }, []);

  const GetWebsiteDetails = async () => {
    const result = await axios.get(
      "/api/website?websiteId=" + websiteId + "&websiteOnly=true"
    );
    // console.log("Website Details:", result.data);
    setWebsiteDetails(result.data);
    setWebsiteDomain(result.data.domain);
  };

  const script = `<script
  defer
  data-website-id="${websiteId}"
  data-domain="${websiteDetails?.domain}"
  src="${process.env.NEXT_PUBLIC_HOST_URL}/analytics.js">
</script>`;

  const onDeleteWebsite = async () => {
    setLoading(true);
    const result = await axios.delete("/api/website", {
      data: {
        websiteId: websiteId,
      },
    });
    toast.success("Website deleted successfully");
    setLoading(false);
    router.replace("/dashboard");
  };

  return (
    <div className="mb-20 px-4">
      {/* Page container */}
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Back button */}
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <Link href={`/dashboard/website/${websiteId}`}>
            <ArrowLeft size={16} />
            Back to Analytics
          </Link>
        </Button>

        {/* Header */}
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">
            Website Settings
          </h2>
          <p className="text-sm text-muted-foreground">
Website configuration and analytics setup
          </p>
        </div>

        <Separator />

        {/* Website info card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Website</CardTitle>
            <CardDescription>
              Configuration for your tracked website
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-2">
            <div className="flex flex-col gap-1">
              <span className="text-sm text-muted-foreground">Domain</span>
              <span className="font-medium">
                {websiteDetails?.domain?.replace("https://", "")}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm text-muted-foreground">Website ID</span>
              <span className="font-medium">
                {websiteDetails?.websiteId}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Widgets / Tabs / Settings */}
        <div className="space-y-6">
          <Tabs defaultValue="general" className="w-[800px] mt-6">
            <TabsList>
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="other">Other</TabsTrigger>
            </TabsList>
            <TabsContent value="general">
              <Card className="w-full mx-auto mt-6">
                <CardHeader>
                  <CardTitle>Install the WebTrack Script</CardTitle>
                  <p className="text-sm text-muted-foreground mt-4">
                    Copy and paste this into the <code>&lt;head&gt;</code> of
                    your website
                  </p>
                </CardHeader>

                <CardContent>
                  <pre
                    className="
    relative rounded-lg p-4 text-sm leading-relaxed overflow-x-auto
    bg-slate-100 text-green-600
    dark:bg-slate-900 dark:text-green-400
    border border-slate-200 dark:border-slate-700
    transition-colors duration-200
  "
                  >
                    {script}

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={handleCopy}
                      className="
      absolute top-2 right-2
      text-slate-500
      hover:text-slate-800
      hover:bg-slate-200
      dark:text-slate-400
      dark:hover:text-slate-100
      dark:hover:bg-slate-800
      transition-colors
    "
                      aria-label="Copy script"
                    >
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                    </Button>
                  </pre>
                </CardContent>
              </Card>

              {/* <Card className="mt-6">
            <CardHeader>
              <CardTitle>Website Domain</CardTitle>
              <CardDescription>
                Your main website domain for analytics tracing{" "}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="website.com"
                value={websiteDomain}
                onChange={(e) => setWebsiteDomain(e.target.value)}
              />
              <div className="flex justify-between mt-2 items-center gap-4">
                <h2>Your public INSIGHTICA ID is {websiteId}</h2>
                <Button>Save</Button>
              </div>
            </CardContent>
          </Card> */}
            </TabsContent>
            <TabsContent value="other">
              <Card>
                <CardHeader>
                  <CardTitle>Danger</CardTitle>
                </CardHeader>
                <Separator />
                <CardContent className="flex justify-between mt-3 items-center">
                  <h2>Do you want to delete this website from Insightica?</h2>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="mt-4 text-white">
                        <Trash />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete your account and remove your data from our
                          servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <Button
                          className="text-white"
                          variant="destructive"
                          disabled={loading}
                          onClick={() => onDeleteWebsite()}
                        >
                          {loading ? (
                            <Loader className="animate-spin" />
                          ) : (
                            "Continue"
                          )}
                        </Button>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default WebsiteSettings;
