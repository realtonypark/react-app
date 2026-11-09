import { useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import { subscribeToAuthState } from '../services/authService';

interface AuthState {
  user: User | null;
  isLoading: boolean;
}

export const useAuth = (): AuthState => {
  const [state, setState] = useState<AuthState>({ user: null, isLoading: true });

  useEffect(() => {
    const unsubscribe = subscribeToAuthState((user) => {
      setState({ user, isLoading: false });
    });

    return unsubscribe;
  }, []);

  return state;
};
