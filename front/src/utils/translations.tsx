// localization/translations.ts

// 지원 언어 코드를 정의
export type LangCode = 'ko' | 'en' | 'ja' | 'zh' | 'vi';

// 각 화면별 번역 맵
export const translations = {
  // GenderScreen 번역
  genderTranslations: {
    ko: { question: '성별을 선택해 주세요', male: '남자', female: '여자' },
    en: { question: 'Please select your gender',   male: 'Male',  female: 'Female' },
    ja: { question: '性別を選択してください',      male: '男性',   female: '女性'   },
    zh: { question: '请选择您的性别',             male: '男',     female: '女'     },
    vi: { question: 'Vui lòng chọn giới tính',     male: 'Nam',    female: 'Nữ'     },
  },

  // MediaSelectionScreen 번역
  mediaTranslations: {
    ko: {
      title: 'AI 분석을 위해\n사진을 선택해 주세요',
      pickGalleryText: '갤러리',
      takePhotoText: '카메라',
      analyzeButton: 'AI 얼굴상 분석',
      analyzingText: 'AI 분석중…',
      tip1: '셀카/증명사진/인물사진 모두 OK',
      tip2: 'AI 분석 후 사진은 즉시 삭제됩니다.',
      modalTitle: '광고 시청 후 결과 확인',
      modalDescPart1: '리워드 광고 시청을 완료하시면\n',
      modalDescHighlight: '소중한 15초',
      modalDescPart2: '가 개발자에게 큰 힘이 됩니다🥹',
      cancelText: '취소',
      confirmText: '확인',
      errorText: '광고를 불러오지 못했습니다.',
    },
    en: {
      title: 'Select a photo\nfor AI analysis',
      pickGalleryText: 'Gallery',
      takePhotoText: 'Camera',
      analyzeButton: 'Analyze Face',
      analyzingText: 'Analyzing…',
      tip1: 'Selfie / Portrait / People OK',
      tip2: 'Photo will be deleted after analysis.',
      modalTitle: 'Watch ad to continue',
      modalDescPart1: 'After watching the rewarded ad\n',
      modalDescHighlight: '15 seconds',
      modalDescPart2: ' help support the developer🥹',
      cancelText: 'Cancel',
      confirmText: 'OK',
      errorText: 'Failed to load ad.',
    },
    ja: {
      title: 'AI解析のために\n写真を選択してください',
      pickGalleryText: 'ギャラリー',
      takePhotoText: 'カメラ',
      analyzeButton: '顔分析',
      analyzingText: '分析中…',
      tip1: 'セルフィー/ポートレート/人物写真 OK',
      tip2: '分析後に写真は削除されます。',
      modalTitle: '広告を視聴して続行',
      modalDescPart1: 'リワード広告視聴後\n',
      modalDescHighlight: '15秒',
      modalDescPart2: 'で開発者をサポート🥹',
      cancelText: 'キャンセル',
      confirmText: 'OK',
      errorText: '広告を読み込めませんでした。',
    },
    zh: {
      title: '请选择用于AI分析的照片',
      pickGalleryText: '图库',
      takePhotoText: '相机',
      analyzeButton: '分析面部',
      analyzingText: '分析中…',
      tip1: '自拍/肖像/人物照片均可',
      tip2: '分析后照片将被删除。',
      modalTitle: '观看广告继续',
      modalDescPart1: '观看奖励广告后\n',
      modalDescHighlight: '15秒',
      modalDescPart2: '即支持开发者🥹',
      cancelText: '取消',
      confirmText: '确定',
      errorText: '广告加载失败。',
    },
    vi: {
      title: 'Chọn ảnh để phân tích AI',
      pickGalleryText: 'Thư viện',
      takePhotoText: 'Máy ảnh',
      analyzeButton: 'Phân tích khuôn mặt',
      analyzingText: 'Đang phân tích…',
      tip1: 'Chấp nhận selfie/ảnh chân dung/ảnh người',
      tip2: 'Ảnh sẽ bị xóa sau khi phân tích.',
      modalTitle: 'Xem quảng cáo để tiếp tục',
      modalDescPart1: 'Sau khi xem quảng cáo thưởng\n',
      modalDescHighlight: '15 giây',
      modalDescPart2: ' bạn hỗ trợ nhà phát triển🥹',
      cancelText: 'Hủy',
      confirmText: 'OK',
      errorText: 'Không tải được quảng cáo.',
    },
  },

   /* FaceResultScreen */
   faceResultTranslations: {
    
    ko: {
      title: '나의 얼굴상 점수',
      radarExplain: '※ 점수가 높을수록 테토 성향, 낮을수록 에겐 성향에 가까워요!',
      retry: '다시하기',
      share: '공유하기',
      retryConfirm: '다시 하시겠습니까? 현재 결과는 삭제됩니다.',
      cancel: '취소',
      confirm: '확인',
      sexSuffix: { male: '남', female: '녀' },

      /* 축 라벨 */
      axes: {
        expression: '표정',
        face_shape: '얼굴형',
        physiognomy: '관상',
        style: '스타일',
        atmosphere: '분위기',
      },
      /* 레벨 라벨 */
      levels: {
        teto: '테토',
        semiTeto: '세미테토',
        tegen: '테겐',
        semiEgen: '세미에겐',
        egen: '에겐',
      },
    },

    en: {
      title: 'My Face Score',
      radarExplain: '※ Higher score → Teto, lower → Egen',
      retry: 'Retry',
      share: 'Share',
      retryConfirm: 'Retry? Current result will be lost.',
      cancel: 'Cancel',
      confirm: 'OK',
      sexSuffix: { male: 'Boy', female: 'Girl' },   // → “Teto Boy / Teto Girl”

      axes: {
        expression: 'Expression',
        face_shape: 'Face shape',
        physiognomy: 'Physiognomy',
        style: 'Style',
        atmosphere: 'Mood',
      },
      levels: {
        teto: 'Teto',
        semiTeto: 'Semi-Teto',
        tegen: 'Tegen',
        semiEgen: 'Semi-Egen',
        egen: 'Egen',
      },
    },

    ja: {
      title: '私の顔スコア',
      radarExplain: '※ スコアが高いほどテト傾向、低いほどエゲン傾向',
      retry: '再試行',
      share: '共有',
      retryConfirm: '再試行しますか？ 現在の結果は削除されます。',
      cancel: 'キャンセル',
      confirm: 'OK',
      sexSuffix: { male: '男子', female: '女子' },  // → “テト男子” 등

      axes: {
        expression: '表情',
        face_shape: '顔形',
        physiognomy: '観相',
        style: 'スタイル',
        atmosphere: '雰囲気',
      },
      levels: {
        teto: 'テト',
        semiTeto: 'セミテト',
        tegen: 'テゲン',
        semiEgen: 'セミエゲン',
        egen: 'エゲン',
      },
    },

    zh: {
      title: '我的面部评分',
      radarExplain: '※ 分数越高越趋向 Teto，越低越趋向 Egen',
      retry: '重试',
      share: '分享',
      retryConfirm: '确定重试？ 当前结果将被删除。',
      cancel: '取消',
      confirm: '确定',
      sexSuffix: { male: '男', female: '女' },

      axes: {
        expression: '表情',
        face_shape: '脸型',
        physiognomy: '相学',
        style: '风格',
        atmosphere: '氛围',
      },
      levels: {
        teto: 'Teto',
        semiTeto: '半-Teto',
        tegen: 'Tegen',
        semiEgen: '半-Egen',
        egen: 'Egen',
      },
    },

    vi: {
      title: 'Điểm khuôn mặt của tôi',
      radarExplain: '※ Điểm cao → Teto, điểm thấp → Egen',
      retry: 'Thử lại',
      share: 'Chia sẻ',
      retryConfirm: 'Thử lại? Kết quả hiện tại sẽ bị xoá.',
      cancel: 'Hủy',
      confirm: 'OK',
      sexSuffix: { male: 'Nam', female: 'Nữ' },
      axes: {
        expression: 'Biểu cảm',
        face_shape: 'Hình mặt',
        physiognomy: 'Tướng mạo',
        style: 'Phong cách',
        atmosphere: 'Bầu không khí',
      },
      levels: {
        teto: 'Teto',
        semiTeto: 'Bán-Teto',
        tegen: 'Tegen',
        semiEgen: 'Bán-Egen',
        egen: 'Egen',
      },
    },
   }
};
