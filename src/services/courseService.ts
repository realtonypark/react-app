const COURSES_URL =
  'https://courses.cs.northwestern.edu/394/guides/data/cs-courses-firestore.php';

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

export const fetchCourses = async (signal?: AbortSignal): Promise<CourseData> => {
  const response = await fetch(COURSES_URL, { signal });

  if (!response.ok) {
    throw new Error(`Course request failed with status ${response.status}.`);
  }

  return (await response.json()) as CourseData;
};
