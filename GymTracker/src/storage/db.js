import AsyncStorage from '@react-native-async-storage/async-storage';

const SESSIONS_KEY = 'gym_sessions_v1';

export async function getSessions() {
  try {
    const raw = await AsyncStorage.getItem(SESSIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function saveSession(session) {
  try {
    const sessions = await getSessions();
    const idx = sessions.findIndex((s) => s.id === session.id);
    if (idx >= 0) {
      sessions[idx] = session;
    } else {
      sessions.unshift(session);
    }
    await AsyncStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
    return true;
  } catch {
    return false;
  }
}

export function createSession(workout) {
  return {
    id: Date.now().toString(),
    date: new Date().toISOString().split('T')[0],
    workoutId: workout.id,
    workoutName: workout.name,
    muscles: workout.muscles,
    startedAt: Date.now(),
    finishedAt: null,
    completed: false,
    exercises: workout.exercises.map((ex) => ({
      exerciseId: ex.id,
      name: ex.name,
      completed: false,
      sets: Array.from({ length: ex.sets }, () => ({
        weight: '',
        reps: '',
        done: false,
      })),
    })),
  };
}

export async function getLastSessionForExercise(exerciseId, excludeSessionId) {
  const sessions = await getSessions();
  for (const s of sessions) {
    if (s.id === excludeSessionId) continue;
    const ex = s.exercises.find((e) => e.exerciseId === exerciseId);
    if (ex) {
      const doneSets = ex.sets.filter((st) => st.done && st.weight);
      if (doneSets.length > 0) return doneSets;
    }
  }
  return null;
}
