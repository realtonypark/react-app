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
  <fieldset className="mb-10">
    <legend className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-stone-600">
      Show classes for
    </legend>
    <div className="inline-flex rounded-lg border border-stone-300 bg-white p-1 shadow-sm">
      {terms.map((term) => (
        <label
          key={term}
          className={`cursor-pointer rounded-md px-5 py-2 text-sm font-medium transition-colors ${
            selectedTerm === term
              ? 'bg-stone-950 text-white'
              : 'text-stone-700 hover:bg-stone-100'
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
