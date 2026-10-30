import { useState } from 'react';
import type { Course } from '../services/courseService';
import {
  courseResolver,
  courseToFormData,
  type CourseFormData,
} from '../utils/courseValidation';

interface CourseFormProps {
  course: Course;
  onCancel: () => void;
}

export const CourseForm = ({ course, onCancel }: CourseFormProps) => {
  const [values, setValues] = useState<CourseFormData>(courseToFormData(course));
  const [errors, setErrors] = useState(() => courseResolver(courseToFormData(course)).errors);

  const updateField = (field: keyof CourseFormData, value: string) => {
    const nextValues = { ...values, [field]: value };
    setValues(nextValues);
    setErrors(courseResolver(nextValues).errors);
  };

  const fieldClassName =
    'w-full rounded-md border border-stone-300 px-3 py-2 text-stone-950 shadow-sm outline-none focus:border-stone-950 focus:ring-2 focus:ring-stone-200';

  return (
    <form
      onSubmit={() => {}}
      className="mx-auto max-w-xl rounded-lg border border-stone-200 bg-white p-8 shadow-sm"
    >
      <div className="mb-8">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-stone-600">
          Edit course
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight">
          {values.term} CS {values.number}
        </h2>
      </div>

      <div className="space-y-5">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-stone-800">Title</span>
          <input
            type="text"
            id="title"
            name="title"
            value={values.title}
            aria-invalid={Boolean(errors.title)}
            aria-describedby={errors.title ? 'title-error' : undefined}
            onChange={(event) => updateField('title', event.target.value)}
            className={fieldClassName}
          />
          {errors.title && (
            <span id="title-error" className="mt-1 block text-sm text-red-700">
              {errors.title}
            </span>
          )}
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-stone-800">Term</span>
          <input
            type="text"
            id="term"
            name="term"
            value={values.term}
            aria-invalid={Boolean(errors.term)}
            aria-describedby={errors.term ? 'term-error' : undefined}
            onChange={(event) => updateField('term', event.target.value)}
            className={fieldClassName}
          />
          {errors.term && (
            <span id="term-error" className="mt-1 block text-sm text-red-700">
              {errors.term}
            </span>
          )}
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-stone-800">
            Course number
          </span>
          <input
            type="text"
            id="number"
            name="number"
            value={values.number}
            aria-invalid={Boolean(errors.number)}
            aria-describedby={errors.number ? 'number-error' : undefined}
            onChange={(event) => updateField('number', event.target.value)}
            className={fieldClassName}
          />
          {errors.number && (
            <span id="number-error" className="mt-1 block text-sm text-red-700">
              {errors.number}
            </span>
          )}
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-stone-800">
            Meeting times
          </span>
          <input
            type="text"
            id="meets"
            name="meets"
            value={values.meets}
            aria-invalid={Boolean(errors.meets)}
            aria-describedby={errors.meets ? 'meets-error' : undefined}
            onChange={(event) => updateField('meets', event.target.value)}
            className={fieldClassName}
          />
          {errors.meets && (
            <span id="meets-error" className="mt-1 block text-sm text-red-700">
              {errors.meets}
            </span>
          )}
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
};
