import { collection, getDocs } from 'firebase/firestore';
import { ref, update } from 'firebase/database';
import { db, realtimeDb } from './firebase';

export interface Course {
  term: string;
  number: string;
  meets: string;
  title: string;
}

export interface Schedule {
  title: string;
  courses: Record<string, Course>;
}

export interface CourseData {
  schedules: Record<string, Schedule>;
}

const isCourse = (value: unknown): value is Course => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const course = value as Record<string, unknown>;
  return (
    typeof course.term === 'string' &&
    typeof course.number === 'string' &&
    typeof course.meets === 'string' &&
    typeof course.title === 'string'
  );
};

const parseSchedule = (value: unknown): Schedule => {
  if (!value || typeof value !== 'object') {
    throw new Error('Firestore returned an invalid course schedule.');
  }

  const schedule = value as Record<string, unknown>;
  if (typeof schedule.title !== 'string' || !schedule.courses) {
    throw new Error('Firestore returned an invalid course schedule.');
  }

  if (typeof schedule.courses !== 'object' || schedule.courses === null) {
    throw new Error('Firestore returned an invalid course schedule.');
  }

  const rawCourses = schedule.courses as Record<string, unknown>;
  const courses: Record<string, Course> = {};
  for (const id of Object.keys(rawCourses)) {
    const course = rawCourses[id];
    if (!isCourse(course)) {
      throw new Error(`Firestore returned invalid data for course ${id}.`);
    }
    courses[id] = course;
  }

  return { title: schedule.title, courses };
};

export const fetchCourses = async (signal?: AbortSignal): Promise<CourseData> => {
  if (signal?.aborted) {
    throw new DOMException('The course request was aborted.', 'AbortError');
  }

  const snapshot = await getDocs(collection(db, 'schedules'));
  if (signal?.aborted) {
    throw new DOMException('The course request was aborted.', 'AbortError');
  }

  const schedules: Record<string, Schedule> = {};
  snapshot.forEach((scheduleDocument) => {
    schedules[scheduleDocument.id] = parseSchedule(scheduleDocument.data());
  });

  return { schedules };
};

export const saveCourse = async (
  scheduleId: string,
  courseKey: string,
  course: Course,
): Promise<void> => {
  await update(ref(realtimeDb, `schedules/${scheduleId}/courses/${courseKey}`), course);
};
