import type { Course } from '../services/courseService';
import type { CourseNote as CourseNoteData } from '../services/courseService';
import type { Term } from '../types/course';
import { hasTimeConflict } from '../utils/timeConflicts';
import { CourseNote } from './CourseNote';

interface CourseListProps {
  courses: Record<string, Course>;
  selectedTerm: Term;
  selectedClasses: string[];
  onClassToggle: (courseKey: string) => void;
  onEditCourse: (courseKey: string) => void;
  canEdit: boolean;
  userId?: string;
  notes: Record<string, CourseNoteData>;
  onSaveNote: (courseKey: string, text: string) => Promise<void>;
  onDeleteNote: (courseKey: string) => Promise<void>;
}

export const CourseList = ({
  courses,
  selectedTerm,
  selectedClasses,
  onClassToggle,
  onEditCourse,
  canEdit,
  userId,
  notes,
  onSaveNote,
  onDeleteNote,
}: CourseListProps) => {
  const filteredCourses = Object.keys(courses).filter(
    (key) => courses[key].term === selectedTerm,
  );
  const selectedCourses = selectedClasses.map((key) => courses[key]);

  if (filteredCourses.length === 0) {
    return (
      <p className="rounded-md border border-dashed border-stone-300 p-8 text-center text-stone-600 dark:border-stone-700 dark:text-stone-400">
        No {selectedTerm.toLowerCase()} classes are available.
      </p>
    );
  }

  return (
    <ul className="grid w-full grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
      {filteredCourses.map((key) => {
        const course = courses[key];
        const isSelected = selectedClasses.indexOf(key) !== -1;
        const isConflicting = !isSelected && hasTimeConflict(course, selectedCourses);

        return (
          <li
            key={key}
            className={`flex min-w-0 flex-col rounded-md border shadow-sm transition-colors ${
              isSelected
                ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950'
                : isConflicting
                  ? 'border-stone-200 bg-stone-100 dark:border-stone-800 dark:bg-stone-900'
                  : 'border-stone-300 bg-white dark:border-stone-700 dark:bg-stone-900'
            }`}
          >
            <button
              type="button"
              aria-pressed={isSelected}
              aria-label={`${course.term} CS ${course.number}: ${course.title}${
                isConflicting ? ', time conflict with a selected class' : ''
              }`}
              disabled={isConflicting}
              onClick={() => onClassToggle(key)}
              className={`flex min-h-[204px] w-full flex-col px-6 py-6 text-left ${
                isConflicting ? 'cursor-not-allowed opacity-40' : ''
              }`}
            >
              <span className="flex items-start justify-between gap-3">
                <h2 className="text-xl font-medium leading-tight">
                  {course.term} CS {course.number}
                </h2>
                {isSelected && (
                  <span
                    aria-hidden="true"
                    className="text-xl font-bold text-emerald-700 dark:text-emerald-400"
                  >
                    ✓
                  </span>
                )}
                {isConflicting && (
                  <span aria-hidden="true" className="text-xl font-bold text-stone-500">
                    ✕
                  </span>
                )}
              </span>
              <p className="mt-2 flex-1 text-[15px] leading-[1.4] text-stone-800 dark:text-stone-200">
                {course.title}
              </p>
              <p className="mt-4 border-t border-stone-300 pt-3 text-sm text-stone-700 dark:border-stone-700 dark:text-stone-300">
                {course.meets}
              </p>
            </button>
            {canEdit && (
              <button
                type="button"
                onClick={() => onEditCourse(key)}
                className="mx-6 mb-5 rounded-md border border-stone-300 px-3 py-2 text-sm font-medium text-stone-800 transition-colors hover:bg-stone-100 dark:border-stone-700 dark:text-stone-200 dark:hover:bg-stone-800"
              >
                Edit
              </button>
            )}
            <CourseNote
              courseTitle={`${course.term} CS ${course.number}`}
              note={notes[key]}
              isSignedIn={Boolean(userId)}
              onSave={(text) => onSaveNote(key, text)}
              onDelete={() => onDeleteNote(key)}
            />
          </li>
        );
      })}
    </ul>
  );
};
