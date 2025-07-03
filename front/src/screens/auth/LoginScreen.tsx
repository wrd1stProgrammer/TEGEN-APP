import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { navigate } from '../../navigation/NavigationUtils';

const LoginScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.appName}>테겐프렌즈</Text>

      <View style={styles.socialContainer}>
        <TouchableOpacity style={[styles.socialButton, styles.kakaoButton]} onPress={() => navigate('LoginScreen')}>
          <Text style={styles.kakaoText}>카카오로 로그인</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.socialButton, styles.naverButton]}>
          <Text style={styles.naverText}>네이버로 로그인</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.socialButton, styles.googleButton]}>
          <Text style={styles.googleText}>애플로 로그인</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  appName: {
    fontSize: 32,
    fontWeight: '800',
    color: '#3384FF',
    marginBottom: 56,
    letterSpacing: 1,
  },
  socialContainer: {
    width: '100%',
    gap: 18,
  },
  socialButton: {
    borderRadius: 10,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 0,
  },
  kakaoButton: {
    backgroundColor: '#FAE100',
    marginBottom: 12,
  },
  kakaoText: {
    color: '#3B1E1E',
    fontWeight: '700',
    fontSize: 16,
  },
  naverButton: {
    backgroundColor: '#03C75A',
    marginBottom: 12,
  },
  naverText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  googleText: {
    color: '#4285F4',
    fontWeight: '700',
    fontSize: 16,
  },
});
