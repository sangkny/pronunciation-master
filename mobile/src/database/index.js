import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import schema from './schema';
import User from './models/User';
import Analysis from './models/Analysis';
import Subscription from './models/Subscription';

const adapter = new SQLiteAdapter({
  dbName: 'pronunciation_master',
  schema,
  jsi: false,
  onSetUpError: (error) => {
    console.error('WatermelonDB setup error:', error);
  },
});

const database = new Database({
  adapter,
  modelClasses: [User, Analysis, Subscription],
});

export default database;
