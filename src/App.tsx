import { useEffect, useState } from 'react';
import './App.css';
import { fetchCourses, type Schedule } from './services/courseService';

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

  return (
    <main className="min-h-screen bg-stone-50 px-8 py-10 text-stone-950">
      <h1 className="mb-12 text-3xl font-semibold tracking-tight">{schedule.title}</h1>
      <ul className="grid w-full grid-cols-4 gap-3">
        {Object.keys(schedule.courses).map((key) => {
          const course = schedule.courses[key];
          return (
            <li
              key={key}
              className="flex min-h-[204px] min-w-0 flex-col rounded-md border border-stone-300 bg-white px-6 py-6 shadow-sm"
            >
              <h2 className="text-xl font-medium leading-tight">
                {course.term} CS {course.number}
              </h2>
              <p className="mt-2 flex-1 text-[15px] leading-[1.4] text-stone-800">{course.title}</p>
              <p className="mt-4 border-t border-stone-300 pt-3 text-sm text-stone-700">{course.meets}</p>
            </li>
          );
        })}
      </ul>
    </main>
  );
};

export default App;