// components/ScoreChips.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const colors = [
  '#AEE1F9', // 연애 성향
  '#FFC3A0', // 삶 태도
  '#FFB5C5', // 성격
  '#D4EFDF', // 취미
  '#F9E79F', // 욕구
];

export default function ScoreChips({ catScores }: { catScores: {cat: string, score: number}[] }) {
  return (
    <View style={styles.row}>
      {catScores.map((c, i) => (
        <View key={c.cat} style={[styles.chip, { backgroundColor: colors[i % colors.length] }]}>
          <Text style={styles.chipLabel}>{c.cat}</Text>
          <Text style={styles.chipScore}>{c.score}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginVertical: 6,
    gap: 8,
  },
  chip: {
    borderRadius: 18,
    minWidth: 88,
    paddingVertical: 12,
    paddingHorizontal: 16,
    margin: 4,
    alignItems: 'center',
    backgroundColor: '#F5F6FA',
    shadowColor: '#d1d1d1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  chipLabel: {
    color: '#222',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  chipScore: {
    color: '#444',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
