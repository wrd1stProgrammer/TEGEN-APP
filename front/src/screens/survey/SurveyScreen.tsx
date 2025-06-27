import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { navigate, goBack } from '../../navigation/NavigationUtils';

const questions = [
  {
    question: '친구들이나 직장 동료들 사이에서 나는',
    options: ['어딜 가나 내가 중심', '조용히 따라다니는 편', '분위기에 따라 달라짐', '혼자가 더 편함'],
  },
  {
    question: '모임이나 파티에서 나는',
    options: ['먼저 분위기를 띄운다', '조용히 듣는 쪽', '소수와만 대화', '아예 참석 안 함'],
  },
  {
    question: '새로운 취미를 시작할 때 나는',
    options: ['계획 세우고 바로 시작', '친구 권유 기다림', '인터넷 후기 먼저', '나중에 생각'],
  },
];

export default function SurveyScreen() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

  const handleSelect = (idx: number) => {
    setAnswers([...answers, idx]);
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      navigate('Face', { answers: [...answers, idx] });
    }
  };

  const handleBack = () => {
    if (step === 0) {
      goBack();
    } else {
      setStep(step - 1);
      setAnswers(answers.slice(0, -1));
    }
  };

  const q = questions[step];

  return (
    <View style={styles.container}>
      {/* 상단 영역 */}
      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={28} color="#111" />
        </Pressable>
        <View style={styles.progressWrap}>
          <View
            style={[
              styles.progressBar,
              { width: `${((step) / questions.length) * 100}%` },
            ]}
          />
        </View>
      </View>
      {/* 질문 영역 */}
      <View style={styles.content}>
        <Text style={styles.question}>{q.question}</Text>
        <View style={{ marginTop: 36 }}>
          {q.options.map((opt, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.option}
              onPress={() => handleSelect(idx)}
            >
              <Text style={styles.optionText}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // 흰색 배경
  },
  header: {
    paddingTop: 54, // SafeArea 고려
    paddingHorizontal: 20,
    paddingBottom: 0,
    backgroundColor: '#fff',
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  progressWrap: {
    width: '100%',
    height: 7,
    backgroundColor: '#E0E0E0',
    borderRadius: 3.5,
    overflow: 'hidden',
    // 뒤로가기 아래에 완전히 붙게 marginBottom 없음!
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#111', // 검정색
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  question: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111',
    textAlign: 'center',
    marginBottom: 24,
    marginTop: 20,
  },
  option: {
    width: 320,
    backgroundColor: '#111',
    borderRadius: 32,
    paddingVertical: 18,
    marginVertical: 10,
    alignItems: 'center',
  },
  optionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff', // 버튼 안 글씨는 흰색
  },
});
