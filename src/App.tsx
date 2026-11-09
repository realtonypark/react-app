import { useEffect, useState } from 'react';
import { fetchCourses, type Schedule } from './services/courseService';
import { AuthBanner } from './components/AuthBanner';
import { TermPage } from './components/TermPage';
import { useAuth } from './hooks/useAuth';
import './App.css';

const App = () => {
  const scheduleId = 'CS-2018-2019';
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isLoading: isAuthLoading } = useAuth();

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
    <>
      <AuthBanner user={user} />
      {isLoading || isAuthLoading ? (
        <main className="p-8">Loading courses...</main>
      ) : error ? (
        <main className="p-8 text-red-700">Error: {error}</main>
      ) : !schedule ? (
        <main className="p-8">No courses found.</main>
      ) : (
        <TermPage
          schedule={schedule}
          scheduleId={scheduleId}
          canEdit={user !== null}
        />
      )}
    </>
  );
};

export default App;