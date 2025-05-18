import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import { navigate } from '../../navigation/NavigationUtils';
import { useAppDispatch } from '../../redux/config/reduxHook';
import { userlogin } from '../../redux/actions/userAction';

const LoginScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (type: 'parent' | 'patient') => {
    try {
      await dispatch(userlogin(userId, password, type));
    } catch {
      Alert.alert('로그인 실패', '아이디 또는 비밀번호를 확인하세요.');
    }
  };

  return (
    <View style={styles.container}>
      {/* 원형 로고 */}
      <Image
        source={require('../../assets/images/main.jpeg')} // 직접 설정하세요
        style={styles.logo}
      />

      <Text style={styles.title}>카본 뱅크</Text>
      <Text style={styles.subtitle}>노스텔지아 드라이브</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>아이디</Text>
        <TextInput
          style={styles.input}
          placeholder="아이디를 입력하세요"
          placeholderTextColor="#A0AEC0"
          value={userId}
          onChangeText={setUserId}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>비밀번호</Text>
        <TextInput
          style={styles.input}
          placeholder="비밀번호를 입력하세요"
          placeholderTextColor="#A0AEC0"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.loginButton, styles.guardianButton]}
          onPress={() => handleLogin('parent')}
        >
          <Text style={styles.loginButtonText}>로그인</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity>
        <Text style={styles.forgotText}>비밀번호를 잊으셨나요?</Text>
      </TouchableOpacity>

      <View style={styles.signupContainer}>
        <Text style={styles.signupPrompt}>계정이 없으신가요?</Text>
        <TouchableOpacity
          style={styles.signupButton}
          onPress={() => navigate('RegisteryScreen')}
        >
          <Text style={styles.signupButtonText}>회원가입</Text>
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
    paddingHorizontal: 24,
    paddingTop: 100,           // 위로 당겨서 전체 컨텐츠를 올림
    alignItems: 'center',     // 가운데 정렬
  },
  logo: {
    width: 150,
    height: 150,
    borderRadius: 50,         // 완전한 원형
    marginBottom: 24,
    backgroundColor: '#EDF2F7',
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    color: '#3384FF',
    textAlign: 'center',
    marginBottom: 6,          // subtitle과의 간격 줄임
  },
  subtitle: {
    fontSize: 16,
    color: '#2E7DD7',
    textAlign: 'center',
    marginBottom: 24,         // 입력폼과의 간격
  },
  inputContainer: {
    width: '100%',
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2E7DD7',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CBD5E0',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#2D3748',
    backgroundColor: '#EDF2F7',
  },
  buttonContainer: {
    width: '100%',
    marginVertical: 20,
  },
  loginButton: {
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  guardianButton: {
    backgroundColor: '#A0CDFE',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  forgotText: {
    fontSize: 14,
    color: '#2E7DD7',
    textDecorationLine: 'underline',
    marginTop: 12,
    marginBottom: 20,
  },
  signupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  signupPrompt: {
    fontSize: 14,
    color: '#2E7DD7',
    marginRight: 8,
  },
  signupButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#3384FF',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  signupButtonText: {
    color: '#3384FF',
    fontSize: 14,
    fontWeight: '600',
  },
});
