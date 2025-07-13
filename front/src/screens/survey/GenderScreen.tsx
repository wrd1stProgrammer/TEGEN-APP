import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { navigate } from '../../navigation/NavigationUtils';
import { useAppSelector } from '../../redux/config/reduxHook';
import { LangCode, translations } from '../../utils/translations';

const { height: windowHeight } = Dimensions.get('window');
const ICON_SIZE = windowHeight * 0.07; // 화면 높이의 10%를 아이콘 크기로
const ROW_HEIGHT = windowHeight * 0.2; // 화면 높이의 30%를 버튼 행 높이로

export default function GenderScreen() {
  const lang = useAppSelector((state: any) => state.language.lang) as LangCode;
  const { question, male, female } = translations.genderTranslations[lang];

  return (
    <View style={styles.container}>
      <Text style={styles.question}>{question}</Text>

      <View style={[styles.row, { height: ROW_HEIGHT }]}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigate('MediaSelectionScreen', { sex: '남' })}
        >
          <Icon name="mars" size={ICON_SIZE} color="#3498db" />
          <Text style={[styles.label, { color: '#3498db' }]}>{male}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigate('MediaSelectionScreen', { sex: '여' })}
        >
          <Icon name="venus" size={ICON_SIZE} color="#e74c3c" />
          <Text style={[styles.label, { color: '#e74c3c' }]}>{female}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  question: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 1,
    textAlign: 'center',
  },
  row: {
    width: '60%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  iconButton: {
    alignItems: 'center',
  },
  label: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '500',
  },
});
