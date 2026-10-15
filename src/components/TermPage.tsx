import { useState } from 'react';
import type { Schedule } from '../services/courseService';
import type { Term } from '../types/course';
import { CourseList } from './CourseList';
import { TermSelector } from './TermSelector';

interface TermPageProps {
  schedule: Schedule;
}

export const TermPage = ({ schedule }: TermPageProps) => {
  const [selectedTerm, setSelectedTerm] = useState<Term>('Fall');
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);

  const toggleClass = (courseKey: string) => {
    setSelectedClasses((currentSelectedClasses) =>
      currentSelectedClasses.indexOf(courseKey) !== -1
        ? currentSelectedClasses.filter((key) => key !== courseKey)
        : [...currentSelectedClasses, courseKey],
    );
  };

  return (
    <main className="min-h-screen bg-stone-50 px-8 py-10 text-stone-950">
      <h1 className="mb-12 text-3xl font-semibold tracking-tight">{schedule.title}</h1>
      <TermSelector selectedTerm={selectedTerm} onTermChange={setSelectedTerm} />
      <CourseList
        courses={schedule.courses}
        selectedTerm={selectedTerm}
        selectedClasses={selectedClasses}
        onClassToggle={toggleClass}
      />
    </main>
  );
};
