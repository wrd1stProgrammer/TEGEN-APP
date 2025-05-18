/* src/screens/MainScreen/PatientHomeScreen.tsx */
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  View, Text, StyleSheet, Image, SectionList,
  TouchableOpacity, Modal, Alert, RefreshControl, Dimensions, Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import Share, { Social } from 'react-native-share';
import * as FileSystem from 'expo-file-system';
import { appAxios } from '../../redux/config/apiConfig';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useAppDispatch, useAppSelector } from '../../redux/config/reduxHook';
import { uploadFile } from '../../redux/actions/fileAction';
import { selectUser } from '../../redux/reducers/userSlice';
import { Logout, refetchUser } from '../../redux/actions/userAction';
import { ActivityIndicator } from 'react-native';
const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const HEADER_RATIO = 0.28;

/* ---------- types (모델과 동일) ---------- */
interface Stage {
  title: string;
  desc: string;
  expected_reduction_g: number;
  completed: boolean;
  difficulty: 'easy' | 'normal' | 'hard';
  proofImageUrl?: string;          // 모델 필드 이름
}
interface Mission {
  _id: string;
  createdAt: string;
  stages: Stage[];
}

/* ---------- component ---------- */
const PatientHomeScreen: React.FC = () => {
  const insets  = useSafeAreaInsets();
  const dispatch = useAppDispatch();
    const [finishLoader, setFinishLoader] = useState({ visible:false, msg:'' });


  const user         = useAppSelector(selectUser);
  const carbonSaved  = (user?.carbonSaved_g ?? 0) / 1000;
  const bearTemp     = user?.bearTemp ?? 75;

  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading,  setLoading ] = useState(false);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [current, setCurrent] = useState<{ missionId:string; stageIndex:number; difficulty:Stage['difficulty'] }|null>(null);

  /* ---- fetch ---- */
  const fetchMissions = useCallback(async () => {
    try {
      setLoading(true);
      await dispatch(refetchUser());
      const { data } = await appAxios.get<Mission[]>('/carbon/missionall');
      setMissions(data);
    } catch (e) {
      console.warn('미션 조회 실패', e);
      setMissions([]);
    } finally { setLoading(false); }
  }, []);
  useEffect(() => { fetchMissions(); }, [fetchMissions]);

  /* ---- group ---- */
  const sections = useMemo(() => {
    const map: Record<string, Mission[]> = {};
    missions.forEach(m=>{
      const d = new Date(m.createdAt).toISOString().slice(0,10);
      (map[d] ||= []).push(m);
    });
    return Object.keys(map).sort((a,b)=>a<b?1:-1)
      .map(date=>({ title:date, data:map[date] }));
  }, [missions]);

  /* ---- 완료 ---- */
  /* ---- 완료 ---- */
  const completeStageWithImage = async (uri:string) => {
    if (!current) return;

    /* 단계별 메시지 타이머 시작 */
    setFinishLoader({ visible:true, msg:'업로드 중...' });
    setTimeout(()=>setFinishLoader({ visible:true, msg:'AI 검토 중...' }), 2000);
    setTimeout(()=>setFinishLoader({ visible:true, msg:'미션 완료!'   }), 5000);

    try {
      const { payload } = await dispatch(uploadFile(uri,'qcr_image'));
      const imageUrl = (payload as any)?.url ?? payload;

      await appAxios.post('/mission/complete',{
        missionId:current.missionId, stageIndex:current.stageIndex,
        difficulty:current.difficulty, imageUrl,
      });

      /* 로컬 반영 */
      setMissions(prev=>prev.map(m=>m._id!==current.missionId?m:{
        ...m,
        stages:m.stages.map((s,i)=> i===current.stageIndex?{...s,completed:true,proofImageUrl:imageUrl}:s),
      }));
    } catch {
      Alert.alert('오류','미션 완료 처리 실패');
    } finally {
      setCurrent(null);
      setPickerVisible(false);
      /* 6초 시점(5~6) 로딩 종료 */
      setTimeout(()=>setFinishLoader({ visible:false, msg:'' }), 6000);
    }
  };
  const openPicker = (missionId:string, stageIndex:number, diff:Stage['difficulty']) => {
    setCurrent({ missionId, stageIndex, difficulty: diff });
    setPickerVisible(true);
  };

  const takePhoto   = () => launchCamera   ({ mediaType:'photo', cameraType:'back', saveToPhotos:true },
                                           r=>r.assets?.[0]?.uri && completeStageWithImage(r.assets[0].uri));
  const pickGallery = () => launchImageLibrary({ mediaType:'photo', selectionLimit:1 },
                                           r=>r.assets?.[0]?.uri && completeStageWithImage(r.assets[0].uri));

                                           

  /* ---- 공유 (Instagram Stories) ---- */
  const shareStage = async (stage: Stage) => {
    if (!stage.proofImageUrl) {
      Alert.alert('공유 실패','인증 이미지가 없습니다.');
      return;
    }

    let local = stage.proofImageUrl;
    const isRemote = !local.startsWith('file://') && !local.startsWith('content://');

    // // Android는 로컬 파일만 backgroundImage 허용 → 원격일 때 다운로드
    // if (isRemote && Platform.OS === 'android') {
    //   try {
    //     const { uri } = await FileSystem.downloadAsync(
    //       encodeURI(local),
    //       FileSystem.cacheDirectory + `story-${Date.now()}.jpg`
    //     );
    //     local = uri;
    //   } catch (e) {
    //     console.log('download error', e);
    //     Alert.alert('공유 실패','이미지 다운로드에 문제가 있습니다.');
    //     return;
    //   }
    // }

    try {
      await Share.shareSingle({
        social: Share.Social.INSTAGRAM,
        ...(local.startsWith('file://') || local.startsWith('content://')
          ? { backgroundImage: local }        // 로컬 파일
          : { url: local }                    // iOS는 원격 URL 허용
        ),
        type: 'image/*',
      });
    } catch (e) {
      console.log('share error', e);
      Alert.alert('공유 실패','Instagram 스토리 공유를 진행할 수 없습니다.');
    }
  };

  /* ---- UI ---- */
  const HEADER_HEIGHT = SCREEN_HEIGHT*HEADER_RATIO + insets.top;

  return (
    <View style={styles.root}>
      {/* ----- Header ----- */}
      <LinearGradient
        colors={['#B7DBFF','#E8F3FF']}
        style={[styles.header,{height:HEADER_HEIGHT,paddingTop:insets.top}]}
      >
        <TouchableOpacity style={[styles.iconBtn,{top:insets.top+8,right:16}]} onPress={()=>dispatch(Logout())}>
          <Icon name="person-circle-outline" size={32} color="#fff"/>
        </TouchableOpacity>

        <View style={styles.metricsRow}>
          <MetricBox value={`${carbonSaved.toFixed(2)} kg`} label="CO₂ 절감"/>
          <MetricBox value={`${bearTemp.toFixed(1)}°`}     label="곰곰온도"/>
        </View>

        <View style={styles.bearWrapper}>
          <Image
            source={carbonSaved>10
              ? require('../../assets/images/banner2.png')
              : require('../../assets/images/banner1.png')}
            style={styles.bearImg}
          />
        </View>
      </LinearGradient>

      {/* ----- Content ----- */}
      <SafeAreaView edges={['left','right','bottom']} style={styles.container}>
        <Text style={styles.sectionTitle}>탄소 감소 미션</Text>
        {loading && sections.length===0 && <Text style={styles.info}>불러오는 중...</Text>}
        {!loading && sections.length===0 && <Text style={styles.info}>미션이 없습니다.</Text>}

        <SectionList
          sections={sections}
          keyExtractor={m=>m._id}
          stickySectionHeadersEnabled={false}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchMissions}/>}
          renderSectionHeader={({section:{title}})=>(
            <Text style={styles.dateHeader}>{title}</Text>
          )}
          renderItem={({item})=>(
            <View style={styles.receipt}>
              {item.stages.map((s,idx)=>(
                <View key={s.title} style={[
                  styles.card,
                  { marginBottom:idx===item.stages.length-1?16:8, opacity:s.completed?0.4:1 }
                ]}>
                  <View style={{flex:1}}>
                    <Text style={styles.cardTitle}>{s.title}</Text>
                    <Text style={styles.cardDesc}>{s.desc}</Text>
                    <Text style={styles.cardCO2}>↓ {s.expected_reduction_g} g CO₂e</Text>
                  </View>

                  {s.completed ? (
                    <TouchableOpacity onPress={()=>shareStage(s)} style={styles.shareBtn}>
                      <Icon name="share-social" size={20} color="#fff"/>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity onPress={()=>openPicker(item._id,idx,s.difficulty)} style={styles.certBtn}>
                      <Icon name="camera" size={20} color="#fff"/>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>
          )}
          contentContainerStyle={{paddingBottom:100}}
        />
      </SafeAreaView>

      {/* ----- Image Picker Modal ----- */}
      <Modal transparent visible={pickerVisible} animationType="fade">
        <View style={styles.modalBg}>
          <View style={styles.modalBox}>
            <TouchableOpacity style={styles.modalBtn} onPress={()=>{setPickerVisible(false);takePhoto();}}>
              <Text style={styles.modalTxt}>카메라 촬영</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalBtn} onPress={()=>{setPickerVisible(false);pickGallery();}}>
              <Text style={styles.modalTxt}>갤러리 선택</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.modalBtn,{borderTopWidth:0}]} onPress={()=>setPickerVisible(false)}>
              <Text style={[styles.modalTxt,{color:'#666'}]}>취소</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal transparent visible={finishLoader.visible} animationType="fade">
        <View style={styles.loadingBg}>
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color="#3384FF" />
            <Text style={styles.loadingText}>{finishLoader.msg}</Text>
          </View>
        </View>
      </Modal>

    </View>
  );
};

