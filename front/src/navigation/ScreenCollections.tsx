// ++ New Screen 
import SplashScreen from "../screens/auth/SplashSceen";
import LoginScreen from "../screens/auth/LoginScreen";
import BottomTab from "./BottomTab";
import RegisteryScreen from "../screens/auth/RegisteryScreen";
import PatientHome from "../screens/MainScreen/PatientHome";
import SecondScreen from "../screens/MainScreen/SecondScreen";
import ThirdScreen from "../screens/MainScreen/ThirdScreen";
import FaceTestScreen from "../screens/survey/FaceTestScreen";
import GenderScreen from "../screens/survey/GenderScreen";
import ResultScreen from "../screens/survey/ResultScreen";
import SurveyScreen from "../screens/survey/SurveyScreen";
import WelcomeScreen from "../screens/survey/WelcomeScreen";

// ++ Screen Type ??

// ++ New Screen Stack
export const authStack = [
    {
        name: 'SplashScreen',
        component: SplashScreen,
    },
    {
        name: 'LoginScreen',
        component: LoginScreen,
    },
    {
        name: "RegisteryScreen",
        component: RegisteryScreen,
    },

];

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


];


export const dashboardStack = [
    {
        name:"BottomTab",
        component: BottomTab
    },
    {
        name:"PatientHome",
        component: PatientHome,
    },
    {
        name:"SecondScreen",
        component: SecondScreen
    },
    {
        name:"ThirdScreen",
        component: ThirdScreen,
    },
 
];

export const mergedStacks = [...dashboardStack, ...authStack, ...surveyStack];