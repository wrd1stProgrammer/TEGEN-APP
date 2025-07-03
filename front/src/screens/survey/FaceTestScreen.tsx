// screens/FaceTestScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { navigate } from '../../navigation/NavigationUtils';

export default function FaceTestScreen({ route }) {
  // SurveyScreen에서 넘겨준 props 받기
  const { answers, gender, score } = route.params ?? {};

  const goResult = () => navigate('Result', { answers, gender, score, faceTest: false });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI 얼굴상 테스트를 시작할까요?</Text>
      <Text style={styles.sub}>얼굴 분석을 통해 맞춤 결과를 제공해요.</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          // 실제 얼굴상 분석시 score, answers 그대로 넘기면 됨
          navigate('Result', { answers, gender, score, faceTest: true })
        }
      >
        <Text style={styles.buttonText}>AI 얼굴상 테스트 시작</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#bbb' }]}
        onPress={goResult}
      >
        <Text style={[styles.buttonText, { color: '#111' }]}>건너뛰기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#111', marginBottom: 18, textAlign: 'center' },
  sub: { color: '#555', fontSize: 15, marginBottom: 42, textAlign: 'center' },
  button: { backgroundColor: '#111', borderRadius: 24, paddingVertical: 16, paddingHorizontal: 42, marginTop: 16, width: 220, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 17, fontWeight: 'bold' },
});
