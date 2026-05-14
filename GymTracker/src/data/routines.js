export const WORKOUTS = {
  A: {
    id: 'A',
    name: 'Pull',
    day: 'Monday',
    muscles: 'Back · Rear Delts · Biceps',
    exercises: [
      {
        id: 'lat-pulldown',
        name: 'Lat Pulldown',
        sets: 3,
        repsRange: '5–8',
        rir: 2,
        isNew: false,
        dropset: false,
        toFailure: false,
        notes:
          'Wide-ish grip. Pull bar to upper chest, driving elbows down and back. Squeeze lats at the bottom, control on the way up.',
      },
      {
        id: 'machine-row',
        name: 'Machine Row',
        sets: 4,
        repsRange: '8–10',
        rir: 2,
        isNew: false,
        dropset: false,
        toFailure: false,
        notes:
          'Chest-supported seated row. Pull handles toward torso, squeeze shoulder blades together, control the return. Mid-back thickness.',
      },
      {
        id: 'straight-arm-pulldown',
        name: 'Straight-Arm Pulldown',
        sets: 3,
        repsRange: '10–12',
        rir: 1,
        isNew: true,
        dropset: false,
        toFailure: false,
        notes:
          'High pulley with bar or rope. Arms nearly straight. Pull bar to thighs in wide arc using just lats, control back up. Pure lat isolation.',
      },
      {
        id: 'reverse-pec-deck',
        name: 'Reverse Pec Deck',
        sets: 3,
        repsRange: '10–12',
        rir: 1,
        isNew: true,
        dropset: false,
        toFailure: false,
        notes:
          'Sit facing the pec deck pad (chest against pad). Pull handles back and outward in wide arc, squeezing rear delts. Control return. Top EMG activation for rear delts.',
      },
      {
        id: 'cable-bicep-curl',
        name: 'Cable Bicep Curl',
        sets: 3,
        repsRange: '6–8',
        rir: 1,
        isNew: false,
        dropset: false,
        toFailure: false,
        notes:
          'Low pulley with straight or EZ bar. Curl up with elbows pinned to sides — no swinging. Squeeze biceps at top.',
      },
      {
        id: 'incline-db-curl',
        name: 'Incline Dumbbell Curl',
        sets: 3,
        repsRange: '8–10',
        rir: 1,
        isNew: true,
        dropset: false,
        toFailure: false,
        notes:
          'Bench at 45–60°. Lie back with dumbbells hanging at sides, arms behind torso. Curl up keeping elbows back — the stretched bottom position drives growth.',
      },
    ],
  },

  B: {
    id: 'B',
    name: 'Legs',
    day: 'Tuesday',
    muscles: 'Quads · Hamstrings · Glutes · Calves',
    exercises: [
      {
        id: 'squat',
        name: 'Squat (or Leg Press)',
        sets: 3,
        repsRange: '5–8',
        rir: 2,
        isNew: false,
        dropset: false,
        toFailure: false,
        notes:
          'Squat: bar on upper traps, hips back and down until thighs parallel, drive up. Leg press: feet shoulder-width, lower to ~90° knee bend.',
      },
      {
        id: 'romanian-deadlift',
        name: 'Romanian Deadlift',
        sets: 3,
        repsRange: '8–10',
        rir: 2,
        isNew: false,
        dropset: false,
        toFailure: false,
        notes:
          'Slight knee bend, bar close to legs. Hinge at hips, push glutes back, lower bar to mid-shin feeling hamstring stretch, then drive hips forward.',
      },
      {
        id: 'leg-extension',
        name: 'Leg Extension',
        sets: 3,
        repsRange: '10–12',
        rir: 1,
        isNew: false,
        dropset: false,
        toFailure: false,
        notes: 'Seated machine. Extend knees fully, hold squeeze at top, control down. Quads.',
      },
      {
        id: 'leg-curl',
        name: 'Leg Curl',
        sets: 3,
        repsRange: '10–12',
        rir: 1,
        isNew: false,
        dropset: false,
        toFailure: false,
        notes:
          'Curl heels toward glutes, squeeze hamstrings at peak, lower under control. Hamstrings.',
      },
      {
        id: 'hip-thrust',
        name: 'Hip Thrust',
        sets: 3,
        repsRange: '8–10',
        rir: 1,
        isNew: false,
        dropset: false,
        toFailure: false,
        notes:
          'Upper back on bench, bar padded across hips. Drive hips to full lockout, squeeze glutes, control down.',
      },
      {
        id: 'standing-calf-raise',
        name: 'Standing Calf Raise',
        sets: 4,
        repsRange: '8–12',
        rir: 1,
        isNew: false,
        dropset: false,
        toFailure: false,
        notes:
          'Balls of feet on platform. Drop heels for full stretch, rise as high as possible on toes. Pause at top and bottom. Calves.',
      },
    ],
  },

  C: {
    id: 'C',
    name: 'Push',
    day: 'Thursday',
    muscles: 'Chest · Shoulders · Triceps',
    exercises: [
      {
        id: 'smith-bench',
        name: 'Smith Flat Bench Press',
        sets: 3,
        repsRange: '5–8',
        rir: 2,
        isNew: false,
        dropset: false,
        toFailure: false,
        notes:
          'Flat bench inside Smith machine. Lower bar to lower chest with control, press straight up. Main chest compound.',
      },
      {
        id: 'incline-db-press',
        name: 'Incline Dumbbell Press',
        sets: 2,
        repsRange: '8–10',
        rir: 1,
        isNew: false,
        dropset: false,
        toFailure: false,
        notes:
          'Bench at 30–45°. Press dumbbells from chest level up and slightly inward. Upper chest, full range of motion.',
      },
      {
        id: 'pec-deck',
        name: 'Pec Deck',
        sets: 2,
        repsRange: 'to failure',
        rir: null,
        isNew: false,
        dropset: false,
        toFailure: true,
        notes:
          'Seated machine. Bring handles together, squeeze hard for a beat, control back. Push to failure but cap at 15 reps.',
      },
      {
        id: 'machine-shoulder-press',
        name: 'Machine Shoulder Press',
        sets: 2,
        repsRange: '10–12',
        rir: null,
        isNew: false,
        dropset: true,
        toFailure: false,
        notes:
          'Press handles overhead through full range. Last set: hit failure, drop weight ~25%, immediately rep again to failure.',
      },
      {
        id: 'lateral-raises',
        name: 'Seated Lateral Raises',
        sets: 3,
        repsRange: 'to failure',
        rir: null,
        isNew: false,
        dropset: false,
        toFailure: true,
        notes:
          'Sit on bench, dumbbells at sides. Raise out to shoulder height with slight elbow bend, pinkies slightly higher than thumbs. Side delts.',
      },
      {
        id: 'cable-tricep-extension',
        name: 'Cable Tricep Extension',
        sets: 3,
        repsRange: '6–8',
        rir: 1,
        isNew: false,
        dropset: true,
        toFailure: false,
        notes:
          'High pulley, rope or bar. Elbows tucked, press down and fully extend, squeeze triceps. Last set: failure → drop weight ~25% → failure again.',
      },
      {
        id: 'katana-tricep',
        name: 'Katana Tricep Extension',
        sets: 3,
        repsRange: '8–10',
        rir: 1,
        isNew: false,
        dropset: false,
        toFailure: false,
        notes:
          'Single arm cable. Stand side-on, grab handle from above opposite shoulder, extend down and across like drawing a sword. Long head of triceps.',
      },
    ],
  },

  D: {
    id: 'D',
    name: 'Core',
    day: 'Friday',
    muscles: 'Abs · Lower Back',
    exercises: [
      {
        id: 'hanging-leg-raises',
        name: 'Hanging Leg Raises',
        sets: 3,
        repsRange: '10–15',
        rir: null,
        isNew: false,
        dropset: false,
        toFailure: false,
        notes:
          'Hang from pull-up bar. Raise legs to at least 90° (straight if possible, bent knees if too hard). Lower abs.',
      },
      {
        id: 'cable-crunch',
        name: 'Cable Crunch',
        sets: 3,
        repsRange: '12–15',
        rir: 1,
        isNew: false,
        dropset: false,
        toFailure: false,
        notes:
          'Kneel facing cable, rope on high pulley, hands beside head. Crunch torso toward knees, hips stay still. Upper abs.',
      },
      {
        id: 'pallof-press',
        name: 'Pallof Press',
        sets: 3,
        repsRange: '10–12 per side',
        rir: null,
        isNew: false,
        dropset: false,
        toFailure: false,
        isPerSide: true,
        notes:
          'Side-on to cable, handle at chest. Press straight out and hold a beat, resisting rotation. Anti-rotation core.',
      },
      {
        id: 'plank',
        name: 'Plank',
        sets: 3,
        repsRange: '30–60 sec',
        rir: null,
        isNew: false,
        dropset: false,
        toFailure: false,
        isTime: true,
        notes:
          'Forearms on floor, straight line from head to heels. Brace abs, squeeze glutes, don\'t let hips sag. Whole core.',
      },
      {
        id: 'back-extension',
        name: 'Back Extension',
        sets: 3,
        repsRange: '12–15',
        rir: 1,
        isNew: false,
        dropset: false,
        toFailure: false,
        notes:
          'Hyperextension bench. Lower torso under control, raise to neutral (don\'t overarch), squeeze glutes at top. Lower back and glutes.',
      },
    ],
  },
};

// 0=Sun 1=Mon 2=Tue 3=Wed 4=Thu 5=Fri 6=Sat
export const SCHEDULE = {
  0: null,
  1: 'A',
  2: 'B',
  3: null,
  4: 'C',
  5: 'D',
  6: null,
};

export function getTodayWorkout() {
  const workoutId = SCHEDULE[new Date().getDay()];
  return workoutId ? WORKOUTS[workoutId] : null;
}
