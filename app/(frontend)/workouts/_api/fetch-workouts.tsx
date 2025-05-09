'use server';

import { getPayload } from 'payload';
import config from '@payload-config';

export async function fetchWorkouts() {
  const payload = await getPayload({ config });
  const workoutsResult = await payload.find({
    collection: 'workouts',
    limit: 10,
    depth: 2,
    sort: '-createdAt',
    page: 1,
  });
  return workoutsResult.docs;
}
