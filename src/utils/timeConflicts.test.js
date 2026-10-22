import { describe, expect, it } from 'vitest';
import { hasTimeConflict } from './timeConflicts';

const course = (term, meets) => ({ term, number: '101', title: 'Test', meets });

describe('hasTimeConflict', () => {
  it('detects overlapping times on a shared day in the same term', () => {
    expect(
      hasTimeConflict(course('Fall', 'MWF 9:00-9:50'), [
        course('Fall', 'W 9:30-10:20'),
      ]),
    ).toBe(true);
  });

  it('requires the same term', () => {
    expect(
      hasTimeConflict(course('Fall', 'MWF 9:00-9:50'), [
        course('Winter', 'MWF 9:00-9:50'),
      ]),
    ).toBe(false);
  });

  it('requires a shared day', () => {
    expect(
      hasTimeConflict(course('Fall', 'MW 9:00-9:50'), [
        course('Fall', 'TuTh 9:00-9:50'),
      ]),
    ).toBe(false);
  });

  it('allows classes that meet back to back', () => {
    expect(
      hasTimeConflict(course('Fall', 'MWF 9:00-9:50'), [
        course('Fall', 'MWF 9:50-10:40'),
      ]),
    ).toBe(false);
  });

  it('parses multi-letter day abbreviations', () => {
    expect(
      hasTimeConflict(course('Spring', 'TuTh 14:00-15:20'), [
        course('Spring', 'Th 15:00-16:00'),
      ]),
    ).toBe(true);
  });

  it('never conflicts when either meeting time is empty', () => {
    expect(hasTimeConflict(course('Fall', ''), [course('Fall', 'MWF 9:00-9:50')])).toBe(false);
    expect(hasTimeConflict(course('Fall', 'MWF 9:00-9:50'), [course('Fall', '')])).toBe(false);
  });
});
