import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import Home from "../screens/Home/Home";
import Calendar from "../screens/Calendar/Calendar";
import NewEntry from "../screens/New/NewEntry";
import Analytics from "../screens/Analytics/Analytics";
import Setting from "../screens/Settings/Setting";
import { Entypo, MaterialCommunityIcons, Feather, AntDesign } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

const CustomTabBarButton = ({ children, onPress }: any) => (
  <TouchableOpacity
    style={styles.customButtonContainer}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <View style={styles.customButton}>{children}</View>
  </TouchableOpacity>
);

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: "#007bff",
        tabBarInactiveTintColor: "#aaa",
      }}
    >
      {/* Home */}
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ color }) => <Entypo name="home" size={26} color={color} />,
        }}
      />

      {/* Calendar */}
      <Tab.Screen
        name="Calendar"
        component={Calendar}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="calendar" size={26} color={color} />
          ),
        }}
      />

      {/* New Task (Floating Button) */}
      <Tab.Screen
        name="New"
        component={NewEntry}
        options={{
          tabBarIcon: ({ color }) => (
            <AntDesign name="plus" size={28} color="#fff" />
          ),
          tabBarButton: (props) => <CustomTabBarButton {...props} />,
        }}
      />

      {/* Analytics */}
      <Tab.Screen
        name="Analytics"
        component={Analytics}
        options={{
          tabBarIcon: ({ color }) => (
            <Feather name="pie-chart" size={26} color={color} />
          ),
        }}
      />

      {/* Settings */}
      <Tab.Screen
        name="Settings"
        component={Setting}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="cog" size={26} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
   
    left: 20,
    right: 20,
    backgroundColor: "#fff",
    borderRadius: 30,
    height: 70,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    borderTopWidth: 0,
    paddingBottom: 5,
  },
  customButtonContainer: {
    top: -25,
    justifyContent: "center",
    alignItems: "center",
  },
  customButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#007bff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#007bff",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
});