/* ---------- sub ---------- */
const MetricBox:React.FC<{value:string;label:string}> = ({value,label})=>(
  <View style={styles.metricBox}>
    <Text style={styles.metricValue}>{value}</Text>
    <Text style={styles.metricLabel}>{label}</Text>
  </View>
);

export default PatientHomeScreen;

/* ---------- styles ---------- */
const styles = StyleSheet.create({
  root:{ flex:1, backgroundColor:'#F7F9FB' },

  header:{ width:'100%', alignItems:'center', borderBottomLeftRadius:28, borderBottomRightRadius:28 },
  iconBtn:{ position:'absolute' },

  metricsRow:{ flexDirection:'row', gap:24, marginTop:16 },
  metricBox:{ alignItems:'center' },
  metricValue:{ fontSize:24, fontWeight:'bold', color:'#1E6ED0' },
  metricLabel:{ fontSize:12, color:'#444' },

  bearWrapper:{ marginTop:20, width:140, height:140, borderRadius:70,
    backgroundColor:'#fff', justifyContent:'center', alignItems:'center',
    shadowColor:'#000', shadowOpacity:0.08, shadowRadius:8, elevation:4 },
  bearImg:{ width:125, height:125, borderRadius:62.5 },

  container:{ flex:1, paddingHorizontal:16 },
  sectionTitle:{ fontSize:18, fontWeight:'700', marginTop:16, marginBottom:8 },
  info:{ color:'#777', marginTop:10 },
  dateHeader:{ fontSize:15, fontWeight:'600', color:'#2B2B2B', marginTop:12 },

  receipt:{},
  card:{ flexDirection:'row', backgroundColor:'#fff', borderRadius:12,
    padding:14, shadowColor:'#000', shadowOpacity:0.05, shadowRadius:4, elevation:1 },
  cardTitle:{ fontWeight:'600', marginBottom:2 },
  cardDesc:{ fontSize:13, color:'#555' },
  cardCO2:{ marginTop:4, fontSize:12, color:'#2E7DD7' },

  certBtn:{ marginLeft:10, backgroundColor:'#2E7DD7', width:40, height:40,
    borderRadius:20, justifyContent:'center', alignItems:'center' },
  shareBtn:{ marginLeft:10, backgroundColor:'#FF9F1C', width:40, height:40,
    borderRadius:20, justifyContent:'center', alignItems:'center' },

  modalBg:{ flex:1, backgroundColor:'rgba(0,0,0,0.3)', justifyContent:'flex-end' },
  modalBox:{ backgroundColor:'#fff', margin:12, borderRadius:12, overflow:'hidden' },
  modalBtn:{ padding:16, borderTopWidth:StyleSheet.hairlineWidth, borderColor:'#ddd' },
  modalTxt:{ textAlign:'center', fontSize:16 },
  loadingBg:{ flex:1,backgroundColor:'rgba(0,0,0,0.4)',justifyContent:'center',alignItems:'center' },
  loadingBox:{ width:220,paddingVertical:30,borderRadius:16,backgroundColor:'#fff',alignItems:'center' },
  loadingText:{ marginTop:12,fontSize:16,color:'#333' },
});
