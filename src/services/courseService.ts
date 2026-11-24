import { collection, getDocs } from 'firebase/firestore';
import { get, ref, remove, set, update } from 'firebase/database';
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

export interface CourseNote {
  text: string;
  updatedAt: string;
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

export const fetchCourseNotes = async (
  scheduleId: string,
  userId: string,
): Promise<Record<string, CourseNote>> => {
  const snapshot = await get(ref(realtimeDb, `userNotes/${userId}/${scheduleId}`));
  if (!snapshot.exists()) {
    return {};
  }

  const value = snapshot.val();
  if (!value || typeof value !== 'object') {
    throw new Error('Firebase returned invalid course notes.');
  }

  const notes: Record<string, CourseNote> = {};
  for (const courseKey of Object.keys(value)) {
    const rawNote = value[courseKey];
    if (
      rawNote &&
      typeof rawNote === 'object' &&
      'text' in rawNote &&
      typeof rawNote.text === 'string' &&
      'updatedAt' in rawNote &&
      typeof rawNote.updatedAt === 'string'
    ) {
      notes[courseKey] = {
        text: rawNote.text,
        updatedAt: rawNote.updatedAt,
      };
    }
  }
  return notes;
};

export const saveCourseNote = async (
  scheduleId: string,
  userId: string,
  courseKey: string,
  text: string,
): Promise<CourseNote> => {
  const note = { text: text.trim(), updatedAt: new Date().toISOString() };
  await set(ref(realtimeDb, `userNotes/${userId}/${scheduleId}/${courseKey}`), note);
  return note;
};

export const deleteCourseNote = async (
  scheduleId: string,
  userId: string,
  courseKey: string,
): Promise<void> => {
  await remove(ref(realtimeDb, `userNotes/${userId}/${scheduleId}/${courseKey}`));
};
