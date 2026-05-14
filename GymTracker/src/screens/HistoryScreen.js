import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getSessions } from '../storage/db';
import { colors, spacing } from '../theme';

const WORKOUT_COLORS = {
  A: '#4361ee',
  B: '#22c55e',
  C: '#f59e0b',
  D: '#ec4899',
};

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

function formatDuration(startedAt, finishedAt) {
  if (!finishedAt || !startedAt) return null;
  const mins = Math.round((finishedAt - startedAt) / 60000);
  if (mins < 1) return null;
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export default function HistoryScreen() {
  const [sessions, setSessions] = useState([]);
  const [expanded, setExpanded] = useState(null);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const all = await getSessions();
        // Show sessions that have at least one logged set
        const relevant = all.filter((s) =>
          s.exercises.some((e) => e.sets.some((st) => st.done))
        );
        setSessions(relevant);
      })();
    }, [])
  );

  if (sessions.length === 0) {
    return (
      <View style={styles.empty}>
        <Ionicons name="barbell-outline" size={60} color={colors.border} />
        <Text style={styles.emptyTitle}>No sessions yet</Text>
        <Text style={styles.emptySub}>
          Complete your first workout to see progress here.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.headerTitle}>{sessions.length} session{sessions.length !== 1 ? 's' : ''}</Text>

      {sessions.map((session) => {
        const isExp = expanded === session.id;
        const accentColor = WORKOUT_COLORS[session.workoutId] ?? colors.accent;
        const completedExs = session.exercises.filter((e) => e.completed).length;
        const totalExs = session.exercises.length;
        const duration = formatDuration(session.startedAt, session.finishedAt);

        // Volume: total kg lifted (weight × reps across all done sets)
        let totalVol = 0;
        session.exercises.forEach((ex) => {
          ex.sets.forEach((st) => {
            if (st.done && st.weight && st.reps) {
              totalVol += parseFloat(st.weight) * parseInt(st.reps, 10) || 0;
            }
          });
        });

        return (
          <View key={session.id} style={styles.card}>
            <TouchableOpacity
              style={styles.cardHeader}
              onPress={() => setExpanded(isExp ? null : session.id)}
              activeOpacity={0.7}
            >
              <View style={[styles.workoutDot, { backgroundColor: accentColor }]} />
              <View style={styles.cardHeaderBody}>
                <View style={styles.cardTitleRow}>
                  <Text style={styles.cardWorkout}>
                    {session.workoutName} Day
                  </Text>
                  {session.completed && (
                    <Ionicons name="checkmark-circle" size={15} color={colors.success} />
                  )}
                </View>
                <Text style={styles.cardDate}>{formatDate(session.date)}</Text>
                <View style={styles.cardStats}>
                  <Text style={styles.cardStat}>
                    {completedExs}/{totalExs} exercises
                  </Text>
                  {totalVol > 0 && (
                    <Text style={styles.cardStat}>· {totalVol.toLocaleString()} kg vol</Text>
                  )}
                  {duration && (
                    <Text style={styles.cardStat}>· {duration}</Text>
                  )}
                </View>
              </View>
              <Ionicons
                name={isExp ? 'chevron-up' : 'chevron-down'}
                size={18}
                color={colors.subtext}
              />
            </TouchableOpacity>

            {isExp && (
              <View style={styles.exList}>
                {session.exercises.map((ex) => {
                  const doneSets = ex.sets.filter((s) => s.done);
                  if (doneSets.length === 0) return null;
                  return (
                    <View key={ex.exerciseId} style={styles.histEx}>
                      <View style={styles.histExHeader}>
                        <Ionicons
                          name={ex.completed ? 'checkmark-circle' : 'remove-circle-outline'}
                          size={14}
                          color={ex.completed ? colors.success : colors.subtext}
                        />
                        <Text style={styles.histExName}>{ex.name}</Text>
                      </View>
                      {doneSets.map((st, si) => {
                        const hasData = st.weight || st.reps;
                        return (
                          <Text key={si} style={styles.histSet}>
                            Set {si + 1}:{' '}
                            {hasData
                              ? `${st.weight ? st.weight + ' kg' : '—'} × ${st.reps || '—'} reps`
                              : 'logged'}
                          </Text>
                        );
                      })}
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        );
      })}

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.md },

  headerTitle: {
    color: colors.subtext,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: spacing.md,
  },

  empty: {
    flex: 1,
    backgroundColor: colors.bg,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    gap: spacing.sm,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
    marginTop: spacing.md,
  },
  emptySub: {
    color: colors.subtext,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },

  card: {
    backgroundColor: colors.card,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  workoutDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 2,
    alignSelf: 'flex-start',
  },
  cardHeaderBody: { flex: 1 },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  cardWorkout: { color: colors.text, fontSize: 16, fontWeight: '700' },
  cardDate: { color: colors.subtext, fontSize: 13, marginTop: 2 },
  cardStats: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 4 },
  cardStat: { color: colors.subtext, fontSize: 12 },

  exList: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    padding: 14,
    gap: 12,
  },
  histEx: { gap: 4 },
  histExHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  histExName: { color: colors.text, fontSize: 14, fontWeight: '600' },
  histSet: { color: colors.subtext, fontSize: 13, paddingLeft: 20 },
});
