/*  ────────────────────────────────────
    MediaSelectionScreen.tsx (v14.x)
    리워드 광고 + 모달 + 테겐 분석 〈다국어 + 로딩 오버레이〉
    ──────────────────────────────────── */
    import React, { useEffect, useRef, useState } from 'react';
    import {
      View,
      Text,
      TouchableOpacity,
      StyleSheet,
      Platform,
      SafeAreaView,
      Image,
      Alert,
      ActivityIndicator,
    } from 'react-native';
    import Ionicons from '@expo/vector-icons/Ionicons';
    import Modal from 'react-native-modal';
    import {
      launchCamera,
      launchImageLibrary,
      CameraOptions,
      ImageLibraryOptions,
      ImagePickerResponse,
    } from 'react-native-image-picker';
    import { goBack, navigate } from '../../navigation/NavigationUtils';
    import { useAppSelector, useAppDispatch } from '../../redux/config/reduxHook';
    import { LangCode, translations } from '../../utils/translations';
    import { uploadFile } from '../../redux/actions/fileAction';
    import { geminiImageAction } from '../../redux/actions/geminiAction';
    
    /* ── AdMob ─────────────────────────── */
    import {
      AdEventType,
      RewardedAd,
      RewardedAdEventType,
    } from 'react-native-google-mobile-ads';
    
    const AD_UNIT_IOS = 'ca-app-pub-9384938904470201/3338318006';
    const AD_UNIT_ANDROID = 'ca-app-pub-9384938904470201/5264244396';

    // 테스트 광고 ID (iOS는 구글이 제공한 공식 테스트 ID 사용)
    const AD_UNIT_TEST_IOS = 'ca-app-pub-3940256099942544/1712485313';
    const AD_UNIT_TEST_ANDROID = 'ca-app-pub-3940256099942544/5224354917'; // 필요 시

    // 개발(build - debug) ↔︎ 배포(build - release) 구분
    const isProd = !__DEV__;
    const adUnitId = Platform.OS === 'ios'
  ? (isProd ? AD_UNIT_IOS : AD_UNIT_TEST_IOS)
  : (isProd ? AD_UNIT_ANDROID : AD_UNIT_TEST_ANDROID);
    
    interface Props {
      route: { params: { sex: '남' | '여' } };
    }
    
    export default function MediaSelectionScreen({ route }: Props) {
      const sex  = route.params?.sex ?? '남';
      const lang = useAppSelector((s: any) => s.language.lang) as LangCode;
      const t    = translations.mediaTranslations[lang];
      const dispatch = useAppDispatch();
    
      const [selectedImage, setSelectedImage] = useState<string | null>(null);
      const [loading,       setLoading]       = useState(false);
      const [modalVisible,  setModalVisible]  = useState(false);

      const confirmModal = () => {
        setModalVisible(false);
        showRewardedAndAnalyze();
      };
    
      /* ───────── Gemini 호출 ───────── */
      const geminiCall = async (uri: string) => {
        setLoading(true);                  // ← 스피너 ON
        try {
          const uploaded = await dispatch(uploadFile(uri, 'face_image'));
          const res      = await dispatch(geminiImageAction(uploaded, sex, lang));
          navigate('FaceResultScreen', {
            scores: res?.data, sex, photoUri: uploaded,
          });
        } catch { Alert.alert(t.errorText); }
        finally { setLoading(false); }     // ← 스피너 OFF
      };
    
      /* ───────── 리워드 광고 & 분석 ─── */
      const showRewardedAndAnalyze = () => {
        setLoading(true);                  // 스피너 ON (로딩 + 광고 표시 직전)
        const rewarded = RewardedAd.createForAdRequest(adUnitId, {
          requestNonPersonalizedAdsOnly: true,
        });
        const loadedLister = rewarded.addAdEventListener(
          RewardedAdEventType.LOADED, () => rewarded.show());
        const rewardLister = rewarded.addAdEventListener(
          RewardedAdEventType.EARNED_REWARD, () => {
            selectedImage && geminiCall(selectedImage);
          });

        const errorLister = rewarded.addAdEventListener(
          AdEventType.ERROR, () => {

            selectedImage && geminiCall(selectedImage);
          });
        
        cleanupRef.current = () => { loadedLister(); rewardLister(); errorLister();};
        rewarded.load();
      };
    
      /* ───────── 기타 유틸 ─────────── */
      const cleanupRef = useRef<null | (() => void)>(null);
      useEffect(() => () => cleanupRef.current?.(), []);
    
      const takePhoto = () => {
        const opt: CameraOptions = { mediaType:'photo', cameraType:'back', saveToPhotos:true };
        launchCamera(opt, (r:ImagePickerResponse)=>{
          if (r.assets?.[0]?.uri) setSelectedImage(r.assets[0].uri);
        });
      };
      const pickGallery = async () => {
        const opt: ImageLibraryOptions = { mediaType:'photo', selectionLimit:1 };
        const r = await launchImageLibrary(opt);
        if (r.assets?.[0]?.uri) setSelectedImage(r.assets[0].uri);
      };
    
      return (
        <SafeAreaView style={styles.safe}>
          {/* ── 헤더 ───────────────────── */}
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={goBack} style={styles.backIconBtn}>
              <Ionicons name="chevron-back" size={30} color="#222"/>
            </TouchableOpacity>
          </View>
    
          {/* ── 본문 ───────────────────── */}
          <View style={styles.content}>
            <Text style={styles.title}>{t.title}</Text>
    
            {/* 갤러리 / 카메라 선택 */}
            <View style={styles.buttonGroup}>
              <TouchableOpacity style={styles.galleryBtn} onPress={pickGallery}>
                <Ionicons name="images-outline" size={24} color="#fff" style={{ marginRight:6 }}/>
                <Text style={styles.galleryText}>{t.pickGalleryText}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cameraBtn}  onPress={takePhoto}>
                <Ionicons name="camera-outline" size={22} color="#222" style={{ marginRight:7 }}/>
                <Text style={styles.cameraText}>{t.takePhotoText}</Text>
              </TouchableOpacity>
            </View>
    
            {/* 미리보기 */}
            {selectedImage && (
              <View style={styles.previewBox}>
                <Image source={{ uri:selectedImage }} style={styles.previewImg}/>
                <TouchableOpacity onPress={()=>setSelectedImage(null)}
                  style={styles.removeBtn} hitSlop={15}>
                  <Ionicons name="close-circle" size={22} color="#FC3468"/>
                </TouchableOpacity>
              </View>
            )}
    
            {/* 분석 버튼 */}
            <TouchableOpacity
              disabled={!selectedImage || loading}
              style={[
                styles.analyzeBtn,
                selectedImage ? styles.analyzeBtnActive : styles.analyzeBtnInactive,
                loading && { opacity:0.45 },
              ]}
              onPress={()=>setModalVisible(true)}>
              <Ionicons name="sparkles" size={22}
                color={selectedImage ? '#fff' : '#bbb'} style={{ marginRight:7 }}/>
              <Text style={[
                styles.analyzeText,
                { color:selectedImage ? '#fff' : '#bbb' }]}>
                {loading ? t.analyzingText : t.analyzeButton}
              </Text>
            </TouchableOpacity>
    
            <Text style={styles.tip}>{t.tip1}</Text>
            <Text style={styles.tip}>{t.tip2}</Text>
          </View>
    
          {/* ── 광고 안내 모달 ─────────── */}
          <Modal isVisible={modalVisible}
            animationIn="zoomIn" animationOut="fadeOut"
            backdropOpacity={0.25}
            onBackdropPress={()=>setModalVisible(false)}
            useNativeDriver hideModalContentWhileAnimating>
            <View style={styles.modalBox}>
              <Ionicons name="gift-outline" size={36} color="#FC3468"
                        style={{ marginBottom:12 }}/>
              <Text style={styles.modalTitle}>{t.modalTitle}</Text>
              <Text style={styles.modalDesc}>
                {t.modalDescPart1}
                <Text style={{ color:'#FF3366', fontWeight:'bold' }}>{t.modalDescHighlight}</Text>
                {t.modalDescPart2}
              </Text>
              <View style={styles.modalBtns}>
                <TouchableOpacity style={styles.modalBtnCancel}
                  onPress={()=>setModalVisible(false)}>
                  <Text style={styles.modalBtnTextCancel}>{t.cancelText}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalBtnOk} onPress={confirmModal}>
                  <Text style={styles.modalBtnTextOk}>{t.confirmText}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
    
          {/* ── 로딩 스피너 오버레이 ───── */}
          {loading && (
            <View style={styles.loadingOverlay} pointerEvents="none">
              <ActivityIndicator size="small" color="#FC3468"/>
            </View>
          )}
        </SafeAreaView>
      );
    }
    
    /* ───────────────────────── 스타일 ───────────────────────── */
    const styles = StyleSheet.create({
      safe:{ flex:1, backgroundColor:'#fff' },
    
      /* 헤더 */
      headerRow:{ flexDirection:'row', alignItems:'center',
                  height: Platform.OS==='ios'?56:48, paddingHorizontal:6 },
      backIconBtn:{ padding:8, width:40, alignItems:'center' },
    
      /* 본문 */
      content:{ flex:1, justifyContent:'center', alignItems:'center',
                marginBottom:80, paddingHorizontal:18 },
      title:{ fontSize:24, fontWeight:'bold', color:'#111',
              textAlign:'center', marginBottom:36, lineHeight:34 },
    
      buttonGroup:{ width:'80%', flexDirection:'row', gap:22,
                    marginBottom:30, justifyContent:'center' },
      galleryBtn:{ flex:1, flexDirection:'row', alignItems:'center',
                   backgroundColor:'#111', borderRadius:25, paddingVertical:18,
                   justifyContent:'center', marginRight:7 },
      galleryText:{ color:'#fff', fontSize:18, fontWeight:'bold' },
      cameraBtn:{ flex:1, flexDirection:'row', alignItems:'center',
                  backgroundColor:'#fff', borderRadius:25, borderWidth:1.5,
                  borderColor:'#111', paddingVertical:18, justifyContent:'center',
                  marginLeft:7 },
      cameraText:{ color:'#111', fontSize:18, fontWeight:'bold' },
    
      previewBox:{ marginTop:26, marginBottom:18, width:145, height:145,
                   borderRadius:19, overflow:'hidden', borderWidth:1.5,
                   borderColor:'#f3c8e0', backgroundColor:'#f8f8fa',
                   alignItems:'center', justifyContent:'center', position:'relative' },
      previewImg:{ width:140, height:140, borderRadius:14 },
      removeBtn:{ position:'absolute', top:6, right:6,
                  backgroundColor:'rgba(255,255,255,0.9)', borderRadius:12 },
    
      analyzeBtn:{ flexDirection:'row', alignItems:'center',
                   borderRadius:26, marginTop:10, marginBottom:18,
                   paddingVertical:16, paddingHorizontal:38 },
      analyzeBtnActive:{ backgroundColor:'#FC3468' },
      analyzeBtnInactive:{ backgroundColor:'#e8e7e7' },
      analyzeText:{ fontWeight:'bold', fontSize:18 },
    
      tip:{ color:'#B3B3B3', fontSize:14, marginTop:10,
            textAlign:'center', fontWeight:'500' },
    
      /* 광고 모달 */
      modalBox:{ backgroundColor:'#fff', borderRadius:20,
                 paddingVertical:36, paddingHorizontal:30, alignItems:'center' },
      modalTitle:{ fontSize:19, fontWeight:'bold', color:'#222', marginBottom:10 },
      modalDesc:{ fontSize:16, color:'#444', textAlign:'center',
                  lineHeight:22, marginBottom:18 },
      modalBtns:{ flexDirection:'row', width:'100%', justifyContent:'space-between' },
      modalBtnCancel:{ flex:1, backgroundColor:'#eee', borderRadius:11, marginRight:7,
                       paddingVertical:12, alignItems:'center' },
      modalBtnOk:{ flex:1, backgroundColor:'#FC3468', borderRadius:11, marginLeft:7,
                   paddingVertical:12, alignItems:'center' },
      modalBtnTextCancel:{ color:'#555', fontSize:16, fontWeight:'bold' },
      modalBtnTextOk:{ color:'#fff', fontSize:16, fontWeight:'bold' },
    
      /* 로딩 오버레이 */
      loadingOverlay:{ position:'absolute', top:0, left:0, right:0, bottom:0,
                       backgroundColor:'rgba(255,255,255,0.55)',
                       justifyContent:'center', alignItems:'center', zIndex:20 },
    });
    