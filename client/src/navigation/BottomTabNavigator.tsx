import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../screens/Home/Home";
import { Entypo } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";
import Calendar from "../screens/Calendar/Calendar";
import NewEntry from "../screens/New/NewEntry";
import Analytics from "../screens/Analytics/Analytics";
import Setting from "../screens/Settings/Setting";
const Tab = createBottomTabNavigator();
const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: "black",
        tabBarInactiveTintColor: "grey",
        tabBarStyle: {
          height: "6%",
          backgroundColor: "#fff",
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ color }) => (
            <Entypo name="home" size={30} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Calendar Screen"
        component={Calendar}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="calendar" size={30} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="New Screen"
        component={NewEntry}
        options={{
          tabBarIcon: ({ color }) => (
            <AntDesign name="plussquare" size={26} color="black" />
          ),
        }}
      />
      <Tab.Screen
        name="Analytics"
        component={Analytics}
        options={{
          tabBarIcon: ({ color }) => (
            <Feather name="pie-chart" size={28} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Setting}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="cog" size={28} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
