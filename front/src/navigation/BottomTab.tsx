// BottomTab.tsx
import React, { FC, useState, useCallback } from 'react';
import {
  View, TouchableOpacity, StyleSheet, Platform, Alert,
  Modal, Text, ActivityIndicator,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RFValue } from 'react-native-responsive-fontsize';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
  launchCamera, launchImageLibrary,
  CameraOptions, ImageLibraryOptions, ImagePickerResponse,
} from 'react-native-image-picker';

import PatientHome from '../screens/MainScreens/PatientHome';
import SecondScreen from '../screens/MainScreens/SecondScreen';
import ThirdScreen  from '../screens/MainScreens/ThirdScreen';
import { useAppDispatch } from '../redux/config/reduxHook';
import { uploadFile } from '../redux/actions/fileAction';
import { geminiImageAction } from '../redux/actions/geminiAction';

const Tab = createBottomTabNavigator();

/* ───────── component ───────── */
const BottomTab: FC = () => {
  const dispatch = useAppDispatch();

  /* ── 로딩 모달 state ── */
  const [loader, setLoader] = useState({ visible:false, msg:'' });

  /** 단계별 메시지 & 7초 후 자동 종료 */
  const showLoader = () => {
    setLoader({ visible:true, msg:'업로드 중...' });
    setTimeout(() => setLoader({ visible:true, msg:'AI 분석 중...'   }), 2000);
    setTimeout(() => setLoader({ visible:true, msg:'미션 생성 중...' }), 5000);
    setTimeout(() => setLoader({ visible:false, msg:'' }), 7000);
  };

  /** Gemini 호출 (+로딩 시작) */
  const geminiCall = useCallback(async (uri:string) => {
    showLoader();                      // ← 선택 직후에 시작
    try {
      const res = await dispatch(uploadFile(uri,'qcr_image'));
      await dispatch(geminiImageAction(res));
    } catch {
      Alert.alert('오류','이미지 처리 중 문제가 발생했습니다.');
      setLoader({ visible:false, msg:'' });
    }
  }, [dispatch]);

  /* ── 사진/갤러리 ── */
  const takePhoto = () => {
    const opt: CameraOptions = { mediaType:'photo', cameraType:'back', saveToPhotos:true };
    launchCamera(opt, (r:ImagePickerResponse)=>{
      if (r.didCancel) return;
      if (r.errorMessage) return Alert.alert('오류', r.errorMessage);
      r.assets?.[0]?.uri && geminiCall(r.assets[0].uri);
    });
  };

  const pickGallery = async () => {
    const opt: ImageLibraryOptions = { mediaType:'photo', selectionLimit:1 };
    const r = await launchImageLibrary(opt);
    if (r.didCancel) return;
    if (r.errorMessage) return Alert.alert('오류', r.errorMessage);
    r.assets?.[0]?.uri && geminiCall(r.assets[0].uri);
  };

  const openPicker = () => {
    Alert.alert('이미지 선택','원하는 옵션을 선택하세요',[
      { text:'사진 찍기',     onPress: takePhoto },
      { text:'앨범에서 선택', onPress: pickGallery },
      { text:'취소', style:'cancel' },
    ]);
  };

  /* ── UI ── */
  return (
    <>
      <Tab.Navigator screenOptions={{ headerShown:false, tabBarHideOnKeyboard:true, tabBarShowLabel:false, tabBarStyle:styles.tabBar }}>
        <Tab.Screen name="PatientHome" component={PatientHome}
          options={{
            tabBarIcon:({focused,color,size})=><Ionicons name={focused?'home':'home-outline'} size={size??24} color={color}/>,
            tabBarActiveTintColor:'#2B2B2B', tabBarInactiveTintColor:'#999',
          }}
        />

        <Tab.Screen name="Scan" component={SecondScreen}
          listeners={{ tabPress:e=>{e.preventDefault(); openPicker();} }}
          options={{
            tabBarButton:props=><TouchableOpacity {...props} style={styles.scanBtnContainer}/>,
            tabBarIcon:()=>(<View style={styles.scanBtnOuter}><Ionicons name="camera" size={28} color="#fff"/></View>)
          }}
        />

        <Tab.Screen name="ThirdScreen" component={ThirdScreen}
          options={{
            tabBarIcon:({focused,color,size})=><Ionicons name={focused?'reader':'reader-outline'} size={size??24} color={color}/>,
            tabBarActiveTintColor:'#2B2B2B', tabBarInactiveTintColor:'#999',
          }}
        />
      </Tab.Navigator>

      {/* 로딩 모달 */}
      <Modal transparent visible={loader.visible} animationType="fade">
        <View style={styles.loadingBg}>
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color="#3384FF"/>
            <Text style={styles.loadingText}>{loader.msg}</Text>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default BottomTab;

/* ---------- styles ---------- */
const styles = StyleSheet.create({
  tabBar:{ position:'absolute',left:0,right:0,bottom:0,
    height:Platform.OS==='ios'?80:70,
    paddingTop:Platform.OS==='ios'?RFValue(5):0,
    paddingBottom:Platform.OS==='ios'?20:10,
    backgroundColor:'#fff',borderTopWidth:0,borderTopLeftRadius:20,borderTopRightRadius:20,
    shadowColor:'#000',shadowOffset:{width:0,height:-3},shadowOpacity:0.07,shadowRadius:10,elevation:5
  },
  scanBtnContainer:{ top:-20,flex:1,justifyContent:'center',alignItems:'center' },
  scanBtnOuter:{ width:68,height:68,borderRadius:34,backgroundColor:'#3384FF',
    justifyContent:'center',alignItems:'center',shadowColor:'#3384FF',
    shadowOffset:{width:0,height:10},shadowOpacity:0.3,shadowRadius:10,elevation:6
  },
  loadingBg:{ flex:1,backgroundColor:'rgba(0,0,0,0.4)',justifyContent:'center',alignItems:'center' },
  loadingBox:{ width:220,paddingVertical:30,borderRadius:16,backgroundColor:'#fff',alignItems:'center' },
  loadingText:{ marginTop:12,fontSize:16,color:'#333' },
});
