import { readFile } from 'node:fs/promises';
import { applicationDefault, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const projectId = 'realtonypark-react-app';
const schedule = JSON.parse(
  await readFile(new URL('../data/schedule.json', import.meta.url), 'utf8'),
);

if (getApps().length === 0) {
  initializeApp({ credential: applicationDefault(), projectId });
}

await getFirestore()
  .collection('schedules')
  .doc(schedule.id)
  .set({ title: schedule.title, courses: schedule.courses });

console.log(`Seeded schedules/${schedule.id} in ${projectId}.`);
