import { StyleSheet, Text, View } from "react-native";
import React from "react";

const Calendar = () => {
  return (
    <View style={styles.container}>
      <Text>Calendar</Text>
    </View>
  );
};

export default Calendar;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
});
