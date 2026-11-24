import { useState, type FormEvent } from 'react';
import type { CourseNote as CourseNoteData } from '../services/courseService';

interface CourseNoteProps {
  courseTitle: string;
  note?: CourseNoteData;
  isSignedIn: boolean;
  onSave: (text: string) => Promise<void>;
  onDelete: () => Promise<void>;
}

export const CourseNote = ({
  courseTitle,
  note,
  isSignedIn,
  onSave,
  onDelete,
}: CourseNoteProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(note?.text ?? '');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const startEditing = () => {
    setText(note?.text ?? '');
    setError(null);
    setIsEditing(true);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!text.trim()) {
      setError('A course note cannot be empty.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await onSave(text);
      setIsEditing(false);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Unable to save note.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      await onDelete();
      setText('');
      setIsEditing(false);
    } catch (deleteError) {
      setError(
        deleteError instanceof Error ? deleteError.message : 'Unable to delete note.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isSignedIn) {
    return null;
  }

  return (
    <div className="mx-6 mb-5 border-t border-stone-300 pt-4 dark:border-stone-700">
      {isEditing ? (
        <form onSubmit={(event) => void handleSubmit(event)}>
          <label>
            <span className="mb-2 block text-sm font-medium text-stone-800 dark:text-stone-200">
              Note for {courseTitle}
            </span>
            <textarea
              value={text}
              onChange={(event) => setText(event.target.value)}
              rows={4}
              className="w-full resize-y rounded-md border border-stone-300 px-3 py-2 text-sm text-stone-950 shadow-sm outline-none focus:border-stone-950 focus:ring-2 focus:ring-stone-200 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 dark:focus:border-stone-300 dark:focus:ring-stone-700"
            />
          </label>
          {error && (
            <p role="alert" className="mt-2 text-sm text-red-700">
              {error}
            </p>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md bg-stone-950 px-3 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-stone-100 dark:text-stone-950"
            >
              {isSubmitting ? 'Saving...' : 'Save note'}
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => setIsEditing(false)}
              className="rounded-md border border-stone-300 px-3 py-2 text-sm font-medium disabled:opacity-50 dark:border-stone-700"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          {note ? (
            <>
              <p className="whitespace-pre-wrap text-sm leading-6 text-stone-700 dark:text-stone-300">
                {note.text}
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={startEditing}
                  className="rounded-md border border-stone-300 px-3 py-2 text-sm font-medium text-stone-800 hover:bg-stone-100 dark:border-stone-700 dark:text-stone-200 dark:hover:bg-stone-800"
                >
                  Edit note
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => void handleDelete()}
                  className="rounded-md border border-red-300 px-3 py-2 text-sm font-medium text-red-700 disabled:opacity-50 dark:border-red-800 dark:text-red-300"
                >
                  {isSubmitting ? 'Deleting...' : 'Delete note'}
                </button>
              </div>
            </>
          ) : (
            <button
              type="button"
              onClick={startEditing}
              className="w-full rounded-md border border-dashed border-stone-300 px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800"
            >
              Add note
            </button>
          )}
        </>
      )}
    </div>
  );
};
