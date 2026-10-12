import type { Course } from '../services/courseService';
import type { Term } from '../types/course';

interface CourseListProps {
  courses: Record<string, Course>;
  selectedTerm: Term;
}

export const CourseList = ({ courses, selectedTerm }: CourseListProps) => {
  const filteredCourses = Object.keys(courses).filter(
    (key) => courses[key].term === selectedTerm,
  );

  if (filteredCourses.length === 0) {
    return (
      <p className="rounded-md border border-dashed border-stone-300 p-8 text-center text-stone-600">
        No {selectedTerm.toLowerCase()} classes are available.
      </p>
    );
  }

  return (
    <ul className="grid w-full grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
      {filteredCourses.map((key) => {
        const course = courses[key];

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
  );
};
