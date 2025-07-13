import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
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
      '테겐상 테스트 웹 버전 바로가기',
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
      'Tegen Face Test Web Version',
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
      'テゲンフェイステストウェブ版',
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
      '特根面孔测试网页版',
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
      'Phiên bản web bài kiểm tra khuôn mặt Tegen',
    ],
  },
};

export default function InfoScreen() {
  const safeTop = getSafeTop();
  const lang = useAppSelector((state: any) => state.language.lang) as LangCode;
  const { title, rows, menu } = translations[lang];

  // 두 번째 메뉴(앱스토어)까지는 URL이 있고, 웹버전 URL은 실제 주소로 교체해주세요.
  const menuLinks = [
    'https://www.instagram.com/tegenai_official?igsh=MWQ0bHZnbmc5ZmlrOQ%3D%3D&utm_source=qr',
    'https://apps.apple.com/kr/app/%ED%85%8C%EA%B2%90%EC%83%81-%ED%85%8C%EC%8A%A4%ED%8A%B8/id6748128213',
    'https://tegen-web.vercel.app/', // ← 실제 웹버전 주소로 바꿀 것
  ];

  const onPressMenu = (idx: number) => {
    const url = menuLinks[idx];
    if (url) {
      Linking.openURL(url).catch(err => console.error('링크 열기 오류', err));
    } else {
      // (필요 시) 공유, 리뷰 기능 처리
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={[styles.container, { paddingTop: safeTop + 24 }]}>
        <TouchableOpacity style={[styles.closeBtn, { top: safeTop }]} onPress={goBack}>
          <Icon name="close-outline" size={34} color="#aaa" />
        </TouchableOpacity>

        <Text style={styles.title}>{title}</Text>

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
  rowText: {
    flex: 1,
    color: '#222',
    fontSize: 15.7,
    fontWeight: '400',
    lineHeight: 21,
  },
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
