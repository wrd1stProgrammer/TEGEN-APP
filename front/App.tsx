import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,Platform, AppState} from 'react-native';
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from 'react-redux';
import { persistor, store } from "./src/redux/config/store"
import { PersistGate } from "redux-persist/integration/react";
import Navigation from './src/navigation/Navigation';
import { initializeAdMob } from './src/screens/AdMob/ConfigureAdMob';
import { requestTrackingPermission } from 'react-native-tracking-transparency';
import {request, PERMISSIONS} from 'react-native-permissions';


const App:React.FC = () => {

  const checkPermissionForIOS = async () => {
    return await requestTrackingPermission();
  }

  useEffect(() => {
    const listener = AppState.addEventListener('change', (status) => {
      if (Platform.OS === 'ios' && status === 'active') {
        request(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY)
          .then((result) => console.warn(result))
          .catch((error) => console.warn(error));
      }
    });

    checkPermissionForIOS();
    initializeAdMob();
  

    return () => {listener.remove()}
  }, []);


  return(
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar
        translucent={Platform.OS === "ios"}
        backgroundColor="transparent"
      />
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Navigation />
        </PersistGate>
      </Provider>

    </GestureHandlerRootView>
  ); 
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;

