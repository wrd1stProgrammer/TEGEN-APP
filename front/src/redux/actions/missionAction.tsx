import { token_storage } from '../config/storage';
import { appAxios } from '../config/apiConfig';
import {setUser} from '../reducers/userSlice';
import {persistor} from '../config/store';
import { resetAndNavigate,navigate } from '../../navigation/NavigationUtils';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { Alert } from 'react-native';

export const completeMission =
  (missionId: string, stageIndex: number, difficulty: 'easy' | 'normal' | 'hard', imageUrl: string) =>
  async (dispatch: any) => {
    const { data } = await appAxios.post('/mission/complete', {
      missionId,
      stageIndex,
      difficulty,
      imageUrl,
    });
    // 후처리: carbonSlice·missionSlice 등에 데이터 반영
    dispatch({ type: 'mission/COMPLETE_SUCCESS', payload: data });
    // 달력 새로고침
    dispatch({ type: 'carbon/ADD_RECORD', payload: data.record });
  };
