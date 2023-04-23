import {
  ExtractDocumentTypeFromTypedRxJsonSchema,
  RxCollection,
  RxDocument,
  RxJsonSchema,
  toTypedRxJsonSchema
} from 'rxdb'
import { schemaNames } from 'src/shared/constants'
import { Products } from 'src/types/global'

export const moderationSchemaLiteral = {
  title: schemaNames[Products.Moderation],
  description: 'describes a moderation object.',
  version: 0,
  keyCompression: false,
  primaryKey: 'conversation_id',
  type: 'object',
  properties: {
    conversation_id: {
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
  required: ['conversation_id'],
  indexes: ['conversation_id']
} as const

const schemaTyped = toTypedRxJsonSchema(moderationSchemaLiteral)

export type ModerationDocType = ExtractDocumentTypeFromTypedRxJsonSchema<
  typeof schemaTyped
>

export type ModerationDocument = RxDocument<ModerationDocType>

export type ModerationCollection = RxCollection<ModerationDocType>

export const moderationSchema: RxJsonSchema<ModerationDocType> = moderationSchemaLiteral
