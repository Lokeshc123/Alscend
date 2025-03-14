import { StatusBar } from "expo-status-bar";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import StackNavigator from "./src/navigation/StackNavigator";
import * as NavigationBar from "expo-navigation-bar";
import { useEffect } from "react";
export default function App() {
  useEffect(() => {
    NavigationBar.setVisibilityAsync("hidden");

    NavigationBar.setBehaviorAsync("overlay-swipe");
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <StackNavigator />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
