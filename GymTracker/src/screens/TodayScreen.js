import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getTodayWorkout } from '../data/routines';
import { createSession, getSessions, saveSession } from '../storage/db';
import { colors, spacing } from '../theme';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function TodayScreen({ navigation }) {
  const [todaySession, setTodaySession] = useState(null);
  const [loading, setLoading] = useState(true);

  const workout = getTodayWorkout();
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const dayName = DAY_NAMES[today.getDay()];
  const dateLabel = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

  useFocusEffect(
    useCallback(() => {
      (async () => {
        setLoading(true);
        const sessions = await getSessions();
        const existing = sessions.find((s) => s.date === todayStr);
        setTodaySession(existing || null);
        setLoading(false);
      })();
    }, [todayStr])
  );

  async function handleStart() {
    if (todaySession) {
      navigation.navigate('Workout', { sessionId: todaySession.id });
      return;
    }
    const session = createSession(workout);
    await saveSession(session);
    navigation.navigate('Workout', { sessionId: session.id });
  }

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator color={colors.accent} size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.dayName}>{dayName}</Text>
        <Text style={styles.dateLabel}>{dateLabel}</Text>
      </View>

      {workout ? (
        <>
          <View style={styles.workoutCard}>
            <View style={styles.workoutTopRow}>
              <View style={styles.workoutBadge}>
                <Text style={styles.workoutBadgeText}>WORKOUT {workout.id}</Text>
              </View>
              {todaySession?.completed && (
                <View style={styles.donePill}>
                  <Ionicons name="checkmark-circle" size={14} color={colors.success} />
                  <Text style={styles.donePillText}>Done</Text>
                </View>
              )}
            </View>
            <Text style={styles.workoutName}>{workout.name}</Text>
            <Text style={styles.muscles}>{workout.muscles}</Text>
          </View>

          <Text style={styles.sectionLabel}>EXERCISES</Text>

          {workout.exercises.map((ex, i) => {
            const sessionEx = todaySession?.exercises?.find((e) => e.exerciseId === ex.id);
            const isDone = sessionEx?.completed ?? false;
            return (
              <View key={ex.id} style={[styles.exRow, isDone && styles.exRowDone]}>
                <View style={[styles.exNumBox, isDone && styles.exNumBoxDone]}>
                  {isDone ? (
                    <Ionicons name="checkmark" size={14} color="#fff" />
                  ) : (
                    <Text style={styles.exNumText}>{i + 1}</Text>
                  )}
                </View>
                <View style={styles.exBody}>
                  <View style={styles.exNameRow}>
                    <Text style={[styles.exName, isDone && styles.exNameDone]}>{ex.name}</Text>
                    {ex.isNew && (
                      <View style={styles.newBadge}>
                        <Text style={styles.newBadgeText}>NEW</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.exMeta}>
                    {ex.sets} sets · {ex.repsRange}
                    {ex.rir != null ? ` · RIR ${ex.rir}` : ''}
                    {ex.dropset ? ' · Dropset' : ''}
                    {ex.toFailure ? ' · To failure' : ''}
                  </Text>
                </View>
              </View>
            );
          })}

          <TouchableOpacity
            style={[styles.startBtn, todaySession?.completed && styles.startBtnDone]}
            onPress={handleStart}
            activeOpacity={0.8}
          >
            <Text style={styles.startBtnText}>
              {!todaySession
                ? 'Start Workout'
                : todaySession.completed
                ? 'View Session'
                : 'Continue Workout'}
            </Text>
            <Ionicons
              name={todaySession?.completed ? 'eye-outline' : 'arrow-forward'}
              size={20}
              color="#fff"
            />
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.restCard}>
          <Text style={styles.restEmoji}>🛌</Text>
          <Text style={styles.restTitle}>Rest Day</Text>
          <Text style={styles.restSub}>Recovery is part of the program. Enjoy it.</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.md, paddingBottom: 40 },
  center: { justifyContent: 'center', alignItems: 'center' },

  header: { marginBottom: spacing.lg },
  dayName: { fontSize: 30, fontWeight: '800', color: colors.text },
  dateLabel: { fontSize: 15, color: colors.subtext, marginTop: 2 },

  workoutCard: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  workoutTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  workoutBadge: {
    backgroundColor: colors.accent + '30',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  workoutBadgeText: {
    color: colors.accentLight,
    fontWeight: '700',
    fontSize: 11,
    letterSpacing: 1.5,
  },
  donePill: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  donePillText: { color: colors.success, fontSize: 13, fontWeight: '600' },
  workoutName: { fontSize: 28, fontWeight: '800', color: colors.text },
  muscles: { fontSize: 13, color: colors.subtext, marginTop: 4 },

  sectionLabel: {
    fontSize: 11,
    color: colors.subtext,
    letterSpacing: 2,
    fontWeight: '700',
    marginBottom: 10,
  },

  exRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  exRowDone: {
    borderColor: colors.success + '50',
    backgroundColor: colors.success + '0e',
  },
  exNumBox: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  exNumBoxDone: { backgroundColor: colors.success },
  exNumText: { color: colors.subtext, fontSize: 13, fontWeight: '700' },
  exBody: { flex: 1 },
  exNameRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6 },
  exName: { color: colors.text, fontSize: 15, fontWeight: '600' },
  exNameDone: { color: colors.subtext },
  newBadge: {
    backgroundColor: colors.warning + '30',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  newBadgeText: { color: colors.warning, fontSize: 10, fontWeight: '700' },
  exMeta: { color: colors.subtext, fontSize: 12, marginTop: 3 },

  startBtn: {
    backgroundColor: colors.accent,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: spacing.md,
  },
  startBtnDone: { backgroundColor: colors.border },
  startBtnText: { color: '#fff', fontSize: 17, fontWeight: '700' },

  restCard: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: spacing.lg,
  },
  restEmoji: { fontSize: 60, marginBottom: spacing.md },
  restTitle: { fontSize: 26, fontWeight: '800', color: colors.text, marginBottom: 8 },
  restSub: { fontSize: 15, color: colors.subtext, textAlign: 'center', lineHeight: 22 },
});
