import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../screens/Auth/Login";
import Register from "../screens/Auth/Register";
import Home from "../screens/Home/Home";
import BottomTabNavigator from "./BottomTabNavigator";
import TaskDetails from "../screens/Details/TaskDetails";
import RecoHabits from "../screens/New/RecoHabits";

// Define the type for the stack navigator
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  BottomTab: undefined;
  TaskDetails: { taskId: string };
  RecoHabits: undefined;
};

// Create the stack navigator with the correct type
const Stack = createNativeStackNavigator<RootStackParamList>();

const StackNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "white" },
        }}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="BottomTab" component={BottomTabNavigator} />
        <Stack.Screen name="TaskDetails" component={TaskDetails} />
        <Stack.Screen name="RecoHabits" component={RecoHabits} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;
