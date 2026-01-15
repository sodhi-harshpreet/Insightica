import { NextRequest, NextResponse } from "next/server";
// import UAParser from "ua-parser-js";
import { db } from "@/configs/db";
import { liveUserTable } from "@/configs/schema";
import { and, eq, gt } from "drizzle-orm";
import { UAParser } from "ua-parser-js";

const CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

export async function OPTIONS(req:Request) {
    const origin=req.headers.get("Origin") || "*";

    return new NextResponse(null,{
        status:200,
        headers:{
            "Access-Control-Allow-Origin": origin,
            "Access-Control-Allow-Methods": "POST,OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        }
    })
}

/* ------------------------ POST: Track Visitor ------------------------ */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { visitorId, websiteId, last_seen, url } = body;

    /* ---------- Parse User-Agent ---------- */
    const parser = new UAParser(req.headers.get("user-agent") || "");

    const deviceInfo =
      parser.getDevice().model ||
      parser.getDevice().type ||
      "Unknown";

    const osInfo = parser.getOS().name || "Unknown";
    const browserInfo = parser.getBrowser().name || "Unknown";

    /* ---------- Get IP ---------- */
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    /* ---------- Geo Lookup ---------- */
    const geoRes = await fetch(`https://ip-api.com/json/${ip}`);
    const geoInfo = await geoRes.json();

    const country = geoInfo.country || "";
    const countryCode =
      geoInfo.countryCode && geoInfo.countryCode !== ""
        ? geoInfo.countryCode
        : "";

    const city = geoInfo.city || "";
    const region = geoInfo.regionName || "";

    /* ---------- Insert / Update ---------- */
    await db
      .insert(liveUserTable)
      .values({
        visitorId,
        websiteId,
        last_seen,
        // url,

        city,
        region,
        country,
        countryCode,

        lat: geoInfo.lat?.toString() || "",
        lng: geoInfo.lon?.toString() || "",

        device: deviceInfo,
        os: osInfo,
        browser: browserInfo,
      })
      .onConflictDoUpdate({
        target: liveUserTable.visitorId,
        set: {
          last_seen,
          city,
          region,
          country,
          countryCode,
          lat: geoInfo.lat?.toString() || null,
          lng: geoInfo.lon?.toString() || null,
          device: deviceInfo,
          os: osInfo,
          browser: browserInfo,
        },
      });

    return NextResponse.json(
        {message:"Data received"},
        {headers: CORS_HEADERS}
        );  } 
    catch (err: any) {
    // console.error("Visitor POST error:", err);
    return NextResponse.json(
      { status: "error", message: err.message },
      { status: 500 }
    );
  }
}

/* ------------------------ GET: Active Users ------------------------ */
export async function GET(req: NextRequest) {
  const websiteId = req.nextUrl.searchParams.get("websiteId");
  const now = Date.now();

  if (!websiteId) {
    return NextResponse.json([], { status: 400 });
  }

  const activeUsers = await db
    .select()
    .from(liveUserTable)
    .where(
      and(
        eq(liveUserTable.websiteId, websiteId),
        // @ts-ignore
        gt(liveUserTable.last_seen, now - 30_000) // last 30 sec
      )
    );

  return NextResponse.json(activeUsers);
}
