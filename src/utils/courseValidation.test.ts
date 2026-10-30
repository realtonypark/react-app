import { describe, expect, it } from 'vitest';
import { courseResolver } from './courseValidation';

const validCourse = {
  title: 'Artificial Intelligence',
  term: 'Fall',
  number: '213-2',
  meets: 'MWF 12:00-13:20',
};

describe('courseResolver', () => {
  it('accepts valid course data and an empty meeting time', () => {
    expect(courseResolver(validCourse)).toEqual({
      values: validCourse,
      errors: {},
    });
    expect(courseResolver({ ...validCourse, meets: '' }).errors).toEqual({});
  });

  it('reports an error for every invalid field', () => {
    const result = courseResolver({
      title: 'X',
      term: 'Autumn',
      number: '213-section',
      meets: 'MWF 13:20-12:00',
    });

    expect(result.values).toEqual({});
    expect(result.errors).toEqual({
      title: 'must contain at least two characters',
      term: 'must be Fall, Winter, Spring, or Summer',
      number: 'must be a number with an optional section, e.g., 213-2',
      meets: 'must have a start time before the end time',
    });
  });

  it.each(['MWF', 'MWF 12:00-', '12:00-13:20', 'X 12:00-13:20'])(
    'rejects malformed meeting time %s',
    (meets) => {
      expect(courseResolver({ ...validCourse, meets }).errors.meets).toBe(
        'must contain days and start-end, e.g., MWF 12:00-13:20',
      );
    },
  );
});
