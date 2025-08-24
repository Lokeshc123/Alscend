import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { getAllCategories, getUserTasks } from "../../services/task";
import { getToken } from "../../services/secureStorage";
import Categories from "../../components/Categories";

export interface ITask {
  _id: string;
  category: string;
  color: string;
  createdAt: string;
  emoji: string;
  journalEntries: any[];
  progress: number;
  progressRecords: any[];
  recommendations: any[];
  status: string;
  streak: number;
  title: string;
  type: "one-time" | "continuous";
  updatedAt: string;
  goal?: number;
  currentGoal?: number;
  originalGoal?: number;
}

const Home = () => {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [categories, setCategories] = useState<{ name: string; emoji: string }[]>([]);

  const currentDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  useEffect(() => {
    getCategories();
    getTasks();
  }, []);

  const getCategories = async () => {
    try {
      const response = await getAllCategories();
      setCategories(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getTasks = async () => {
    const token = await getToken();
    try {
      if (!token) throw new Error("Token not found");
      const response = await getUserTasks(token);
      setTasks(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const filteredCategories = categories.filter((category) =>
    tasks.some((task) => task.category === category.name)
  );

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
      <View style={styles.categoriesContainer}>
        <Categories parentCategories={filteredCategories} tasks={tasks} />
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
    fontWeight: "900",
    color: "#333",
    letterSpacing: 1,
  },
  date: {
    fontSize: 20,
    fontWeight: "600",
    color: "grey",
    marginTop: 2,
    marginLeft: 6,
  },
  categoriesContainer: {
    flex: 1, // Take up remaining space
    marginTop: 20,
  },
});