import { useState } from 'react';
import type { Schedule } from '../services/courseService';
import type { Term } from '../types/course';
import { CourseList } from './CourseList';
import { CoursePlan } from './CoursePlan';
import { TermSelector } from './TermSelector';
import { hasTimeConflict } from '../utils/timeConflicts';

interface TermPageProps {
  schedule: Schedule;
}

export const TermPage = ({ schedule }: TermPageProps) => {
  const [selectedTerm, setSelectedTerm] = useState<Term>('Fall');
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [isPlanOpen, setIsPlanOpen] = useState(false);

  const toggleClass = (courseKey: string) => {
    setSelectedClasses((currentSelectedClasses) => {
      if (currentSelectedClasses.indexOf(courseKey) !== -1) {
        return currentSelectedClasses.filter((key) => key !== courseKey);
      }

      const course = schedule.courses[courseKey];
      const selectedCourses = currentSelectedClasses.map(
        (key) => schedule.courses[key],
      );

      return hasTimeConflict(course, selectedCourses)
        ? currentSelectedClasses
        : [...currentSelectedClasses, courseKey];
    });
  };

  return (
    <main className="min-h-screen bg-stone-50 px-8 py-10 text-stone-950">
      <h1 className="mb-12 text-3xl font-semibold tracking-tight">{schedule.title}</h1>
      <div className="mb-10 flex items-end justify-between gap-4">
        <TermSelector selectedTerm={selectedTerm} onTermChange={setSelectedTerm} />
        <button
          type="button"
          onClick={() => setIsPlanOpen(true)}
          className="rounded-lg bg-stone-950 px-5 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-stone-800"
        >
          Course plan
        </button>
      </div>
      <CourseList
        courses={schedule.courses}
        selectedTerm={selectedTerm}
        selectedClasses={selectedClasses}
        onClassToggle={toggleClass}
      />
      {isPlanOpen && (
        <CoursePlan
          courses={schedule.courses}
          selectedClasses={selectedClasses}
          onClose={() => setIsPlanOpen(false)}
        />
      )}
    </main>
  );
};
