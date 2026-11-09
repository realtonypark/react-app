import { useState, type FormEvent } from 'react';
import type { Course } from '../services/courseService';
import {
  courseResolver,
  courseToFormData,
  type CourseFormData,
} from '../utils/courseValidation';

interface CourseFormProps {
  course: Course;
  onCancel: () => void;
  onSubmit: (course: Course) => Promise<void>;
}

export const CourseForm = ({ course, onCancel, onSubmit }: CourseFormProps) => {
  const initialValues = courseToFormData(course);
  const [values, setValues] = useState<CourseFormData>(initialValues);
  const [errors, setErrors] = useState(() => courseResolver(courseToFormData(course)).errors);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field: keyof CourseFormData, value: string) => {
    const nextValues = { ...values, [field]: value };
    setValues(nextValues);
    setErrors(courseResolver(nextValues).errors);
    setSubmitError(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = courseResolver(values);
    setErrors(result.errors);
    const hasChanges = Object.keys(initialValues).some((field) => {
      const key = field as keyof CourseFormData;
      return initialValues[key] !== values[key];
    });

    if (Object.keys(result.errors).length > 0 || !hasChanges) {
      if (Object.keys(result.errors).length === 0) {
        setSubmitError('Change at least one value before submitting.');
      }
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await onSubmit({ ...course, ...values });
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Unable to save course.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldClassName =
    'w-full rounded-md border border-stone-300 px-3 py-2 text-stone-950 shadow-sm outline-none focus:border-stone-950 focus:ring-2 focus:ring-stone-200';

  return (
    <form
      onSubmit={(event) => void handleSubmit(event)}
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

      {submitError && (
        <p role="alert" className="mt-5 text-sm text-red-700">
          {submitError}
        </p>
      )}

      <button
        type="button"
        onClick={onCancel}
        disabled={isSubmitting}
        className="mt-8 rounded-lg border border-stone-300 px-5 py-2 text-sm font-medium text-stone-800 transition-colors hover:bg-stone-100"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={isSubmitting}
        className="ml-3 mt-8 rounded-lg bg-stone-950 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-stone-800 disabled:opacity-50"
      >
        {isSubmitting ? 'Saving...' : 'Submit'}
      </button>
    </form>
  );
};
