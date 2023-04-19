import { addRxPlugin, createRxDatabase, RxDatabase, RxJsonSchema } from 'rxdb'
import { RxDBAttachmentsPlugin } from 'rxdb/plugins/attachments'
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder'
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie'
import { chatSchema } from 'src/schemas/chatSchema'
import { embeddingSchema } from 'src/schemas/embeddingSchema'
import { settingsSchema } from 'src/schemas/settingsSchema'

addRxPlugin(RxDBQueryBuilderPlugin)
addRxPlugin(RxDBAttachmentsPlugin)

export let db: RxDatabase

export const connectDB = async () => {
  db = await createRxDatabase({
    name: 'chatchat',
    storage: getRxStorageDexie()
  })

  // @ts-ignore
  window.db = db
}

export const isCollectionExist = <T>(schema: RxJsonSchema<T>) =>
  Boolean(db.collections[schema.title as string])

export const createCollection = async <T>(schema: RxJsonSchema<T>) => {
  if (isCollectionExist(schema)) return

  await db.addCollections({
    [schema.title as string]: {
      schema
    }
  })
}

export const initialDB = async () => {
  await connectDB()
  await createCollection(chatSchema)
  await createCollection(settingsSchema)
  await createCollection(embeddingSchema)
}
