
import FaceTestScreen from "../screens/survey/FaceTestScreen";
import GenderScreen from "../screens/survey/GenderScreen";
import ResultScreen from "../screens/survey/ResultScreen";
import SurveyScreen from "../screens/survey/SurveyScreen";
import WelcomeScreen from "../screens/survey/WelcomeScreen";
import MediaSelectionScreen from "../screens/faceAI/MediaSelectionScreen";
import FaceResultScreen from "../screens/MainSceen/FaceResultScreen";
import InfoScreen from "../screens/MainSceen/InfoScreen";

// ++ Screen Type ??


export const surveyStack = [
    {
        name: "Face",
        component: FaceTestScreen,
    },
    {
        name: "Gender",
        component: GenderScreen,
    },
    {
        name: "Result",
        component: ResultScreen,
    },
    {
        name: "Survey",
        component: SurveyScreen,
    },
    {
        name: "Welcome",
        component: WelcomeScreen,
    },

    {
        name: "MediaSelectionScreen",
        component: MediaSelectionScreen,
    },
    {
        name: "FaceResultScreen",
        component: FaceResultScreen
    },
    {
        name: "InfoScreen",
        component: InfoScreen,
    }


];



export const mergedStacks = [ ...surveyStack];