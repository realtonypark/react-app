import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { Course } from '../services/courseService';
import { CourseForm } from './CourseForm';

const course: Course = {
  term: 'Fall',
  number: '101',
  title: 'Alpha',
  meets: 'MWF 9:00-9:50',
};

const renderForm = (onSubmit: (updatedCourse: Course) => Promise<void>) =>
  render(<CourseForm course={course} onCancel={vi.fn()} onSubmit={onSubmit} />);

describe('CourseForm submission', () => {
  it('does not submit when there are no changes', () => {
    const onSubmit = vi.fn(async () => {});
    const { container } = renderForm(onSubmit);

    fireEvent.submit(container.querySelector('form')!);

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Change at least one value before submitting.',
    );
  });

  it('does not submit invalid values', () => {
    const onSubmit = vi.fn(async () => {});
    const { container } = renderForm(onSubmit);

    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'X' } });
    fireEvent.submit(container.querySelector('form')!);

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText('must contain at least two characters')).toBeVisible();
  });

  it('submits the changed course', async () => {
    const onSubmit = vi.fn(async () => {});
    const { container } = renderForm(onSubmit);

    fireEvent.change(screen.getByLabelText('Title'), {
      target: { value: 'Updated Alpha' },
    });
    fireEvent.submit(container.querySelector('form')!);

    await vi.waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        ...course,
        title: 'Updated Alpha',
      });
    });
  });
});
