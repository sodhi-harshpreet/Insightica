import { time } from "console";
import { uuid,boolean, integer, pgTable, varchar } from "drizzle-orm/pg-core";
import { exit } from "process";
export const usersTable = pgTable("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
});

export const websitesTable = pgTable("websites", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    websiteId: uuid("websiteId").notNull(),
    domain: varchar({ length: 255 }).notNull().unique(),
    timezone: varchar({ length: 100 }).notNull(),
    enableLocalHostTracking: boolean().default(false),
    userEmail: varchar({ length: 255 }).notNull(),
});

export const pageViewTable= pgTable("pageViews", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    websiteId: uuid("websiteId").notNull(),
    domain: varchar({ length: 255 }).notNull(),
    url: varchar({ length: 2048 }),
    type: varchar({ length: 50 }).notNull(),
    referrer: varchar({ length: 2048 }),
    visitorId: varchar({ length: 255 }),
    entryTime: varchar({ length: 100 }),
    exitTime: varchar({ length: 100 }),
    totalActiveTime: integer(),
    urlParams: varchar(),
    utm_source: varchar({ length: 255 }),
    utm_medium: varchar({ length: 255 }),
    utm_campaign: varchar({ length: 255 }),
    device: varchar(),
    os: varchar(),
    browser: varchar(),
    city: varchar(),
    region: varchar(),
    country: varchar(),
    countryCode: varchar(),
    ipAddress: varchar(),
    refParams: varchar(),
    exitUrl: varchar(),
});

export const liveUserTable=pgTable('liveUser',{
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    websiteId: varchar(),
    visitorId: varchar().unique(),
    last_seen: varchar(),
    city: varchar(),
    region: varchar(),
    country: varchar(),
    countryCode: varchar(),
    lat: varchar(),
    lng: varchar(),
    device: varchar(),
    os: varchar(),
    browser: varchar(),
});