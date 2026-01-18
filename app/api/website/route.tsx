import { db } from "@/configs/db";
import { pageViewTable, websitesTable } from "@/configs/schema";
import { auth, currentUser } from "@clerk/nextjs/server";
import { da } from "date-fns/locale";
import { and, eq, desc, sql, gte, lte } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { fromZonedTime, toZonedTime } from "date-fns-tz";
import { startOfDay, endOfDay } from "date-fns";


export async function POST(req: NextRequest) {
  const { websiteId, domain, timezone, enableLocalHostTracking } =
    await req.json();
  const user = await currentUser();
  const {has}=await auth();
  const hasPremiumAccess = has({ plan: 'monthly' })

  if(!hasPremiumAccess){
    const result = await db
      .select()
      .from(websitesTable)
      .where(
        eq(websitesTable.userEmail, user?.primaryEmailAddress?.emailAddress as string)
      );
      if(result.length>0){
        return NextResponse.json({
          message: "Upgrade to Pro to add more websites"
        }); 
      }
  }

  const existingDomain = await db
    .select()
    .from(websitesTable)
    .where(
      and(
        eq(websitesTable.domain, domain),
        eq(
          websitesTable.userEmail,
          user?.primaryEmailAddress?.emailAddress as string
        )
      )
    );
  if (existingDomain.length > 0) {
    return NextResponse.json({
      message: "Domain already exists",
      data: existingDomain[0],
    });
  }

  const result = await db
    .insert(websitesTable)
    .values({
      websiteId,
      domain,
      timezone,
      enableLocalHostTracking,
      userEmail: user?.primaryEmailAddress?.emailAddress as string,
    })
    .returning();

  return NextResponse.json(result);
}

export async function DELETE(req: NextRequest) {
    const { websiteId } = await req.json();
    const user = await currentUser();

    const result = await db
      .delete(websitesTable)
      .where(
        and(
          eq(websitesTable.websiteId, websiteId),
          eq(
            websitesTable.userEmail,
            user?.primaryEmailAddress?.emailAddress as string
          )
        )
      )
      .returning();
    return NextResponse.json({message: "Website deleted successfully"});
}

/* ---------------------------------------------
   SAFE TIMEZONE VALIDATOR (IANA ONLY)
--------------------------------------------- */
const getSafeTimeZone = (tz?: string | null) => {
  if (!tz) return "UTC";

  try {
    Intl.DateTimeFormat("en-US", { timeZone: tz });
    return tz;
  } catch {
    return "UTC";
  }
};

