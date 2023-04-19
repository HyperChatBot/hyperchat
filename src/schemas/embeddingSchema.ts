import {
  ExtractDocumentTypeFromTypedRxJsonSchema,
  RxCollection,
  RxDocument,
  RxJsonSchema,
  toTypedRxJsonSchema
} from 'rxdb'

export const embeddingSchemaLiteral = {
  title: 'embedding',
  description: 'describes an embedding object.',
  version: 0,
  keyCompression: false,
  primaryKey: 'embedding_id',
  type: 'object',
  properties: {
    embedding_id: {
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
  required: ['embedding_id'],
  indexes: ['embedding_id']
} as const

const schemaTyped = toTypedRxJsonSchema(embeddingSchemaLiteral)

export type EmbeddingDocType = ExtractDocumentTypeFromTypedRxJsonSchema<
  typeof schemaTyped
>

export type EmbeddingDocument = RxDocument<EmbeddingDocType>

export type EmbeddingCollection = RxCollection<EmbeddingDocType>

export const embeddingSchema: RxJsonSchema<EmbeddingDocType> =
  embeddingSchemaLiteral
