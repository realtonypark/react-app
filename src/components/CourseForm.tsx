import type { Course } from '../services/courseService';

interface CourseFormProps {
  course: Course;
  onCancel: () => void;
}

export const CourseForm = ({ course, onCancel }: CourseFormProps) => (
  <form
    onSubmit={() => {}}
    className="mx-auto max-w-xl rounded-lg border border-stone-200 bg-white p-8 shadow-sm"
  >
    <div className="mb-8">
      <p className="text-sm font-medium uppercase tracking-[0.18em] text-stone-600">
        Edit course
      </p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight">
        {course.term} CS {course.number}
      </h2>
    </div>

    <div className="space-y-5">
      <label className="block">
        <span className="mb-2 block text-sm font-medium text-stone-800">Title</span>
        <input
          type="text"
          name="title"
          defaultValue={course.title}
          className="w-full rounded-md border border-stone-300 px-3 py-2 text-stone-950 shadow-sm outline-none focus:border-stone-950 focus:ring-2 focus:ring-stone-200"
        />
      </label>
      <label className="block">
        <span className="mb-2 block text-sm font-medium text-stone-800">
          Meeting times
        </span>
        <input
          type="text"
          name="meets"
          defaultValue={course.meets}
          className="w-full rounded-md border border-stone-300 px-3 py-2 text-stone-950 shadow-sm outline-none focus:border-stone-950 focus:ring-2 focus:ring-stone-200"
        />
      </label>
    </div>

    <button
      type="button"
      onClick={onCancel}
      className="mt-8 rounded-lg border border-stone-300 px-5 py-2 text-sm font-medium text-stone-800 transition-colors hover:bg-stone-100"
    >
      Cancel
    </button>
  </form>
);
