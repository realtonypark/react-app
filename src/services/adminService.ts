import { get, ref } from 'firebase/database';
import { realtimeDb } from './firebase';

export const fetchAdminStatus = async (uid: string): Promise<boolean> => {
  const snapshot = await get(ref(realtimeDb, `admins/${uid}`));
  return snapshot.val() === true;
};
