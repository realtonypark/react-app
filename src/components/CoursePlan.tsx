import type { Course } from '../services/courseService';

interface CoursePlanProps {
  courses: Record<string, Course>;
  selectedClasses: string[];
  onClose: () => void;
}

export const CoursePlan = ({
  courses,
  selectedClasses,
  onClose,
}: CoursePlanProps) => (
  <div
    className="fixed inset-0 z-10 flex items-center justify-center bg-stone-950/40 p-6"
    onClick={onClose}
  >
    <div
      role="dialog"
      aria-label="Course plan"
      className="w-full max-w-lg rounded-lg bg-white p-8 shadow-xl"
      onClick={(event) => event.stopPropagation()}
    >
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-2xl font-semibold tracking-tight">Course plan</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close course plan"
          className="rounded-md px-2 py-1 text-sm font-medium text-stone-600 hover:bg-stone-100 hover:text-stone-950"
        >
          Close ✕
        </button>
      </div>

      {selectedClasses.length === 0 ? (
        <p className="mt-4 text-stone-700">
          You have not selected any classes. To select one, click a course card
          in the list below.
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-stone-200">
          {selectedClasses.map((key) => {
            const course = courses[key];

            return (
              <li key={key} className="py-3">
                <p className="font-medium">
                  CS {course.number}: {course.title}
                </p>
                <p className="mt-1 text-sm text-stone-700">{course.meets}</p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  </div>
);
