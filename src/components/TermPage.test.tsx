import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { Schedule } from '../services/courseService';
import { TermPage } from './TermPage';

vi.mock('../services/courseService', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('../services/courseService')>();
  return {
    ...actual,
    fetchCourseNotes: vi.fn().mockResolvedValue({}),
    saveCourseNote: vi.fn(
      async (_scheduleId: string, _userId: string, _courseKey: string, text: string) =>
        ({ text: text.trim(), updatedAt: '2026-11-23T20:20:40.682Z' }),
    ),
    deleteCourseNote: vi.fn().mockResolvedValue(undefined),
  };
});

const schedule: Schedule = {
  title: 'Test schedule',
  courses: {
    alpha: { term: 'Fall', number: '101', title: 'Alpha', meets: 'MWF 9:00-9:50' },
    beta: { term: 'Fall', number: '102', title: 'Beta', meets: 'MW 9:30-10:20' },
    gamma: { term: 'Fall', number: '103', title: 'Gamma', meets: 'TuTh 14:00-15:20' },
  },
};

const card = (title: string) =>
  screen.getByRole('button', { name: new RegExp(title) });

describe('TermPage time conflicts', () => {
  it('exports the selected courses as a text file', () => {
    const createObjectURL = vi.fn(() => 'blob:test');
    const revokeObjectURL = vi.fn();
    Object.defineProperty(URL, 'createObjectURL', {
      configurable: true,
      value: createObjectURL,
    });
    Object.defineProperty(URL, 'revokeObjectURL', {
      configurable: true,
      value: revokeObjectURL,
    });
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click');

    render(<TermPage schedule={schedule} />);
    fireEvent.click(card('Alpha'));
    fireEvent.click(screen.getByRole('button', { name: 'Export .txt' }));

    expect(createObjectURL).toHaveBeenCalledOnce();
    expect(click).toHaveBeenCalledOnce();
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:test');

    click.mockRestore();
  });

  it('blocks conflicting classes and allows unselecting', () => {
    render(<TermPage schedule={schedule} />);

    fireEvent.click(card('Alpha'));

    expect(card('Alpha')).toHaveAttribute('aria-pressed', 'true');
    expect(card('Beta')).toBeDisabled();
    expect(card('Gamma')).not.toBeDisabled();

    fireEvent.click(card('Beta'));
    expect(card('Beta')).toHaveAttribute('aria-pressed', 'false');

    fireEvent.click(card('Alpha'));
    expect(card('Alpha')).toHaveAttribute('aria-pressed', 'false');
    expect(card('Beta')).not.toBeDisabled();
  });

  it('opens a course form with the selected course data and cancels back to the list', () => {
    render(<TermPage schedule={schedule} canEdit />);

    fireEvent.click(screen.getAllByRole('button', { name: 'Edit' })[0]);

    expect(screen.getByRole('heading', { name: 'Fall CS 101' })).toBeVisible();
    expect(screen.getByLabelText('Title')).toHaveValue('Alpha');
    expect(screen.getByLabelText('Meeting times')).toHaveValue('MWF 9:00-9:50');
    expect(screen.queryByRole('button', { name: 'Course plan' })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(screen.getByRole('button', { name: /Fall CS 101: Alpha/ })).toBeVisible();
    expect(screen.queryByLabelText('Meeting times')).not.toBeInTheDocument();
  });

  it('shows field feedback as course form values become invalid', () => {
    render(<TermPage schedule={schedule} canEdit />);

    fireEvent.click(screen.getAllByRole('button', { name: 'Edit' })[0]);
    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'X' } });
    fireEvent.change(screen.getByLabelText('Meeting times'), {
      target: { value: 'MWF' },
    });

    expect(screen.getByText('must contain at least two characters')).toBeVisible();
    expect(
      screen.getByText('must contain days and start-end, e.g., MWF 12:00-13:20'),
    ).toBeVisible();
    expect(screen.getByRole('textbox', { name: /^Title/ })).toHaveAttribute(
      'aria-invalid',
      'true',
    );
  });

  it('hides edit controls for signed-out users', () => {
    render(<TermPage schedule={schedule} />);

    expect(screen.queryByRole('button', { name: 'Edit' })).not.toBeInTheDocument();
  });

  it('creates, edits, and deletes a personal course note', async () => {
    render(<TermPage schedule={schedule} userId="test-user" />);

    await waitFor(() =>
      expect(screen.getAllByRole('button', { name: 'Add note' })).toHaveLength(3),
    );

    fireEvent.click(screen.getAllByRole('button', { name: 'Add note' })[0]);
    fireEvent.change(screen.getByLabelText('Note for Fall CS 101'), {
      target: { value: 'Review linked lists before the exam.' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Save note' }));

    expect(await screen.findByRole('button', { name: 'Edit note' })).toBeVisible();
    expect(screen.getByText('Review linked lists before the exam.')).toBeVisible();

    fireEvent.click(screen.getByRole('button', { name: 'Edit note' }));
    fireEvent.change(screen.getByLabelText('Note for Fall CS 101'), {
      target: { value: 'Updated note.' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Save note' }));

    expect(await screen.findByRole('button', { name: 'Edit note' })).toBeVisible();
    expect(screen.getByText('Updated note.')).toBeVisible();

    fireEvent.click(screen.getByRole('button', { name: 'Delete note' }));

    await waitFor(() =>
      expect(screen.getAllByRole('button', { name: 'Add note' })).toHaveLength(3),
    );
  });
});
