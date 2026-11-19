import type { Term } from '../types/course';

interface TermSelectorProps {
  selectedTerm: Term;
  onTermChange: (term: Term) => void;
}

const terms: Term[] = ['Fall', 'Winter', 'Spring'];

export const TermSelector = ({
  selectedTerm,
  onTermChange,
}: TermSelectorProps) => (
  <fieldset>
    <legend className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-stone-600 dark:text-stone-400">
      Show classes for
    </legend>
    <div className="inline-flex rounded-lg border border-stone-300 bg-white p-1 shadow-sm dark:border-stone-700 dark:bg-stone-900">
      {terms.map((term) => (
        <label
          key={term}
          className={`cursor-pointer rounded-md px-5 py-2 text-sm font-medium transition-colors ${
            selectedTerm === term
              ? 'bg-stone-950 text-white dark:bg-stone-100 dark:text-stone-950'
              : 'text-stone-700 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800'
          }`}
        >
          <input
            className="sr-only"
            type="radio"
            name="term"
            value={term}
            checked={selectedTerm === term}
            onChange={() => onTermChange(term)}
          />
          {term}
        </label>
      ))}
    </div>
  </fieldset>
);
