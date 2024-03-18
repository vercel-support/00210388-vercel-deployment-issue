import { sql } from 'drizzle-orm';
import { text, json, pgTable, timestamp } from 'drizzle-orm/pg-core';

///////////////////////////////////////
// USER ///////////////////////////////
///////////////////////////////////////


export const UserTable = pgTable('user', {
  id: text('id').notNull().primaryKey(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').notNull(),
  attributes: json('attributes'),
  createdAt: timestamp('created_at', { withTimezone: true, precision: 6 }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp('updated_at', { withTimezone: true, precision: 6 }),
});
