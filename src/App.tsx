import { useEffect, useState } from 'react';
import { fetchCourses, type Schedule } from './services/courseService';
import { AuthBanner } from './components/AuthBanner';
import { TermPage } from './components/TermPage';
import { useAuth } from './hooks/useAuth';
import { useAdminStatus } from './hooks/useAdminStatus';
import './App.css';

const App = () => {
  const scheduleId = 'CS-2018-2019';
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem('theme') === 'dark',
  );
  const { user, isLoading: isAuthLoading } = useAuth();
  const {
    isAdmin,
    isLoading: isAdminLoading,
    error: adminError,
  } = useAdminStatus(user);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    const controller = new AbortController();

    const loadCourses = async () => {
      try {
        const data = await fetchCourses(controller.signal);
        const selectedSchedule = data.schedules[scheduleId];

        if (!selectedSchedule) {
          throw new Error('The course schedule was not found.');
        }

        setSchedule(selectedSchedule);
      } catch (requestError) {
        if (controller.signal.aborted) {
          return;
        }

        setError(
          requestError instanceof Error
            ? requestError.message
            : 'Unable to load courses.',
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    void loadCourses();

    return () => {
      controller.abort();
    };
  }, [scheduleId]);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-950 dark:bg-stone-950 dark:text-stone-100">
      <AuthBanner user={user} />
      {isLoading || isAuthLoading || isAdminLoading ? (
        <main className="p-8">Loading courses...</main>
      ) : error ? (
        <main className="p-8 text-red-700">Error: {error}</main>
      ) : adminError ? (
        <main className="p-8 text-red-700">Error: {adminError}</main>
      ) : !schedule ? (
        <main className="p-8">No courses found.</main>
      ) : (
        <TermPage
          schedule={schedule}
          scheduleId={scheduleId}
          canEdit={isAdmin}
          userId={user?.uid}
        />
      )}
      <button
        type="button"
        onClick={() => setIsDarkMode((currentMode) => !currentMode)}
        aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        aria-pressed={isDarkMode}
        className="fixed bottom-5 left-5 z-20 rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-900 shadow-md transition-colors hover:bg-stone-100 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 dark:hover:bg-stone-700"
      >
        {isDarkMode ? '☀️ Light mode' : '🌙 Dark mode'}
      </button>
    </div>
  );
};

export default App;