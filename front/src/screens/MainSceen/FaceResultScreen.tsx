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
  const [descModalVisible, setDescModalVisible] = useState(false);
  const [selectedDesc, setSelectedDesc] = useState('');

  const avg  = axes.reduce((s,d)=>s+scores[d.key].score,0) / axes.length;
  const { label: levelLabel, color } = getLevel(avg, t.levels);
  let sexSuffix = sex === '여' ? t.sexSuffix.female : t.sexSuffix.male;
  const resultLabel = `${levelLabel}${sexSuffix}`;
  const data = axes.map(a => ({ x: a.label, y: scores[a.key].score }));

  const onShare = async () => {
    try {
      const uri = await viewShot.current.capture();
      await Share.share({ title: t.title, url: uri, message: t.share });
    } catch (e) { console.log('share err', e); }
  };

  const openDesc = (desc: string) => {
    setSelectedDesc(desc);
    setDescModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <ScrollView contentContainerStyle={styles.scroll}>

        <ViewShot ref={viewShot} options={{ format:'jpg', quality:0.94 }}>

          {/* 사진 + 뱃지 */}
          <View style={styles.photoBox}>
            <View style={styles.imgWrap}>
              <Image source={{ uri: photoUri }} style={styles.profileImg} />
              <View style={[styles.badge, { backgroundColor: color }]}>                
                <Text style={styles.badgeText}>{resultLabel}</Text>
              </View>
            </View>
          </View>

          {/* AI 총평 */}
          <View style={[styles.descBox, styles.cardShadow]}>
            <Text style={styles.descText}>{scores.total?.desc}</Text>
          </View>

          {/* 레이더 차트 */}
          <View style={[styles.cardOuter, styles.cardShadow]}>
            <View style={styles.cardInner}>
              <Text style={styles.cardTitle}>{t.title}</Text>
              <VictoryChart polar theme={VictoryTheme.material}
                width={CHART_SIZE} height={CHART_SIZE} padding={50}
                domain={{ y:[0,100] }}>
                {axes.map((a,i)=>(
                  <VictoryPolarAxis key={i} dependentAxis axisValue={a.label}
                    label={a.label} labelPlacement="perpendicular"
                    style={{
                      axis:{ stroke:'#E6D8E8', strokeWidth:1.3 },
                      axisLabel:{ fontSize:14, fill:'#4B4B4B', fontWeight:'600' },
                      grid:{ stroke:'#F7BFD8', strokeDasharray:'4,9' },
                      tickLabels:{ fill:'transparent' },
                    }}
                    tickValues={[20,40,60,80,100]}/>
                ))}
                <VictoryGroup colorScale={[color]} style={{ data:{ fillOpacity:0.3, strokeWidth:2.5 } }}>
                  <VictoryArea data={data}/>
                  <VictoryScatter data={data} size={6}
                    style={{ data:{ fill:color, stroke:'#fff', strokeWidth:1.5 } }}/>
                </VictoryGroup>
              </VictoryChart>
              <View style={styles.radarExplain}>
                <Text style={styles.radarExplainText}>{t.radarExplain}</Text>
              </View>
            </View>
          </View>

          {/* 게이지바 안내 텍스트 */}
          

          {/* 게이지바 */}
          <View style={[styles.gaugeSec, styles.cardShadow]}>
          <Text style={styles.guideText}>터치 시 AI가 분석한 결과가 보여요</Text>
            {axes.map((a,i)=>(
              <View key={i} style={styles.gaugeRow}>
                <TouchableOpacity onPress={()=>openDesc(scores[a.key].desc)}>
                  <Text style={styles.gaugeLabel}>{a.label}</Text>
                </TouchableOpacity>
                <View style={styles.gaugeWrap}>
                  <View style={styles.gaugeBg}/>
                  <View style={[styles.gaugeFill, { width:`${scores[a.key].score}%`, backgroundColor:gaugeColors[i%gaugeColors.length] }]}/>
                </View>
                <Text style={[styles.gaugeScore, { color:gaugeColors[i%gaugeColors.length] }]}>{scores[a.key].score}%</Text>
              </View>
            ))}
          </View>

        </ViewShot>

        {/* 하단 버튼 */}
        <View style={styles.btnRow}>
          <TouchableOpacity style={[styles.btn, { backgroundColor:'#FF6B81' }]} onPress={()=>setConfirmVisible(true)}>
            <Ionicons name="reload-outline" size={20} color="#fff" style={styles.btnIcon}/>
            <Text style={[styles.btnText, { color:'#fff' }]}>{t.retry}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, { backgroundColor:'#22A7F0' }]} onPress={onShare}>
            <Ionicons name="share-social-outline" size={20} color="#fff" style={styles.btnIcon}/>
            <Text style={[styles.btnText, { color:'#fff' }]}>{t.share}</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* 다시하기 모달 */}
      <Modal transparent visible={confirmVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, styles.cardShadow]}>
            <Text style={styles.modalMsg}>{t.retryConfirm}</Text>
            <View style={styles.modalBtns}>
              <TouchableOpacity style={styles.modalBtn} onPress={()=>setConfirmVisible(false)}>
                <Text style={styles.modalBtnText}>{t.cancel}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, styles.modalOk]} onPress={()=>{ setConfirmVisible(false); resetAndNavigate('Welcome'); }}>
                <Text style={[styles.modalBtnText, { color:'#fff' }]}>{t.confirm}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 설명 모달 */}
      <Modal transparent visible={descModalVisible} animationType="fade">
        <View style={styles.descOverlay}>
          <View style={[styles.descModalBox, styles.cardShadow]}>
            <Text style={styles.descModalText}>{selectedDesc}</Text>
            <TouchableOpacity style={styles.descCloseBtn} onPress={()=>setDescModalVisible(false)}>
              <Text style={styles.descCloseText}>{t.confirm}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#FFF6FA' },
  scroll: { paddingBottom:30 },

  photoBox: { alignItems:'center', marginTop:30, marginBottom:12 },
  imgWrap: { position:'relative' },
  profileImg: { width:120, height:120, borderRadius:60, borderWidth:3, borderColor:'#fff' },
  badge: { position:'absolute', bottom:-10, right:-10, paddingHorizontal:16, paddingVertical:6, borderRadius:16, borderWidth:2, borderColor:'#fff' },
  badgeText: { color:'#fff', fontWeight:'700', fontSize:16 },

  descBox: { marginHorizontal:30, marginBottom:16, padding:16, borderRadius:12, backgroundColor:'#fff' },
  descText: { color:'#313949', fontSize:15, fontWeight:'500', textAlign:'center', lineHeight:22 },

  cardOuter: { marginHorizontal:18, marginBottom:18, borderRadius:20, overflow:'hidden', backgroundColor:'#fff' },
  cardInner: { alignItems:'center', paddingVertical:16 },
  cardShadow: { shadowColor:'#000', shadowOpacity:0.08, shadowRadius:8, elevation:4 },
  cardTitle: { fontSize:18, fontWeight:'600', color:'#FC3468', marginBottom:8 },
  radarExplain: { marginTop:4, marginBottom:8, paddingHorizontal:12, paddingVertical:4, borderRadius:8, borderWidth:1, borderColor:'#FDC8D4', backgroundColor:'#fff7fb' },
  radarExplainText: { fontSize:13, color:'#B03A5B', fontWeight:'500' },

  guideText: { textAlign:'center', fontSize:12, color:'#888', marginVertical:1, marginBottom: 10, },

  gaugeSec: { marginHorizontal:18, marginBottom:24, borderRadius:12, backgroundColor:'#fff', paddingVertical:12, paddingHorizontal:12 },
  gaugeRow: { flexDirection:'row', alignItems:'center', marginVertical:6 },
  gaugeLabel: { width:70, fontSize:14, fontWeight:'600', color:'#22223B', marginRight:10 },
  gaugeWrap: { flex:1, height:16, borderRadius:8, backgroundColor:'#F4E3F7', overflow:'hidden', marginRight:8 },
  gaugeBg: { ...StyleSheet.absoluteFillObject, backgroundColor:'#F4E3F7' },
  gaugeFill: { position:'absolute', left:0, top:0, height:16, borderRadius:8 },
  gaugeScore: { width:36, textAlign:'right', fontSize:13, fontWeight:'700' },

  btnRow: { flexDirection:'row', justifyContent:'center', marginBottom:32 },
  btn: { flexDirection:'row', alignItems:'center', paddingVertical:10, paddingHorizontal:24, borderRadius:24, marginHorizontal:12 },
  btnIcon: { marginRight:6 },
  btnText: { fontSize:15, fontWeight:'600' },

  modalOverlay: { flex:1, backgroundColor:'rgba(0,0,0,0.4)', justifyContent:'center', alignItems:'center' },
  modalBox: { width:'80%', backgroundColor:'#fff', borderRadius:12, padding:20 },
  modalMsg: { fontSize:16, color:'#333', textAlign:'center', marginBottom:16, lineHeight:22 },
  modalBtns: { flexDirection:'row', justifyContent:'space-between' },
  modalBtn: { flex:1, paddingVertical:10, marginHorizontal:5, borderRadius:8, backgroundColor:'#eee', alignItems:'center' },
  modalOk: { backgroundColor:'#FC3468' },
  modalBtnText: { fontSize:15, fontWeight:'600' },

  descOverlay: { flex:1, backgroundColor:'rgba(0,0,0,0.4)', justifyContent:'center', alignItems:'center' },
  descModalBox: { width:'75%', backgroundColor:'#fff', borderRadius:12, padding:20 },
  descModalText: { fontSize:15, lineHeight:22, color:'#333', marginBottom:16, textAlign:'center' },
  descCloseBtn: { alignSelf:'center', paddingVertical:8, paddingHorizontal:16, backgroundColor:'#FC3468', borderRadius:8 },
  descCloseText: { color:'#fff', fontSize:15, fontWeight:'600' },
});
