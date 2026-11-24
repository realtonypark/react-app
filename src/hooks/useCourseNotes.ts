import { useEffect, useState } from 'react';
import {
  deleteCourseNote,
  fetchCourseNotes,
  saveCourseNote,
  type CourseNote,
} from '../services/courseService';

interface CourseNotesState {
  notes: Record<string, CourseNote>;
  isLoading: boolean;
  error: string | null;
  saveNote: (courseKey: string, text: string) => Promise<void>;
  removeNote: (courseKey: string) => Promise<void>;
}

export const useCourseNotes = (
  scheduleId: string,
  userId: string | undefined,
): CourseNotesState => {
  const [notes, setNotes] = useState<Record<string, CourseNote>>({});
  const [isLoading, setIsLoading] = useState(Boolean(userId));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      queueMicrotask(() => {
        setNotes({});
        setIsLoading(false);
        setError(null);
      });
      return;
    }

    let isCurrent = true;

    const loadNotes = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const loadedNotes = await fetchCourseNotes(scheduleId, userId);
        if (isCurrent) {
          setNotes(loadedNotes);
        }
      } catch (requestError) {
        if (isCurrent) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : 'Unable to load course notes.',
          );
        }
      } finally {
        if (isCurrent) {
          setIsLoading(false);
        }
      }
    };

    void loadNotes();
    return () => {
      isCurrent = false;
    };
  }, [scheduleId, userId]);

  const saveNote = async (courseKey: string, text: string) => {
    if (!userId) {
      throw new Error('Sign in to add a course note.');
    }
    if (!text.trim()) {
      throw new Error('A course note cannot be empty.');
    }

    const note = await saveCourseNote(scheduleId, userId, courseKey, text);
    setNotes((currentNotes) => ({ ...currentNotes, [courseKey]: note }));
  };

  const removeNote = async (courseKey: string) => {
    if (!userId) {
      throw new Error('Sign in to delete a course note.');
    }

    await deleteCourseNote(scheduleId, userId, courseKey);
    setNotes((currentNotes) => {
      const nextNotes = { ...currentNotes };
      delete nextNotes[courseKey];
      return nextNotes;
    });
  };

  return { notes, isLoading, error, saveNote, removeNote };
};
