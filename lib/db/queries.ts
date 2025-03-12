import 'dotenv/config'
import { and, asc, desc, eq } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/node-postgres'
import { v4 as uuidV4 } from 'uuid'
import {
  chat,
  message,
  setting,
  vote,
  type Message,
  type Setting
} from './schema'

export const db = drizzle(process.env.POSTGRES_URL!)

export async function saveChat({ title, id }: { id: string; title: string }) {
  try {
    return await db.insert(chat).values({
      id,
      title
    })
  } catch (error) {
    console.error('Failed to save chat in database')
    throw error
  }
}

export async function getChats() {
  try {
    return await db.select().from(chat).orderBy(desc(chat.createdAt))
  } catch (error) {
    console.error('Failed to get chats by user from database')
    throw error
  }
}

export async function deleteChatById({ id }: { id: string }) {
  try {
    await db.delete(vote).where(eq(vote.chatId, id))
    await db.delete(message).where(eq(message.chatId, id))

    return await db.delete(chat).where(eq(chat.id, id))
  } catch (error) {
    console.error('Failed to delete chat by id from database')
    throw error
  }
}

export async function getChatById({ id }: { id: string }) {
  try {
    const [selectedChat] = await db.select().from(chat).where(eq(chat.id, id))
    return selectedChat
  } catch (error) {
    console.error('Failed to get chat by id from database')
    throw error
  }
}

export async function saveMessages({ messages }: { messages: Array<Message> }) {
  try {
    return await db.insert(message).values(messages)
  } catch (error) {
    console.error('Failed to save messages in database')
    throw error
  }
}

export async function getMessagesByChatId({ id }: { id: string }) {
  try {
    return await db
      .select()
      .from(message)
      .where(eq(message.chatId, id))
      .orderBy(asc(message.createdAt))
  } catch (error) {
    console.error('Failed to get messages by chat id from database', error)
    throw error
  }
}

export async function voteMessage({
  chatId,
  messageId,
  type
}: {
  chatId: string
  messageId: string
  type: 'up' | 'down'
}) {
  try {
    const [existingVote] = await db
      .select()
      .from(vote)
      .where(and(eq(vote.messageId, messageId)))

    if (existingVote) {
      return await db
        .update(vote)
        .set({ isUpvoted: type === 'up' })
        .where(and(eq(vote.messageId, messageId), eq(vote.chatId, chatId)))
    }
    return await db.insert(vote).values({
      chatId,
      messageId,
      isUpvoted: type === 'up'
    })
  } catch (error) {
    console.error('Failed to upvote message in database', error)
    throw error
  }
}

export async function getVotesByChatId({ id }: { id: string }) {
  try {
    return await db.select().from(vote).where(eq(vote.chatId, id))
  } catch (error) {
    console.error('Failed to get votes by chat id from database', error)
    throw error
  }
}

export async function getSetting() {
  try {
    // retrieve first record
    const [data] = await db.select().from(setting)
    if (!data) {
      return await db.insert(setting).values({
        openaiApiKey: '',
        openaiBaseUrl: '',
        azureOpenaiApiKey: '',
        azureOpenAiEndpoint: '',
        azureOpenAiApiVersion: '',
        anthropicApiKey: '',
        anthropicBaseUrl: '',
        googleApiKey: '',
        googleBaseUrl: '',
        xAiApiKey: '',
        xAiBaseUrl: '',
        ollamaBaseUrl: '',
        id: uuidV4()
      })
    }

    return data
  } catch (error) {
    console.error('Failed to save settings in database')
    throw error
  }
}

export async function updateSetting(payload: Setting) {
  try {
    return await db
      .update(setting)
      .set(payload)
      .where(eq(setting.id, payload.id))
  } catch (error) {
    console.error('Failed to save setting in database')
    throw error
  }
}

// export const findRelevantContent = async (userQuery: string) => {
//   const userQueryEmbedded = await generateEmbedding(userQuery);

//   const similarity = sql<number>`1 - (${cosineDistance(
//     embeddingsTable.embedding,
//     userQueryEmbedded,
//   )})`;

//   const similarGuides = await db
//     .select({ name: embeddingsTable.content, similarity })
//     .from(embeddingsTable)
//     .where(gt(similarity, 0.5))
//     .orderBy((t) => desc(t.similarity))
//     .limit(4);

//   return similarGuides;
// };
