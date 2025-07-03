import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, SafeAreaView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'; // expo면 '@expo/vector-icons'
import { goBack, navigate } from '../../navigation/NavigationUtils';
import TegenRadarChart from '../../utils/TegenRadarChart';

export default function ResultScreen({ route }) {
  const { score } = route.params ?? {};

  if (!score) return null;

  const values = score.catScores.map(c => c.score);

  return (
    <SafeAreaView style={styles.outer}>
      {/* 상단바 */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={goBack} style={styles.backIconBtn}>
          <Ionicons name="chevron-back" size={30} color="#222" />
        </TouchableOpacity>
        {/* 필요하면 중앙 타이틀: <Text style={styles.topBarTitle}>결과</Text> */}
      </View>

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>테토·에겐 테스트 결과</Text>
        <TegenRadarChart data={values} />

        <View style={[styles.resultBox, { borderColor: '#FF3B30' }]}>
          <Text style={[styles.finalType, { color: '#FF3B30' }]}>{score.type}</Text>
          <Text style={styles.percent}>{`총점: ${score.total.toFixed(0)}점`}</Text>
        </View>

        <Text style={styles.detailTitle}>카테고리별 점수</Text>
        {score.catScores.map((c, i) => (
          <Text key={c.cat} style={styles.catScore}>
            {c.cat}: {c.score}
          </Text>
        ))}

        <TouchableOpacity style={styles.button} onPress={goBack}>
          <Text style={styles.buttonText}>다시하기</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.bottomButtonWrap}>
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => navigate('LoginScreen')}
        >
          <Text style={styles.ctaButtonText}>테토에겐 친구 만들기!</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: Platform.OS === 'ios' ? 54 : 48,
    paddingHorizontal: 5,
    marginTop: Platform.OS === 'ios' ? 0 : 0,
    zIndex: 20,
  },
  backIconBtn: {
    padding: 7,
    paddingLeft: 2,
    justifyContent: 'center',
    alignItems: 'center',
    width: 45,
    height: '100%',
  },
  container: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 120,
  },
  title: { fontSize: 24, fontWeight: 'bold', color: '#111', marginBottom: 12, textAlign: 'center' },
  resultBox: {
    borderWidth: 2,
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginBottom: 18,
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
  },
  finalType: { fontSize: 26, fontWeight: 'bold', marginBottom: 6 },
  percent: { fontSize: 18, color: '#222', marginBottom: 2 },
  detailTitle: { fontWeight: 'bold', marginBottom: 4, color: '#555', fontSize: 15, marginTop: 4 },
  catScore: { fontSize: 14, color: '#333' },
  button: { backgroundColor: '#111', borderRadius: 24, paddingVertical: 14, paddingHorizontal: 40, marginTop: 32, alignItems: 'center', marginBottom: 36 },
  buttonText: { color: '#fff', fontSize: 17, fontWeight: 'bold' },

  bottomButtonWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 28,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  ctaButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 24,
    paddingVertical: 18,
    paddingHorizontal: 50,
    alignItems: 'center',
    shadowColor: '#f88',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 2,
    width: '100%',
  },
  ctaButtonText: {
    color: '#fff',
    fontSize: 19,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});

