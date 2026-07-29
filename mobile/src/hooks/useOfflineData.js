import { useEffect, useState } from 'react';
import { Q } from '@nozbe/watermelondb';
import database from '../database';

export function useAnalysisHistory(userId) {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    if (!userId) {
      setRecords([]);
      return undefined;
    }

    const subscription = database
      .get('analyses')
      .query(Q.where('user_id', userId), Q.sortBy('created_at', Q.desc))
      .observe()
      .subscribe(setRecords);

    return () => subscription.unsubscribe();
  }, [userId]);

  return records;
}

export function useOfflineAnalyses(userId) {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const query = userId
      ? database
        .get('analyses')
        .query(Q.where('user_id', userId), Q.where('synced', false))
      : database.get('analyses').query(Q.where('synced', false));

    const subscription = query.observe().subscribe(setRecords);
    return () => subscription.unsubscribe();
  }, [userId]);

  return records;
}

export function useSyncStats(userId) {
  const offline = useOfflineAnalyses(userId);
  const history = useAnalysisHistory(userId);

  return {
    unsyncedCount: offline.length,
    totalCount: history.length,
    offlineRecords: offline,
  };
}
