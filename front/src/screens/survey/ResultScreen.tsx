// screens/ResultScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { navigate,goBack } from '../../navigation/NavigationUtils';


export default function ResultScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>테토·에겐 테스트 결과</Text>
      <Text style={styles.chartDummy}>[레이더 차트 자리]</Text>
      <Text style={styles.desc}>AI 분석 및 설문 결과를 기반으로<br/>테토/에겐 성향과 특징을 정리해 보여줍니다.</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => goBack()}
      >
        <Text style={styles.buttonText}>다시하기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 28,
  },
  chartDummy: {
    width: 260,
    height: 180,
    borderRadius: 16,
    backgroundColor: '#222',
    color: '#aaa',
    textAlign: 'center',
    lineHeight: 180,
    marginBottom: 28,
    fontSize: 17,
  },
  desc: {
    color: '#bbb',
    fontSize: 15,
    marginBottom: 48,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 40,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#111',
    fontSize: 17,
    fontWeight: 'bold',
  },
});
