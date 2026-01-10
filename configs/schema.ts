import { time } from "console";
import { uuid,boolean, integer, pgTable, varchar } from "drizzle-orm/pg-core";
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