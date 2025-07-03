import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, Dimensions, ScrollView, SafeAreaView,
  Image, StatusBar, TouchableOpacity, Share, Modal,
} from 'react-native';
import ViewShot from 'react-native-view-shot';
import {
  VictoryChart, VictoryPolarAxis, VictoryGroup,
  VictoryArea, VictoryTheme, VictoryScatter,
} from 'victory-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { resetAndNavigate } from '../../navigation/NavigationUtils';
import { useAppSelector } from '../../redux/config/reduxHook';
import { LangCode, translations } from '../../utils/translations';

const { width, height } = Dimensions.get('window');
const CHART_SIZE = Math.min(width, height) * 0.78;
const gaugeColors = ['#FF6B81', '#B983FF', '#2ED573', '#FDA7DF', '#22A7F0'];

/* 레벨 → 색 + 다국어 라벨 */
function getLevel(score: number, tLevels: any) {
  if (score >= 80) return { label: tLevels.teto,      color: '#FF6B81' };
  if (score >= 65) return { label: tLevels.semiTeto,  color: '#FFB347' };
  if (score >= 50) return { label: tLevels.tegen,     color: '#4B4B4B' };
  if (score >= 30) return { label: tLevels.semiEgen,  color: '#83B0FF' };
  return               { label: tLevels.egen,         color: '#F78FB3' };
}

export default function FaceResultScreen({ route }: any) {
  const { scores, sex, photoUri } = route.params;
  const lang = useAppSelector((s: any) => s.language.lang) as LangCode;
  const t = translations.faceResultTranslations[lang];

  const axes = [
    { key: 'expression',  label: t.axes.expression   },
    { key: 'face_shape',  label: t.axes.face_shape   },
    { key: 'physiognomy', label: t.axes.physiognomy },
    { key: 'style',       label: t.axes.style        },
    { key: 'atmosphere',  label: t.axes.atmosphere   },
  ];

  const viewShot = useRef<any>();
  const [confirmVisible, setConfirmVisible] = useState(false);

  /* 평균 점수로 레벨 계산 */
  const avg  = axes.reduce((s,d)=>s+scores[d.key].score,0) / axes.length;
  const { label: levelLabel, color } = getLevel(avg, t.levels);

  //const resultLabel = `${levelLabel}${sex === '여' ? '녀' : '남'}`;
  let sexSuffix = sex === '여' ? t.sexSuffix.female : t.sexSuffix.male;
  sexSuffix = sex === '여' ? '녀' : '남';
  const resultLabel = `${levelLabel}${sexSuffix}`;


  const data = axes.map(a => ({ x: a.label, y: scores[a.key].score }));

  /* 공유 */
  const onShare = async () => {
    try {
      const uri = await viewShot.current.capture();
      await Share.share({ title: t.title, url: uri, message: t.share });
    } catch (e) { console.log('share err', e); }
  };

  return (
    <SafeAreaView style={{ flex:1, backgroundColor:'#FFF6FA' }}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <ViewShot ref={viewShot} options={{ format:'jpg', quality:0.94 }}>

          {/* ── 사진 + 레벨 뱃지 ─────────────────────────────── */}
          <View style={styles.photoBox}>
            <View style={styles.imgWrap}>
              <Image source={{ uri: photoUri }} style={styles.profileImg} />
              <View style={[styles.badge,{ backgroundColor:color }]}>
                <Text style={styles.badgeText}>{resultLabel}</Text>
              </View>
            </View>
          </View>

          {/* ── AI 총평 ─────────────────────────────────────── */}
          <View style={styles.descBox}>
            <Text style={styles.descText}>{scores.total?.desc}</Text>
          </View>

          {/* ── 레이더 차트 ─────────────────────────────────── */}
          <View style={styles.cardShadow}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{t.title}</Text>

              <VictoryChart polar theme={VictoryTheme.material}
                width={CHART_SIZE} height={CHART_SIZE} padding={50}
                domain={{ y:[0,100] }}>
                {axes.map((a,i)=>(
                  <VictoryPolarAxis key={i} dependentAxis axisValue={a.label}
                    label={a.label} labelPlacement="perpendicular"
                    style={{
                      axis:{ stroke:'#E6D8E8', strokeWidth:1.3 },
                      axisLabel:{ fontSize:15, fill:'#4B4B4B', fontWeight:'bold' },
                      grid:{ stroke:'#F7BFD8', strokeDasharray:'4,9' },
                      tickLabels:{ fill:'transparent' },
                    }}
                    tickValues={[20,40,60,80,100]}/>
                ))}
                <VictoryGroup colorScale={[color]} style={{ data:{ fillOpacity:0.33, strokeWidth:3 } }}>
                  <VictoryArea   data={data}/>
                  <VictoryScatter data={data} size={8}
                    style={{ data:{ fill:color, stroke:'#fff', strokeWidth:2 } }}/>
                </VictoryGroup>
              </VictoryChart>

              <View style={styles.radarExplain}>
                <Text style={styles.radarExplainText}>{t.radarExplain}</Text>
              </View>
            </View>
          </View>

          {/* ── 게이지바 ────────────────────────────────────── */}
          <View style={styles.gaugeSec}>
            {axes.map((a,i)=>(
              <View key={i} style={styles.gaugeRow}>
                <Text style={styles.gaugeLabel}>{a.label}</Text>
                <View style={styles.gaugeWrap}>
                  <View style={styles.gaugeBg}/>
                  <View style={[
                    styles.gaugeFill,
                    {
                      width:`${scores[a.key].score}%`,
                      backgroundColor:gaugeColors[i%gaugeColors.length],
                    },
                  ]}/>
                </View>
                <Text style={[
                  styles.gaugeScore,
                  { color:gaugeColors[i%gaugeColors.length] },
                ]}>{scores[a.key].score}%</Text>
              </View>
            ))}
          </View>
        </ViewShot>

        {/* ── 하단 버튼 ───────────────────────────────────── */}
        <View style={styles.btnRow}>
          <TouchableOpacity style={styles.btn} onPress={()=>setConfirmVisible(true)}>
            <Ionicons name="reload-outline" size={22} color="#FC3468" style={styles.btnIcon}/>
            <Text style={styles.btnText}>{t.retry}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn} onPress={onShare}>
            <Ionicons name="share-social-outline" size={22} color="#FC3468" style={styles.btnIcon}/>
            <Text style={styles.btnText}>{t.share}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* ── 다시하기 모달 ─────────────────────────────────── */}
      <Modal transparent visible={confirmVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalMsg}>{t.retryConfirm}</Text>
            <View style={styles.modalBtns}>
              <TouchableOpacity style={styles.modalBtn} onPress={()=>setConfirmVisible(false)}>
                <Text style={styles.modalBtnText}>{t.cancel}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalOk]}
                onPress={()=>{ setConfirmVisible(false); resetAndNavigate('Welcome'); }}>
                <Text style={[styles.modalBtnText,{ color:'#fff' }]}>{t.confirm}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

