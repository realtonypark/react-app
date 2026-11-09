import { useState } from 'react';
import { signInWithGoogle, signOutUser } from '../services/authService';
import type { User } from 'firebase/auth';

interface AuthBannerProps {
  user: User | null;
}

export const AuthBanner = ({ user }: AuthBannerProps) => {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignIn = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch (signInError) {
      setError(
        signInError instanceof Error ? signInError.message : 'Unable to sign in.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      await signOutUser();
    } catch (signOutError) {
      setError(
        signOutError instanceof Error ? signOutError.message : 'Unable to sign out.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <header className="flex items-center justify-between gap-4 border-b border-stone-200 bg-white px-8 py-3 text-sm">
      {user ? (
        <p className="text-stone-700">
          Signed in as <span className="font-medium">{user.displayName ?? user.email}</span>
        </p>
      ) : (
        <p className="text-stone-700">Sign in to edit course information.</p>
      )}
      <button
        type="button"
        onClick={() => void (user ? handleSignOut() : handleSignIn())}
        disabled={isSubmitting}
        className="rounded-md border border-stone-300 px-3 py-2 font-medium text-stone-800 transition-colors hover:bg-stone-100 disabled:opacity-50"
      >
        {isSubmitting ? 'Working...' : user ? 'Sign out' : 'Sign in with Google'}
      </button>
      {error && (
        <p role="alert" className="text-red-700">
          {error}
        </p>
      )}
    </header>
  );
};
