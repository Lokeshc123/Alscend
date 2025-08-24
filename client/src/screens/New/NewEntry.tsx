import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { getToken } from "../../services/secureStorage";
import { getRecommendedTasks } from "../../services/task";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/StackNavigator";

type TaskAddingScreenProps = NativeStackNavigationProp<
  RootStackParamList,
  "RecoHabits"
>;
const NewEntry = () => {
  const navigation = useNavigation<TaskAddingScreenProps>();


  return (
    <View style={styles.container}>
      {/* Title Section */}
      <View style={styles.header}>
        <Text style={styles.title}>Forge Your Next Habit</Text>
        <Text style={styles.subtitle}>
          Select a smart way to craft your next goal
        </Text>
      </View>

      {/* Surprise Me */}
      <TouchableOpacity
        onPress={() => navigation.navigate("RecoHabits")}
        style={styles.cardWrapper}
      >
        <LinearGradient
          colors={["#6a11cb", "#2575fc"]}
          style={styles.optionCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons name="sparkles" size={28} color="#fff" />
          <Text style={styles.optionText}>Discover AI-Powered Habits</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Choose Category */}
      <TouchableOpacity
        onPress={() => getTaskRecommendations("category")}
        style={styles.cardWrapper}
      >
        <LinearGradient
          colors={["#11998e", "#38ef7d"]}
          style={styles.optionCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <MaterialIcons name="category" size={28} color="#fff" />
          <Text style={styles.optionText}>Explore Habits by Category</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Add Manually */}
      <TouchableOpacity
        onPress={() => console.log("Manual task entry")}
        style={styles.cardWrapper}
      >
        <LinearGradient
          colors={["#ff512f", "#dd2476"]}
          style={styles.optionCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons name="create-outline" size={28} color="#fff" />
          <Text style={styles.optionText}>Add Habit Manually</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

export default NewEntry;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 20,
    justifyContent: "center",
  },
  header: {
    marginBottom: 40,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#222",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
  },
  cardWrapper: {
    marginVertical: 12,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 5,
  },
  optionCard: {
    paddingVertical: 20,
    paddingHorizontal: 18,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  optionText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginLeft: 12,
  },
});