/* ───────────────────────────── 스타일 그대로 ───────────────── */
const styles = StyleSheet.create({
  scroll:{ backgroundColor:'#FFF6FA', paddingBottom:30 },
  photoBox:{ alignItems:'center', marginTop:24, marginBottom:10 },

  /* 프로필 + 뱃지 위치용 래퍼 */
  imgWrap:{ position:'relative', alignSelf:'center' },

  profileImg:{ width:110,height:110,borderRadius:55,borderWidth:3,
               borderColor:'#FDC8D4',backgroundColor:'#fff' },
  badge:{ position:'absolute', bottom:-8, right:-8,
          paddingHorizontal:16, paddingVertical:6, borderRadius:16,
          shadowColor:'#F99', shadowOpacity:0.18, shadowRadius:8, elevation:5 },
  badgeText:{ color:'#fff', fontWeight:'bold', fontSize:18 },

  descBox:{ marginHorizontal:30, marginTop:10, marginBottom:12 },
  descText:{ color:'#313949', fontSize:16.5, fontWeight:'500',
             textAlign:'center', lineHeight:24 },

  cardShadow:{ marginHorizontal:18, marginBottom:18, borderRadius:23,
               backgroundColor:'#fff', shadowColor:'#FDC8D4',
               shadowOpacity:0.13, shadowRadius:20, elevation:6 },
  card:{ borderRadius:22, paddingTop:12, paddingBottom:18,
         alignItems:'center', backgroundColor:'#fff' },
  cardTitle:{ fontSize:18, fontWeight:'bold', color:'#FC3468', marginBottom:6 },
  radarExplain:{ alignSelf:'center', marginTop:3, marginBottom:8,
                 backgroundColor:'#fff7fb', paddingVertical:6,
                 paddingHorizontal:16, borderRadius:11, borderWidth:1,
                 borderColor:'#FDC8D4' },
  radarExplainText:{ fontSize:14, color:'#B03A5B', textAlign:'center',
                     fontWeight:'600' },

  gaugeSec:{ marginTop:8, marginHorizontal:18, marginBottom:18,
             backgroundColor:'#fff', borderRadius:18,
             paddingVertical:8, paddingHorizontal:8 },
  gaugeRow:{ flexDirection:'row', alignItems:'center', marginVertical:7 },
  gaugeLabel:{ width:70, fontWeight:'600', fontSize:15.5,
               color:'#22223B', marginRight:10 },
  gaugeWrap:{ flex:1, height:18, borderRadius:9, backgroundColor:'#F4E3F7',
              overflow:'hidden', marginRight:10 },
  gaugeBg:{ ...StyleSheet.absoluteFillObject,
            backgroundColor:'#F4E3F7', borderRadius:9 },
  gaugeFill:{ position:'absolute', left:0, top:0, height:18, borderRadius:9 },
  gaugeScore:{ fontWeight:'800', fontSize:15, width:42, textAlign:'right' },

  btnRow:{ flexDirection:'row', justifyContent:'center',
           marginTop:8, marginBottom:32 },
  btn:{ flexDirection:'row', alignItems:'center', backgroundColor:'#fff',
        borderRadius:19, paddingVertical:8, paddingHorizontal:30,
        marginHorizontal:12, shadowColor:'#FDC8D4', shadowOpacity:0.14,
        shadowRadius:10, elevation:3 },
  btnIcon:{ marginRight:7 },
  btnText:{ color:'#FC3468', fontWeight:'bold', fontSize:15.5 },

  modalOverlay:{ flex:1, backgroundColor:'rgba(0,0,0,0.5)',
                 justifyContent:'center', alignItems:'center' },
  modalBox:{ width:'80%', backgroundColor:'#fff', borderRadius:12,
             padding:20, alignItems:'center' },
  modalMsg:{ fontSize:16, color:'#333', textAlign:'center',
             marginBottom:20, lineHeight:24 },
  modalBtns:{ flexDirection:'row', width:'100%' },
  modalBtn:{ flex:1, paddingVertical:10, marginHorizontal:5,
             borderRadius:8, backgroundColor:'#eee', alignItems:'center' },
  modalOk:{ backgroundColor:'#FC3468' },
  modalBtnText:{ fontSize:16, color:'#333', fontWeight:'bold' },
});
