import {
  ExtractDocumentTypeFromTypedRxJsonSchema,
  RxJsonSchema,
  toTypedRxJsonSchema
} from 'rxdb'

export const settingsSchemaLiteral = {
  title: 'settings',
  description: 'describes a settings.',
  version: 0,
  keyCompression: false,
  primaryKey: 'settings_id',
  type: 'object',
  properties: {
    settings_id: {
      type: 'string'
    },
    assistant_avatar: {
      type: 'string'
    },
    user_avatar: {
      type: 'string'
    },
    api_key: {
      type: 'string'
    },
    org_id: {
      type: 'string'
    }
  },
  required: ['settings_id'],
  indexes: ['settings_id']
} as const

const schemaTyped = toTypedRxJsonSchema(settingsSchemaLiteral)

export type SettingsDocType = ExtractDocumentTypeFromTypedRxJsonSchema<
  typeof schemaTyped
>

export const settingsSchema: RxJsonSchema<SettingsDocType> =
  settingsSchemaLiteral
