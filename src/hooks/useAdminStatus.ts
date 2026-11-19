import { useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import { fetchAdminStatus } from '../services/adminService';

interface AdminStatus {
  isAdmin: boolean;
  isLoading: boolean;
  error: string | null;
}

interface LoadedAdminStatus {
  uid: string;
  isAdmin: boolean;
  error: string | null;
}

export const useAdminStatus = (user: User | null): AdminStatus => {
  const [status, setStatus] = useState<LoadedAdminStatus | null>(null);

  useEffect(() => {
    let isCurrent = true;

    if (!user) {
      return () => {
        isCurrent = false;
      };
    }

    const loadAdminStatus = async () => {
      try {
        const isAdmin = await fetchAdminStatus(user.uid);
        if (isCurrent) {
          setStatus({ uid: user.uid, isAdmin, error: null });
        }
      } catch (requestError) {
        if (isCurrent) {
          setStatus({
            uid: user.uid,
            isAdmin: false,
            error:
              requestError instanceof Error
                ? requestError.message
                : 'Unable to load administrator status.',
          });
        }
      }
    };

    void loadAdminStatus();

    return () => {
      isCurrent = false;
    };
  }, [user]);

  const isCurrentUserStatus = user !== null && status?.uid === user.uid;
  return {
    isAdmin: isCurrentUserStatus ? status.isAdmin : false,
    isLoading: user !== null && !isCurrentUserStatus,
    error: isCurrentUserStatus ? status.error : null,
  };
};
