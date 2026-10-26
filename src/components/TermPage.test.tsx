import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { Schedule } from '../services/courseService';
import { TermPage } from './TermPage';

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
    render(<TermPage schedule={schedule} />);

    fireEvent.click(screen.getAllByRole('button', { name: 'Edit' })[0]);

    expect(screen.getByRole('heading', { name: 'Fall CS 101' })).toBeVisible();
    expect(screen.getByLabelText('Title')).toHaveValue('Alpha');
    expect(screen.getByLabelText('Meeting times')).toHaveValue('MWF 9:00-9:50');
    expect(screen.queryByRole('button', { name: 'Course plan' })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(screen.getByRole('button', { name: /Fall CS 101: Alpha/ })).toBeVisible();
    expect(screen.queryByLabelText('Meeting times')).not.toBeInTheDocument();
  });
});
