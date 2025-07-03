import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAppSelector, useAppDispatch } from '../../redux/config/reduxHook';
import { setLanguage } from '../../redux/reducers/languageSlice';
import { navigate } from '../../navigation/NavigationUtils';

const { height } = Dimensions.get('window');
const offset = Math.round(height * 0.25);

type LangCode = 'ko' | 'en' | 'ja' | 'zh' | 'vi';

const translations: Record<LangCode, { greet: string; btn: string }> = {
  ko: { greet: '테토·에겐 테스트', btn: '시작하기' },
  en: { greet: 'Teto vs Egen Test', btn: 'Start' },
  ja: { greet: 'テト・エゲン テスト', btn: '始める' },
  zh: { greet: 'Teto vs Egen 测试', btn: '开始' },
  vi: { greet: 'Bài kiểm tra Teto và Egen', btn: 'Bắt đầu' },
};

const flags: Record<LangCode, string> = {
  ko: '🇰🇷',
  en: '🇺🇸',
  ja: '🇯🇵',
  zh: '🇨🇳',
  vi: '🇻🇳',
};

export default function WelcomeScreen() {
  const dispatch = useAppDispatch();
  const lang = useAppSelector((state: any) => state.language.lang) as LangCode;
  const [modalVisible, setModalVisible] = useState(false);

  const { greet, btn } = translations[lang];

  const onSelectLang = (code: LangCode) => {
    dispatch(setLanguage(code));
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigate('InfoScreen')} style={styles.iconBtn}>
          <Icon name="information-circle-outline" size={28} color="#111" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.iconBtn}>
          <Icon name="globe-outline" size={28} color="#111" />
        </TouchableOpacity>
      </View>

      {/* Main */}
      <View style={[styles.container, { marginTop: offset }]}>
        <Text style={styles.greet}>{greet}</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigate('Gender')}>
          <Text style={styles.buttonText}>{btn}</Text>
        </TouchableOpacity>
      </View>

      {/* Language Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            {(Object.keys(translations) as LangCode[]).map(code => (
              <TouchableOpacity
                key={code}
                style={styles.langBtn}
                onPress={() => onSelectLang(code)}
              >
                <Text style={styles.flag}>{flags[code]}</Text>
                <Text style={styles.langText}>
                  {code === 'ko'
                    ? '한국어'
                    : code === 'en'
                    ? 'English'
                    : code === 'ja'
                    ? '日本語'
                    : code === 'zh'
                    ? '中文'
                    : 'Tiếng Việt'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Developed by @mins2k</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 13,
    alignItems: 'center',
    height: 54,
    backgroundColor: '#fff',
    zIndex: 2,
  },
  iconBtn: { padding: 4 },
  container: { flex: 1, alignItems: 'center' },
  greet: { fontSize: 28, fontWeight: 'bold', color: '#111', marginBottom: 28 },
  button: {
    backgroundColor: '#111',
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 48,
    marginTop: 12,
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: { width: '80%', backgroundColor: '#fff', borderRadius: 12, paddingVertical: 12 },
  langBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 20 },
  flag: { fontSize: 24, marginRight: 12 },
  langText: { fontSize: 18, color: '#333' },
  footer: {

    position: 'absolute',
    bottom: 60,
    width: '100%',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    color: '#999',
  },
});
