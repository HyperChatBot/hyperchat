import { ChatCollection, ChatDocType, chatSchema } from './chatSchema'
import { SettingsDocType, settingsSchema } from './settingsSchema'

export { chatSchema, settingsSchema }
export type { ChatDocType, SettingsDocType }

interface DataBaseCollections {
  chat: ChatCollection
}
