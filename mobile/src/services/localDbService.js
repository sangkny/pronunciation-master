import { Q } from '@nozbe/watermelondb';
import database from '../database';

export function getLocalUserId(user, token) {
  return user?.email || user?.id?.toString() || token?.slice(0, 16) || 'anonymous';
}

export async function upsertLocalUser({ email, name, tier, token, serverUserId }) {
  const localId = email || serverUserId || 'anonymous';
  const existing = await database
    .get('users')
    .query(Q.where('email', localId))
    .fetch();

  await database.write(async () => {
    if (existing.length > 0) {
      await existing[0].update((record) => {
        record.name = name || record.name;
        record.tier = tier || record.tier;
        record.token = token || record.token;
        record.serverUserId = serverUserId || record.serverUserId;
        record.updatedAt = Date.now();
      });
      return existing[0];
    }

    return database.get('users').create((record) => {
      record.email = localId;
      record.name = name || localId;
      record.tier = tier || 'Free';
      record.token = token || '';
      record.serverUserId = serverUserId || '';
      record.updatedAt = Date.now();
    });
  });

  return localId;
}

export async function upsertLocalSubscription(userId, tier, planId = '') {
  const existing = await database
    .get('subscriptions')
    .query(Q.where('user_id', userId))
    .fetch();

  await database.write(async () => {
    if (existing.length > 0) {
      await existing[0].update((record) => {
        record.tier = tier;
        record.planId = planId;
        record.updatedAt = Date.now();
      });
    } else {
      await database.get('subscriptions').create((record) => {
        record.userId = userId;
        record.tier = tier;
        record.planId = planId;
        record.updatedAt = Date.now();
      });
    }
  });
}

export async function saveAnalysisLocal({
  userId,
  word,
  audioUri = '',
  audioDuration = 0,
  payload,
  synced = false,
  confidence = 0,
}) {
  let created;
  await database.write(async () => {
    created = await database.get('analyses').create((record) => {
      record.userId = userId;
      record.word = word;
      record.audioUri = audioUri;
      record.audioDuration = audioDuration;
      record.analysis = JSON.stringify(payload);
      record.confidence = confidence;
      record.createdAt = Date.now();
      record.synced = synced;
      record.serverId = '';
    });
  });
  return created;
}

export async function countUnsyncedAnalyses(userId) {
  const rows = await database
    .get('analyses')
    .query(Q.where('user_id', userId), Q.where('synced', false))
    .fetchCount();
  return rows;
}
