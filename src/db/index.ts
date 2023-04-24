import { addRxPlugin, createRxDatabase, RxDatabase, RxJsonSchema } from 'rxdb'
import { RxDBAttachmentsPlugin } from 'rxdb/plugins/attachments'
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder'
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie'
import { audioSchema } from 'src/schemas/audioSchema'
import { chatSchema } from 'src/schemas/chatSchema'
import { imageSchema } from 'src/schemas/imageSchema'
import { moderationSchema } from 'src/schemas/moderationSchema'
import { settingsSchema } from 'src/schemas/settingsSchema'
import { textSchema } from 'src/schemas/textSchema'

addRxPlugin(RxDBQueryBuilderPlugin)
addRxPlugin(RxDBAttachmentsPlugin)

export let db: RxDatabase

export const connectDB = async () => {
  db = await createRxDatabase({
    name: 'hyperchat',
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
  await createCollection(settingsSchema)
  await createCollection(chatSchema)
  await createCollection(audioSchema)
  await createCollection(imageSchema)
  await createCollection(moderationSchema)
  await createCollection(textSchema)
}
