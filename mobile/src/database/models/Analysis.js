import { Model } from '@nozbe/watermelondb';
import { field, relation } from '@nozbe/watermelondb/decorators';

export default class Analysis extends Model {
  static table = 'analyses';

  static associations = {
    users: { type: 'belongs_to', key: 'user_id' },
  };

  @field('user_id') userId;
  @field('word') word;
  @field('audio_uri') audioUri;
  @field('audio_duration') audioDuration;
  @field('analysis') analysis;
  @field('confidence') confidence;
  @field('created_at') createdAt;
  @field('synced') synced;
  @field('server_id') serverId;

  @relation('users', 'user_id') user;
}
