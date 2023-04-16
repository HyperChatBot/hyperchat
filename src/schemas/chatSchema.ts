import {
  ExtractDocumentTypeFromTypedRxJsonSchema,
  RxCollection,
  RxDocument,
  RxJsonSchema,
  toTypedRxJsonSchema
} from 'rxdb'

export const chatSchemaLiteral = {
  title: 'chat',
  description: 'describes a chat object.',
  version: 0,
  keyCompression: false,
  primaryKey: 'chat_id',
  type: 'object',
  properties: {
    chat_id: {
      type: 'string'
    },
    summary: {
      type: 'string'
    },
    messages: {
      type: 'array',
      maxItems: 5,
      uniqueItems: true,
      items: {
        type: 'object',
        properties: {
          message_id: {
            type: 'string'
          },
          question: {
            type: 'string'
          },
          answer: {
            type: 'string'
          },
          question_created_at: {
            type: 'number'
          },
          answer_created_at: {
            type: 'number'
          }
        }
      }
    },
    created_at: {
      type: 'number'
    },
    updated_at: {
      type: 'number'
    }
  },
  required: ['chat_id'],
  indexes: ['chat_id']
} as const

const schemaTyped = toTypedRxJsonSchema(chatSchemaLiteral)

export type ChatDocType = ExtractDocumentTypeFromTypedRxJsonSchema<
  typeof schemaTyped
>

export type ChatDocument = RxDocument<ChatDocType>

export type ChatCollection = RxCollection<ChatDocType>

export const chatSchema: RxJsonSchema<ChatDocType> = chatSchemaLiteral
