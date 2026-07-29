import { Model } from '@nozbe/watermelondb';
import { field, children } from '@nozbe/watermelondb/decorators';

export default class User extends Model {
  static table = 'users';

  @field('email') email;
  @field('name') name;
  @field('tier') tier;
  @field('token') token;
  @field('server_user_id') serverUserId;
  @field('updated_at') updatedAt;

  @children('analyses') analyses;
}
