export type WebsiteType = {
    id: number;
    websiteId: string;
    domain: string;
    timezone: string;
    enableLocalHostTracking: boolean;
    userEmail: string;
};

export type WebsiteInfoType = {
    website: WebsiteType,
    analytics: AnalytisType
}

export type AnalytisType = {
    avgActiveTime: number;
    totalActiveTime: number;
    totalSessions: number;
    totalVisitors: number;
    hourlyVisitors: HourlyVisitorsType[];
    dailyVisitors: DailyVisitorsType[];
}

export type HourlyVisitorsType={
    count: number;
    date: string;
    hour: number;
    hourLabel: string;
}

export type DailyVisitorsType={
    date: string;
    count: number;
}