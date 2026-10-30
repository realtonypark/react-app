import type { Course } from '../services/courseService';

export interface CourseFormData {
  title: string;
  term: string;
  number: string;
  meets: string;
}

export type CourseField = keyof CourseFormData;

export type CourseFormErrors = Partial<Record<CourseField, string>>;

export interface CourseResolverResult {
  values: CourseFormData | Record<string, never>;
  errors: CourseFormErrors;
}

export const courseSchema: Record<CourseField, (value: string) => string | undefined> = {
  title: (value) =>
    value.trim().length >= 2 ? undefined : 'must contain at least two characters',
  term: (value) =>
    /^(Fall|Winter|Spring|Summer)$/.test(value)
      ? undefined
      : 'must be Fall, Winter, Spring, or Summer',
  number: (value) =>
    /^\d+(?:-\d+)?$/.test(value)
      ? undefined
      : 'must be a number with an optional section, e.g., 213-2',
  meets: (value) => {
    if (value === '') {
      return undefined;
    }

    const match = /^((?:Su|Sa|Th|Tu|M|W|F)+) ((?:[01]?\d|2[0-3]):[0-5]\d)-((?:[01]?\d|2[0-3]):[0-5]\d)$/.exec(
      value,
    );

    if (!match) {
      return 'must contain days and start-end, e.g., MWF 12:00-13:20';
    }

    const toMinutes = (time: string) => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    };

    return toMinutes(match[2]) < toMinutes(match[3])
      ? undefined
      : 'must have a start time before the end time';
  },
};

export const courseResolver = (data: CourseFormData): CourseResolverResult => {
  const errors = Object.keys(courseSchema).reduce<CourseFormErrors>(
    (currentErrors, field) => {
      const courseField = field as CourseField;
      const message = courseSchema[courseField](data[courseField]);

      if (message) {
        currentErrors[courseField] = message;
      }

      return currentErrors;
    },
    {},
  );

  return Object.keys(errors).length > 0
    ? { values: {}, errors }
    : { values: data, errors: {} };
};

export const courseToFormData = ({
  title,
  term,
  number,
  meets,
}: Course): CourseFormData => ({
  title,
  term,
  number,
  meets,
});
