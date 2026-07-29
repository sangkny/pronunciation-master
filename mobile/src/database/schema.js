import { appSchema, tableSchema } from '@nozbe/watermelondb';

export default appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'users',
      columns: [
        { name: 'email', type: 'string', isIndexed: true },
        { name: 'name', type: 'string' },
        { name: 'tier', type: 'string' },
        { name: 'token', type: 'string', isOptional: true },
        { name: 'server_user_id', type: 'string', isOptional: true },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'analyses',
      columns: [
        { name: 'user_id', type: 'string', isIndexed: true },
        { name: 'word', type: 'string' },
        { name: 'audio_uri', type: 'string', isOptional: true },
        { name: 'audio_duration', type: 'number', isOptional: true },
        { name: 'analysis', type: 'string' },
        { name: 'confidence', type: 'number' },
        { name: 'created_at', type: 'number' },
        { name: 'synced', type: 'boolean' },
        { name: 'server_id', type: 'string', isOptional: true },
      ],
    }),
    tableSchema({
      name: 'subscriptions',
      columns: [
        { name: 'user_id', type: 'string', isIndexed: true },
        { name: 'tier', type: 'string' },
        { name: 'plan_id', type: 'string', isOptional: true },
        { name: 'expires_at', type: 'number', isOptional: true },
        { name: 'updated_at', type: 'number' },
      ],
    }),
  ],
});
