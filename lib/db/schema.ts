import { type InferSelectModel } from 'drizzle-orm'
import {
  boolean,
  json,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar
} from 'drizzle-orm/pg-core'

export const chat = pgTable('Chat', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  title: text('title').notNull()
})

export type Chat = InferSelectModel<typeof chat>

export const message = pgTable('Message', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  chatId: uuid('chatId')
    .notNull()
    .references(() => chat.id),
  role: varchar('role').notNull(),
  content: json('content').notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull()
})

export type Message = InferSelectModel<typeof message>

export const vote = pgTable(
  'Vote',
  {
    chatId: uuid('chatId')
      .notNull()
      .references(() => chat.id),
    messageId: uuid('messageId')
      .notNull()
      .references(() => message.id),
    isUpvoted: boolean('isUpvoted').notNull()
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.chatId, table.messageId] })
    }
  }
)

export type Vote = InferSelectModel<typeof vote>

export const setting = pgTable('Setting', {
  id: uuid('id').notNull().primaryKey().notNull().defaultRandom(),
  openaiApiKey: varchar('openaiApiKey').notNull(),
  openaiBaseUrl: varchar('openaiBaseUrl').notNull(),
  azureOpenaiApiKey: varchar('azureOpenaiApiKey').notNull(),
  azureOpenAiEndpoint: varchar('azureOpenAiEndpoint').notNull(),
  azureOpenAiApiVersion: varchar('azureOpenAiApiVersion').notNull(),
  anthropicApiKey: varchar('anthropicApiKey').notNull(),
  anthropicBaseUrl: varchar('anthropicBaseUrl').notNull(),
  googleApiKey: varchar('googleApiKey').notNull(),
  googleBaseUrl: varchar('googleBaseUrl').notNull(),
  xAiApiKey: varchar('xAiApiKey').notNull(),
  xAiBaseUrl: varchar('xAiBaseUrl').notNull(),
  ollamaBaseUrl: varchar('ollamaBaseUrl').notNull()
})

export type Setting = InferSelectModel<typeof setting>
