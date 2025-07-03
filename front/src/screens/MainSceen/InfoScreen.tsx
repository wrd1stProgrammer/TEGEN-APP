import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
  StatusBar,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { goBack } from '../../navigation/NavigationUtils';
import { useAppSelector } from '../../redux/config/reduxHook';

type LangCode = 'ko' | 'en' | 'ja' | 'zh' | 'vi';

// 노치/StatusBar 높이 자동 계산
const getSafeTop = () => {
  if (Platform.OS === 'ios') return 18;
  return StatusBar.currentHeight ? StatusBar.currentHeight + 8 : 18;
};

const translations: Record<LangCode, {
  title: string;
  rows: string[];
  menu: string[];
}> = {
  ko: {
    title: '테겐상 테스트는?',
    rows: [
      '구글의 빅데이터와 이미지 인식 기술을 바탕으로 제작되었습니다.',
      '사진 데이터는 이미지 분석을 위해 서버에서 사용되고 즉시 삭제됩니다!',
      '궁금한 점이나 문의사항이 있으시면 인스타그램 tegenAI_official 에 DM 남겨주세요!',
    ],
    menu: [
      '공식 인스타그램 바로가기',
      '평점 및 리뷰 남기러 가기',
      '앱 공유',
    ],
  },
  en: {
    title: 'What is the Tegen Face Test?',
    rows: [
      'Developed based on Google’s big data and image recognition technology.',
      'Photos are used on the server for analysis then immediately deleted!',
      'For questions, DM us on Instagram at tegenAI_official!',
    ],
    menu: [
      'Go to official Instagram',
      'Leave a rating & review',
      'Share the app',
    ],
  },
  ja: {
    title: 'テゲンフェイステストとは？',
    rows: [
      'Googleのビッグデータと画像認識技術を基に作成されました。',
      '写真データは分析のためにサーバーで使用後、即座に削除されます！',
      'ご質問は InstagramのtegenAI_officialまでDMしてください！',
    ],
    menu: [
      '公式Instagramへ',
      '評価とレビューを書く',
      'アプリを共有',
    ],
  },
  zh: {
    title: '什么是特根面孔测试？',
    rows: [
      '基于Google大数据和图像识别技术制作。',
      '照片数据在服务器分析后会立即删除！',
      '如有疑问，请在Instagram关注tegenAI_official并私信！',
    ],
    menu: [
      '前往官方Instagram',
      '留下评分和评论',
      '分享应用',
    ],
  },
  vi: {
    title: 'Bài kiểm tra khuôn mặt Tegen là gì?',
    rows: [
      'Được phát triển dựa trên dữ liệu lớn và công nghệ nhận dạng hình ảnh của Google.',
      'Ảnh được sử dụng trên máy chủ để phân tích và ngay lập tức bị xóa!',
      'Nếu có thắc mắc, vui lòng DM trên Instagram tại tegenAI_official!',
    ],
    menu: [
      'Đến Instagram chính thức',
      'Để lại đánh giá & bình luận',
      'Chia sẻ ứng dụng',
    ],
  },
};

export default function InfoScreen() {
  const safeTop = getSafeTop();
  const lang = useAppSelector((state: any) => state.language.lang) as LangCode;
  const { title, rows, menu } = translations[lang];

  // 첫 번째 메뉴(인스타그램) 링크만 지정
  const menuLinks = [
    'https://www.instagram.com/tegenai_official?igsh=MWQ0bHZnbmc5ZmlrOQ%3D%3D&utm_source=qr',
    '', '', '',
  ];

  const onPressMenu = (idx: number) => {
    const url = menuLinks[idx];
    if (url) {
      Linking.openURL(url).catch(err => console.error('링크 열기 오류', err));
    } else {
      // TODO: 나머지 메뉴에 대한 처리 (공유, 리뷰 등)
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={[styles.container, { paddingTop: safeTop + 24 }]}>
        {/* 닫기 버튼 */}
        <TouchableOpacity style={[styles.closeBtn, { top: safeTop }]} onPress={goBack}>
          <Icon name="close-outline" size={34} color="#aaa" />
        </TouchableOpacity>

        {/* 타이틀 */}
        <Text style={styles.title}>{title}</Text>

        {/* 설명 카드 */}
        <View style={styles.card}>
          {rows.map((text, idx) => (
            <View style={styles.row} key={idx}>
              <Icon
                name={['logo-octocat', 'image-outline', 'logo-youtube'][idx]}
                size={25}
                color="#111"
                style={styles.rowIcon}
              />
              <Text style={styles.rowText}>{text}</Text>
            </View>
          ))}
        </View>

        {/* 하단 메뉴 */}
        <View style={styles.menuList}>
          {menu.map((label, idx) => (
            <TouchableOpacity
              style={styles.menuItem}
              key={idx}
              onPress={() => onPressMenu(idx)}
            >
              <Text style={styles.menuText}>{label}</Text>
              <Icon name="chevron-forward-outline" size={22} color="#888" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  container: { paddingHorizontal: 18, paddingBottom: 30 },
  closeBtn: {
    position: 'absolute',
    right: 8,
    zIndex: 10,
  },
  title: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#151515',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#FAFAFA',
    borderRadius: 16,
    padding: 19,
    marginBottom: 30,
    elevation: 2,
    shadowColor: '#ddd',
    shadowOpacity: 0.09,
    shadowRadius: 7,
  },
  row: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 19 },
  rowIcon: { marginRight: 13, marginTop: 2 },
  rowText: { flex: 1, color: '#222', fontSize: 15.7, fontWeight: '400', lineHeight: 21 },
  menuList: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 5,
    marginBottom: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#F3F3F3',
    borderBottomWidth: 1,
    paddingVertical: 16,
    paddingHorizontal: 3,
    justifyContent: 'space-between',
  },
  menuText: { fontSize: 16.3, color: '#222' },
});
