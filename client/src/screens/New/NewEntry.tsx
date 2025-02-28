import { StyleSheet, Text, View } from "react-native";
import React from "react";

const NewEntry = () => {
  return (
    <View style={styles.container}>
      <Text>NewEntry</Text>
    </View>
  );
};

export default NewEntry;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
});
