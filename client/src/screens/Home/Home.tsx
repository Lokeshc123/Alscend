import { StyleSheet, Text, View } from "react-native";
import React from "react";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";

const Home = () => {
  const currentDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  return (
    <View style={styles.container}>
      <View style={styles.headerIcons}>
        <View style={styles.headerIconsRight}>
          <SimpleLineIcons
            name="pie-chart"
            size={24}
            color="black"
            style={{ transform: [{ rotate: "100deg" }] }}
          />
          <SimpleLineIcons name="grid" size={24} color="black" />
        </View>
      </View>
      <View>
        <Text style={styles.dateHeader}>Today</Text>
        <Text style={styles.date}>{currentDate}</Text>
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  headerIcons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    width: "100%",
  },
  headerIconsRight: {
    flexDirection: "row",
    width: "17%",
    justifyContent: "space-between",
  },

  dateHeader: {
    fontSize: 35,
    fontWeight: "900", // Thicker text
    color: "#333",
    letterSpacing: 1,
    fontFamily: "sans-serif-black",
  },

  date: {
    fontSize: 20,
    fontWeight: "600",
    color: "grey",
    marginTop: 2,

    marginLeft: 6,
  },
});
