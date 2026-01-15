import { db } from "@/configs/db";
import { pageViewTable } from "@/configs/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { UAParser } from "ua-parser-js";

// const CORS_HEADERS = {
//   "Access-Control-Allow-Origin": "*",
//   "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
//   "Access-Control-Allow-Headers": "Content-Type, Authorization",
// };
function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}


export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(),
  });
}


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("body data :", body);

    // fetch all the data from analytic.js
    const parser = new UAParser(req.headers.get("user-agent") || "");
    const deviceInfo = parser.getDevice().type;
    const osInfo = parser.getOS().name;
    const browserInfo = parser.getBrowser().name;
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0] ||
      req.headers.get("x-real-ip") ||
      "71.71.22.54"; // Fallback IP for local testing
    let geoInfo = null;
    const geoRes = await fetch(`http://ip-api.com/json/71.71.22.54`);
    geoInfo = await geoRes.json();

    // console.log("Device Info: ", deviceInfo);
    // console.log("OS Info: ", osInfo);
    // console.log("Browser Info: ", browserInfo);
    // console.log("IP Address: ", ip);
    // console.log("Geo Info: ", geoInfo);

    // process and store the data in the database
    let result;
    if (body.type === "entry") {
      result = await db
        .insert(pageViewTable)
        .values({
          websiteId: body.websiteId,
          domain: body.domain,
          url: body.url,
          type: body.type,
          referrer: body.referrer,
          visitorId: body.visitorId,
          entryTime: body.entryTime,
          exitTime: body.exitTime,
          totalActiveTime: body.totalActiveTime,
          urlParams: body.urlParams,
          utm_source: body.utm_source,
          utm_medium: body.utm_medium,
          utm_campaign: body.utm_campaign,
          device: deviceInfo || "Unknown",
          os: osInfo || "Unknown",
          browser: browserInfo || "Unknown",
          city: geoInfo.city || "Unknown",
          region: geoInfo.regionName || "Unknown",
          country: geoInfo.country || "Unknown",
          countryCode: geoInfo.countryCode || "Unknown",
          ipAddress: ip || "Unknown",
          refParams: body.refParams,
        })
        .returning();
    } else {
      await db
        .update(pageViewTable)
        .set({
          exitTime: body.exitTime,
          totalActiveTime: body.totalActiveTime,
          exitUrl: body.exitUrl,
        })
        .where(eq(pageViewTable.visitorId, body.visitorId))
        .returning();
    }
    // console.log("Insert Result: ", result);
    return NextResponse.json(
  { message: "Data received", data: result },
  { headers: corsHeaders() }
);

  } catch (err: any) {
    return NextResponse.json(
      { status: "error", message: err.message },
      {
        status: 500,
        headers: corsHeaders(),
      }
    );
  }
}
