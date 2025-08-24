// NewEntryStack.tsx
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import NewEntry from "../screens/New/NewEntry";
import RecoHabits from "../screens/New/RecoHabits";

const Stack = createNativeStackNavigator();

const NewEntryStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="NewEntryMain" component={NewEntry} />
      <Stack.Screen
        name="RecoHabits"
        component={RecoHabits}
        options={{
          presentation: "modal", // optional, looks nicer sliding up
          animation: "slide_from_bottom",
        }}
      />
    </Stack.Navigator>
  );
};

export default NewEntryStack;
