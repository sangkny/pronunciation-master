import { Q } from '@nozbe/watermelondb';
import database from '../database';
import apiClient from './apiService';
import { useAppStore } from '../store/useAppStore';
import { getLocalUserId } from './localDbService';

async function findLocalAnalysis(clientId, serverId) {
  if (clientId) {
    try {
      return await database.get('analyses').find(clientId);
    } catch {
      // not found
    }
  }

  if (serverId) {
    const rows = await database
      .get('analyses')
      .query(Q.where('server_id', serverId))
      .fetch();
    return rows[0] || null;
  }

  return null;
}

export async function syncData() {
  const { token, isOnline, user } = useAppStore.getState();

  if (!token || !isOnline) {
    return { uploaded: 0, downloaded: 0, skipped: true };
  }

  const userId = getLocalUserId(user, token);
  let uploaded = 0;
  let downloaded = 0;

  try {
    const unsyncedAnalyses = await database
      .get('analyses')
      .query(Q.where('user_id', userId), Q.where('synced', false))
      .fetch();

    for (const analysis of unsyncedAnalyses) {
      try {
        let parsed;
        try {
          parsed = JSON.parse(analysis.analysis);
        } catch {
          parsed = { text: analysis.analysis };
        }

        const { data } = await apiClient.post('/api/analysis/sync', {
          clientId: analysis.id,
          word: analysis.word,
          analysis: parsed,
          confidence: analysis.confidence || 0,
          createdAt: analysis.createdAt,
          audioDuration: analysis.audioDuration,
        });

        await database.write(async () => {
          await analysis.update((record) => {
            record.synced = true;
            record.serverId = data?.id?.toString() || record.serverId;
          });
        });
        uploaded += 1;
      } catch (error) {
        console.warn('Sync upload failed for analysis:', analysis.id, error.message);
      }
    }

    const { data: listData } = await apiClient.get('/api/analysis/list');
    const latestAnalyses = listData?.analyses || [];

    for (const serverAnalysis of latestAnalyses) {
      const serverId = serverAnalysis.id?.toString();
      const clientId = serverAnalysis.client_id || serverAnalysis.clientId;
      const serverCreated = new Date(
        serverAnalysis.created_at || serverAnalysis.createdAt
      ).getTime();

      const localMatch = await findLocalAnalysis(clientId, serverId);

      if (localMatch) {
        if (serverCreated >= localMatch.createdAt) {
          await database.write(async () => {
            await localMatch.update((record) => {
              record.word = serverAnalysis.word;
              record.analysis = JSON.stringify(
                serverAnalysis.analysis_json || serverAnalysis.analysis
              );
              record.confidence = parseFloat(serverAnalysis.confidence) || 0;
              record.synced = true;
              record.serverId = serverId;
              record.createdAt = serverCreated;
            });
          });
        }
      } else {
        await database.write(async () => {
          await database.get('analyses').create((record) => {
            record.userId = userId;
            record.word = serverAnalysis.word;
            record.analysis = JSON.stringify(
              serverAnalysis.analysis_json || serverAnalysis.analysis
            );
            record.confidence = parseFloat(serverAnalysis.confidence) || 0;
            record.audioUri = '';
            record.audioDuration = serverAnalysis.audio_duration || 0;
            record.createdAt = serverCreated || Date.now();
            record.synced = true;
            record.serverId = serverId || clientId || '';
          });
        });
        downloaded += 1;
      }
    }
  } catch (error) {
    console.error('Sync error:', error.message);
    throw error;
  }

  return { uploaded, downloaded };
}

export default syncData;
