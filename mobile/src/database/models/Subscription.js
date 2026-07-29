import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

export default class Subscription extends Model {
  static table = 'subscriptions';

  @field('user_id') userId;
  @field('tier') tier;
  @field('plan_id') planId;
  @field('expires_at') expiresAt;
  @field('updated_at') updatedAt;
}
