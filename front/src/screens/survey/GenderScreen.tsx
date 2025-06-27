// screens/GenderScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { navigate,goBack } from '../../navigation/NavigationUtils';


export default function GenderScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.question}>성별을 선택해 주세요</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigate('Survey', { gender: '남' })}
      >
        <Text style={styles.buttonText}>남자</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigate('Survey', { gender: '여' })}
      >
        <Text style={styles.buttonText}>여자</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // 흰색 배경
    justifyContent: 'center',
    alignItems: 'center',
  },
  question: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 48,
  },
  button: {
    backgroundColor: '#111',
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 48,
    marginBottom: 16,
  },
  buttonText: {
    color:'#fff', // 흰색 배경
    fontSize: 18,
    fontWeight: 'bold',
  },
});
