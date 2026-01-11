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
    averageActiveTime: number;
    totalActiveTime: number;
    totalSessions: number;
    last24hVisitors: number;
    hourlyVisitors: HourlyVisitorsType[];
}

export type HourlyVisitorsType={
    count: number;
    date: string;
    hour: number;
    hourLabel: string;
}