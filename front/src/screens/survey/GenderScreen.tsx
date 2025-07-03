import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { navigate, goBack } from '../../navigation/NavigationUtils';
import { useAppSelector } from '../../redux/config/reduxHook';
import { LangCode, translations } from '../../utils/translations';

export default function GenderScreen() {
  const lang = useAppSelector((state: any) => state.language.lang) as LangCode;
  const { question, male, female } = translations.genderTranslations[lang];

  return (
    <View style={styles.container}>
      <Text style={styles.question}>{question}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigate('MediaSelectionScreen', { sex: '남' })}
      >
        <Text style={styles.buttonText}>{male}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigate('MediaSelectionScreen', { sex: '여' })}
      >
        <Text style={styles.buttonText}>{female}</Text>
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
  question: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 48,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#111',
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 48,
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
