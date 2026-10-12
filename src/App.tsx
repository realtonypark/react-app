import { useEffect, useState } from 'react';
import { fetchCourses, type Schedule } from './services/courseService';
import { TermPage } from './components/TermPage';
import './App.css';

const App = () => {
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const loadCourses = async () => {
      try {
        const data = await fetchCourses(controller.signal);
        const selectedSchedule = data.schedules['CS-2018-2019'];

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
  }, []);

  if (isLoading) {
    return <main className="p-8">Loading courses...</main>;
  }

  if (error) {
    return <main className="p-8 text-red-700">Error: {error}</main>;
  }

  if (!schedule) {
    return <main className="p-8">No courses found.</main>;
  }

  return <TermPage schedule={schedule} />;
};

export default App;