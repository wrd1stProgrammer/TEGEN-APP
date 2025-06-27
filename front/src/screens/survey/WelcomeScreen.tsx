// screens/WelcomeScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { navigate,goBack } from '../../navigation/NavigationUtils';


export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.greet}>테토·에겐 테스트</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigate('Gender')}
      >
        <Text style={styles.buttonText}>시작하기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  greet: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 48,
  },
  button: {
    backgroundColor: '#111',
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 48,
    marginTop: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
