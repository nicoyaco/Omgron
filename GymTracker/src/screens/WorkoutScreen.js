import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getSessions, saveSession, getLastSessionForExercise } from '../storage/db';
import { WORKOUTS } from '../data/routines';
import { colors, spacing } from '../theme';

export default function WorkoutScreen({ route, navigation }) {
  const { sessionId } = route.params;
  const [session, setSession] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [prevSets, setPrevSets] = useState({});
  const sessionRef = useRef(null);

  useEffect(() => {
    (async () => {
      const sessions = await getSessions();
      const s = sessions.find((x) => x.id === sessionId);
      if (!s) return;
      setSession(s);
      sessionRef.current = s;

      // Load previous best sets for each exercise
      const prev = {};
      for (const ex of s.exercises) {
        const last = await getLastSessionForExercise(ex.exerciseId, sessionId);
        if (last) prev[ex.exerciseId] = last;
      }
      setPrevSets(prev);

      // Auto-expand first incomplete exercise
      const first = s.exercises.find((e) => !e.completed);
      if (first) setExpanded(first.exerciseId);
    })();
  }, [sessionId]);

  async function persist(updated) {
    setSession(updated);
    sessionRef.current = updated;
    await saveSession(updated);
  }

  function toggleExpanded(exId) {
    setExpanded((prev) => (prev === exId ? null : exId));
  }

  async function updateSet(exIdx, setIdx, field, value) {
    const s = sessionRef.current;
    const updatedExercises = s.exercises.map((ex, ei) => {
      if (ei !== exIdx) return ex;
      const updatedSets = ex.sets.map((set, si) => {
        if (si !== setIdx) return set;
        return { ...set, [field]: value };
      });
      const allDone = updatedSets.every((st) => st.done);
      return { ...ex, sets: updatedSets, completed: allDone };
    });
    await persist({ ...s, exercises: updatedExercises });
  }

  async function toggleSetDone(exIdx, setIdx) {
    const current = sessionRef.current.exercises[exIdx].sets[setIdx].done;
    await updateSet(exIdx, setIdx, 'done', !current);
  }

  async function finishWorkout() {
    const s = sessionRef.current;
    const completedCount = s.exercises.filter((e) => e.completed).length;
    const total = s.exercises.length;

    Alert.alert(
      'Finish Workout?',
      `${completedCount} of ${total} exercises completed.`,
      [
        { text: 'Keep Going', style: 'cancel' },
        {
          text: 'Finish',
          onPress: async () => {
            await persist({ ...s, completed: true, finishedAt: Date.now() });
            navigation.goBack();
          },
        },
      ]
    );
  }

  if (!session) {
    return <View style={styles.container} />;
  }

  const workout = WORKOUTS[session.workoutId];
  const completedCount = session.exercises.filter((e) => e.completed).length;
  const totalEx = session.exercises.length;
  const progress = completedCount / totalEx;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Progress bar */}
        <View style={styles.progressWrap}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {completedCount}/{totalEx} done
          </Text>
        </View>

        {session.exercises.map((ex, exIdx) => {
          const def = workout.exercises.find((e) => e.id === ex.exerciseId);
          const isExpanded = expanded === ex.exerciseId;
          const doneSets = ex.sets.filter((s) => s.done).length;
          const last = prevSets[ex.exerciseId];

          return (
            <View key={ex.exerciseId} style={[styles.exCard, ex.completed && styles.exCardDone]}>
              {/* Exercise header */}
              <TouchableOpacity
                style={styles.exHeader}
                onPress={() => toggleExpanded(ex.exerciseId)}
                activeOpacity={0.7}
              >
                <View style={[styles.exStatus, ex.completed && styles.exStatusDone]}>
                  {ex.completed ? (
                    <Ionicons name="checkmark" size={14} color="#fff" />
                  ) : (
                    <Text style={styles.exStatusNum}>{exIdx + 1}</Text>
                  )}
                </View>
                <View style={styles.exHeaderBody}>
                  <View style={styles.exNameRow}>
                    <Text style={[styles.exName, ex.completed && styles.exNameDone]}>
                      {ex.name}
                    </Text>
                    {def?.isNew && (
                      <View style={styles.newBadge}>
                        <Text style={styles.newBadgeText}>NEW</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.exMeta}>
                    {doneSets}/{ex.sets.length} sets
                    {def?.repsRange ? `  ·  ${def.repsRange}` : ''}
                    {def?.rir != null ? `  ·  RIR ${def.rir}` : ''}
                  </Text>
                </View>
                <Ionicons
                  name={isExpanded ? 'chevron-up' : 'chevron-down'}
                  size={18}
                  color={colors.subtext}
                />
              </TouchableOpacity>

              {isExpanded && (
                <View style={styles.exBody}>
                  {/* Cue notes */}
                  {def?.notes && (
                    <View style={styles.notesBox}>
                      <Text style={styles.notesText}>{def.notes}</Text>
                      {def.dropset && (
                        <Text style={styles.dropsetNote}>
                          Last set: Dropset — drop weight ~25% and rep to failure
                        </Text>
                      )}
                      {def.toFailure && (
                        <Text style={styles.dropsetNote}>Push every set to failure (cap 15 reps)</Text>
                      )}
                    </View>
                  )}

                  {/* Previous session reference */}
                  {last && (
                    <View style={styles.prevRow}>
                      <Ionicons name="time-outline" size={12} color={colors.subtext} />
                      <Text style={styles.prevText}>
                        Last: {last.map((s) => `${s.weight || '?'}kg × ${s.reps || '?'}`).join('  ·  ')}
                      </Text>
                    </View>
                  )}

                  {/* Sets table header */}
                  <View style={styles.tableHeader}>
                    <Text style={[styles.col, styles.colSet]}>SET</Text>
                    <Text style={[styles.col, styles.colInput]}>KG</Text>
                    <Text style={[styles.col, styles.colInput]}>REPS</Text>
                    <Text style={[styles.col, styles.colDone]}>✓</Text>
                  </View>

                  {ex.sets.map((set, setIdx) => {
                    const isLastDropset = def?.dropset && setIdx === ex.sets.length - 1;
                    return (
                      <View
                        key={setIdx}
                        style={[styles.setRow, set.done && styles.setRowDone]}
                      >
                        <View style={[styles.col, styles.colSet, styles.setNumBox]}>
                          <Text style={styles.setNum}>{setIdx + 1}</Text>
                          {isLastDropset && (
                            <Text style={styles.dsTag}>DS</Text>
                          )}
                        </View>
                        <TextInput
                          style={[styles.col, styles.colInput, styles.input, set.done && styles.inputDone]}
                          value={set.weight}
                          onChangeText={(v) => updateSet(exIdx, setIdx, 'weight', v)}
                          keyboardType="numeric"
                          placeholder="—"
                          placeholderTextColor={colors.border}
                          returnKeyType="next"
                          selectTextOnFocus
                        />
                        <TextInput
                          style={[styles.col, styles.colInput, styles.input, set.done && styles.inputDone]}
                          value={set.reps}
                          onChangeText={(v) => updateSet(exIdx, setIdx, 'reps', v)}
                          keyboardType="numeric"
                          placeholder="—"
                          placeholderTextColor={colors.border}
                          returnKeyType="done"
                          selectTextOnFocus
                        />
                        <TouchableOpacity
                          style={[styles.col, styles.colDone, styles.doneBtn]}
                          onPress={() => toggleSetDone(exIdx, setIdx)}
                          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        >
                          <Ionicons
                            name={set.done ? 'checkmark-circle' : 'ellipse-outline'}
                            size={26}
                            color={set.done ? colors.success : colors.border}
                          />
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </View>
              )}
            </View>
          );
        })}

        {/* Finish / Completed */}
        {!session.completed ? (
          <TouchableOpacity
            style={[styles.finishBtn, completedCount === totalEx && styles.finishBtnReady]}
            onPress={finishWorkout}
            activeOpacity={0.8}
          >
            <Ionicons name="trophy-outline" size={20} color="#fff" />
            <Text style={styles.finishBtnText}>Finish Workout</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.completedCard}>
            <Ionicons name="trophy" size={40} color={colors.warning} />
            <Text style={styles.completedTitle}>Session Complete!</Text>
            <Text style={styles.completedSub}>
              {completedCount}/{totalEx} exercises · great work
            </Text>
          </View>
        )}

        <View style={{ height: 50 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scroll: { flex: 1 },
  content: { padding: spacing.md },

  progressWrap: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md, gap: 12 },
  progressTrack: {
    flex: 1,
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: colors.accent, borderRadius: 3 },
  progressText: { color: colors.subtext, fontSize: 13, fontWeight: '600', minWidth: 60 },

  exCard: {
    backgroundColor: colors.card,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  exCardDone: { borderColor: colors.success + '50' },

  exHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: spacing.sm,
  },
  exStatus: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exStatusDone: { backgroundColor: colors.success },
  exStatusNum: { color: colors.subtext, fontSize: 13, fontWeight: '700' },
  exHeaderBody: { flex: 1 },
  exNameRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6 },
  exName: { color: colors.text, fontSize: 15, fontWeight: '600' },
  exNameDone: { color: colors.subtext },
  exMeta: { color: colors.subtext, fontSize: 12, marginTop: 2 },
  newBadge: {
    backgroundColor: colors.warning + '30',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  newBadgeText: { color: colors.warning, fontSize: 10, fontWeight: '700' },

  exBody: { paddingHorizontal: 12, paddingBottom: 12 },

  notesBox: {
    backgroundColor: colors.bg,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  notesText: { color: colors.subtext, fontSize: 13, lineHeight: 19 },
  dropsetNote: { color: colors.warning, fontSize: 12, marginTop: 6, fontWeight: '600' },

  prevRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 10,
  },
  prevText: { color: colors.subtext, fontSize: 12 },

  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    marginBottom: 4,
  },
  col: { alignItems: 'center', justifyContent: 'center' },
  colSet: { width: 40 },
  colInput: { flex: 1, marginHorizontal: 4 },
  colDone: { width: 44 },

  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    borderRadius: 8,
    paddingHorizontal: 4,
  },
  setRowDone: { backgroundColor: colors.success + '12' },

  setNumBox: { alignItems: 'center', justifyContent: 'center' },
  setNum: { color: colors.subtext, fontSize: 14, fontWeight: '700' },
  dsTag: {
    color: colors.warning,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  input: {
    backgroundColor: colors.inputBg,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 8,
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputDone: { borderColor: colors.success + '60' },

  doneBtn: { alignItems: 'center', justifyContent: 'center' },

  finishBtn: {
    backgroundColor: colors.border,
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: spacing.md,
  },
  finishBtnReady: { backgroundColor: colors.success },
  finishBtnText: { color: '#fff', fontSize: 17, fontWeight: '700' },

  completedCard: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: spacing.xl,
    alignItems: 'center',
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: colors.warning + '50',
  },
  completedTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
    marginTop: spacing.sm,
  },
  completedSub: { color: colors.subtext, fontSize: 14, marginTop: 4 },
});
