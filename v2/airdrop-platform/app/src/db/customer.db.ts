import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import {
  CustomerStatuses,
  type CustomerStatus,
} from "@nexeraid/identity-schemas";

export const CustomerTable = pgTable("customer", {
  id: serial("id").primaryKey(),

  compilotCustomerId: text("compilot_customer_id").unique(),

  walletAddress: text("wallet_address").unique().notNull(),
  userStatus: text("user_status", {
    enum: CustomerStatuses,
  }).$type<CustomerStatus>(),

  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});