/* ---------------------------------------------
   TZ SAFE DATE FORMATTER (yyyy-MM-dd)
--------------------------------------------- */
const formatDateInTZ = (date: Date, timeZone: string) =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);


  
export async function GET(req: NextRequest) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const websiteId = req.nextUrl.searchParams.get("websiteId");
  const from = req.nextUrl.searchParams.get("from");
  const to = req.nextUrl.searchParams.get("to");
  const websiteOnly = req.nextUrl.searchParams.get("websiteOnly");

  


  const nowUnix = Math.floor(Date.now() / 1000);
  const last24hUnix = nowUnix - 24 * 60 * 60;

  /* ---------------------------------------------
       WEBSITE ONLY
    --------------------------------------------- */
  if (websiteOnly === "true") {
    if (websiteId) {
      const websites = await db
        .select()
        .from(websitesTable)
        .where(
          and(
            eq(websitesTable.userEmail, user.primaryEmailAddress!.emailAddress),
            eq(websitesTable.websiteId, websiteId)
          )
        );

      return NextResponse.json(websites[0]);
    }

    const websites = await db
      .select()
      .from(websitesTable)
      .where(
        eq(websitesTable.userEmail, user.primaryEmailAddress!.emailAddress)
      );

    return NextResponse.json(websites);
  }

  /* ---------------------------------------------
       FETCH WEBSITES
    --------------------------------------------- */
  const websites = await db
    .select()
    .from(websitesTable)
    .where(
      websiteId
        ? and(
            eq(websitesTable.userEmail, user.primaryEmailAddress!.emailAddress),
            eq(websitesTable.websiteId, websiteId)
          )
        : eq(websitesTable.userEmail, user.primaryEmailAddress!.emailAddress)
    )
    .orderBy(sql`${websitesTable.id} DESC`);

  const result: any[] = [];

  /* ---------------------------------------------
       FORMATTERS (UNCHANGED)
    --------------------------------------------- */
  const formatSimple = (map: Record<string, number>) =>
    Object.entries(map).map(([name, uv]) => ({ name, uv }));

  const formatWithImage = (map: Record<string, number>) =>
    Object.entries(map).map(([name, uv]) => ({
      name,
      uv,
      image: `/${name.toLowerCase()}.png`,
    }));

  const formatCountries = (
    map: Record<string, number>,
    codeMap: Record<string, string>
  ) =>
    Object.entries(map).map(([name, uv]) => ({
      name,
      uv,
      code: codeMap[name] ?? null,
      image: codeMap[name]
        ? `https://flagsapi.com/${codeMap[name]}/flat/64.png`
        : "/country.png",
    }));

  const formatCities = (
    map: Record<string, number>,
    codeMap: Record<string, string>
  ) =>
    Object.entries(map).map(([name, uv]) => ({
      name,
      uv,
      code: codeMap[name] ?? null,
      image: codeMap[name]
        ? `https://flagsapi.com/${codeMap[name]}/flat/64.png`
        : "/city.png",
    }));

  const formatRegions = (
    map: Record<string, number>,
    codeMap: Record<string, string>
  ) =>
    Object.entries(map).map(([name, uv]) => ({
      name,
      uv,
        code: codeMap[name] ?? null,
      image: codeMap[name]
        ? `https://flagsapi.com/${codeMap[name]}/flat/64.png`
        : "/region.png",
    }));

  const getDomainName = (value: string) => {
    try {
      const host = new URL(
        value.startsWith("http") ? value : `https://${value}`
      ).hostname;
      return host.replace("www.", "").split(".")[0];
    } catch {
      return value.split(".")[0];
    }
  };

  const formatReferrals = (map: Record<string, number>) =>
    Object.entries(map).map(([name, uv]) => ({
      name,
      uv,
      domainName: getDomainName(name),
    }));

  /* ---------------------------------------------
       LOOP WEBSITES
    --------------------------------------------- */
  for (const site of websites) {
    const siteTZ = getSafeTimeZone(site.timezone);
    const makeUnixRange = (from: string | null, to: string | null, tz: string) => {
    if (!from || !to) return { fromUnix: null, toUnix: null };

    // Treat from/to as date-only in tz, not server timezone
    const fromLocal = startOfDay(new Date(`${from}T00:00:00`));
    const toLocal = endOfDay(new Date(`${to}T00:00:00`));

    // convert those tz boundaries to UTC
    const fromUTC = fromZonedTime(fromLocal, tz);
    const toUTC = fromZonedTime(toLocal, tz);

    return {
      fromUnix: Math.floor(fromUTC.getTime() / 1000),
      toUnix: Math.floor(toUTC.getTime() / 1000),
    };
  };
    const { fromUnix, toUnix } = makeUnixRange(from, to, siteTZ);


    const views = await db
      .select()
      .from(pageViewTable)
      .where(
        and(
          eq(pageViewTable.websiteId, site.websiteId),
          ...(fromUnix && toUnix
            ? [
                gte(sql`${pageViewTable.entryTime}::bigint`, fromUnix),
                lte(sql`${pageViewTable.entryTime}::bigint`, toUnix),
              ]
            : [])
        )
      );
    if (views.length === 0) {
      result.push({
        website: site,
        analytics: {
          totalVisitors: 0,
          last24hVisitors: 0,
          totalSessions: 0,
          totalActiveTime: 0,
          avgActiveTime: 0,
          hourlyVisitors: [],
          dailyVisitors: [],
          countries: [],
          cities: [],
          regions: [],
          devices: [],
          os: [],
          browsers: [],
          referrals: [],
          refParams: [],
          utmSources: [],
          urls: [],
        },
      });
      continue;
    }

    /* ---------- UNIQUE VISITORS ---------- */
    const makeSetMap = () => ({} as Record<string, Set<string>>);

    const countryVisitors = makeSetMap();
    const cityVisitors = makeSetMap();
    const regionVisitors = makeSetMap();
    const deviceVisitors = makeSetMap();
    const osVisitors = makeSetMap();
    const browserVisitors = makeSetMap();
    const referralVisitors = makeSetMap();
    const refParamsVisitors = makeSetMap();
    const utmSourceVisitors = makeSetMap();
    const urlVisitors = makeSetMap();

    const countryCodeMap: Record<string, string> = {};
    const cityCountryMap: Record<string, string> = {};
    const regionCountryMap: Record<string, string> = {};

    /* ---------- LAST 24 HOURS VISITORS ---------- */
    const last24hVisitorsSet = new Set<string>();

    views.forEach((v) => {
      if (!v.visitorId || !v.entryTime) return;

      if (Number(v.entryTime) >= last24hUnix) {
        last24hVisitorsSet.add(v.visitorId);
      }
    });

    const last24hVisitors = last24hVisitorsSet.size;

    const uniqueVisitors = new Set<string>();
    let totalActiveTime = 0;

    views.forEach((v) => {
      if (!v.visitorId) return;
      uniqueVisitors.add(v.visitorId);

      if (v.totalActiveTime && v.totalActiveTime > 0) {
        totalActiveTime += v.totalActiveTime;
      }

      const add = (map: Record<string, Set<string>>, key: string) => {
        map[key] ??= new Set();
        map[key].add(v.visitorId!);
      };

      if (v.country) {
        add(countryVisitors, v.country);
        if (v.countryCode)
          countryCodeMap[v.country] = v.countryCode.toUpperCase();
      }
      if (v.city) {
        add(cityVisitors, v.city);
        if (v.countryCode) cityCountryMap[v.city] = v.countryCode.toUpperCase();
      }
      if (v.region) {
        add(regionVisitors, v.region);
        if (v.countryCode)
          regionCountryMap[v.region] = v.countryCode.toUpperCase();
      }

      if (v.device) add(deviceVisitors, v.device);
      if (v.os) add(osVisitors, v.os);
      if (v.browser) add(browserVisitors, v.browser);
      if (v.referrer) add(referralVisitors, v.referrer);
      if (v.refParams) add(refParamsVisitors, v.refParams);
      if (v.utm_source) add(utmSourceVisitors, v.utm_source);
      if (v.url) add(urlVisitors, v.url);
    });

    const toCountMap = (map: Record<string, Set<string>>) =>
      Object.fromEntries(Object.entries(map).map(([k, v]) => [k, v.size]));

    const totalVisitors = uniqueVisitors.size;
    const totalSessions = views.length;
    const avgActiveTime =
      totalVisitors > 0 ? Math.round(totalActiveTime / totalVisitors) : 0;

    /* ---------- HOURLY VISITORS ---------- */
    const hourlyMap: Record<string, Set<string>> = {};
    const hourlyVisitors: any[] = [];

    if (views.length > 0) {
      const start = new Date((fromUnix ?? last24hUnix) * 1000);
      const end = new Date((toUnix ?? nowUnix) * 1000);

      let cursor = new Date(start);

      while (cursor <= end) {
        const local = toZonedTime(cursor, siteTZ);
        const date = formatDateInTZ(local, siteTZ);
        const hour = local.getHours();
        const key = `${date}-${hour}`;

        hourlyVisitors.push({
          date,
          hour,
          hourLabel: local.toLocaleString("en-US", {
            hour: "numeric",
            hour12: true,
            timeZone: siteTZ,
          }),
          count: 0,
        });

        hourlyMap[key] = new Set();
        cursor.setHours(cursor.getHours() + 1);
      }

      views.forEach((v) => {
        if (!v.entryTime || !v.visitorId) return;

        const local = toZonedTime(new Date(Number(v.entryTime) * 1000), siteTZ);

        const date = formatDateInTZ(local, siteTZ);
        hourlyMap[`${date}-${local.getHours()}`]?.add(v.visitorId);
      });

      hourlyVisitors.forEach((h) => {
        h.count = hourlyMap[`${h.date}-${h.hour}`]?.size || 0;
      });
    }

    /* ---------- DAILY VISITORS ---------- */
    const dailyMap: Record<string, Set<string>> = {};

    views.forEach((v) => {
      if (!v.entryTime || !v.visitorId) return;

      const local = toZonedTime(new Date(Number(v.entryTime) * 1000), siteTZ);

      const date = formatDateInTZ(local, siteTZ);

      dailyMap[date] ??= new Set();
      dailyMap[date].add(v.visitorId);
    });

    const dailyVisitors = Object.entries(dailyMap).map(([date, set]) => ({
      date,
      count: set.size,
    }));

    /* ---------- FINAL RESPONSE ---------- */
    result.push({
      website: site,
      analytics: {
        totalVisitors,
        last24hVisitors,
        totalSessions,
        totalActiveTime,
        avgActiveTime,
        hourlyVisitors,
        dailyVisitors,

        countries: formatCountries(toCountMap(countryVisitors), countryCodeMap),
        cities: formatCities(toCountMap(cityVisitors), cityCountryMap),
        regions: formatRegions(toCountMap(regionVisitors), regionCountryMap),

        devices: formatWithImage(toCountMap(deviceVisitors)),
        os: formatWithImage(toCountMap(osVisitors)),
        browsers: formatWithImage(toCountMap(browserVisitors)),

        referrals: formatReferrals(toCountMap(referralVisitors)),
        refParams: formatSimple(toCountMap(refParamsVisitors)),
        utmSources: formatSimple(toCountMap(utmSourceVisitors)),
        urls: formatSimple(toCountMap(urlVisitors)),
      },
    });
  }

  // If a specific websiteId was requested, return only that website
  if (websiteId) {
    return NextResponse.json(result[0] ?? null);
  }

  return NextResponse.json(result);
}
