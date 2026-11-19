import { describe, expect, it } from 'vitest';
import type { Course } from '../services/courseService';
import { formatScheduleText } from './exportSchedule';

describe('formatScheduleText', () => {
  it('lists selected courses and meeting times', () => {
    const courses: Course[] = [
      {
        term: 'Fall',
        number: '101',
        title: 'Alpha',
        meets: 'MWF 9:00-9:50',
      },
    ];

    expect(formatScheduleText('Test schedule', courses)).toBe(
      'Course Schedule: Test schedule\n\nSelected courses\nFall CS 101: Alpha\nMeeting: MWF 9:00-9:50\n',
    );
  });

  it('states when no courses are selected', () => {
    expect(formatScheduleText('Test schedule', [])).toBe(
      'Course Schedule: Test schedule\n\nSelected courses\nNo courses selected.\n',
    );
  });
});
